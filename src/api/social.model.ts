export interface AutSocial {
  type: string;
  link: string;
}

export const socialUrls = {
  discord: {
    hidePrefix: true,
    placeholder: "name#1234",
    prefix: "https://discord.com/users/"
  },
  github: {
    prefix: "https://github.com/",
    placeholder: ""
  },
  telegram: {
    prefix: "https://t.me/",
    placeholder: ""
  },
  twitter: {
    prefix: "https://twitter.com/",
    placeholder: ""
  },
  lensfrens: {
    prefix: "https://www.lensfrens.xyz/",
    placeholder: ""
  }
};

export const DefaultSocials: AutSocial[] = [
  {
    type: "discord",
    link: ""
  },
  {
    type: "github",
    link: ""
  },
  {
    type: "twitter",
    link: ""
  },
  {
    type: "telegram",
    link: ""
  },
  {
    type: "lensfrens",
    link: ""
  }
];
