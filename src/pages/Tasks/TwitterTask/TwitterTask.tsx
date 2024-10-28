import { memo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography
} from "@mui/material";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TaskStatus } from "@store/model";
import { updateContributionById } from "@store/contributions/contributions.reducer";
import { AutOsButton } from "@components/AutButton";
import TaskDetails from "../Shared/TaskDetails";
import SubmitDialog from "@components/Dialog/SubmitDialog";
import AutLoading from "@components/AutLoading";
import { useOAuthSocials } from '@components/OAuth';
import { useAccount } from 'wagmi';

const TwitterSubmitContent = ({ contribution, userAddress }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
  const { autAddress, hubAddress } = useParams();
  const { getAuthX } = useOAuthSocials();

  const handleSubmit = async () => {
    await getAuthX(
      async (data) => {
        const { access_token } = data;
        setLoading(true);
        
        try {
          // Here you would typically make your API call to verify the twitter action
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating API call
          
          dispatch(
            updateContributionById({
              id: contribution?.id,
              data: {
                ...contribution,
                status: TaskStatus.Submitted,
                submission: {
                  properties: {
                    twitterToken: access_token
                  }
                }
              }
            })
          );
          
          setLoading(false);
          setOpenSubmitSuccess(true);
        } catch (error) {
          setLoading(false);
          // Handle error case
          console.error('Failed to submit contribution:', error);
        }
      },
      () => {
        setLoading(false);
        // Handle auth failure
      }
    );
  };

  return (
    <Stack
      direction="column"
      gap={4}
      sx={{
        flex: 1,
        justifyContent: "space-between",
        margin: "0 auto",
        width: {
          xs: "100%",
          sm: "600px",
          xxl: "800px"
        }
      }}
    >
      <SubmitDialog
        open={openSubmitSuccess || loading}
        mode={openSubmitSuccess ? "success" : "loading"}
        backdropFilter={true}
        message={loading ? "" : "Congratulations!"}
        titleVariant="h2"
        subtitle={
          loading
            ? "Submitting contribution..."
            : "Your submission has been successful!"
        }
        subtitleVariant="subtitle1"
        handleClose={() => {
          if (!loading) {
            setOpenSubmitSuccess(false);
            navigate({
              pathname: `/${autAddress}/hub/${hubAddress}`,
              search: searchParams.toString()
            });
          }
        }}
      />

      {contribution?.status === TaskStatus.Created ||
      contribution?.status === TaskStatus.Taken ? (
        <Card
          sx={{
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px"
            }}
          >
            <Typography
              color="white"
              variant="body"
              textAlign="center"
              marginBottom="24px"
            >
              {contribution?.description}
            </Typography>
            
            <Typography
              color="white"
              variant="body2"
              textAlign="center"
              marginBottom="32px"
            >
              Please authenticate with Twitter to verify your contribution
            </Typography>

            <AutOsButton
              type="button"
              color="primary"
              variant="outlined"
              onClick={handleSubmit}
              sx={{
                width: "160px"
              }}
            >
              <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                Verify with Twitter
              </Typography>
            </AutOsButton>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            bgcolor: "nightBlack.main",
            borderColor: "divider",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Stack direction="column" alignItems="center" mb="15px">
              <Typography
                color="white"
                variant="body"
                textAlign="center"
                p="5px"
              >
                {contribution?.description}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Contribution Description
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

const TwitterTask = ({ contribution }) => {
  const { address: userAddress } = useAccount();

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {contribution ? (
        <>
          <TaskDetails task={contribution} />
          <TwitterSubmitContent
            contribution={contribution}
            userAddress={userAddress}
          />
        </>
      ) : (
        <AutLoading width="130px" height="130px" />
      )}
    </Container>
  );
};

export default memo(TwitterTask);