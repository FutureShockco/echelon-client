// src/global-plugins.ts

import type { Account, ExtendedAccount } from 'dsteem';
import moment from 'moment';
import numeral from 'numeral';
import type { App } from 'vue';
import { useAppStore } from './stores/app';
import { Remarkable } from 'remarkable';
import { SanitizeConfig } from './utils/sanitizeConfig';

import DOMPurify from 'dompurify';
import { imageRegex, instagramRegex, twitterRegex, usernameURLRegex, youtubeRegex } from './utils/regexHelpers';
import { marked } from 'marked';

const renderer = new marked.Renderer();

renderer.hr = () => {
  return '<hr class="custom-hr"/>'; // Add your custom class or styles here
};
marked.setOptions({
  renderer: renderer,
  breaks: true, // Enable GFM line breaks
  gfm: true,    // Enable GFM (GitHub Flavored Markdown)
  pedantic: false // Parse according to strict markdown rules
});

// Apply the plugin
interface Props {
  text: string,
  className?: string,
  highQualityPost?: boolean,
  noImage?: boolean,
  allowDangerousHTML?: boolean,
  hideImages?: boolean,
  breaks?: boolean,
  isProxifyImages?: boolean
  isNsfw?: boolean;

};

const config = SanitizeConfig({
  large: true,
  highQualityPost: true,
  noImage: false,
});


export function setupGlobalMethods(app: App) {
  app.config.globalProperties.$formatReputation = (reputation: string | number): number => {
    if (reputation == null) return Number(reputation);
    reputation = parseInt(reputation.toString());
    let rep = String(reputation);
    let neg = rep.charAt(0) === "-";
    rep = neg ? rep.substring(1) : rep;
    let str = rep;
    let leadingDigits = parseInt(str.substring(0, 4));
    let log = Math.log(leadingDigits) / Math.log(10);
    let n = str.length - 1;
    let out = n + (log - Math.floor(log)); // Use Math.floor for integer part of log
    if (isNaN(out)) out = 0;
    out = Math.max(out - 9, 0);
    out = (neg ? -1 : 1) * out;
    out = out * 9 + 25;
    out = parseInt(out.toString());
    return out;
  },
    // app.config.globalProperties.$readableSteemPower = (account: any, precision: number) {
    //     if (account && (account.vesting_shares || account.delegated || account.received_vesting_shares)) {
    //       let SP = 0;
    //       SP = SP + Number(this.$vestToSteemPower(account.vesting_shares.split(" ")[0]));
    //       SP = SP - Number(this.$vestToSteemPower(account.delegated_vesting_shares.split(" ")[0]));
    //       SP = SP + Number(this.$vestToSteemPower(account.received_vesting_shares.split(" ")[0]));
    //       return parseFloat(SP.toString()).toFixed(precision);
    //     }
    //   },
    app.config.globalProperties.$markdown = async (value: string): Promise<any> => {
      let processedContent = value

      processedContent = processedContent.replace(youtubeRegex, (url, videoId) => {
        return `<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      });

      processedContent = processedContent.replace(twitterRegex, (url, tweetId) => {
        return `<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/${tweetId}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
      });

      processedContent = processedContent.replace(instagramRegex, (url, postId) => {
        return `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${postId}"></blockquote><script async defer src="//www.instagram.com/embed.js"></script>`;
      });

      processedContent = processedContent.replace(imageRegex, (url, imageUrl) => {
        return `<img class="image-container" src="${url}"/>`;
      });

      let parsedHtml = await marked(processedContent);

      let sanitizedHtml = DOMPurify.sanitize(parsedHtml, {
        ALLOWED_TAGS: [
          'div', 'iframe', 'del', 'a', 'p', 'b', 'i', 'q', 'br', 'ul', 'li', 'ol', 'img', 'strong',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'blockquote', 'pre', 'code', 'em', 'strong',
          'center', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strike', 'sup', 'sub'
        ],
        ALLOWED_ATTR: [
          'src', 'href', 'height', 'width', 'allow', 'frameborder', 'allowfullscreen',
          'class', 'data-username', 'data-instgrm-permalink'
        ]
      });
      parsedHtml = parsedHtml.replace(usernameURLRegex, (username) => {
        const userName = username;
        return `<a href='${userName}'>${userName}</a>`;
      });
      return sanitizedHtml;
    },
    app.config.globalProperties.$amount = (value: number | undefined): any => {
      return numeral(value).format('0.[000]a')
    },
    app.config.globalProperties.$vestToSteem = (vestingShares: number | undefined): any => {
      const appStore = useAppStore();
      const total_vesting_fund_steem = appStore.dynamicProperties?.total_vesting_fund_steem as string
      const totalVestingFund = Number(total_vesting_fund_steem.split(" ")[0])
      const total_vesting_shares = appStore.dynamicProperties?.total_vesting_shares as string
      const totalVestingShares = Number(total_vesting_shares.split(" ")[0])
      if (vestingShares)
        return totalVestingFund * vestingShares / totalVestingShares;
      else return 0
    },
    app.config.globalProperties.$getVotingPower = (account: Account): any => {
      return account.delegated_vesting_shares;
    },
    app.config.globalProperties.$timeFromNow = (date: string): any => {
      return moment(date).fromNow()
    }
}
