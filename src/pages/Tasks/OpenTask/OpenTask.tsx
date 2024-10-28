/* eslint-disable no-useless-escape */
/* eslint-disable max-len */

import AutLoading from "@components/AutLoading";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { AutTextField } from "@theme/field-text-styles";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { useAccount } from "wagmi";
import { FormHelperText } from "@components/Fields/AutFields";
import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import { TaskFileUpload } from "@components/FileUpload";
import { AutOsButton } from "@components/AutButton";
import { TaskStatus } from "@store/model";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { updateContributionById } from "@store/contributions/contributions.reducer";
import { useDispatch } from "react-redux";
import SubmitDialog from "@components/Dialog/SubmitDialog";

interface UserSubmitContentProps {
  contribution: any;
  userAddress: string;
  isLoadingTasks: boolean;
  submission?: any;
}

const errorTypes = {
  pattern: "Invalid url."
};

const UserSubmitContent = ({
  contribution,
  userAddress,
  isLoadingTasks
}: UserSubmitContentProps) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
  const { control, handleSubmit, formState, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      openTask: null,
      attachment: null
    }
  });

  const { autAddress, hubAddress } = useParams();

  useEffect(() => {
    if (!initialized && contribution) {
      setValue("openTask", contribution.submission?.description);
      setInitialized(true);
    }
  }, [initialized, contribution]);

  //   const [submitTask, { isSuccess, error, isError, isLoading, reset }] =
  //     useSubmitOpenTaskMutation();

  //   useEffect(() => {
  //     if (isSuccess) {
  //       setOpenSubmitSuccess(true);
  //     }
  //   }, [isSuccess]);

  const onSubmit = async (values) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    dispatch(
      updateContributionById({
        id: contribution?.id,
        data: {
          ...contribution,
          status: TaskStatus.Submitted
        }
      })
    );
    setLoading(false);
    setOpenSubmitSuccess(true);

    // submitTask({
    //   userAddress,
    //   file: values.attachment,
    //   task: {
    //     ...task,
    //     submission: {
    //       name: "Open task submission",
    //       description: values.openTask,
    //       properties: {} as any
    //     }
    //   },
    //   onboardingQuestAddress: searchParams.get(
    //     RequiredQueryParams.OnboardingQuestAddress
    //   ),
    //   pluginAddress: plugin.pluginAddress,
    //   pluginDefinitionId: plugin.pluginDefinitionId
    // });
  };

  // const attachmentType = useMemo(() => {
  //   // @ts-ignore
  //   return task.properties.attachmentType;
  // }, [task]);

  // const textRequired = useMemo(() => {
  //   // @ts-ignore
  //   return task.properties.textRequired;
  // }, [task]);

  const textRequired = contribution?.properties?.textRequired;
  const attachmentType = contribution?.properties?.attachmentType;

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
      {/* <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
       */}
      {/* <LoadingDialog open={true} message="Submitting contribution..." backdropFilter={true} /> */}
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
              flexDirection: "column"
            }}
          >
            <Typography
              color="white"
              variant="body"
              textAlign="center"
              p="20px"
            >
              {contribution?.description}
            </Typography>
            {textRequired && (
              <Controller
                name="openTask"
                control={control}
                rules={{
                  required: true,
                  maxLength: 257
                }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <AutTextField
                      name={name}
                      disabled={
                        contribution.status === TaskStatus.Submitted ||
                        contribution.status === TaskStatus.Finished
                      }
                      value={value || ""}
                      sx={{ mb: "20px" }}
                      onChange={onChange}
                      variant="outlined"
                      color="offWhite"
                      multiline
                      rows={5}
                      placeholder={`Enter text here (required)`}
                    />
                  );
                }}
              />
            )}
            {attachmentType === "url" && (
              <>
                <Typography
                  color="white"
                  variant="body"
                  textAlign="center"
                  p="20px"
                >
                  URL
                </Typography>
                <Controller
                  name="attachment"
                  control={control}
                  rules={{
                    required: true,
                    pattern:
                      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
                  }}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <AutTextField
                        name={name}
                        disabled={
                          contribution.status === TaskStatus.Submitted ||
                          contribution.status === TaskStatus.Finished
                        }
                        value={value || ""}
                        sx={{ mt: "20px" }}
                        onChange={onChange}
                        variant="outlined"
                        color="offWhite"
                        required
                        rows={1}
                        placeholder="URL Link Here"
                        helperText={
                          <FormHelperText
                            value={value}
                            name={name}
                            errors={formState.errors}
                            errorTypes={errorTypes}
                          />
                        }
                      />
                    );
                  }}
                />
              </>
            )}
            {(attachmentType === "image" || attachmentType === "text") && (
              <>
                <Typography
                  color="white"
                  variant="body"
                  textAlign="center"
                  p="20px"
                >
                  {`Upload a file ${
                    attachmentType === "image"
                      ? "(.png, .jpg, .jpeg)"
                      : "(.doc, .docx, .txt, .pdf)"
                  }`}
                </Typography>
                <Controller
                  name="attachment"
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange } }) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <TaskFileUpload
                          attachmentType={attachmentType}
                          color="offWhite"
                          fileChange={async (file) => {
                            if (file) {
                              onChange(file);
                            } else {
                              onChange(null);
                            }
                          }}
                        />
                      </div>
                    );
                  }}
                />
              </>
            )}
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
              flexDirection: "column"
            }}
          >
            {(contribution as any)?.status === TaskStatus.Finished && (
              <Stack direction="column" alignItems="flex-end" mb="15px">
                <Chip label="Approved" color="success" size="small" />
              </Stack>
            )}
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

            {
              // @ts-ignore
              task?.properties?.attachmentRequired && (
                <Stack direction="column" alignItems="center">
                  <Typography
                    color="white"
                    variant="body"
                    textAlign="center"
                    p="5px"
                  >
                    <Link
                      color="primary"
                      sx={{
                        mt: 1,
                        cursor: "pointer"
                      }}
                      variant="body"
                      target="_blank"
                      href={ipfsCIDToHttpUrl(
                        contribution?.submission?.properties["fileUri"]
                      )}
                    >
                      Open attachment
                    </Link>
                  </Typography>
                  <Typography variant="caption" className="text-secondary">
                    Attachment File
                  </Typography>
                </Stack>
              )
            }
          </CardContent>
        </Card>
      )}

      <Stack
        sx={{
          margin: "0 auto",
          width: {
            xs: "100%",
            sm: "600px",
            xxl: "800px"
          }
        }}
      >
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
              disabled={
                !formState.isValid
                //   ||  isLoadingTasks
              }
              onClick={handleSubmit(onSubmit)}
            >
              <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                Confirm
              </Typography>
            </AutOsButton>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

const OpenTask = ({ contribution }: any) => {
  const [searchParams] = useSearchParams();
  const { address: userAddress } = useAccount();

  const params = useParams();

  //   const { task, submission, isLoading } = useGetAllTasksPerQuestQuery(
  //     {
  //       userAddress,
  //       isAdmin: false,
  //       pluginAddress: searchParams.get(
  //         RequiredQueryParams.OnboardingQuestAddress
  //       ),
  //       questId: +searchParams.get(RequiredQueryParams.QuestId)
  //     },
  //     {
  //       selectFromResult: ({ data, isLoading, isFetching }) => ({
  //         isLoading: isLoading || isFetching,
  //         submission: (data?.submissions || []).find((t) => {
  //           const [pluginType] = location.pathname.split("/").splice(-2);
  //           return (
  //             t.submitter === userAddress &&
  //             t.taskId === +params?.taskId &&
  //             PluginDefinitionType[pluginType] ===
  //               taskTypes[t.taskType].pluginType
  //           );
  //         }),
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

  const isLoading = false;
  const submission = null;

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
          <TaskDetails task={submission || contribution} />
          <UserSubmitContent
            // task={submission || task}
            contribution={contribution}
            isLoadingTasks={isLoading}
            userAddress={userAddress}
          />
        </>
      ) : (
        <AutLoading width="130px" height="130px"></AutLoading>
      )}
    </Container>
  );
};

export default memo(OpenTask);
