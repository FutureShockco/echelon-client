import type { IOptions, Transformer, Attributes } from 'sanitize-html';

const iframeWhitelist: any = [
    {
        re: /^(https?:)?\/\/player.vimeo.com\/video\/.*/i,
        fn: (src: string) => {
            // <iframe src="https://player.vimeo.com/video/179213493" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            if (!src) return null;
            const m = src.match(/https:\/\/player\.vimeo\.com\/video\/([0-9]+)/);
            if (!m || m.length !== 2) return null;
            return "https://player.vimeo.com/video/" + m[1];
        },
    },
    {
        re: /^(https?:)?\/\/www.youtube.com\/embed\/.*/i,
        fn: (src: string) => {
            return src.replace(/\?.+$/, ""); // strip query string (yt: autoplay=1,controls=0,showinfo=0, etc)
        },
    },
    {
        re: /^(https?:)?\/\/3speak.online\/embed\?v=.*/i,
        fn: (src: any) => {
            return src;
        },
    },
    {
        re: /^https:\/\/w.soundcloud.com\/player\/.*/i,
        fn: (src: string) => {
            if (!src) return null;
            // <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257659076&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
            const m = src.match(/url=(.+?)&/);
            if (!m || m.length !== 2) return null;
            return (
                "https://w.soundcloud.com/player/?url=" +
                m[1] +
                "&auto_play=false&hide_related=false&show_comments=true" +
                "&show_user=true&show_reposts=false&visual=true"
            );
        },
    },
    {
        re: /^(https?:)?\/\/player.twitch.tv\/.*/i,
        fn: (src: any) => {
            //<iframe src="https://player.twitch.tv/?channel=ninja" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620">
            return src;
        },
    },
    {
        re: /^https:\/\/emb.d.tube\/\#\!\/([a-zA-Z0-9\-\.\/]+)$/,
        fn: (src: any) => {
            // <iframe width="560" height="315" src="https://emb.d.tube/#!/justineh/u6qoydvy" frameborder="0" allowfullscreen></iframe>
            return src;
        },
    },
];
export const noImageText = "(Image not shown due to low ratings)";
export const allowedTags = `
      div, iframe, del,
      a, p, b, i, q, br, ul, li, ol, img, h1, h2, h3, h4, h5, h6, hr,
      blockquote, pre, code, em, strong, center, table, thead, tbody, tr, th, td,
      strike, sup, sub
  `
    .trim()
    .split(/,\s*/);


interface SanitizeConfigOptions {
    large: boolean;
    highQualityPost: boolean;
    noImage?: boolean;
    sanitizeErrors?: any;
}


interface SanitizeConfigOptions {
    large: boolean;
    highQualityPost: boolean;
    noImage?: boolean;
    sanitizeErrors?: any;
}

export function SanitizeConfig({
}: SanitizeConfigOptions): IOptions {
    const transformTags: { [tagName: string]: Transformer } = {
        iframe: (tagName, attribs: Attributes) => ({
            tagName: 'iframe',
            attribs: {
                frameborder: '0',
                allowfullscreen: 'true',
                webkitallowfullscreen: 'true',
                mozallowfullscreen: 'true',
                src: attribs.src as string, // Ensure `src` is a string
                width: attribs.width ?? '560',
                height: attribs.height ?? '315',
            }
        }),
        img: (tagName, attribs: Attributes) => ({
            tagName: 'img',
            attribs: {
                src: attribs.src as string, // Ensure `src` is a string
                alt: attribs.alt ?? '',
                width: attribs.width ?? 'auto',
                height: attribs.height ?? 'auto',
            }
        }),
        // Add other tag transformations as needed
    };

    return {
        allowedTags: ['iframe', 'img', 'div', 'td', 'a'],
        allowedAttributes: {
            iframe: ['src', 'width', 'height'],
            img: ['src', 'alt', 'width', 'height'],
            div: ['class'],
            td: ['class'],
            a: ['href', 'target'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags
    };
}