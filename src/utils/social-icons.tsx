import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { AutSocial } from "@aut-labs/sdk/dist/models/social";

export const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
};

export interface SocialWithIcon extends AutSocial {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const socialsWithIcons = (socials: AutSocial[]): SocialWithIcon[] => {
  return socials.map((social, index) => {
    const AutIcon = socialIcons[Object.keys(socialIcons)[index]];
    return {
      ...social,
      Icon: AutIcon
    } as SocialWithIcon;
  });
};
