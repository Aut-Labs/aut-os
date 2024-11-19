import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { memo } from "react";
import { Link, useParams } from "react-router-dom";
import { TaskContributionNFT } from "@aut-labs/sdk";
import OverflowTooltip from "@components/OverflowTooltip";

const TaskDetails = ({
  contribution
}: {
  contribution: TaskContributionNFT & { contributionType?: string };
}) => {
  const { hubAddress, autAddress } = useParams();

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
                sm: "absolute"
              },
              left: {
                sm: "0"
              }
            }}
            to={`/${autAddress}/hub/${hubAddress}`}
            component={Link}
          >
            <Typography color="white" variant="body">
              Back
            </Typography>
          </Button>
          <Typography textAlign="center" color="white" variant="h3">
            {contribution?.name}
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
          {contribution?.contributionType}
        </Typography>

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
