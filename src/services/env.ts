/** API HOST THEO 3 MÔI TRƯỜNG */
export const API_HOST: { [index: string]: { [index: string]: string } } = {
  /** môi trường development */
  development: {
    chatbox: "https://bbh-embed-chat-sdk.vercel.app",
    chatbox_embed: "https://chatbox-embed-sdk.botbanhang.vn/dist/sdk.min.js",
    chatbox_public: "https://chatbox-public-v2.botbanhang.vn/",
    domain: "https://retion.ai",
  },
  /** môi trường production */
  production: {
    chatbox: "https://chatbox-embed-sdk.botbanhang.vn",
    chatbox_embed: "https://chatbox-embed-sdk.botbanhang.vn/dist/sdk.min.js",
    chatbox_public: "https://chatbox-public-v2.botbanhang.vn/",
    domain: "https://retion.ai",
  },
};
