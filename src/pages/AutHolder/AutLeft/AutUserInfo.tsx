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
  useMediaQuery,
  useTheme
} from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { useState } from "react";
import PencilEdit from "@assets/PencilEditicon";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HolderData,
  HolderStatus,
  updateHolderState
} from "@store/holder/holder.reducer";
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
          backgroundColor: "rgba(67, 158, 221, 0.3)"
        }
      },

      "&.isActive": {
        backgroundColor: theme.palette.primary.main
      }
    }
  },

  td: {
    padding: `${pxToRem(20)} ${pxToRem(10)}`,
    height: pxToRem(32),

    [theme.breakpoints.down("md")]: {
      padding: pxToRem(20)
    },

    "&:not(:first-of-type)": {
      paddingLeft: pxToRem(30)
    },
    borderBottom: "1px solid white"
  },

  th: {
    height: pxToRem(32),
    padding: `${pxToRem(20)} ${pxToRem(10)}`,

    [theme.breakpoints.down("md")]: {
      padding: pxToRem(20)
    },

    "&:not(:first-of-type)": {
      paddingLeft: pxToRem(30)
    },
    borderBottom: "1px solid white"
  }
}));

const IconContainer = styled("div")(({ theme }) => ({
  paddingTop: pxToRem(15),
  display: "flex",
  minHeight: pxToRem(30),
  [theme.breakpoints.down("md")]: {
    paddingTop: pxToRem(20)
  }
}));

const ExternalUrl = styled("a")(({ theme }) => ({
  color: "white",
  fontSize: pxToRem(14)
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

const { FieldWrapper, FormWrapper, BottomWrapper, TopWrapper, ContentWrapper } =
  EditContentElements;

const AutUserInfo = ({ match }) => {
  const holderData = useSelector(HolderData);
  const holderStatus = useSelector(HolderStatus);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const selectedNetwork = useSelector(SelectedNetworkConfig);
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const xs = useMediaQuery(theme.breakpoints.down("sm"));
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
              paddingBottom: pxToRem(100)
            }}
          >
            <AutCard
              sx={{
                bgcolor: "background.default",
                border: "none",
                display: "flex"
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: "background.default",
                      width: pxToRem(150),
                      height: pxToRem(150),
                      borderRadius: 0
                    }}
                    aria-label="recipe"
                    src={ipfsCIDToHttpUrl(
                      holderData?.properties?.avatar as string
                    )}
                  />
                }
              />
              <CardContent
                sx={{
                  ml: xs ? "0" : pxToRem(30),
                  mr: xs ? 0 : pxToRem(30),
                  alignSelf: "center",
                  height: pxToRem(150)
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "5px"
                  }}
                >
                  <Typography
                    fontSize={pxToRem(50)}
                    color="background.paper"
                    textAlign="left"
                    lineHeight={1}
                  >
                    {holderData.name}
                  </Typography>
                  {canUpdateProfile && (
                    <div
                      style={{
                        padding: pxToRem(10),
                        cursor: "pointer",
                        alignSelf: "center"
                      }}
                      onClick={onEdit}
                    >
                      <PencilEdit height={pxToRem(24)} width={pxToRem(24)} />
                    </div>
                  )}
                </div>
                <ExternalUrl
                  href={`${blockExplorer}/address/${holderData?.properties?.address}`}
                  target="_blank"
                >
                  {trimAddress(holderData.properties.address)}
                </ExternalUrl>

                {holderData.properties.ethDomain && (
                  <Typography
                    variant="subtitle2"
                    color="background.paper"
                    textAlign="left"
                    sx={{ textDecoration: "underline", wordBreak: "break-all" }}
                  >
                    {holderData.properties.ethDomain}
                  </Typography>
                )}
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
                              height: pxToRem(34),
                              width: pxToRem(31),
                              mr: pxToRem(20)
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
            <Typography
              fontSize={pxToRem(47)}
              textTransform="uppercase"
              color="background.paper"
              textAlign="left"
            >
              Communities
            </Typography>
          </Box>
          <Box
            sx={{
              paddingTop: pxToRem(50),
              paddingBottom: pxToRem(100)
            }}
          >
            <AutTable aria-label="table" cellSpacing="0">
              <tbody>
                <tr>
                  <th>
                    <Typography
                      variant="subtitle2"
                      color="background.paper"
                      textAlign="left"
                      fontWeight="bold"
                    >
                      Community Name
                    </Typography>
                  </th>
                  <th>
                    <Typography
                      variant="subtitle2"
                      color="background.paper"
                      textAlign="left"
                      fontWeight="bold"
                    >
                      Role
                    </Typography>
                  </th>
                  <th>
                    <Typography
                      variant="subtitle2"
                      color="background.paper"
                      textAlign="center"
                      fontWeight="bold"
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
                              width: pxToRem(64),
                              height: pxToRem(64),
                              borderRadius: 0,
                              mr: pxToRem(15),
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
                              color="background.paper"
                              sx={{ pb: "5px" }}
                            >
                              {name}
                            </Typography>
                            <ExternalUrl
                              onClick={(event) => event.stopPropagation()}
                              href={`${blockExplorer}/address/${properties.address}`}
                              target="_blank"
                            >
                              {trimAddress(properties.address)}
                            </ExternalUrl>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Typography
                          variant="subtitle2"
                          color="background.paper"
                        >
                          {properties?.userData?.roleName}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="subtitle2"
                          color="background.paper"
                          textAlign="center"
                          sx={{ pb: "5px" }}
                        >
                          {`${properties.userData.commitment}/10`}
                        </Typography>
                        <Typography
                          variant="body1"
                          textAlign="center"
                          color="background.paper"
                        >
                          {properties.userData.commitmentDescription}
                        </Typography>
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
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            mb: "10px",
            fontSize: pxToRem(50),
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
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            mb: "10px",
            fontSize: pxToRem(50),
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
