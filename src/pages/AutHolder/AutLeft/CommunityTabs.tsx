import { useEffect, memo, useMemo } from "react";
import Box from "@mui/material/Box";
import { useAppDispatch } from "@store/store.model";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses
} from "@mui/material";
import { setTitle } from "@store/ui-reducer";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import AutLoading from "@components/AutLoading";
import { useSelector } from "react-redux";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: theme.palette.divider
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

// const generateCommunityTabs = (tasks: { [header: string]: any[] }) => {
//   return Object.keys(tasks || []).reduce((prev, curr) => {
//     const item = tasks[curr];
//     if (Array.isArray(item)) {
//       prev = [
//         ...prev,
//         {
//           label: curr,
//           props: {
//             tasks: item
//           },
//           component: CommunityTasksTable
//         }
//       ];
//     }
//     return prev;
//   }, []);
// };

const TableListItem = memo((data: any) => {
  console.log("row", data);
  const { row } = data;
  return (
    <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <StyledTableCell align="center">
        <Stack>
          <Typography variant="subtitle2" fontWeight="normal" color="white">
            {row?.name}
          </Typography>
          <Typography variant="caption" fontWeight="normal" color="white">
            {row?.description}
          </Typography>
        </Stack>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Typography variant="subtitle2" fontWeight="normal" color="white">
          {moment(row?.startDate).format("DD/MM/YYYY").toString()}
        </Typography>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Typography variant="subtitle2" fontWeight="normal" color="white">
          {moment(row?.endDate).format("DD/MM/YYYY").toString()}
        </Typography>
      </StyledTableCell>
    </StyledTableRow>
  );
});

export const CommunityTasksTable = ({ header, tasks }) => {
  console.log("tasks????", tasks, header);
  return (
    <div>
      <TableContainer
        sx={{
          minWidth: {
            sm: "100%"
          },
          width: {
            xs: "360px",
            sm: "unset"
          },
          margin: 0,
          padding: 0,
          backgroundColor: "nightBlack.main",
          borderColor: "divider"
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
              <StyledTableCell align="center">
                <Typography
                  variant="subtitle2"
                  fontWeight="normal"
                  color="white"
                >
                  Name
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography
                  variant="subtitle2"
                  fontWeight="normal"
                  color="white"
                >
                  Start Date
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography
                  variant="subtitle2"
                  fontWeight="normal"
                  color="white"
                >
                  End Date
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks?.map((row, index) => (
              <TableListItem key={`table-row-${index}`} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
