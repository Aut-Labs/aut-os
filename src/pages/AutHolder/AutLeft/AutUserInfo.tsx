/* eslint-disable no-constant-condition */
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";

import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Stack,
  styled,
  SvgIcon,
  Tooltip,
  Typography
} from "@mui/material";
import { useState } from "react";
import PencilEdit from "@assets/PencilEditicon";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HolderData, HolderStatus } from "@store/holder/holder.reducer";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { ResultState } from "@store/result-status";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  BlockExplorerUrl,
  SelectedNetworkConfig
} from "@store/WalletProvider/WalletProvider";
import { EditContentElements } from "@components/EditContentElements";
import CommunitiesTable from "./CommunitiesTable";
import CopyAddress from "@components/CopyAddress";

const IconContainer = styled("div")(({ theme }) => ({
  paddingTop: "15px",
  display: "flex",
  minHeight: "25px",
  height: "40px",

  [theme.breakpoints.down("md")]: {
    height: "35px",
    minHeight: "20px"
  }
}));

const AutCard = styled(Card)(({ theme }) => ({
  "&.MuiCard-root": {
    display: "flex"
  },

  ".MuiCardHeader-root": {
    padding: "0"
  },

  ".MuiCardContent-root:last-child": {
    padding: "0"
  }
}));

const EditIcon = styled("div")(({ theme }) => ({
  height: "30px",
  width: "30px",
  cursor: "pointer",
  paddingLeft: "10px",
  display: "flex",
  alignSelf: "flex-end",
  marginBottom: "5px",

  [theme.breakpoints.down("md")]: {
    height: "18px",
    width: "18px"
  }
}));

const { ContentWrapper } = EditContentElements;

const AutUserInfo = () => {
  const holderData = useSelector(HolderData);
  const holderStatus = useSelector(HolderStatus);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const selectedNetwork = useSelector(SelectedNetworkConfig);
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const [isActiveIndex, setIsActiveIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const socialIcons = {
    discord: DiscordIcon,
    github: GitHubIcon,
    twitter: TwitterIcon,
    telegram: TelegramIcon,
    lensfrens: LensfrensIcon
  };

  const onEdit = () => {
    navigate({
      pathname: "edit-profile",
      search: location.search
    });
  };
  function clickRow(index, address: string) {
    if (CanUpdateProfile) {
      if (isActiveIndex === index) {
        setIsActiveIndex(null);
      } else {
        setIsActiveIndex(index);
      }
      navigate({
        pathname: `edit-community/${address}`,
        search: location.search
      });
    }
  }

  const selectedNetworkConfig = useSelector(SelectedNetworkConfig);

  return (
    <ContentWrapper>
      {holderStatus === ResultState.Success ? (
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flex: "1"
          }}
        >
          <Box
            sx={{
              paddingBottom: {
                xs: 3,
                md: 4,
                xxl: 6
              }
            }}
          >
            <AutCard
              sx={{
                border: "none",
                display: "flex",
                boxShadow: "none",
                alignItems: "flex-start",
                bgcolor: "transparent"
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: "background.default",
                      height: {
                        xs: "100px",
                        xxl: "150px"
                      },
                      width: {
                        xs: "100px",
                        xxl: "150px"
                      },
                      borderRadius: 0
                    }}
                    aria-label="avatar"
                    src={ipfsCIDToHttpUrl(
                      holderData?.properties?.avatar as string
                    )}
                  />
                }
              />
              <CardContent
                sx={{
                  ml: {
                    xs: "0",
                    sm: "30px"
                  },
                  mr: {
                    xs: "0",
                    sm: "30px"
                  },
                  alignSelf: "center",
                  // height: {
                  //   xs: "100px",
                  //   md: "150px"
                  // },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "5px"
                    }}
                  >
                    <Typography
                      color="white"
                      textAlign="left"
                      lineHeight={1}
                      variant="h3"
                    >
                      {holderData.name}
                    </Typography>
                    {canUpdateProfile && (
                      <Tooltip title="Edit profile">
                        <EditIcon onClick={onEdit}>
                          <PencilEdit />
                        </EditIcon>
                      </Tooltip>
                    )}
                  </div>

                  <Stack direction="row" alignItems="center">
                    <CopyAddress address={holderData?.properties?.address} />
                    {selectedNetworkConfig?.name && (
                      <Tooltip
                        title={`Explore in ${selectedNetworkConfig?.name}`}
                      >
                        <IconButton
                          sx={{ p: 0, ml: 1 }}
                          href={`${blockExplorer}/address/${holderData?.properties?.address}`}
                          target="_blank"
                          color="offWhite"
                        >
                          <OpenInNewIcon
                            sx={{ cursor: "pointer", width: "20px" }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                  {/* <ExternalUrl
                    href={`${blockExplorer}/address/${holderData?.properties?.address}`}
                    target="_blank"
                  >
                    <Typography
                      variant="subtitle2"
                      color="white"
                      fontWeight="normal"
                    >
                      {trimAddress(holderData.properties.address)}
                    </Typography>
                  </ExternalUrl> */}

                  {/* {holderData.properties.ethDomain && (
                    <Typography
                      variant="subtitle2"
                      color="white"
                      textAlign="left"
                      sx={{
                        textDecoration: "underline",
                        wordBreak: "break-all"
                      }}
                    >
                      {holderData.properties.ethDomain}
                    </Typography>
                  )} */}
                </div>

                <IconContainer>
                  {holderData?.properties.socials.map((social, index) => {
                    const AutIcon =
                      socialIcons[Object.keys(socialIcons)[index]];

                    return (
                      <Link
                        key={`social-icon-${index}`}
                        {...(!!social.link && {
                          color: "offwhite.main",
                          component: "a",
                          href: social.link,
                          target: "_blank"
                        })}
                        {...(!social.link && {
                          sx: {
                            color: "divider"
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
                      </Link>
                    );
                  })}
                </IconContainer>
              </CardContent>
            </AutCard>
          </Box>
          <Box>
            <Typography color="white" textAlign="left" variant="h3">
              Communities
            </Typography>
          </Box>
          <CommunitiesTable
            communities={holderData.properties.communities}
            isLoading={false}
          />
        </Box>
      ) : !selectedNetwork ? (
        <Typography
          variant="h3"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            mb: "10px",
            color: "white",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%"
          }}
        >
          Oops, it looks like we don't support this network yet.
        </Typography>
      ) : (
        <Typography
          variant="h3"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            mb: "10px",
            color: "white",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%"
          }}
        >
          This āutID hasn't been claimed yet.
        </Typography>
      )}
    </ContentWrapper>
  );
};

export default AutUserInfo;
