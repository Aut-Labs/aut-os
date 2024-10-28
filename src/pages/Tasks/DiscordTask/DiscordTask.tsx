import AutLoading from "@components/AutLoading";
import { Box, Container, Stack, Typography } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { StepperButton } from "@components/StepperButton";
import { useAccount } from "wagmi";
import { AutOsButton } from "@components/AutButton";
import { TaskStatus } from "@store/model";
import { useOAuth, useOAuthSocials } from "@components/OAuth";
import { updateContributionById } from "@store/contributions/contributions.reducer";
import SubmitDialog from "@components/Dialog/SubmitDialog";

const JoinDiscordTask = ({ contribution }: any) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const params = useParams();
  const { address: userAddress } = useAccount();
  // const isAdmin = useSelector(IsAdmin);
  const isAdmin = false;
  const { getAuthDiscord, authenticating } = useOAuthSocials();
  const [joinClicked, setJoinClicked] = useState(false);
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
  const navigate = useNavigate();
  const { autAddress, hubAddress } = useParams();

  //   const { task, isLoading: isLoadingTasks } = useGetAllTasksPerQuestQuery(
  //     {
  //       userAddress,
  //       isAdmin,
  //       pluginAddress: searchParams.get(
  //         RequiredQueryParams.OnboardingQuestAddress
  //       ),
  //       questId: +searchParams.get(RequiredQueryParams.QuestId)
  //     },
  //     {
  //       selectFromResult: ({ data, isLoading, isFetching }) => ({
  //         isLoading: isLoading || isFetching,
  //         task: (data?.tasks || []).find((t) => {
  //           const [pluginType] = location.pathname.split("/").splice(-2);
  //           return (
  //             t.taskId === +params?.taskId &&
  //             PluginDefinitionType[pluginType] ===
  //               taskTypes[t.taskType].pluginType
  //           );
  //         })
  //       })
  //     }
  //   );

  //   const [
  //     submitJoinDiscordTask,
  //     { isSuccess, error, isError, isLoading, reset }
  //   ] = useSubmitJoinDiscordTaskMutation();

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    dispatch(
      updateContributionById({
        id: contribution.id,
        data: {
          ...contribution,
          status: TaskStatus.Submitted
        }
      })
    );
    setLoading(false);
    setOpenSubmitSuccess(true);
    // await getAuth(
    //   async (data) => {
    //     const { access_token } = data;
    //     submitJoinDiscordTask({
    //       userAddress,
    //       task,
    //       bearerToken: access_token,
    //       onboardingPluginAddress: searchParams.get(
    //         RequiredQueryParams.OnboardingQuestAddress
    //       )
    //     });
    //   },
    //   () => {
    //     setJoinClicked(false);
    //   }
    // );
  };

  //   useEffect(() => {
  //     if (isSuccess) {
  //       setOpenSubmitSuccess(true);
  //     }
  //   }, [isSuccess]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: "30px",
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {/* <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
       */}
      {/* <LoadingDialog
        open={loading}
        message="Submitting contribution..."
        backdropFilter={true}
      />
      <SuccessDialog
        backdropFilter={true}
        open={openSubmitSuccess}
        message="Congrats!"
        titleVariant="h2"
        subtitle="You successfully submitted the task!"
        subtitleVariant="subtitle1"
        handleClose={() => {
          setOpenSubmitSuccess(false);
          navigate({
            pathname: "/quest",
            search: searchParams.toString()
          });
        }}
      ></SuccessDialog> */}

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
      ></SubmitDialog>

      {contribution ? (
        <>
          <TaskDetails task={contribution} />
          <Stack
            direction="column"
            gap={8}
            sx={{
              flex: 1,
              justifyContent: "space-between",
              margin: "0 auto",
              width: {
                xs: "100%",
                sm: "650px",
                xxl: "800px"
              }
            }}
          >
            <Stack
              sx={{
                margin: "0 auto",
                width: {
                  xs: "100%",
                  sm: "400px",
                  xxl: "500px"
                }
              }}
            >
              {joinClicked && (
                <AutOsButton
                  type="button"
                  color="primary"
                  variant="outlined"
                  sx={{
                    width: "100px"
                  }}
                  disabled={contribution?.status !== TaskStatus.Created}
                  onClick={() => onSubmit()}
                >
                  <Typography
                    fontWeight="bold"
                    fontSize="16px"
                    lineHeight="26px"
                  >
                    Confirm
                  </Typography>
                </AutOsButton>
              )}
              {!joinClicked && (
                <AutOsButton
                  type="button"
                  color="primary"
                  variant="outlined"
                  sx={{
                    width: "100px"
                  }}
                  disabled={
                    contribution?.status !== TaskStatus.Created
                    // || isLoadingTasks
                  }
                  onClick={() => {
                    setJoinClicked(true);
                    window.open(
                      contribution.metadata.properties["inviteUrl"],
                      "_blank"
                    );
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    fontSize="16px"
                    lineHeight="26px"
                  >
                    Join
                  </Typography>
                </AutOsButton>
              )}
              {/* <Button
                  startIcon={<OpenInNewIcon />}
                  sx={{
                    textTransform: "uppercase"
                  }}
                  type="button"
                  size="medium"
                  color="offWhite"
                  disabled={task?.status !== TaskStatus.Created}
                  variant="outlined"
                  component={Link}
                  target="_blank"
                  to={(task as any)?.metadata?.properties?.inviteUrl}
                  onClick={setButtonClicked}
                >
                  Join Discord
                </Button> */}
            </Stack>
            {(contribution?.status === TaskStatus.Created ||
              contribution?.status === TaskStatus.Taken) && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  mb: 4,
                  justifyContent: {
                    xs: "center",
                    sm: "flex-end"
                  }
                }}
              >
                {" "}
                <AutOsButton
                  type="button"
                  color="primary"
                  variant="outlined"
                  sx={{
                    width: "100px"
                  }}
                  onClick={onSubmit}
                  disabled={!joinClicked}
                >
                  <Typography
                    fontWeight="bold"
                    fontSize="16px"
                    lineHeight="26px"
                  >
                    Confirm
                  </Typography>
                </AutOsButton>
              </Box>
            )}
          </Stack>
        </>
      ) : (
        <AutLoading width="130px" height="130px"></AutLoading>
      )}
    </Container>
  );
};

export default memo(JoinDiscordTask);
