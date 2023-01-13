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
  Link,
  styled,
  SvgIcon,
  Typography,
  useTheme
} from "@mui/material";
import { useState } from "react";
import PencilEdit from "@assets/PencilEditicon";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HolderData, HolderStatus } from "@store/holder/holder.reducer";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { ResultState } from "@store/result-status";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { trimAddress } from "@utils/trim-address";
import {
  BlockExplorerUrl,
  SelectedNetworkConfig
} from "@store/WalletProvider/WalletProvider";
import { EditContentElements } from "@components/EditContentElements";
import { useAppDispatch } from "@store/store.model";

const AutTable = styled("table")(({ theme }) => ({
  width: "100%",

  tr: {
    "&:not(:first-of-type)": {
      "&.CanUpdateProfile": {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(235, 235, 242, 0.2)"
        }
      },

      "&.isActive": {
        backgroundColor: theme.palette.primary.main
      }
    }
  },

  td: {
    padding: "20px 0",
    height: "32px",

    [theme.breakpoints.down("md")]: {
      padding: "10px 5px"
    },

    "&:not(:first-of-type)": {
      paddingLeft: "30px",
      [theme.breakpoints.down("md")]: {
        paddingLeft: "15px"
      }
    },
    borderBottom: "1px solid white"
  },

  th: {
    height: "32px",
    padding: "20px 0px",

    [theme.breakpoints.down("md")]: {
      padding: "10px 5px"
    },
    "&:not(:first-of-type)": {
      paddingLeft: "30px",
      [theme.breakpoints.down("md")]: {
        paddingLeft: "15px"
      }
    },
    borderBottom: "1px solid white"
  }
}));

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

const ExternalUrl = styled("a")(({ theme }) => ({
  color: "white"
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
  height: "34px",
  width: "34px",
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

const { FieldWrapper, FormWrapper, BottomWrapper, TopWrapper, ContentWrapper } =
  EditContentElements;

const AutUserInfo = ({ match }) => {
  const holderData = useSelector(HolderData);
  const holderStatus = useSelector(HolderStatus);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const selectedNetwork = useSelector(SelectedNetworkConfig);
  const canUpdateProfile = useSelector(CanUpdateProfile);

  const theme = useTheme();
  const [isActiveIndex, setIsActiveIndex] = useState(null);
  const history = useHistory();
  const location = useLocation();

  const socialIcons = {
    discord: DiscordIcon,
    github: GitHubIcon,
    twitter: TwitterIcon,
    telegram: TelegramIcon,
    lensfrens: LensfrensIcon
  };

  const onEdit = () => {
    history.push({
      pathname: `${match.url}/edit-profile`,
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
      history.push({
        pathname: `${match.url}/edit-community/${address}`,
        search: location.search
      });
    }
  }

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
                xs: "30px",
                md: "50px",
                lg: "80px"
              }
            }}
          >
            <AutCard
              sx={{
                border: "none",
                display: "flex",
                boxShadow: "none",
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
                        md: "150px"
                      },
                      width: {
                        xs: "100px",
                        md: "150px"
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
                  height: {
                    xs: "100px",
                    md: "150px"
                  },
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
                      <EditIcon onClick={onEdit}>
                        <PencilEdit />
                      </EditIcon>
                    )}
                  </div>
                  <ExternalUrl
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
                  </ExternalUrl>

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
                      social.link && (
                        <Link
                          key={`social-icon-${index}`}
                          href={social.link}
                          target="_blank"
                          component="a"
                        >
                          <SvgIcon
                            sx={{
                              height: {
                                xs: "25px",
                                md: "30px"
                              },
                              width: {
                                xs: "25px",
                                md: "30px"
                              },
                              mr: {
                                xs: "10px",
                                md: "15px"
                              }
                            }}
                            key={`socials.${index}.icon`}
                            component={AutIcon}
                          />
                        </Link>
                      )
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
          <Box
            sx={{
              paddingTop: "30px",
              paddingBottom: "30px"
            }}
          >
            <AutTable aria-label="table" cellSpacing="0">
              <tbody>
                <tr>
                  <th>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                      textAlign="left"
                    >
                      Community Name
                    </Typography>
                  </th>
                  <th>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                      textAlign="left"
                    >
                      Role
                    </Typography>
                  </th>
                  <th>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                    >
                      Commitment
                    </Typography>
                  </th>
                </tr>
                {holderData.properties.communities.map(
                  ({ image, name, properties }, index) => (
                    <tr
                      key={`row-key-${index}`}
                      className={`${
                        isActiveIndex === index ? "isActive" : " "
                      } ${canUpdateProfile ? "CanUpdateProfile" : ""}`}
                      onClick={() => clickRow(index, properties.address)}
                    >
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
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
                            src={ipfsCIDToHttpUrl(image as string)}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight="normal"
                              color="white"
                              sx={{ pb: "5px" }}
                            >
                              {name}
                            </Typography>
                            <ExternalUrl
                              onClick={(event) => event.stopPropagation()}
                              href={`${blockExplorer}/address/${properties.address}`}
                              target="_blank"
                            >
                              <Typography
                                variant="caption"
                                color="white"
                                fontWeight="normal"
                              >
                                {trimAddress(properties.address)}
                              </Typography>
                            </ExternalUrl>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Typography
                          variant="subtitle2"
                          color="white"
                          fontWeight="normal"
                        >
                          {properties?.userData?.roleName}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="subtitle2"
                          color="white"
                          textAlign="center"
                          fontWeight="normal"
                          sx={{ pb: "5px" }}
                        >
                          {`${properties.userData.commitment}/10`}
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
                            {properties.userData.commitmentDescription}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </AutTable>
          </Box>
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
