import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip, Typography, IconButton, Snackbar } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { trimAddress } from "@utils/trim-address";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export const CopyAddress = ({ address, textStyles = {}, iconStyles = {} }) => {
  const [open, setOpen] = useState(false);

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setOpen(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Snackbar
        sx={{
          ".MuiPaper-root": {
            background: "#000",
            color: "white",
            borderRadius: "4.8px",
            borderWidth: "1px",
            overflow: "hidden",
            fontSize: pxToRem(18),
            paddingY: 0,
            textalign: "center",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minWidth: "120px"
          }
        }}
        open={open}
        autoHideDuration={2000}
        action={action}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message="Copied ✅"
      />
      <CopyToClipboard text={address} onCopy={() => setOpen(true)}>
        <div
          style={{ color: "white" }}
          onClick={(event) => event.stopPropagation()}
        >
          <Tooltip title="Copy Address">
            <Typography
              sx={{ color: "white", fontSize: pxToRem(12), ...textStyles }}
              component="div"
            >
              {trimAddress(address)}
              <IconButton sx={{ color: "white", p: 0 }}>
                <ContentCopyIcon
                  sx={{
                    cursor: "pointer",
                    width: pxToRem(12),
                    ml: "5px",
                    ...iconStyles
                  }}
                />
              </IconButton>
            </Typography>
          </Tooltip>
        </div>
      </CopyToClipboard>
    </>
  );
};

export default CopyAddress;
