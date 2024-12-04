import {
  Box,
  Button,
  Chip,
  Stack,
  styled,
  SvgIcon,
  Tooltip,
  Typography
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { memo } from "react";
import { Link, useParams } from "react-router-dom";
import { TaskContributionNFT } from "@aut-labs/sdk";
import ArrowIcon from "@assets/autos/move-right.svg?react";
import InfoIcon from "@assets/autos/info-icon.svg?react";
import theme from "@theme/theme";
import {
  borderRadius,
  display,
  margin,
  maxWidth,
  textAlign,
  width
} from "@mui/system";
import { max } from "date-fns";

const TaskTopWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px",
  borderBottom: "1px solid",
  borderColor: "inherit",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "20px"
  }
}));
const TaskBottomWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  borderColor: "inherit",

  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "column"
  }
}));

const PropertiesWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "8px",
  [theme.breakpoints.down("md")]: {
    padding: "4px 0"
  }
}));

const TaskDetails = ({
  contribution
}: {
  contribution: TaskContributionNFT & { contributionType?: string };
}) => {
  const { hubAddress, autAddress } = useParams();
  console.log(contribution);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 4,
          position: "relative",
          mx: "auto",
          width: "100%"
        }}
      >
        <Stack alignItems="center" justifyContent="center">
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            color="offWhite"
            sx={{
              position: {
                md: "absolute"
              },
              left: {
                md: "0"
              }
            }}
            to={`/${autAddress}/hub/${hubAddress}`}
            component={Link}
          >
            <Typography color="white" variant="body">
              Back
            </Typography>
          </Button>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: "#576176",
              width: "70%",
              maxWidth: "650px"
            }}
          >
            <TaskTopWrapper
              sx={{
                position: "relative"
              }}
            >
              <Typography
                color="white"
                variant="subtitle1"
                sx={{
                  maxWidth: "70%",
                  textAlign: {
                    xs: "start",
                    md: "center"
                  }
                }}
              >
                {contribution?.name}
              </Typography>
              <Typography
                color="white"
                variant="body"
                sx={{
                  mt: 1,
                  textAlign: {
                    xs: "start",
                    md: "center"
                  }
                }}
              >
                {contribution?.description}
              </Typography>
              <Chip
                label={contribution?.contributionType}
                color="primary"
                sx={{
                  position: "absolute",
                  top: "8px",
                  right: "8px"
                }}
              />
            </TaskTopWrapper>
            <TaskBottomWrapper>
              <PropertiesWrapper
                sx={{
                  borderRight: {
                    xs: "0",
                    md: "1px solid"
                  },
                  borderBottom: {
                    xs: "1px solid",
                    md: "0"
                  },
                  borderRightColor: {
                    xs: "transparent",
                    md: "inherit"
                  },
                  borderBottomColor: {
                    xs: "inherit",
                    md: "transparent"
                  }
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Typography color="white" variant="body">
                    {new Date(
                      parseInt(
                        contribution?.properties?.startDate?.toString() || ""
                      ) * 1000
                    ).toLocaleDateString()}{" "}
                  </Typography>
                  <SvgIcon
                    sx={{ fill: "transparent", mx: theme.spacing(1) }}
                    component={ArrowIcon}
                  />
                  <Typography color="white" variant="body">
                    {new Date(
                      parseInt(
                        contribution?.properties?.endDate?.toString() || ""
                      ) * 1000
                    ).toLocaleDateString()}{" "}
                  </Typography>
                </Box>
              </PropertiesWrapper>
              <PropertiesWrapper
                sx={{
                  borderRight: {
                    xs: "0",
                    md: "1px solid"
                  },
                  borderBottom: {
                    xs: "1px solid",
                    md: "0"
                  },
                  borderRightColor: {
                    xs: "transparent",
                    md: "inherit"
                  },
                  borderBottomColor: {
                    xs: "inherit",
                    md: "transparent"
                  }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Typography color="white" variant="body">
                    {contribution?.properties.points}{" "}
                    {contribution.properties.points > 1 ? "points" : "point"}
                  </Typography>
                  <Tooltip
                    title={
                      "This is the number of points you will earn upon completion of this contribution."
                    }
                  >
                    <SvgIcon
                      sx={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        background: "transparent",
                        fill: "transparent",
                        ml: 1
                      }}
                      viewBox="0 0 16 16"
                    >
                      <InfoIcon />
                    </SvgIcon>
                  </Tooltip>
                </Box>
              </PropertiesWrapper>

              <PropertiesWrapper>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Typography color="white" variant="body">
                    {contribution?.properties.quantity}{" "}
                    {contribution.properties.quantity > 1
                      ? "completions"
                      : "completion"}
                  </Typography>
                  <Tooltip
                    title={
                      "This is the maximum number of times this contribution can be claimed and completed."
                    }
                  >
                    <SvgIcon
                      sx={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        background: "transparent",
                        fill: "transparent",
                        ml: 1
                      }}
                      viewBox="0 0 16 16"
                    >
                      <InfoIcon />
                    </SvgIcon>
                  </Tooltip>
                </Box>

                {/* <Tooltip
                  disableHoverListener={false}
                  title={
                    "The maximum number of completions allowed for this task."
                  }
                  style={{
                    width: "24px",
                    height: "24px"
                  }}
                >
                  <SvgIcon
                    sx={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      background: "transparent",
                      fill: "transparent"
                    }}
                    viewBox="0 0 16 16"
                    key={`info-icon`}
                    component={InfoIcon}
                  />
                </Tooltip> */}
              </PropertiesWrapper>
            </TaskBottomWrapper>
          </Box>
        </Box>

        {/* <Box
          sx={{
            mt: 2,
            mx: "auto",
            textAlign: "center",
            width: {
              xs: "100%",
              sm: "700px",
              xxl: "1000px"
            }
          }}
        >
          <OverflowTooltip
            typography={{
              maxWidth: "400px"
            }}
            text={contribution?.description}
          />
        </Box> */}
      </Box>
    </>
  );
};

export default memo(TaskDetails);
