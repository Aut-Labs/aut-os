/* eslint-disable max-len */
export const generateUniqueIdBetter = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const images = [
  "https://s3-alpha-sig.figma.com/img/3e8e/1bf6/6a3c250e110cf60b64fd48c69ebe7f2d?Expires=1703462400&Signature=ZLeM7WeS-AZCOmPkU2UHNMS8Syb29wxCXhZKqQ8cTles8sWdpDcIqSs-o8covZU7pQuk68qOL8o5wYnh0QoKXQjloe3RIqIBCXsZaa9U3ArvvrlRbvjp-mRrahpThWBcXo25ApPSq91FSbJxk5pS8a2k4IGBBvUa~1f1QbUwkDuZi4LkY56LCaBcp33r5llpVvewcrckaFEmefovfLkKNw5i~xlLPvr1EAnrWva4dIlIOnzqHG1Sm5b9ZkWNzqCL9fDSeW0tqXt~pFa-OVUwEgGn-kJCcvOPBRS1mFCnlyRJSkFu2pF4lE~PZ4cWTKOIRmyetaeHpwJGipGs7GEHbA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
  "https://s3-alpha-sig.figma.com/img/b182/4641/9af0a040a7be9460d4d6d23c11460a71?Expires=1703462400&Signature=CzhFjFuEFm0DSD948SmkLb17AqkBAZRflRn8~ijsGsUdBmKC5tDi1J-7e35BOHjkcuh0Jo6KD3Ug3KwnnbX1HW~OMpYWNXqWXy-0Ndm9dVCVqd0cfIHIURNw2O-pubu3I~5RUNx6yXQC~Czlh2e1wKI5b9KTK230PorIRdttzacwQ65jS-zl8sxfs19UET8nCJoBUDaenkh38ERnl4oYBFtHxyNjfUwKUoryyVdrSPtBzQjjsQY7oo~~ACoqkie48Au6tMg7pHNrVC80kLwEXnyUfDd8vTX9XLQIqxQsml8QCBE3rm5outLDfEYqJSIaeVd8eFYwTOH-GMjHUIOzvQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
  "https://s3-alpha-sig.figma.com/img/7294/c7e9/f29a0df2105db85edd83be55a6911d08?Expires=1703462400&Signature=dABy5ecM8SeFEaU1YirA89v~auMvtKEEQgI5RpRVqe5WbN6m~GN~VjxluT4WbgquEghFh1gyB-QwFLNGxdcW7DbZUgcUsUesIgNioUnXbFDn7awhyLzNmh-N4jV1BX24TxHTEAP2r8duHSO14m1uOJtunIyYz8dwJfuJrWWOJy7ei9iQeIUyr4qEWuQUDTpvJqlWewKUz~AJQVBQI~GamiMO4M5ZoHGWgYKtiHtle4OY5Sy~Br~nzmGElkTpN4u0gznSFB~gMsICTDT6UJoh0tO-p5Rwg-nfVoeAOrDET7PVleQFaJQ7QFkc00uxzUJYD~yLgdpJi4byI~5s141~Fg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
  "https://s3-alpha-sig.figma.com/img/34c3/d82f/d282f533c22e99505e0fa46cef74888c?Expires=1703462400&Signature=nsjb7annzJ8QdnDyGNR~dR5uIDbG7eMVmaHu7yDJlBa~45Bfn2gkP1GUsCFmGm4jbXM6LqtUgfnUQ30yRIyPsourAIlbSBvD8pF3rgYJbKt8twiHfy-neTzIcADOLL4xWOxCzAtAh7ZzGA9RQEXCTrfkNq0HdqUD55oyeg3yduAPimAjKbWUr8~IT5o21KtF3BC3-XiuKcRPL39V3TYi4zXZxNDXxy-YK6w1ipySomzm48HKElCt571C2VbbO4QSDzgVyxq9puXMNx92TOFsTrs-zZ5A8daURysxmrOnpaiIpQfT69TEtnT7ocxknsu1CiunD0S3hdO0ZnZVsT3Mzw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
  "https://s3-alpha-sig.figma.com/img/217e/e63d/60ee71683b475f5c876d0b2135e6c467?Expires=1703462400&Signature=cvozor79RYkC~Kvx~pNVbQOM0s~P3uN3ccRsG8U3F~EZ95yaYE4AOGxqa1EptaRV5T23PlDatVhzMz1u6n04wGWGRXpdt5~Z1pOrWJxp9E1iPHCECuDNsV~gr1gbNmWPWXO3hslTzy1Ma2UUMmroOg-3M9TV-a3QqrpIx8GngLINuMtiXWod0yTgzGqQXAH7tspKf6XK~qWnU~EbaSepORsT7SKSkUD1V3pgoZFBuv5L4U7vAeHrAWw8YnGYQr7KX4B6bW7oYqFQaQVjh2TOVsNegKLJ-Gdz-xk1vl-MZ8-6CpnyKLY76keV2EBAo08yUn7BHliFBpSqGCUbMBWdNQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
  "https://s3-alpha-sig.figma.com/img/d649/4146/b06fe484bb699544e290949b0e0abefa?Expires=1703462400&Signature=ZDsqhNY~ywiRq4XYuWt30T0Ejt54TDzCXUx0gZPKX-u-QlBJzEEFObRPFUWGj610YOzzleBuSAGXQe86zyfRc5DDGFp1q7cRv3atYj-2Rtz-NJvuBSAyxUOTgsdd-ZZzyK0mQedPLiFl8Mr14BqHeWDW2vG~WbIkv4LdXnTk2w8jYPcZ3cD2XJIisxi~VBCC6VS4xZFecSxdr~5MAa5eGzIIaoC7CKGWQP-Nbmdw8WVVN9WFBX-QIbaCnX33L5gCq5g88tjzgGQtQOED9UCWhU3BtEfb4JxPUKYs75iR2GT9AOWh8e60L4Qfpw4EQ1j7x-AwISdyH8G7Fs3hgw7VsQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
];

function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

export class Nova {
  id: string;
  market: string;
  roles: number[];
  metadata: string;
  avatar: string;
  minCommitment: number;
  members: AutId[];

  constructor(
    market: string,
    roles: number[],
    metadata: string,
    avatar: string,
    minCommitment: number,
    members: AutId[]
  ) {
    this.id = generateUniqueIdBetter();
    this.market = market;
    this.roles = roles;
    this.metadata = metadata;
    this.avatar = avatar;
    this.minCommitment = minCommitment;
    this.members = members; // Initialize with no members
  }
}

export interface AutIdInteractions {
  type: string;
  name: string;
  description: string;
  weight: string;
  status: "Complete" | "Incomplete";
}

export class AutId {
  id: string;
  owner: string;
  username: string;
  img: HTMLImageElement;
  commitment: number;
  role: number;
  interactions: AutIdInteractions[];
  nova: Nova;
  constructor(
    owner: string,
    username: string,
    commitment: number,
    role: number,
    interactions,
    avatar,
    nova
  ) {
    const img = new Image();
    img.src = avatar;
    this.id = generateUniqueIdBetter();
    this.owner = owner;
    this.username = username;
    this.img = img;
    this.commitment = commitment;
    this.role = role;
    this.interactions = interactions;
    this.nova = nova;
  }
}
