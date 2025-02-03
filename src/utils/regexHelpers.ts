export const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;

export const usernameURLRegex = /@([^/^\s]+)/g;

export const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/(?:[A-Za-z0-9_]+\/)?)([A-Za-z0-9_-]{11})/gi;

export const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)/gi;

export const twitterRegex = /(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:[A-Za-z0-9_]+\/status\/|status\/)(\d+)/gi;
