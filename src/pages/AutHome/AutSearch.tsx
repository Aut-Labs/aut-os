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
import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogo.svg";
import { ReactComponent as SearchIcon } from "@assets/SearchIcon.svg";

import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { pxToRem } from "@utils/text-size";
import { Controller, useForm } from "react-hook-form";
import { AutTextField } from "@components/Fields/AutFields";
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
import * as animationData from "../../assets/aut-load.json";
import { AutIDProfileList } from "@components/AutIDProfileList";
import { useEffect, useRef } from "react";
import { fetchHolder, fetchSearchResults } from "@api/holder.api";

const AutBox = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    width: "100%"
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "50%"
}));
const TopWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: pxToRem(720),
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.down("md")]: {
    width: "80%"
  },
  [theme.breakpoints.down("sm")]: {
    width: "90%"
  }
}));

const ResultWrapper = styled("div")(({ theme }) => ({
  marginTop: pxToRem(20),
  display: "flex",
  flexDirection: "column",
  width: pxToRem(720),
  minHeight: pxToRem(200),
  justifyContent: "flex-start",
  alignItems: "center",

  [theme.breakpoints.down("md")]: {
    width: "80%"
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}));

const FieldWrapper = styled("div")(({ theme }) => ({
  flexDirection: "row",
  marginBottom: pxToRem(20),
  minHeight: pxToRem(70),
  display: "flex",
  width: pxToRem(720),
  justifyContent: "flex-start",
  alignItems: "flex-start",

  [theme.breakpoints.down("md")]: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%"
  },
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

  [theme.breakpoints.down("md")]: {
    width: "100%",
    paddingLeft: "0",
    paddingRight: "0",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
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

  return (
    <AutBox>
      <DautPlaceholder
        styles={{
          right: pxToRem(80)
        }}
        hide={false}
      />
      <TopWrapper>
        <MyAutIDLogo
          style={{
            height: desktop ? pxToRem(120) : pxToRem(90),
            width: desktop ? pxToRem(400) : pxToRem(300)
          }}
        />
        <Typography
          sx={{
            mt: desktop ? pxToRem(100) : xs ? pxToRem(30) : pxToRem(50),
            mb: pxToRem(20),
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            width: "100%"
          }}
          variant="h1"
        >
          Own your own Identity. <br />
        </Typography>
        <Typography
          sx={{
            mb: pxToRem(50),
            color: "white",
            textAlign: "center",
            width: "100%"
          }}
          variant="subtitle1"
        >
          ĀutID is self-sovereign, unique, and portable: it lets you join new
          DAOs, and log in across DAO-powered Web3 DApps.
        </Typography>
        <Typography
          sx={{
            mb: pxToRem(50),
            color: "white",
            textAlign: "center",
            width: "100%"
          }}
          variant="h6"
        >
          This is a shareable Social profile, with on-chain DAOs & contacts!
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
                  <AutTextField
                    placeholder="Search āut"
                    focused
                    id={name}
                    name={name}
                    value={value}
                    width="100%"
                    onChange={onChange}
                    sx={{
                      mb: pxToRem(45)
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SvgIcon
                            sx={{
                              height: pxToRem(34),
                              width: pxToRem(34),
                              mt: pxToRem(10),
                              ml: pxToRem(20),
                              cursor: "pointer",
                              color: "white",
                              ":hover": {
                                color: "#009ADE"
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

      <ResultWrapper>
        {status === ResultState.Loading ? (
          <>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontWeight: "bold"
              }}
              variant="h6"
            >
              One second, let me look...
            </Typography>
            <Player
              loop
              autoplay
              rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
              src={animationData}
              style={{ height: "130px", width: "130px" }}
            />
          </>
        ) : noResults ? (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: "bold"
            }}
            variant="h6"
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
