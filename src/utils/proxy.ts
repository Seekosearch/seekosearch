/**
 * The proxy URL used to avoid CORS issues from the frontend.
 * allorigins.win is used because it successfully routes 1337x and Nyaa.
 */
export const getProxyUrl = (url: string) => {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
};
