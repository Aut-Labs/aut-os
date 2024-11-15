import { memo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Link,
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
import { useOAuthSocials } from "@components/OAuth";
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { environment } from "@api/environment";

const GithubCommitContent = ({ contribution, userAddress }) => {
  if (contribution) {
    // eslint-disable-next-line no-debugger
    debugger;
  }
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
  const { autAddress, hubAddress } = useParams();
  const { getAuthGithub } = useOAuthSocials();

  const { mutateAsync: verifyCommitTask } = useMutation<any, void, any>({
    mutationFn: (verifyCommitRequest) => {
      return axios
        .post(
          `http://localhost:4005/api/task/github/commit`,
          verifyCommitRequest
        )
        .then((res) => res.data);
    }
  });

  const handleSubmit = async () => {
    await getAuthGithub(
      async (data) => {
        const { access_token } = data;
        setLoading(true);
        try {
          await verifyCommitTask(
            {
              accessToken: access_token,
              contributionId: contribution?.id,
              owner: contribution?.properties?.organisation,
              branch: contribution?.properties?.branch,
              repo: contribution?.properties?.repository
            },
            {
              onSuccess: (response) => {
                dispatch(
                  updateContributionById({
                    id: contribution?.id,
                    data: {
                      ...contribution,
                      status: TaskStatus.Submitted,
                      submission: {
                        properties: {
                          githubToken: access_token
                        }
                      }
                    }
                  })
                );

                setOpenSubmitSuccess(true);
                setLoading(false);
              },
              onError: (res) => {
                console.error("Failed to submit contribution:", res);
                setLoading(false);
              }
            }
          );
        } catch (error) {
          setLoading(false);
          // Handle error case
          console.error("Failed to submit contribution:", error);
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

            <Link
              href={contribution.properties?.tweetUrl}
              target="_blank"
              color="primary"
              underline="none"
            >
              <Typography
                color="primary"
                variant="body2"
                textAlign="center"
                marginBottom="16px"
              >
                {contribution.properties?.tweetUrl}
              </Typography>
            </Link>

            <Typography
              color="white"
              variant="body2"
              textAlign="center"
              marginBottom="32px"
            >
              Please authenticate with Github to verify your contribution
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
                Claim
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

const GithubCommitTask = ({ contribution }) => {
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
          <GithubCommitContent
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

export default memo(GithubCommitTask);
