/* eslint-disable react/button-has-type */
import { CanUpdateProfile } from "@auth/auth.reducer";
import AutLoading from "@components/AutLoading";
import { Toolbar, styled, useMediaQuery, useTheme } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  AutIDProfiles,
  HolderData,
  HolderStatus,
  updateHolderState
} from "@store/holder/holder.reducer";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ResultState } from "@store/result-status";
import { useSelector } from "react-redux";
import AutToolBar from "./AutToolBar";
import { ReactComponent as AutOsLogo } from "@assets/autos/os-logo.svg";

import AutUserInfo from "./AutUserInfo";
import SelectAutIDProfileDialog from "@components/AutIDProfileList";
import { AutID } from "@api/aut.model";
import { useAppDispatch } from "@store/store.model";
import { lazy } from "react";
import { DautPlaceholder } from "@api/ProviderFactory/components/web3-daut-connect";

const AutLeftContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));

const AutCommunityEdit = lazy(() => import("../../AutCommunity/AutNova"));
const AutProfileEdit = lazy(() => import("./AutProfileEdit"));

const AutLeft = () => {
  const dispatch = useAppDispatch();
  const status = useSelector(HolderStatus);
  const profiles = useSelector(AutIDProfiles);
  const holderData = useSelector(HolderData);
  const navigate = useNavigate();
  const location = useLocation();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const onSelect = async (profile: AutID) => {
    const params = new URLSearchParams(location.search);
    // params.set("network", profile.properties.network?.toLowerCase());
    navigate({
      pathname: `/${profile.name}.aut`
      // search: `?${params.toString()}`
    });
    await dispatch(
      updateHolderState({
        selectedProfileAddress: profile.properties.address,
        selectedProfileNetwork: profile.properties.network?.toLowerCase()
      })
    );
  };

  return (
    <AutLeftContainer
      style={{
        width: desktop && status === ResultState.Success ? "100%" : "100%",
        height: "100vh"
      }}
    >
      <SelectAutIDProfileDialog
        profiles={profiles}
        onSelect={onSelect}
        open={profiles?.length > 1 && !holderData}
      />

      {status === ResultState.Loading || status === ResultState.Idle ? (
        <AutLoading />
      ) : (
        <>
          <AutToolBar></AutToolBar>
          <PerfectScrollbar
            style={{
              top: "84px",
              height: "calc(100% - 84px)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Routes>
              {holderData && <Route index element={<AutUserInfo />} />}
              {canUpdateProfile && (
                <>
                  {/* <Route
                    path="edit-community/:communityAddress"
                    element={<AutCommunityEdit />}
                  /> */}
                  {/* <Route path="edit-profile" element={<AutProfileEdit />} /> */}
                </>
              )}
            </Routes>
          </PerfectScrollbar>
        </>
      )}
    </AutLeftContainer>
  );
};

export default AutLeft;
