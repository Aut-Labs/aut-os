import { Community } from "@api/community.model";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import CopyAddress from "@components/CopyAddress";

import {
  Box,
  Link as BtnLink,
  Paper,
  Tooltip,
  styled,
  Avatar,
  Typography,
  useTheme,
  SvgIcon
} from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { IconContainer, socialIcons } from "../AutLeft/AutUserInfo";
import { socialUrls } from "@api/social.model";
import { SubtitleWithInfo } from "@components/SubtitleWithInfoIcon";

export const NovaTopWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "24px",
  borderBottom: "1px solid",
  borderColor: "inherit",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px"
  }
}));
export const NovaBottomWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "4fr 4fr 2fr",
  borderColor: "inherit",

  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "column"
  }
}));

export const PropertiesWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px 0"
}));

const NovaListItem = memo(
  ({
    row,
    canUpdateProfile
  }: {
    row: Community;
    canUpdateProfile: boolean;
  }) => {
    const theme = useTheme();
    return (
      <Box
        sx={{
          border: "1px solid",
          borderColor: "#576176",
          transition: theme.transitions.create(["border-color"]),
          ":hover": {
            borderColor: "#14ECEC"
          }
        }}
      >
        <NovaTopWrapper
          sx={{
            flexDirection: "row"
          }}
        >
          <Box
            sx={{
              display: "flex"
            }}
          >
            <Avatar
              sx={{
                width: {
                  xs: "80px",
                  xxl: "80px"
                },
                height: {
                  xs: "80px",
                  xxl: "80px"
                },
                borderRadius: "6px"
              }}
              aria-label="nova-avatar"
              src={ipfsCIDToHttpUrl(row.image as string)}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column"
                },
                justifyContent: {
                  xs: "space-between",
                  md: "space-between"
                },
                marginLeft: theme.spacing(3)
              }}
            >
              <Tooltip
                disableHoverListener={!canUpdateProfile}
                title={canUpdateProfile ? "View Nova details" : ""}
              >
                <BtnLink
                  color="offWhite.main"
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    textDecoration: "none"
                  }}
                  {...(canUpdateProfile && {
                    to: `edit-community/${row.properties.address}`,
                    component: Link
                  })}
                >
                  {row?.name || "n/a"}
                </BtnLink>
              </Tooltip>
              <CopyAddress address={row.properties.address} />
            </Box>
          </Box>
          <IconContainer>
            {row?.properties.socials.map((social, index) => {
              const AutIcon = socialIcons[Object.keys(socialIcons)[index]];

              return (
                <BtnLink
                  key={`social-icon-${index}`}
                  {...(!!social.link && {
                    component: "a",
                    href: social.link,
                    target: "_blank",
                    sx: {
                      svg: {
                        color: theme.palette.offWhite.main
                      }
                    }
                  })}
                  {...((!social.link ||
                    social.link === socialUrls[social.type].prefix) && {
                    sx: {
                      // display: "none",
                      svg: {
                        color: theme.palette.divider
                      }
                    },
                    component: "button",
                    disabled: true
                  })}
                >
                  <SvgIcon
                    sx={{
                      height: {
                        xs: "25px",
                        xxl: "30px"
                      },
                      width: {
                        xs: "25px",
                        xxl: "30px"
                      },
                      mr: {
                        xs: "10px",
                        xxl: "15px"
                      }
                    }}
                    key={`socials.${index}.icon`}
                    component={AutIcon}
                  />
                </BtnLink>
              );
            })}
          </IconContainer>
        </NovaTopWrapper>
        <NovaBottomWrapper>
          <PropertiesWrapper
            sx={{
              borderRight: {
                xs: "0",
                md: "1px solid"
              },
              borderBottom: {
                xs: "1px solid",
                md: "0"
              },
              borderRightColor: {
                xs: "transparent",
                md: "inherit"
              },
              borderBottomColor: {
                xs: "inherit",
                md: "transparent"
              }
            }}
          >
            <Typography
              variant="subtitle2"
              color="offWhite.main"
              fontWeight="normal"
            >
              {/* TODO: Revert */}
              {/* {row?.properties?.userData?.roleName} */}
              {"Contributor"}
            </Typography>
            <SubtitleWithInfo
              title="role"
              description="This is your role"
            ></SubtitleWithInfo>
          </PropertiesWrapper>
          <PropertiesWrapper
            sx={{
              borderRight: {
                xs: "0",
                md: "1px solid"
              },
              borderBottom: {
                xs: "1px solid",
                md: "0"
              },
              borderRightColor: {
                xs: "transparent",
                md: "inherit"
              },
              borderBottomColor: {
                xs: "inherit",
                md: "transparent"
              }
            }}
          >
            <Typography
              variant="subtitle2"
              color="offWhite.main"
              fontWeight="normal"
            >
              {`${row?.properties.userData.commitment}/10 - ${row?.properties.userData.commitmentDescription}`}
            </Typography>
            <SubtitleWithInfo
              title="commitment"
              description="This is your commitment"
            ></SubtitleWithInfo>
          </PropertiesWrapper>
          <PropertiesWrapper sx={{}}>
            <Typography
              variant="subtitle2"
              color="offWhite.main"
              fontWeight="normal"
            >
              1.0
            </Typography>
            <SubtitleWithInfo
              title="local rep"
              description="This is your local reputation."
            ></SubtitleWithInfo>
          </PropertiesWrapper>
        </NovaBottomWrapper>
      </Box>
    );
  }
);

interface TableParamsParams {
  isLoading: boolean;
  communities: Community[];
}

const NovaeList = ({
  isLoading = false,
  communities = []
}: TableParamsParams) => {
  const theme = useTheme();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  return (
    <Box
      sx={{
        minWidth: {
          sm: "100%"
        },
        width: {
          xs: "360px",
          sm: "unset"
        },
        backgroundColor: "transparent",
        border: "none"
      }}
      component={Paper}
    >
      <Box sx={{ display: "flex", my: theme.spacing(3) }}>
        <Typography color="offWhite.main" variant="h3">
          Novæ
        </Typography>
        <Typography
          color="offWhite.dark"
          variant="h3"
          fontWeight="normal"
          sx={{
            ml: theme.spacing(1)
          }}
        >{`(${communities.length})`}</Typography>
      </Box>
      <Box
        className="swiper-no-swiping"
        sx={{
          minWidth: {
            xs: "unset",
            md: "700px"
          },
          display: "grid",
          gap: theme.spacing(2)
        }}
      >
        {communities?.map((nova, index) => (
          <NovaListItem
            canUpdateProfile={canUpdateProfile}
            key={`nova-row-${index}`}
            row={nova}
          />
        ))}
      </Box>
    </Box>
  );
};

export default NovaeList;
