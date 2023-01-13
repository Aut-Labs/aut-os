/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-expressions */
import {
  Box,
  InputAdornment,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogoPath.svg";
import { ReactComponent as ConcentricImage } from "@assets/ConcentricImage.svg";

import { ReactComponent as SearchIcon } from "@assets/SearchIcon.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { pxToRem } from "@utils/text-size";
import { Controller, useForm } from "react-hook-form";
import {
  NoSearchResults,
  SearchResult,
  SearchStatus
} from "@store/search/search.reducer";
import { ResultState } from "@store/result-status";
import { AutID } from "@api/aut.model";
import { useAppDispatch } from "@store/store.model";
import { Player } from "@lottiefiles/react-lottie-player";
import { DautPlaceholder } from "@components/DautPlaceholder";
import * as animationData from "../../assets/load-id.json";
import { AutIDProfileList } from "@components/AutIDProfileList";
import { useEffect, useRef, useState } from "react";
import { fetchHolder, fetchSearchResults } from "@api/holder.api";
import TextField from "@mui/material/TextField";
import { DummyProfile } from "./dummy-profile";
import { AutTextField } from "@theme/field-text-styles";

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

const StyledTextField = styled(AutTextField)(({ theme }) => ({
  width: "100%",

  ".MuiInputLabel-root": {
    top: "-2px"
  },

  ".MuiOutlinedInput-root, .MuiInput-underline": {
    color: "#fff",
    height: "45px",
    lineHeight: "45px"
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

const AutSearch = ({ match }) => {
  const dispatch = useAppDispatch();
  const status = useSelector(SearchStatus);
  const noResults = useSelector(NoSearchResults);
  const searchResult: AutID[] = useSelector(SearchResult);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const xs = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const location = useLocation();
  const abort = useRef<AbortController>();

  function selectProfile(profile: AutID) {
    console.log(profile, "profile");
    const params = new URLSearchParams(location.search);
    params.set("network", profile.properties.network?.toLowerCase());
    history.push({
      pathname: `/${profile.name}`,
      search: `?${params.toString()}`
    });
    dispatch(
      fetchHolder({
        autName: profile.name,
        network: profile.properties.network?.toLowerCase()
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadingg === true ? setLoadingg(false) : setLoadingg(true);
  //     console.log(loadingg);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <AutBox>
      <ConcentricImageWrapper
        style={{ top: "10%", left: "calc(662px / 2 * -1", right: "unset" }}
      />
      <ConcentricImageWrapper />

      <DautPlaceholder
        styles={{
          right: "80px"
        }}
        hide={false}
      />
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
                  <StyledTextField
                    placeholder="Search āut"
                    variant="standard"
                    color="offWhite"
                    focused
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SvgIcon
                            sx={{
                              height: "29px",
                              width: "29px",
                              mt: "10px",
                              ml: "10px",
                              cursor: "pointer",
                              color: "white",
                              ":hover": {
                                color: "offWhite"
                              }
                            }}
                            key="username-icon"
                            component={SearchIcon}
                            onClick={handleSubmit(onSubmit)}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
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
          <AutIDProfileList profiles={searchResult} onSelect={selectProfile} />
        )}
      </ResultWrapper>
    </AutBox>
  );
};

export default AutSearch;
