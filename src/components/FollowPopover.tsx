import { AutId } from "@api/map.model";
import { Box, Button, Popover, PopoverProps, Typography } from "@mui/material";

interface FollowPopoverProps {
  anchorEl?: HTMLElement | null;
  anchorPos?: { x: number; y: number };
  data: AutId;
  open: boolean;
}

export const FollowPopover = ({
  anchorPos,
  anchorEl,
  data,
  open
}: FollowPopoverProps) => {
  const anchorProps: Partial<PopoverProps> = anchorEl
    ? { anchorEl }
    : {
        anchorReference: "anchorPosition",
        anchorPosition: { left: anchorPos.x, top: anchorPos.y }
      };
  return (
    <Popover
      open={open}
      hideBackdrop
      disablePortal
      {...anchorProps}
      transformOrigin={{
        horizontal: "center",
        vertical: "top"
      }}
      slotProps={{
        root: {
          style: {
            background: "transparent",
            width: "200px",
            height: "200px"
          }
        }
      }}
      PaperProps={{
        style: {
          borderRadius: "16px",
          width: "145px",
          height: "126px",
          background: "#2F3746",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "4px",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <Typography
          fontFamily="FractulAltBold"
          fontWeight="900"
          variant="subtitle1"
          color="white"
        >
          Name
        </Typography>
        <Typography
          fontWeight="400"
          fontFamily="FractulAltLight"
          variant="body"
          sx={{
            color: "#A7B1C4",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "90%",
            display: "block"
          }}
        >
          @{data?.username}
        </Typography>
      </Box>
      <Box>
        <Button
          sx={{
            mx: 0.5,
            mb: 0.5,
            width: "calc(100% - 0.5rem)",
            borderRadius: "8px",
            height: "40px",
            background: "#576176",
            "&:hover": {
              background: "#818CA2"
            }
          }}
        >
          <Typography
            fontFamily="FractulAltBold"
            fontWeight="900"
            variant="subtitle2"
            color="white"
          >
            Follow
          </Typography>
        </Button>
      </Box>
    </Popover>
  );
};
