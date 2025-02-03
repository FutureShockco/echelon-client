import { parseStringPromise, Builder } from 'xml2js';
import { proxifyImageUrl } from "@/libs/proxifyUrl";
import { validate_account_name } from "@/libs/chainValidation";
import linksRe, {
    any as linksAny,
    replaceOldDomains,
    SECTION_LIST,
    WHITE_LIST,-
} from "@/libs/links";
import * as Phishing from "@/libs/phishing";
import {
    INTERNAL_POST_TAG_REGEX,
    MENTION_REGEX,
    POST_REGEX,
} from "./regexes.const";

export const getPhishingWarningMessage = () =>
    "Alert: recognized as phishing link";
export const getExternalLinkWarningMessage = () => "Open external link";

export default async function (
    html: string,
    { mutate = true, hideImages = false, isProxifyImages = false } = {}
) {
    const state: any = { mutate };
    state.hashtags = new Set();
    state.usertags = new Set();
    state.htmltags = new Set();
    state.images = new Set();
    state.links = new Set();

    try {
        const doc = await parseStringPromise(html, { explicitArray: false, preserveChildrenOrder: true });

        traverse(doc, state);

        if (mutate) {
            if (hideImages) {
                // Handle hiding images
                // Note: You may need to implement a custom function for this, as xml2js does not provide direct manipulation of HTML tags
            } else {
                if (!isProxifyImages) proxifyImages(doc);
            }
        }

        const builder = new Builder();
        const resultHtml = builder.buildObject(doc);

        return {
            html: resultHtml || "",
            ...state,
        };
    } catch (error) {
        console.error("rendering error", { error: error?.message, html });
        return { html: "Error " + error?.message };
    }
}

function traverse(node: any, state: { htmltags: { add: (arg0: any) => void; }; }, depth = 0) {
    if (!node || typeof node !== 'object') return;

    Object.keys(node).forEach((key) => {
        const child = node[key];
        const tag = key.toLowerCase();

        if (tag) state.htmltags.add(tag);

        switch (tag) {
            case "img":
                img(state, child);
                break;
            case "iframe":
                iframe(state, child);
                break;
            case "a":
                link(state, child);
                break;
            default:
                if (typeof child === 'string') {
                    linkifyNode(child, state);
                }
                break;
        }

        traverse(child, state, depth + 1);
    });
}

function link(state: { links: { add: (arg0: any) => void; }; mutate: any; }, child: any) {
    const url = child.href;

    if (url) {
        state.links.add(url);
        if (state.mutate) {
            if (!/^((#)|(\/(?!\/))|(((steem|esteem|https?):)?\/\/))/.test(url)) {
                child.href = "https://" + replaceOldDomains(url);
            }

            if (
                (url.indexOf("#") !== 0 && // Allow in-page links
                    child.textContent.match(/(www\.)?steemit\.com/i) &&
                    !url.match(/https?:\/\/(.*@)?(www\.)?steemit\.com/i)) ||
                Phishing.looksPhishy(url)
            ) {
                child = {
                    _text: `${child.textContent} / ${url}`,
                    _attributes: {
                        title: getPhishingWarningMessage(),
                        class: "phishy"
                    }
                };
            }
        }
    }
}

function iframe(state: { images?: any; links?: any; mutate?: any; }, child: any) {
    const url = child.src;
    if (url) {
        const { images, links } = state;
        const yt = youTubeId(url);
        if (yt && images && links) {
            links.add(yt.url);
            images.add("https://img.youtube.com/vi/" + yt.id + "/0.jpg");
        }
    }

    const { mutate } = state;
    if (!mutate) return;

    const tag = child.parent?.tagName?.toLowerCase();
    if (tag === "div" && child.parent?.class === "videoWrapper") return;

    child = {
        _name: "div",
        _attributes: { class: "videoWrapper" },
        _children: [child]
    };
}

function img(state: { images: { add: (arg0: any) => void; }; mutate: any; }, child: any) {
    const url = child.src;
    if (url) {
        state.images.add(url);
        if (state.mutate) {
            let url2 = ipfsPrefix(url);
            if (/^\/\//.test(url2)) {
                url2 = "https:" + url2;
            }
            if (url2 !== url) {
                child.src = url2;
            }
        }
    }
}

function proxifyImages(doc: any) {
    // Implementation to proxify images
}

function linkifyNode(child: any, state: any) {
    try {
        const tag = child.parent?.tagName?.toLowerCase();
        if (tag === "code") return;
        if (tag === "a") return;

        const { mutate } = state;
        if (!child) return;
        child = embedYouTubeNode(child, state.links, state.images);
        child = embedVimeoNode(child, state.links);
        child = embedTwitchNode(child, state.images);
        child = embedDTubeNode(child, state.images);
        child = embedThreeSpeakNode(child, state.links, state.images);

        const content = linkify(
            child,
            state.mutate,
            state.hashtags,
            state.usertags,
            state.images,
            state.links
        );

        if (mutate && content !== child) {
            const href = child.trim();

            let newChild = {
                _name: "span",
                _children: [{ _text: content }]
            };

            const postMatch = href.match(POST_REGEX);
            if (postMatch && WHITE_LIST.includes(postMatch[1].replace(/www./, ""))) {
                const tag = postMatch[2];
                const author = postMatch[3].replace("@", "");
                const permlink = postMatch[4];
                newChild = {
                    _name: "span",
                    _children: [
                        {
                            _name: "a",
                            _attributes: { href: `/${tag}/@${author}/${permlink}` },
                            _text: `@${author}/${permlink}`
                        }
                    ]
                };
            }

            const mentionMatch = href.match(MENTION_REGEX);
            if (
                mentionMatch &&
                WHITE_LIST.includes(mentionMatch[1].replace(/www./, "")) &&
                mentionMatch.length === 3
            ) {
                const author = mentionMatch[2].replace("@", "").toLowerCase();
                if (author.indexOf("/") === -1) {
                    newChild = {
                        _name: "span",
                        _children: [
                            {
                                _name: "a",
                                _attributes: { href: `/@${author}` },
                                _text: `@${author}`
                            }
                        ]
                    };
                }
            }

            const tpostMatch = href.match(INTERNAL_POST_TAG_REGEX);
            if (
                (tpostMatch &&
                    tpostMatch.length === 4 &&
                    WHITE_LIST.some((v) => tpostMatch[1].includes(v))) ||
                (tpostMatch &&
                    tpostMatch.length === 4 &&
                    tpostMatch[1].indexOf("/") == 0)
            ) {
                if (SECTION_LIST.some((v) => tpostMatch[3].includes(v))) {
                    const author = tpostMatch[2].replace("@", "").toLowerCase();
                    const section = tpostMatch[3];
                    const link = `/@${author}/${section}`;
                    newChild = {
                        _name: "span",
                        _children: [
                            {
                                _name: "a",
                                _attributes: { href: link },
                                _text: `@${author}/${section}`
                            }
                        ]
                    };
                }
            }
            // Note: Add the replacement of the child in the actual document structure
        }
    } catch (error) {
        console.error("linkify_error", error);
    }
}

function linkify(content: string, mutate: any, hashtags: { add: (arg0: any) => void; }, usertags: { add: (arg0: any) => void; }, images: { add: (arg0: any) => void; }, links: { add: (arg0: any) => void; }) {
    // Implementation for linkify function
    return content; // Modify this as needed
}
