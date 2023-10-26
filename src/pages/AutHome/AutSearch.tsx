/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-expressions */
import {
  Autocomplete,
  Avatar,
  Box,
  debounce,
  InputAdornment,
  styled,
  SvgIcon,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogoPath.svg";
import { ReactComponent as RedirectIcon } from "@assets/RedirectIcon2.svg";
import { ReactComponent as ConcentricImage } from "@assets/ConcentricImage.svg";
import { ReactComponent as SearchIcon } from "@assets/SearchIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import parse from "autosuggest-highlight/parse";
import {
  NoSearchResults,
  SearchResult,
  SearchStatus
} from "@store/search/search.reducer";
import { ResultState } from "@store/result-status";
import { AutID } from "@api/aut.model";
import { useAppDispatch } from "@store/store.model";
import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "../../assets/load-id.json";
import { AutIDProfileList } from "@components/AutIDProfileList";
import { useEffect, useRef } from "react";
import { fetchHolder, fetchSearchResults } from "@api/holder.api";
import { AutTextField } from "@theme/field-text-styles";
import { DautPlaceholder } from "@api/ProviderFactory/components/web3-daut-connect";
import React from "react";
import UserBubbles from "@components/UserBubbles";
interface UserProfile {
  name: string;
}

const UserRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  height: "40px",
  width: "100%",
  cursor: "pointer",
  backgroundColor: theme.palette.background.default,

  "&:not(:last-of-type)": {
    borderBottom: "1px solid white",
    borderTop: "none"
  },

  "&:hover": {
    backgroundColor: "rgba(235, 235, 242, 0.2)"
  },

  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "row",
    height: "40px",
    width: "100%",
    cursor: "pointer"
  }
}));

const AutBox = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    width: "100%",
    overflow: "hidden"
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
    justifyContent: "flex-end"
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}));

const UserAvatarsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  height: "100%",

  [theme.breakpoints.down("md")]: {
    display: "none"
  }
}));

const TopWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "720px",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "100px",

  [theme.breakpoints.down("sm")]: {
    width: "90%"
  }
}));

const ResultWrapper = styled("div")(({ theme }) => ({
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  width: "500px",
  minHeight: "220px",
  justifyContent: "flex-start",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    width: "90%"
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
  },

  [theme.breakpoints.up("xxl")]: {
    marginTop: "100px"
  }
}));

const ConcentricImageWrapper = styled(ConcentricImage)(({ theme }) => ({
  width: "100%",
  zIndex: "-1",
  position: "absolute",
  top: "100%",
  left: "unset",
  display: "none",
  transform: "translateY(-50%)",
  [theme.breakpoints.up("md")]: {
    display: "inherit",
    height: "662px",
    maxWidth: "662px",
    right: "calc(662px / 2 * -1)"
  },
  [theme.breakpoints.up("xxl")]: {
    height: "892px",
    maxWidth: "892px",
    right: "calc(892px / 2 * -1)"
  }
}));
const MyAutIdLogoWrapper = styled(MyAutIDLogo)(({ theme }) => ({
  width: "300px",
  height: "90px",
  marginBottom: "20px",
  [theme.breakpoints.up("md")]: {
    width: "465px",
    height: "105px"
  }
}));

const autocompleteService = { current: null };

const AutSearch = () => {
  const dispatch = useAppDispatch();
  const status = useSelector(SearchStatus);
  const noResults = useSelector(NoSearchResults);
  const searchResult: AutID[] = useSelector(SearchResult);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const xs = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const abort = useRef<AbortController>();
  const [value, setValue] = React.useState<UserProfile | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly UserProfile[]>([]);
  const loaded = React.useRef(false);

  function selectProfile(profile: AutID) {
    const params = new URLSearchParams(location.search);
    navigate({
      pathname: `/${profile.name}.aut`
    });
    dispatch(
      fetchHolder({
        autName: profile.name,
        network: "mumbai"
      })
    );
  }
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      username: ""
    }
  });

  const onSubmit = async (data) => {
    abort.current = new AbortController();
    dispatch(
      fetchSearchResults({
        ...data,
        signal: abort.current?.signal
      })
    );
  };

  useEffect(() => {
    return () => abort.current && abort.current.abort();
  }, []);

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly UserProfile[]) => void
        ) => {
          // Simulate network request
          setTimeout(() => {
            // Simulated results (mocked data)
            const results = [
              {
                name: "Taulant",
                network: "mumbai"
              },
              {
                name: "Ana",
                network: "mumbai"
              },
              {
                name: "Banana",
                network: "mumbai"
              }
            ].filter((user) =>
              user.name.toLowerCase().includes(request.input.toLowerCase())
            );

            callback(results as unknown as UserProfile[]);
          }, 400);
        },
        400 // debounce delay
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

  const randomUsers = [
    {
      name: "Taulant",
      avatar: "https://picsum.photos/200/300"
    },
    {
      name: "Jessica",
      avatar: "https://picsum.photos/300/300"
    },
    {
      name: "Daniel",
      avatar: "https://picsum.photos/200/200"
    },
    {
      name: "Selena",
      avatar: "https://picsum.photos/200/400"
    },
    {
      name: "Tom",
      avatar: "https://picsum.photos/200/250"
    },
    {
      name: "Angela",
      avatar: "https://picsum.photos/250/250"
    }
  ];

  return (
    <>
      <Toolbar
        sx={{
          width: "100%",
          position: "fixed",
          // backgroundColor: "nightBlack.main",
          // boxShadow: 2,
          "&.MuiToolbar-root": {
            paddingLeft: 6,
            paddingRight: 6,
            minHeight: "84px",
            justifyContent: {
              xs: "center",
              sm: "flex-end"
            },
            alignItems: "center"
          }
        }}
      >
        <DautPlaceholder
        // styles={{
        //   right: "80px"
        // }}
        // hide={false}
        />
      </Toolbar>
      <AutBox>
        <ConcentricImageWrapper
          style={{ top: "10%", left: "calc(662px / 2 * -1", right: "unset" }}
        />
        <ConcentricImageWrapper />
        <UserAvatarsWrapper>
          <UserBubbles users={randomUsers}></UserBubbles>
        </UserAvatarsWrapper>

        <TopWrapper>
          <MyAutIdLogoWrapper />
          <Typography
            variant="subtitle1"
            color="white"
            sx={{
              marginBottom: {
                xs: "20px",
                md: "30px"
              }
            }}
          >
            Own your own Identity. <br />
          </Typography>
          <Typography
            color="white"
            variant="body"
            sx={{
              textAlign: "center",
              marginBottom: {
                xs: "20px",
                md: "30px"
              },
              maxWidth: {
                xs: "100%",
                md: "600px",
                xxl: "800px"
              }
            }}
          >
            ĀutID is self-sovereign, unique, and portable: it lets you join new
            DAOs, and log in across DAO-powered Web3 DApps.
          </Typography>
        </TopWrapper>
        <FormWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <FieldWrapper>
            <Controller
              key="username"
              name="username"
              control={control}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <>
                    <Autocomplete
                      id="search-aut"
                      sx={{ width: 400 }}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      filterOptions={(x) => x}
                      options={options}
                      autoComplete
                      includeInputInList
                      filterSelectedOptions
                      value={value}
                      noOptionsText="No āutID found"
                      onChange={(event: any, newValue: UserProfile | null) => {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      ListboxProps={{
                        style: {
                          background: theme.palette.background.default
                        }
                      }}
                      renderInput={(params) => (
                        <AutTextField
                          {...params}
                          variant="standard"
                          color="offWhite"
                          label="Search āut"
                          sx={{
                            ".MuiInputLabel-root": {
                              color: "white"
                            },
                            ".MuiAutocomplete-clearIndicator, .MuiAutocomplete-popupIndicator":
                              {
                                color: "white"
                              }
                          }}
                        />
                      )}
                      renderOption={(props, option: any) => {
                        return (
                          <UserRow
                            onClick={() => selectProfile(option)}
                            key={option.name}
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
                                  width: "75%",
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
                                    color: "white",
                                    ml: "20px"
                                  }}
                                  variant="h6"
                                >
                                  {option?.name}
                                </Typography>
                              </div>

                              <div
                                style={{
                                  width: "25%",
                                  display: "flex",
                                  alignContent: "center",
                                  alignSelf: "center"
                                }}
                              >
                                <SvgIcon
                                  sx={{
                                    height: "18px",
                                    width: "100%",
                                    mt: "10px",
                                    ml: "20px",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                  }}
                                  key="redirect-icon"
                                  component={RedirectIcon}
                                />
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
                        debugger;
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
        </FormWrapper>
        {/* <ResultWrapper>
        {loadingg ? (
          <>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white"
              }}
              variant="caption"
            >
              One second, let me look...
            </Typography>
            <Player
              loop
              autoplay
              rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
              src={animationData}
              style={{ height: "189px", width: "189px" }}
            />
          </>
        ) : false ? (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "red"
            }}
            variant="caption"
          >
            No user found with that username. Try again!
          </Typography>
        ) : (
          <AutIDProfileList
            profiles={[DummyProfile]}
            onSelect={selectProfile}
          />
        )}
      </ResultWrapper> */}

        <ResultWrapper>
          {status === ResultState.Loading ? (
            <>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white"
                }}
                variant="caption"
              >
                One second, let me look...
              </Typography>
              <Player
                loop
                autoplay
                rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                src={animationData}
                style={{ height: "189px", width: "189px" }}
              />
            </>
          ) : noResults ? (
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "red"
              }}
              variant="caption"
            >
              No user found with that username. Try again!
            </Typography>
          ) : (
            <AutIDProfileList
              profiles={searchResult}
              onSelect={selectProfile}
            />
          )}
        </ResultWrapper>
      </AutBox>
    </>
  );
};

export default AutSearch;
