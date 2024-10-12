import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { memo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { getContributionTypeSubtitle } from "@utils/format-contribution-type";

const TaskDetails = ({ task }: any) => {
  const [searchParams] = useSearchParams();
  const { hubAddress, autAddress } = useParams();
  const isLoading = false;

  const contributionType = getContributionTypeSubtitle(
    task?.contributionType
  );

  return (
    <>
      {isLoading ? (
        <CircularProgress className="spinner-center" size="60px" />
      ) : (
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
                  sm: "absolute"
                },
                left: {
                  sm: "0"
                }
              }}
              to={`/${autAddress}/hub/${hubAddress}`}
              component={Link}
            >
              {/* {searchParams.get("returnUrlLinkName") || "Back"} */}
              <Typography color="white" variant="body">
                Back
              </Typography>
            </Button>
            <Typography textAlign="center" color="white" variant="h3">
              {task?.name}
            </Typography>
          </Stack>

          <Typography
            mt={1}
            mx="auto"
            textAlign="center"
            color="white"
            sx={{
              width: {
                xs: "100%",
                sm: "700px",
                xxl: "1000px"
              }
            }}
            variant="body"
          >
            {contributionType}
          </Typography>

          {/* <OverflowTooltip
          typography={{
            maxWidth: "400px"
          }}
          text={task?.description}
        /> */}
        </Box>
      )}
    </>
  );
};

export default memo(TaskDetails);
