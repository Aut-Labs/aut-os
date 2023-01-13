import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogoToolbarPath.svg";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { DautPlaceholder } from "@components/DautPlaceholder";
import { styled, SvgIcon, Toolbar } from "@mui/material";
import { HolderStatus } from "@store/holder/holder.reducer";
import { ResultState } from "@store/result-status";
import { ReactComponent as ShareIcon } from "@assets/ShareIcon.svg";

import { resetSearchState } from "@store/search/search.reducer";
import { useAppDispatch } from "@store/store.model";
import { setOpenShare } from "@store/ui-reducer";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

const AutBar = styled(Toolbar)(({ theme }) => ({
  "&.MuiToolbar-root": {
    paddingLeft: "80px",
    paddingRight: "80px",
    minHeight: "84px",
    justifyContent: "space-between",
    alignItems: "flex-end",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }
}));

const AutToolBar = ({ isDesktop = false }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const status = useSelector(HolderStatus);
  const canUpdateProfile = useSelector(CanUpdateProfile);

  function goHome() {
    const params = new URLSearchParams(location.search);

    params.delete("network");
    history.push({
      pathname: `/`,
      search: `?${params.toString()}`
    });
    dispatch(resetSearchState());
  }

  const handleClickOpen = () => {
    dispatch(setOpenShare(true));
  };

  return (
    <AutBar>
      <MyAutIDLogo
        height="62"
        style={{ cursor: "pointer" }}
        onClick={() => goHome()}
      />
      {/* {canUpdateProfile ? (
        <SvgIcon
          sx={{
            height: {
              xs: "40px",
              md: "80px"
            },
            width: {
              xs: "40px",
              md: "80px"
            },
            display: {
              xs: "none",
              md: "inherit"
            },
            top: "10px",
            right: "10px",
            padding: "20px",
            fill: "white",
            cursor: "pointer"
          }}
          component={ShareIcon}
          onClick={handleClickOpen}
        />
      ) : null} */}
    </AutBar>
  );
};

export default AutToolBar;
