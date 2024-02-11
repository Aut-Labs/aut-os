import { Community } from "@api/community.model";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import CopyAddress from "@components/CopyAddress";
import OverflowTooltip from "@components/OverflowTooltip";
import {
  Box,
  Link as BtnLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  styled,
  tableCellClasses,
  Avatar,
  Typography,
  IconButton,
  Stack
} from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  BlockExplorerUrl,
  SelectedNetwork
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import { HolderData } from "@store/holder/holder.reducer";
import { CanUpdateProfile } from "@auth/auth.reducer";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const TaskStyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: theme.palette.divider
  }
}));

const CommunityListItem = memo(
  ({
    row,
    canUpdateProfile
  }: {
    row: Community;
    canUpdateProfile: boolean;
  }) => {
    const blockExplorer = useSelector(BlockExplorerUrl);
    const selectedNetwork = useSelector(SelectedNetwork);
    return (
      <StyledTableRow
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TaskStyledTableCell
          sx={{
            pr: 0
          }}
        >
          <Avatar
            sx={{
              bgcolor: "background.default",
              width: {
                xs: "64px",
                xxl: "87px"
              },
              height: {
                xs: "64px",
                xxl: "87px"
              },
              borderRadius: 0,
              mr: {
                xs: "15px"
              },
              border: "1px solid white"
            }}
            aria-label="community-avatar"
            src={ipfsCIDToHttpUrl(row.image as string)}
          />
        </TaskStyledTableCell>
        <TaskStyledTableCell
          sx={{
            pl: 0
          }}
          component="th"
          scope="row"
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              gridGap: "8px"
            }}
          >
            <Box>
              <Tooltip
                disableHoverListener={!canUpdateProfile}
                title={canUpdateProfile ? "View community details" : ""}
              >
                <BtnLink
                  color="primary"
                  variant="subtitle2"
                  {...(canUpdateProfile && {
                    to: `edit-community/${row.properties.address}`,
                    component: Link
                  })}
                >
                  {row?.name || "n/a"}
                </BtnLink>
              </Tooltip>
            </Box>
            <Stack direction="row" alignItems="center">
              <CopyAddress address={row.properties.address} />
              {selectedNetwork?.name && (
                <Tooltip title={`Explore in ${selectedNetwork?.name}`}>
                  <IconButton
                    sx={{ color: "white", p: 0, ml: 1 }}
                    href={`${blockExplorer}/address/${row.properties.address}`}
                    target="_blank"
                    color="offWhite"
                  >
                    <OpenInNewIcon sx={{ cursor: "pointer", width: "20px" }} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            <OverflowTooltip
              typography={{
                maxWidth: "300px"
              }}
              text={row?.description}
            />
          </span>
        </TaskStyledTableCell>
        <TaskStyledTableCell align="center">
          <Typography variant="subtitle2" fontWeight="normal" color="white">
            {row?.properties?.userData?.roleName}
          </Typography>
        </TaskStyledTableCell>
        <TaskStyledTableCell align="right">
          <Typography
            variant="subtitle2"
            color="white"
            textAlign="center"
            fontWeight="normal"
            sx={{ pb: "5px" }}
          >
            {`${row?.properties.userData.commitment}/10`}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Typography
              variant="caption"
              textAlign="center"
              color="white"
              style={{
                margin: "0"
              }}
            >
              {row?.properties.userData.commitmentDescription}
            </Typography>
          </div>
        </TaskStyledTableCell>
        <TaskStyledTableCell align="right">
          <Typography
            variant="subtitle2"
            color="white"
            textAlign="center"
            fontWeight="normal"
            sx={{ pb: "5px" }}
          >
            {"1.24"}
          </Typography>
        </TaskStyledTableCell>
      </StyledTableRow>
    );
  }
);

interface TableParamsParams {
  isLoading: boolean;
  communities: Community[];
}

const CommunitiesTable = ({
  isLoading = false,
  communities = []
}: TableParamsParams) => {
  const canUpdateProfile = useSelector(CanUpdateProfile);
  return (
    <TableContainer
      sx={{
        minWidth: {
          sm: "100%"
        },
        width: {
          xs: "360px",
          sm: "unset"
        },
        borderRadius: "16px",
        backgroundColor: "nightBlack.main",
        borderColor: "divider",
        my: 4
      }}
      component={Paper}
    >
      <Table
        className="swiper-no-swiping"
        sx={{
          minWidth: {
            xs: "700px",
            sm: "unset"
          },
          ".MuiTableBody-root > .MuiTableRow-root:hover": {
            backgroundColor: "#ffffff0a"
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TaskStyledTableCell></TaskStyledTableCell>
            <TaskStyledTableCell
              sx={{
                pl: 0
              }}
            >
              <Typography variant="subtitle2" fontWeight="normal" color="white">
                Nova
              </Typography>
            </TaskStyledTableCell>
            <TaskStyledTableCell align="center">
              <Typography variant="subtitle2" fontWeight="normal" color="white">
                Role
              </Typography>
            </TaskStyledTableCell>
            <TaskStyledTableCell align="center">
              <Typography variant="subtitle2" fontWeight="normal" color="white">
                Commitment
              </Typography>
            </TaskStyledTableCell>
            <TaskStyledTableCell align="center">
              <Typography variant="subtitle2" fontWeight="normal" color="white">
                Local Rep.
              </Typography>
            </TaskStyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {communities?.map((row, index) => (
            <CommunityListItem
              canUpdateProfile={canUpdateProfile}
              key={`table-row-${index}`}
              row={row}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommunitiesTable;
