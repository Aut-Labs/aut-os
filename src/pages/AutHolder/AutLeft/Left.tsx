/* eslint-disable react/button-has-type */
import { CanUpdateProfile } from "@auth/auth.reducer";
import AutLoading from "@components/AutLoading";
import { styled, useMediaQuery, useTheme } from "@mui/material";
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

import AutUserInfo from "./AutUserInfo";
import SelectAutIDProfileDialog from "@components/AutIDProfileList";
import { AutID } from "@api/aut.model";
import { useAppDispatch } from "@store/store.model";
import { useMemo } from "react";

const AutLeftContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));

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
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const onSelect = async (profile: AutID) => {
    const params = new URLSearchParams(location.search);
    // params.set("network", profile.properties.network?.toLowerCase());
    navigate({
      pathname: `/${profile.name}`
      // search: `?${params.toString()}`
    });
    await dispatch(
      updateHolderState({
        selectedProfileAddress: profile.properties.address,
        selectedProfileNetwork: profile.properties.network?.toLowerCase()
      })
    );
  };

  const scrollHeight = useMemo(() => {
    if (mobile) {
      return `${window?.innerHeight}px`;
    }
    return "100%";
  }, [mobile, window?.innerHeight]);

  return (
    <AutLeftContainer
      style={{
        width: "100%",
        height: "100%"
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
              marginTop: mobile ? "130px" : "84px",
              display: "flex",
              height: scrollHeight,
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
