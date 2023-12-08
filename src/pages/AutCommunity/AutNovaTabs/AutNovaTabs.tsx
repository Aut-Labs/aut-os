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
          startDate: new Date("2022-01-01"),
          endDate: new Date("2022-01-05")
        },
        {
          name: "Code Review Session",
          description:
            "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
          startDate: new Date("2022-02-01"),
          endDate: new Date("2022-02-10")
        },
        {
          name: "Task 3",
          description: "Description for task 3",
          startDate: new Date("2022-03-01"),
          endDate: new Date("2022-03-10")
        },
        {
          name: "Task 4",
          description: "Description for task 4",
          startDate: new Date("2022-04-01"),
          endDate: new Date("2022-04-10")
        },
        {
          name: "Task 5",
          description: "Description for task 5",
          startDate: new Date("2022-05-01"),
          endDate: new Date("2022-05-10")
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
          name: "Poll 1",
          description: "Description for poll 1",
          startDate: new Date("2022-03-01"),
          endDate: new Date("2022-03-10")
        },
        {
          name: "Poll 2",
          description: "Description for poll 2",
          startDate: new Date("2022-04-01"),
          endDate: new Date("2022-04-10")
        },
        {
          name: "Poll 3",
          description: "Description for poll 3",
          startDate: new Date("2022-05-01"),
          endDate: new Date("2022-05-10")
        },
        {
          name: "Poll 4",
          description: "Description for poll 4",
          startDate: new Date("2022-06-01"),
          endDate: new Date("2022-06-10")
        },
        {
          name: "Poll 5",
          description: "Description for poll 5",
          startDate: new Date("2022-07-01"),
          endDate: new Date("2022-07-10")
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
          name: "Event 1",
          description: "Description for event 1",
          startDate: new Date("2022-05-01"),
          endDate: new Date("2022-05-10")
        },
        {
          name: "Event 2",
          description: "Description for event 2",
          startDate: new Date("2022-06-01"),
          endDate: new Date("2022-06-10")
        },
        {
          name: "Event 3",
          description: "Description for event 3",
          startDate: new Date("2022-07-01"),
          endDate: new Date("2022-07-10")
        },
        {
          name: "Event 4",
          description: "Description for event 4",
          startDate: new Date("2022-08-01"),
          endDate: new Date("2022-08-10")
        },
        {
          name: "Event 5",
          description: "Description for event 5",
          startDate: new Date("2022-09-01"),
          endDate: new Date("2022-09-10")
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
