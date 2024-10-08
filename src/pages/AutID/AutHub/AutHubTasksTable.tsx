import { memo, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import ArrowIcon from "@assets/autos/move-right.svg?react";

import {
  Link as BtnLink,
  Paper,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  useTheme
} from "@mui/material";
import { format } from "date-fns";
import { AutOsButton } from "@components/AutButton";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AllContributions,
  setSelectedContribution,
  updateContributionState
} from "@store/contributions/contributions.reducer";
import { formatContributionType } from "@utils/format-contribution-type";
import { TaskStatus } from "@store/model";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: "#576176",
    padding: theme.spacing(3),
    "&:nth-of-type(2)": {
      padding: `${theme.spacing(3)} 0 ${theme.spacing(3)} ${theme.spacing(3)}`
    },
    "&:nth-of-type(3)": {
      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} 0`
    }
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const TableListItem = memo((data: any) => {
  const dispatch = useDispatch();
  const { row } = data;
  const theme = useTheme();

  const handleContributionClick = (contribution) => {
    dispatch(setSelectedContribution(contribution));
  };

  const contributionType = useMemo(
    () => formatContributionType(row?.metadata?.contributionType),
    [row?.metadata?.contributionType]
  );

  const startDate = useMemo(() => {
    // return format(new Date(row?.startDate), "dd.MM.yy '•' HH:mm").toString();
    return format(new Date(row?.metadata?.startDate), "dd.MM.yy").toString();
  }, [row?.metadata?.startDate]);

  const endDate = useMemo(() => {
    // return format(new Date(row?.endDate), "dd.MM.yy '•' HH:mm").toString();
    return format(new Date(row?.metadata?.startDate), "dd.MM.yy").toString();
  }, [row?.metadata?.endDate]);

  return (
    <StyledTableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "td, th": {
          padding: theme.spacing(3),
          "&:nth-of-type(1)": {
            width: "50%"
          },
          "&:nth-of-type(2)": {
            width: "25%"
          },
          "&:nth-of-type(3)": {
            width: "25%"
          }
        }
      }}
    >
      <StyledTableCell align="left">
        <Stack>
          <Typography variant="subtitle2" fontWeight="normal" color="white">
            {row?.metadata?.name}
          </Typography>
          <Typography variant="caption" fontWeight="normal" color="white">
            {row?.metadata?.description}
          </Typography>
        </Stack>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Typography variant="body" fontWeight="normal" color="white">
            {contributionType}
          </Typography>
        </Box>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Typography variant="body" fontWeight="normal" color="white">
            {startDate}
          </Typography>
          <SvgIcon
            sx={{ fill: "transparent", ml: theme.spacing(4) }}
            component={ArrowIcon}
          />
        </Box>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Typography variant="body" fontWeight="normal" color="white">
          {endDate}
        </Typography>
      </StyledTableCell>

      <StyledTableCell align="left">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          {row?.status === TaskStatus.Created ? (
            <AutOsButton
              type="button"
              color="primary"
              variant="outlined"
              sx={{
                width: "100px"
              }}
              relative="path"
              to={`contribution/${row.id}`}
              component={Link}
              onClick={() => handleContributionClick(row)}
            >
              <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                Claim
              </Typography>
            </AutOsButton>
          ) : (
            <AutOsButton
              type="button"
              color="success"
              variant="contained"
              sx={{
                "&.MuiButton-root": {
                  backgroundColor: "#12B76A"
                },
                "&.Mui-disabled": {
                  color: `${theme.palette.offWhite.light} !important`
                },
                width: "100px"
              }}
              disabled
            >
              <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                Completed
              </Typography>
            </AutOsButton>
          )}
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
});

export const AutHubTasksTable = ({ header }) => {
  const tasks = useSelector(AllContributions);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(
  //     updateContributionState({
  //       contributions: tasks
  //     })
  //   );
  // }, [dispatch, tasks]);

  const theme = useTheme();
  return (
    <div>
      <TableContainer
        sx={{
          minWidth: {
            sm: "100%"
          },
          width: {
            xs: "100%",
            sm: "unset"
          },
          margin: 0,
          my: theme.spacing(3),
          padding: 0,
          backgroundColor: "transparent",
          borderColor: "#576176"
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
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  Name
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  Contribution Type
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  Start Date
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  End Date
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  Action
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {tasks?.length ? (
            <TableBody>
              {tasks?.map((row, index) => (
                <TableListItem key={`table-row-${index}`} row={row} />
              ))}
            </TableBody>
          ) : (
            <Box
              sx={{
                padding: theme.spacing(3)
              }}
            >
              <Typography variant="body" color="white">
                No items found...
              </Typography>
            </Box>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};
