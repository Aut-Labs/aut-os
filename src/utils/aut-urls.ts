import { EnvMode, environment } from "@api/environment";

interface ApiUrls {
  tryAut: string;
  novaDashboard: string;
  myAut: string;
  hub: string;
  leaderboard: string;
  launchpad: string;
}

const _autUrls = (): ApiUrls => {
  if (environment.env === EnvMode.Development) {
    return {
      tryAut: "https://try-internal.aut.id/",
      novaDashboard: "https://nova-internal.aut.id/",
      myAut: "https://os-internal.aut.id/",
      hub: "https://showcase-internal.aut.id/",
      leaderboard: "https://leaderboard-internal.aut.id/",
      launchpad: "http://launch.hub.sbs/"
    };
  }

  return {
    tryAut: "https://try.aut.id/",
    novaDashboard: "https://nova.aut.id/",
    myAut: "https://my.aut.id/",
    hub: "https://showcase.aut.id/",
    leaderboard: "https://leaderboard.aut.id/",
    launchpad: "http://launch.hub.sbs/"
  };
};

export const autUrls = _autUrls();
