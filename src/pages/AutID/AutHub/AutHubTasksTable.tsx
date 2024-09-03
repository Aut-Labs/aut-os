import { memo, useMemo } from "react";
import Box from "@mui/material/Box";
import { ReactComponent as ArrowIcon } from "@assets/autos/move-right.svg";

import {
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
  const { row } = data;
  const theme = useTheme();

  const startDate = useMemo(() => {
    return format(new Date(row?.startDate), "dd.MM.yy '•' HH:mm").toString();
  }, [row?.startDate]);

  const endDate = useMemo(() => {
    return format(new Date(row?.endDate), "dd.MM.yy '•' HH:mm").toString();
  }, [row?.endDate]);

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
          <Typography variant="subtitle1" fontWeight="normal" color="white">
            {row?.name}
          </Typography>
          <Typography variant="caption" fontWeight="normal" color="white">
            {row?.description}
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
    </StyledTableRow>
  );
});

export const AutHubTasksTable = ({ header, tasks }) => {
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
