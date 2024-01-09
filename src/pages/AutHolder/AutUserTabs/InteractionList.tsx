import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { AutOsButton } from "@components/AutButton";
import {
  Avatar,
  Typography,
  SvgIcon,
  Box,
  useTheme,
  Paper
} from "@mui/material";
import { memo } from "react";
import { ReactComponent as KeyIcon } from "@assets/autos/lock-keyhole.svg";
import PerfectScrollbar from "react-perfect-scrollbar";

const InteractionListItem = memo(({ interaction }: { interaction: any }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid",
        borderColor: "#576176",
        minWidth: "170px",
        padding: theme.spacing(3)
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "row"
            },
            justifyContent: {
              xs: "flex-start"
            },
            alignItems: "center"
          }}
        >
          <Avatar
            sx={{
              bgcolor: "transparent",
              width: {
                xs: "40px",
                md: "50px"
              },
              height: {
                xs: "40px",
                md: "50px"
              },
              borderRadius: "0"
            }}
            aria-label="nova-avatar"
            src={interaction.image}
          />
          <Box
            sx={{
              marginLeft: {
                xs: theme.spacing(3),
                sm: theme.spacing(1),
                md: theme.spacing(2),
                xxl: theme.spacing(3)
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="subtitle2" color="offWhite.main">
              {interaction.protocol}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: theme.spacing(3),
            justifyContent: "center",
            display: "flex"
          }}
        >
          <Typography
            variant="caption"
            color="offWhite.main"
            textAlign="center"
          >
            {interaction.description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: theme.spacing(3)
          }}
        >
          <AutOsButton
            type="button"
            // disabled={holderXp < plugin.xp}
            disabled={false}
            color="primary"
            variant="outlined"
          >
            <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
              Verify
            </Typography>
          </AutOsButton>
        </Box>
      </Box>
    </Box>
  );
});

const InteractionList = ({ isLoading = false, interactions = [] }: any) => {
  const theme = useTheme();

  return (
    <PerfectScrollbar
      style={{
        height: "calc(100%)",
        display: "flex",
        flexDirection: "column",
        paddingBottom: theme.spacing(4)
      }}
    >
      <Box
        sx={{
          minWidth: {
            sm: "100%"
          },
          width: {
            xs: "100%",
            sm: "unset"
          },
          backgroundColor: "transparent",
          border: "none",
          my: theme.spacing(3)
        }}
      >
        {/* <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Loading}
        message="Activating plugin..."
      />
      <SuccessDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Success}
        message={successMessage}
        subtitle="Congratulations!"
      /> */}{" "}
        <Box
          className="swiper-no-swiping"
          sx={{
            minWidth: {
              xs: "unset",
              md: "700px"
            },
            padding: "10px",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr 1fr",
              md: "1fr 1fr 1fr",
              xl: "1fr 1fr 1fr 1fr 1fr"
            },
            gap: theme.spacing(2)
          }}
        >
          {interactions?.map((interaction, index) => (
            <InteractionListItem
              key={`nova-row-${index}`}
              interaction={interaction}
            />
          ))}
        </Box>
      </Box>
    </PerfectScrollbar>
  );
};

export default InteractionList;
