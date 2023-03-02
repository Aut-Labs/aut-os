import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogoToolbarPath.svg";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { Toolbar } from "@mui/material";
import { HolderStatus } from "@store/holder/holder.reducer";
import { resetSearchState } from "@store/search/search.reducer";
import { useAppDispatch } from "@store/store.model";
import { setOpenShare } from "@store/ui-reducer";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const AutToolBar = ({ isDesktop = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const status = useSelector(HolderStatus);
  const canUpdateProfile = useSelector(CanUpdateProfile);

  function goHome() {
    const params = new URLSearchParams(location.search);
    params.delete("network");
    navigate({
      pathname: `/`,
      search: `?${params.toString()}`
    });
    dispatch(resetSearchState());
  }

  const handleClickOpen = () => {
    dispatch(setOpenShare(true));
  };

  return (
    <Toolbar
      sx={{
        backgroundColor: "nightBlack.main",
        boxShadow: 2,
        "&.MuiToolbar-root": {
          paddingLeft: 6,
          paddingRight: 6,
          minHeight: "84px",
          display: "flex",
          justifyContent: {
            xs: "center",
            md: "flex-start"
          },
          alignItems: "center"
        }
      }}
    >
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
    </Toolbar>
  );
};

export default AutToolBar;
