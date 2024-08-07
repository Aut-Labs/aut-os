import { Typography } from "@mui/material";
import DialogWrapper from "./DialogWrapper";

const SuccessDialog = ({
  open,
  handleClose,
  subtitle,
  message,
  fullScreen = false
}: any) => {
  return (
    <DialogWrapper open={open} onClose={handleClose} fullScreen={fullScreen}>
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            mt: 2
          }}
          component="div"
          variant="h3"
        >
          {subtitle}
        </Typography>
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            mt: 2
          }}
          component="div"
          variant="subtitle2"
        >
          {message}
        </Typography>
      </div>
    </DialogWrapper>
  );
};

export default SuccessDialog;
