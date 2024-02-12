import {
  Autocomplete,
  Box,
  debounce,
  Paper,
  styled,
  Typography,
  useTheme
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "@store/store.model";
import { memo, useEffect, useRef } from "react";
import { fetchHolder } from "@api/holder.api";
import { AutTextField } from "@theme/field-text-styles";
import React from "react";
import { apolloClient } from "@store/graphql";
import { queryParamsAsString } from "@aut-labs/sdk/dist/utils/graphql.misc";
import { gql } from "@apollo/client";
import { AutID } from "@api/aut.model";
import { useSelector } from "react-redux";
import { HolderData } from "@store/holder/holder.reducer";
interface UserProfile {
  name: string;
}

const UserRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  height: "50px",
  margin: 0,
  width: "100%",
  cursor: "pointer",
  backgroundColor: "rgba(235, 235, 242, 0.05)",
  "&:not(:last-of-type)": {
    borderBottom: "1px solid rgba(235, 235, 242, 0.3)",
    borderTop: "none"
  },
  "&:last-of-type": {
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px"
  },

  "&:hover": {
    backgroundColor: "rgba(235, 235, 242, 0.15)"
  },

  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "row",
    height: "40px",
    width: "100%",
    cursor: "pointer"
  }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    width: "100%"
    // overflow: "hidden"
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "50%",

  [theme.breakpoints.down("xl")]: {
    justifyContent: "center"
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}));

const FieldWrapper = styled("div")(({ theme }) => ({
  flexDirection: "row",
  marginBottom: "20px",
  display: "flex",
  width: "500px",
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%"
  }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  marginTop: "30px",

  [theme.breakpoints.down("md")]: {
    marginTop: "20px",
    width: "100%",
    paddingLeft: "0",
    paddingRight: "0",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  }
}));

const SimpleFormWrapper = styled("form")(({ theme }) => ({
  display: "flex",

  [theme.breakpoints.down("sm")]: {
    display: "none"
  }
}));

function CustomPaper({ children }) {
  return (
    <Paper
      sx={{
        background: "transparent",
        padding: 0,
        border: "none",
        boxShadow: "none",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        ".MuiAutocomplete-noOptions": {
          display: "none"
        }
      }}
    >
      {children}
    </Paper>
  );
}
interface AutSearchProps {
  onSelect?: (user: AutID) => void;
  mode?: string;
}

const AutSearch = (props: AutSearchProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = React.useState<UserProfile | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly UserProfile[]>([]);
  const holderData = useSelector(HolderData);

  function selectProfile(profile: any) {
    if (props.onSelect) {
      props.onSelect(profile);
    }

    if (holderData?.name === profile.username) {
      return;
    }
    navigate({
      pathname: `/${profile.username}`
    });
    dispatch(
      fetchHolder({
        autName: profile.username
      })
    );
  }
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      username: ""
    }
  });

  const onSubmit = async (data) => {};

  const fetch = React.useMemo(
    () =>
      debounce(
        async (
          request: { input: string },
          callback: (results?: readonly UserProfile[]) => void
        ) => {
          const filters = [
            {
              prop: "username",
              comparison: "contains",
              value: request.input.toLowerCase()
            }
          ];

          const queryArgsString = queryParamsAsString({
            skip: 0,
            take: 5,
            filters
          });
          const query = gql`
        query AutIds {
          autIDs(${queryArgsString}) {
            id
            username
          }
        }
      `;
          const response = await apolloClient.query<any>({
            query
          });

          const { autIDs } = response.data;
          callback(autIDs as unknown as UserProfile[]);
        },
        400
      ),
    []
  );
  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly UserProfile[]) => {
      if (active) {
        let newOptions: readonly UserProfile[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <>
      {props?.mode === "full" && (
        <ContentWrapper>
          <FormWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FieldWrapper>
              <Controller
                key="username"
                name="username"
                control={control}
                render={({ field: { value } }) => {
                  return (
                    <>
                      <Autocomplete
                        id="search-aut"
                        sx={{
                          width: {
                            xs: 260,
                            sm: 480
                          }
                        }}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        openOnFocus
                        PaperComponent={CustomPaper}
                        disableCloseOnSelect
                        open={true}
                        includeInputInList
                        filterSelectedOptions
                        value={value as any}
                        onChange={(
                          event: any,
                          newValue: UserProfile | null
                        ) => {
                          setOptions(
                            newValue ? [newValue, ...options] : options
                          );
                          setValue(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        ListboxProps={{
                          style: {
                            border: "none",
                            display: "flex",
                            margin: 0,
                            padding: 0,
                            flexDirection: "column",
                            background: "transparent",
                            backdropFilter: "blur(8px)",
                            width: "474px"
                          }
                        }}
                        renderInput={(params) => (
                          <AutTextField
                            {...params}
                            color="offWhite"
                            placeholder={"Start typing to search..."}
                            autoFocus
                            sx={{
                              ".MuiInputBase-input": {
                                "&::placeholder": {
                                  color: theme.palette.offWhite.main,
                                  opacity: 0.5
                                }
                              },
                              ".MuiInputBase-root": {
                                caretColor: theme.palette.primary.main,

                                fieldset: {
                                  border: "1.5px solid #82FBFB !important",
                                  borderRadius: "6px"
                                },
                                borderRadius: "6px",
                                background: "rgba(0, 0, 0, 0.64)",
                                // eslint-disable-next-line max-len
                                boxShadow: `0px 16px 80px 0px ${theme.palette.primary.main}, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)`,
                                backdropFilter: "blur(8px)"
                              },
                              ".MuiInputLabel-root": {
                                color: "white"
                              },

                              ".MuiAutocomplete-popupIndicator": {
                                display: "none"
                              },
                              ".MuiAutocomplete-clearIndicator": {
                                background: "#818CA2",
                                borderRadius: "50%",
                                color: "black",
                                marginRight: "10px",
                                ":hover": {
                                  background: "#A7B1C4",
                                  color: "black"
                                }
                              }
                            }}
                          />
                        )}
                        renderOption={(props, option: any) => {
                          return (
                            <UserRow
                              onClick={() => selectProfile(option)}
                              key={option.username}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flex: "1",
                                  overflow: "hidden"
                                }}
                              >
                                <div
                                  style={{
                                    justifyContent: "start",
                                    alignItems: "center",
                                    height: "100%",
                                    display: "flex",
                                    flex: "1"
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      display: "flex",
                                      alignSelf: "start",
                                      justifyContent: "start",
                                      alignItems: "start",
                                      padding: "3px",
                                      height: "100%",
                                      color: theme.palette.offWhite.main,
                                      m: "0px 10px"
                                    }}
                                    variant="h6"
                                    fontFamily="FractulRegular"
                                  >
                                    {option?.username}
                                  </Typography>
                                </div>
                              </div>
                            </UserRow>
                          );
                        }}
                      />
                      {/* <Autocomplete
                        sx={{ width: 500 }}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        value={value}
                        noOptionsText="No users"
                        onChange={(event: any, newValue: UserProfile | null) => {
                          setOptions(newValue ? [newValue, ...options] : options);
                          setValue(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                          console.log(newInputValue, "NEW INPUT VALUE");
                        }}
                        renderInput={(params) => (
                          <AutTextField
                            {...params}
                            variant="standard"
                            color="offWhite"
                            label="Search for a user..."
                          />
                        )}
                        renderOption={(props, option) => {
                          const matches =
                            option.structured_formatting
                              .main_text_matched_substrings || [];
  
                          const parts = parse(
                            option.structured_formatting.main_text,
                            matches.map((match: any) => [
                              match.offset,
                              match.offset + match.length
                            ])
                          );
  
                          return (
                            <li {...props}>
                              <AutIDProfileList
                                profiles={parts}
                                onSelect={selectProfile}
                              />
                            </li>
                          );
                        }}
                      /> */}
                    </>
                  );
                }}
              />
            </FieldWrapper>
            <Typography
              variant="subtitle2"
              fontWeight="normal"
              textAlign="center"
              zIndex="10"
              color="offWhite.main"
              sx={{
                width: {
                  xs: "260px",
                  sm: "480px"
                }
              }}
            >
              find anyone and connect with them - just type _
            </Typography>
          </FormWrapper>
        </ContentWrapper>
      )}
      {props?.mode === "simple" && (
        <SimpleFormWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Controller
              key="username"
              name="username"
              control={control}
              render={({ field: { value } }) => {
                return (
                  <>
                    <Autocomplete
                      id="search-aut"
                      sx={{
                        width: 210
                      }}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      filterOptions={(x) => x}
                      options={options}
                      autoComplete
                      openOnFocus
                      PaperComponent={CustomPaper}
                      disableCloseOnSelect
                      open={true}
                      includeInputInList
                      filterSelectedOptions
                      value={value as any}
                      onChange={(event: any, newValue: UserProfile | null) => {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      ListboxProps={{
                        style: {
                          border: "none",
                          display: "flex",
                          margin: 0,
                          padding: 0,
                          flexDirection: "column",
                          background: "transparent",
                          backdropFilter: "blur(8px)",
                          width: "204px"
                        }
                      }}
                      renderInput={(params) => (
                        <AutTextField
                          {...params}
                          color="offWhite"
                          placeholder={"search_"}
                          autoFocus
                          sx={{
                            ".MuiInputBase-input": {
                              "&::placeholder": {
                                color: theme.palette.offWhite.main,
                                opacity: 0.5
                              }
                            },
                            ".MuiInputBase-root": {
                              caretColor: theme.palette.primary.main,
                              padding: "7px",
                              fieldset: {
                                border: "1.5px solid #82FBFB !important",
                                borderRadius: "6px"
                              },
                              borderRadius: "6px",
                              background: "transparent",
                              boxShadow: "none",
                              backdropFilter: "blur(8px)"
                            },
                            ".MuiInputLabel-root": {
                              color: "white"
                            },

                            ".MuiAutocomplete-popupIndicator": {
                              display: "none"
                            },
                            ".MuiAutocomplete-clearIndicator": {
                              background: "#818CA2",
                              height: "20px",
                              width: "20px",
                              borderRadius: "50%",
                              color: "black",
                              marginRight: "5px",
                              marginTop: "5px",
                              ":hover": {
                                background: "#A7B1C4",
                                color: "black"
                              }
                            }
                          }}
                        />
                      )}
                      renderOption={(props, option: any) => {
                        return (
                          <UserRow
                            onClick={() => selectProfile(option)}
                            key={option.username}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flex: "1",
                                overflow: "hidden"
                              }}
                            >
                              <div
                                style={{
                                  justifyContent: "start",
                                  alignItems: "center",
                                  height: "100%",
                                  display: "flex",
                                  flex: "1"
                                }}
                              >
                                <Typography
                                  sx={{
                                    display: "flex",
                                    alignSelf: "start",
                                    justifyContent: "start",
                                    alignItems: "start",
                                    padding: "3px",
                                    height: "100%",
                                    color: theme.palette.offWhite.main,
                                    m: "0px 10px"
                                  }}
                                  variant="h6"
                                  fontFamily="FractulRegular"
                                >
                                  {option?.username}
                                </Typography>
                              </div>
                            </div>
                          </UserRow>
                        );
                      }}
                    />
                  </>
                );
              }}
            />
          </Box>
        </SimpleFormWrapper>
      )}
    </>
  );
};

export default memo(AutSearch);
