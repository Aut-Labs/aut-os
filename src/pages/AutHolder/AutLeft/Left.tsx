/* eslint-disable react/button-has-type */
import { CanUpdateProfile } from "@auth/auth.reducer";
import AutLoading from "@components/AutLoading";
import { styled, useMediaQuery, useTheme } from "@mui/material";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import Scrollbar from "@components/Scrollbar";
import {
  AutIDProfiles,
  HolderData,
  HolderStatus,
  updateHolderState
} from "@store/holder/holder.reducer";
import { ResultState } from "@store/result-status";
import { useSelector } from "react-redux";
import AutCommunityEdit from "./AutCommunityEdit";
import AutProfileEdit from "./AutProfileEdit";
import AutToolBar from "./AutToolBar";
import AutUserInfo from "./AutUserInfo";
import SelectAutIDProfileDialog from "@components/AutIDProfileList";
import { AutID } from "@api/aut.model";
import { useAppDispatch } from "@store/store.model";

const AutLeftContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));

const AutLeft = ({ match }) => {
  const dispatch = useAppDispatch();
  const status = useSelector(HolderStatus);
  const profiles = useSelector(AutIDProfiles);
  const holderData = useSelector(HolderData);
  const history = useHistory();
  const location = useLocation();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const onSelect = async (profile: AutID) => {
    const params = new URLSearchParams(location.search);
    params.set("network", profile.properties.network?.toLowerCase());
    history.push({
      pathname: `/${profile.name}`,
      search: `?${params.toString()}`
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
        width: desktop && status === ResultState.Success ? "50%" : "100%",
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
          <AutToolBar isDesktop={desktop} />
          <Scrollbar>
            <Switch>
              {holderData && (
                <Route exact path={`${match.path}`} component={AutUserInfo} />
              )}
              {canUpdateProfile && (
                <>
                  <Route
                    exact
                    path={`${match.path}/edit-community/:communityAddress`}
                    component={AutCommunityEdit}
                  />
                  <Route
                    exact
                    path={`${match.path}/edit-profile`}
                    render={(props) => <AutProfileEdit />}
                  />
                </>
              )}
            </Switch>
          </Scrollbar>
        </>
      )}
    </AutLeftContainer>
  );
};

export default AutLeft;
