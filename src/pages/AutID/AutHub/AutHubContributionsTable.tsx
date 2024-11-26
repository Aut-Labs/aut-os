import { memo, useMemo } from "react";
import Box from "@mui/material/Box";
import ArrowIcon from "@assets/autos/move-right.svg?react";

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
import { AutOsButton } from "@components/AutButton";
import useQueryContributions from "@utils/hooks/GetContributions";
import { useCommitAnyContributionMutation } from "@api/contributions.api";
import { useWalletConnector } from "@aut-labs/connector";
import useQueryContributionCommits, {
  ContributionCommit
} from "@utils/hooks/useQueryContributionCommits";
import { TaskContributionNFT } from "@aut-labs/sdk";
import { Link } from "react-router-dom";
import { GithubCommitContribution } from "@api/models/contribution-types/github-commit.model";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: "#576176",
    padding: theme.spacing(3),
    "&:nth-of-type(4)": {
      padding: `${theme.spacing(3)} ${theme.spacing(1)} ${theme.spacing(3)} ${theme.spacing(3)}`
    },
    "&:nth-of-type(5)": {
      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(1)}`
    }
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

interface TableListItemProps {
  contribution: TaskContributionNFT & { contributionType?: string };
  commit: ContributionCommit;
}

const TableListItem = memo(({ contribution, commit }: TableListItemProps) => {
  const theme = useTheme();

  const startDate = useMemo(() => {
    return format(
      new Date(contribution?.properties?.startDate * 1000),
      "dd.MM.yy"
    ).toString();
  }, [contribution?.properties?.startDate]);

  const endDate = useMemo(() => {
    return format(
      new Date(contribution?.properties?.endDate * 1000),
      "dd.MM.yy"
    ).toString();
  }, [contribution?.properties?.endDate]);

  return (
    <StyledTableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "td, th": {
          padding: theme.spacing(3),
          "&:nth-of-type(1)": {
            width: "40%"
          },
          "&:nth-of-type(2)": {
            width: "20%"
          },
          "&:nth-of-type(3)": {
            width: "10%"
          },
          "&:nth-of-type(4)": {
            width: "10%"
          },
          "&:nth-of-type(5)": {
            width: "10%"
          },
          "&:nth-of-type(6)": {
            width: "10%"
          }
        }
      }}
    >
      <StyledTableCell align="left">
        <Stack>
          <Typography variant="subtitle2" fontWeight="normal" color="white">
            {contribution?.name}
          </Typography>
          <Typography variant="caption" fontWeight="normal" color="white">
            {contribution?.description}
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
            {contribution?.contributionType}
          </Typography>
        </Box>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Typography variant="body" fontWeight="normal" color="white">
          {`${contribution?.properties?.points || 0} ${contribution?.properties?.points === 1 ? "pt" : "pts"}`}
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
          {!commit ? (
            <AutOsButton
              type="button"
              color="primary"
              variant="outlined"
              sx={{
                width: "100px"
              }}
              relative="path"
              to={`contribution/${contribution?.properties?.id}`}
              component={Link}
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
              to={`contribution/${contribution?.properties?.id}`}
              component={Link}
            >
              <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                See Commit
              </Typography>
            </AutOsButton>
          )}
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
});

export const AutHubTasksTable = ({ header }) => {
  const { state } = useWalletConnector();

  const { data, loading: isLoading } = useQueryContributions({
    variables: {
      skip: 0,
      take: 1000
    }
  });

  const { data: commits, loading: isLoadingCommits } =
    useQueryContributionCommits({
      skip: !state?.address,
      variables: {
        skip: 0,
        take: 1000,
        where: {
          who: state?.address?.toLowerCase()
        }
      }
    });

  const contributionWithCommits = useMemo(() => {
    return (data || []).map((contribution) => {
      const commit = (commits || []).find(
        (commit) => commit?.contribution?.id === contribution.properties.id
      );
      return {
        contribution,
        commit
      };
    });
  }, [data, commits]);

  if (data?.length) {
    data.map((contribution) => {
      console.log(contribution as GithubCommitContribution);
    })
  }
  const [
    commit,
    { error, isError, isSuccess, isLoading: commitingContribution, reset }
  ] = useCommitAnyContributionMutation();

  // const commitContribution = (row) => {
  //   commit({
  //     autSig: state.authSig,
  //     contribution: row,
  //     message: "secret"
  //   });
  // };

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
                  Type
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  Points
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
          {contributionWithCommits?.length ? (
            <TableBody>
              {contributionWithCommits?.map(
                ({ contribution, commit }, index) => (
                  <TableListItem
                    key={`table-row-${index}`}
                    contribution={contribution}
                    commit={commit}
                  />
                )
              )}
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
