import { Box, SvgIcon, Typography, useTheme } from "@mui/material";
import { CommunityTasksTable } from "./NovaTaskTable";
import AutOsTabs from "@components/AutOsTabs";
import { ReactComponent as UsersIcon } from "@assets/autos/users.svg";
import { AutOsButton } from "@components/AutButton";

const mocktabs = [
  {
    label: "Open tasks",
    props: {
      tasks: [
        {
          name: "Write a Blog Post",
          description:
            "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
          startDate: new Date("2024-02-01"),
          endDate: new Date("2024-02-05")
        },
        {
          name: "Code Review Session",
          description:
            "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
          startDate: new Date("2024-02-01"),
          endDate: new Date("2024-02-10")
        },
        {
          name: "Volunteer for Charity Drive",
          description:
            "Join our charity initiative by offering your time or resources to support a social cause.",
          startDate: new Date("2024-03-01"),
          endDate: new Date("2024-03-10")
        }
      ]
    },
    component: CommunityTasksTable
  },
  {
    label: "Polls",
    props: {
      tasks: [
        {
          name: "Select the Next Featured Artist",
          description:
            "Vote for the artist whose NFT collection will be featured in our upcoming exhibition.",
          startDate: new Date("2022-04-01"),
          endDate: new Date("2022-04-10")
        },
        {
          name: "Debate: Yield Farming Strategies",
          description:
            "Share your perspective on the most effective DeFi yield farming strategies in our community debate.",
          startDate: new Date("2024-05-01"),
          endDate: new Date("2024-05-10")
        },
        {
          name: "Eco-Friendly Blockchain Solutions",
          description:
            "Cast your vote to prioritize eco-friendly projects that promote sustainability within the blockchain space.",
          startDate: new Date("2024-03-01"),
          endDate: new Date("2024-03-10")
        }
      ]
    },
    component: CommunityTasksTable
  },
  {
    label: "Events",
    props: {
      tasks: [
        {
          name: "Digital Art Showcase",
          description:
            "Join us for an online exhibition of web3-inspired art created by members of our collective.",
          startDate: new Date("2024-05-01"),
          endDate: new Date("2024-05-10")
        },
        {
          name: "Play-to-Earn Game Night",
          description:
            "Participate in a virtual game night where you can earn tokens by playing blockchain-based games.",
          startDate: new Date("2024-06-01"),
          endDate: new Date("2024-06-10")
        },
        {
          name: "Tokenomics Webinar",
          description:
            "Attend our interactive webinar to learn about the latest trends in tokenomics and network with experts in the field.",
          startDate: new Date("2024-07-01"),
          endDate: new Date("2024-07-10")
        }
      ]
    },
    component: CommunityTasksTable
  }
];

const AutNovaTabs = ({ isNovaMember }) => {
  const theme = useTheme();
  return (
    <>
      {isNovaMember ? (
        <AutOsTabs tabs={mocktabs}></AutOsTabs>
      ) : (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SvgIcon
              sx={{
                fill: "transparent",
                height: "50px",
                width: "50px"
              }}
              component={UsersIcon}
            />
            <Typography
              variant="subtitle1"
              color="offWhite.main"
              textAlign="center"
              sx={{
                width: {
                  xs: "300px",
                  md: "500px"
                }
              }}
            >
              Join Nova to see its Open Tasks, Polls and Events
            </Typography>
            <AutOsButton
              type="button"
              color="primary"
              variant="outlined"
              sx={{
                mt: theme.spacing(3)
              }}
            >
              <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                Join
              </Typography>
            </AutOsButton>
          </Box>
          <Box
            sx={{
              filter: "blur(20px)",
              pointerEvents: "none",
              position: "absolute",
              top: "30px"
            }}
          >
            <AutOsTabs tabs={mocktabs}></AutOsTabs>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AutNovaTabs;
