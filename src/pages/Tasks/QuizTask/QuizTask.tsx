import AutLoading from "@components/AutLoading";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Stack,
  styled,
  Typography
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { useAccount } from "wagmi";
import TaskDetails from "../Shared/TaskDetails";
import { StepperButton } from "@components/StepperButton";
import { AutOsButton } from "@components/AutButton";
import { TaskStatus } from "@store/model";
import { updateContributionById } from "@store/contributions/contributions.reducer";
import SubmitDialog from "@components/Dialog/SubmitDialog";

export const taskStatuses: any = {
  [TaskStatus.Created]: {
    label: "To Do",
    color: "info"
  },
  [TaskStatus.Finished]: {
    label: "Completed",
    color: "success"
  },
  [TaskStatus.Submitted]: {
    label: "Submitted",
    color: "warning"
  },
  [TaskStatus.Taken]: {
    label: "Taken",
    color: "info"
  }
};

const GridBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gridGap: "20px",
  marginTop: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  }
}));

const GridRow = styled(Box)({
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "1fr 40px",
  gridGap: "8px"
});

const Row = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  width: "100%"
});

const Answers = memo(({ control, questionIndex, answers, taskStatus }: any) => {
  const values = useWatch({
    name: `questions[${questionIndex}].answers`,
    control
  });

  const alphabetize = {
    0: "A",
    1: "B",
    2: "C",
    3: "D"
  };

  return (
    <GridBox>
      {answers.map((answer, index) => {
        return (
          <>
            {answer?.value && (
              <GridRow key={`questions[${questionIndex}].answers[${index}]`}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Typography mr={1} color="white" variant="subtitle2">
                    {alphabetize[index]}
                  </Typography>
                  <Typography color="white" variant="body" lineHeight="40px">
                    {answer?.value}
                  </Typography>
                </Stack>
                <Controller
                  name={`questions[${questionIndex}].answers[${index}].correct`}
                  control={control}
                  rules={{
                    required: !values?.some((v) => v.correct)
                  }}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <Checkbox
                        name={name}
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "primary"
                          },
                          "&.Mui-disabled": {
                            color: "nightBlack.light"
                          }
                        }}
                        value={value}
                        tabIndex={-1}
                        onChange={onChange}
                        disabled={
                          taskStatus === TaskStatus.Submitted ||
                          taskStatus === TaskStatus.Finished
                        }
                      />
                    );
                  }}
                />
              </GridRow>
            )}
          </>
        );
      })}
    </GridBox>
  );
});

const AnswersAdminView = memo(({ questionIndex, answers }: any) => {
  return (
    <GridBox>
      {answers.map((answer, index) => {
        return (
          <GridRow
            key={`questions[${questionIndex}].answers[${index}]`}
            style={{ gridTemplateColumns: "40px 1fr" }}
          >
            <Checkbox
              sx={{
                color: "white",
                "&.Mui-checked": {
                  color: "primary"
                },
                "&.Mui-disabled": {
                  color: "nightBlack.light"
                }
              }}
              checked={!!answer?.correct}
              disabled={true}
            />
            <Typography
              color={answer?.correct ? "success.main" : "error.main"}
              variant="body"
              lineHeight="40px"
            >
              {answer?.value}
            </Typography>
          </GridRow>
        );
      })}
    </GridBox>
  );
});

const QuizTask = ({ contribution }: any) => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  //   const isAdmin = useSelector(IsAdmin);
  const isAdmin = false;
  const { address: userAddress } = useAccount();
  const params = useParams();
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
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

  const { control, handleSubmit, getValues, setValue, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      questions: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  useEffect(() => {
    if (!initialized && contribution) {
      setValue(
        "questions",
        (contribution as any)?.metadata?.properties?.questions
      );
      setInitialized(true);
    }
  }, [initialized, contribution]);

  //   const [submitTask, { isSuccess, error, isError, isLoading, reset }] =
  //     useSubmitQuizTaskMutation();

  //   useEffect(() => {
  //     if (isSuccess) {
  //       setOpenSubmitSuccess(true);
  //     }
  //   }, [isSuccess]);

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
    // submitTask({
    //   userAddress,
    //   task,
    //   questionsAndAnswers: values.questions,
    //   onboardingQuestAddress: searchParams.get(
    //     RequiredQueryParams.OnboardingQuestAddress
    //   ),
    //   pluginAddress: plugin.pluginAddress,
    //   pluginDefinitionId: plugin.pluginDefinitionId
    // });
  };

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
      {/* <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
       */}
      {/* <LoadingDialog open={loading} message="Submitting contribution..." backdropFilter={true} />
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
            gap={4}
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
            {(
              (contribution as any)?.metadata?.properties?.questions as any[]
            )?.map((question, questionIndex) => (
              <Card
                key={`questions.${questionIndex}.question`}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }}
              >
                <CardHeader
                  titleTypographyProps={{
                    fontFamily: "FractulAltBold",
                    fontWeight: 900,
                    color: "white",
                    variant: "subtitle1"
                  }}
                  title={question?.question}
                />
                <CardContent>
                  <Answers
                    control={control}
                    answers={question?.answers}
                    questionIndex={questionIndex}
                    taskStatus={contribution?.status}
                  ></Answers>
                </CardContent>
              </Card>
            ))}

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
              <AutOsButton
                type="button"
                color="primary"
                variant="outlined"
                sx={{
                  width: "100px"
                }}
                disabled={
                  !formState.isValid ||
                  contribution?.status !== TaskStatus.Created
                  //   ||  isLoadingTasks
                }
                onClick={handleSubmit(onSubmit)}
              >
                <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                  Confirm
                </Typography>
              </AutOsButton>
            </Box>
          </Stack>
        </>
      ) : (
        <AutLoading></AutLoading>
      )}
    </Container>
  );
};

export default memo(QuizTask);
