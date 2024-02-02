/* eslint-disable max-len */
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import InteractionMap from "@components/InteractionMap";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AutOsButton } from "@components/AutButton";
import { useAppDispatch } from "@store/store.model";
import { setOpenInteractions } from "@store/ui-reducer";
import { AdddInteractions } from "@store/interactions/interactions.reducer";
import { useAccount } from "wagmi";
import { SelectedProfileAddress } from "@store/holder/holder.reducer";
import { gql, useQuery } from "@apollo/client";
import { fetchMetadata, queryParamsAsString } from "@aut-labs/sdk";
import { Community } from "@api/community.model";
import { environment } from "@api/environment";
import { BaseNFTModel } from "@aut-labs/sdk/dist/models/baseNFTModel";
import { MapAutID, MapNova } from "@api/map.model";
import { AutID } from "@api/aut.model";
import AutLoading from "@components/AutLoading";

const fetchAutIDsQuery = (nova: Community) => {
  const queryArgsString = queryParamsAsString({
    skip: 0,
    take: 100,
    filters: [
      {
        prop: "novaAddress",
        comparison: "equals",
        value: nova.properties?.address?.toLowerCase()
      }
    ]
  });

  return gql`
    query AutIds {
      autIDs(${queryArgsString}) {
        id
        username
        tokenID
        novaAddress
        role
        commitment
        metadataUri
      }
    }
  `;
};

const AutMap = ({ nova }) => {
  const ref = useRef();
  const dispatch = useAppDispatch();
  const addedInteractions = useSelector(AdddInteractions);
  const { loading, error, data } = useQuery(fetchAutIDsQuery(nova), {
    fetchPolicy: "cache-first"
  });

  const { address } = useAccount();
  const selectedAddress = useSelector(SelectedProfileAddress);

  const isUserConnected = useMemo(() => {
    return selectedAddress?.toLowerCase() === address?.toLowerCase();
  }, [address, selectedAddress]);

  const [mapData, setMapData] = useState<MapNova>();

  const isWalletAddressPartOfMembers = useMemo(() => {
    return (mapData?.members || []).some(
      (v) => v.properties?.address?.toLowerCase() === address?.toLowerCase()
    );
  }, [mapData, address]);

  const showInteractionLayer = useMemo(() => {
    return (
      !isUserConnected &&
      !addedInteractions.length &&
      !isWalletAddressPartOfMembers
    );
  }, [isUserConnected, addedInteractions, isWalletAddressPartOfMembers]);

  const fetchAutId = async (autID) => {
    try {
      const metadata = await fetchMetadata<BaseNFTModel<any>>(
        autID.metadataUri,
        environment.ipfsGatewayUrl
      );
      const { avatar, thumbnailAvatar, timestamp } = metadata.properties;

      const newAutId = new MapAutID({
        id: autID.tokenID,
        name: metadata.name,
        image: metadata.image,
        description: metadata.description,
        nova,
        properties: {
          avatar,
          thumbnailAvatar,
          timestamp,
          role: autID.role,
          socials: [],
          address: autID.id,
          tokenId: autID.tokenID,
          network: "Net",
          communities: [nova],
          interactions: []
        }
      });
      return newAutId;
    } catch (error) {
      console.error("Error fetching metadata for autID:", autID.tokenID, error);
      return null;
    }
  };

  useEffect(() => {
    if (data?.autIDs && data.autIDs.length > 0) {
      const enrichAllAutIDs = async () => {
        const enrichedAutIDs: AutID[] = await Promise.all(
          data.autIDs.map(fetchAutId)
        );

        const { central, otherMembers } = enrichedAutIDs.reduce(
          (prev, curr) => {
            if (
              selectedAddress?.toLowerCase() ===
              curr?.properties?.address?.toLowerCase()
            ) {
              prev.central = curr;
              prev.otherMembers.push(curr);
            } else {
              prev.otherMembers.push(curr);
            }

            return prev;
          },
          {
            central: null,
            otherMembers: []
          }
        );

        const mapNova: MapNova = {
          ...nova,
          centralNode: central,
          members: otherMembers
        };

        central.nova.members = mapNova.members;
        setMapData(mapNova);
      };

      enrichAllAutIDs();
    }
  }, [data, selectedAddress, nova]);

  const handleClose = () => {
    dispatch(setOpenInteractions(false));
  };

  const openInteractionsModal = () => {
    dispatch(setOpenInteractions(true));
  };
  return (
    <>
      {loading ? (
        <AutLoading width="100px" height="100px" />
      ) : (
        <>
          {showInteractionLayer && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gridGap: "12px",
                textAlign: "center",
                position: "absolute",
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                zIndex: 99,
                background: "rgba(87, 97, 118, 0.3)",
                borderRadius: "42px"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path
                  d="M32.0013 34.6667C39.3651 34.6667 45.3346 28.6971 45.3346 21.3333C45.3346 13.9695 39.3651 8 32.0013 8C24.6375 8 18.668 13.9695 18.668 21.3333C18.668 28.6971 24.6375 34.6667 32.0013 34.6667Z"
                  stroke="#717BBC"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M53.3346 56C53.3346 50.342 51.087 44.9158 47.0862 40.915C43.0855 36.9142 37.6593 34.6666 32.0013 34.6666C26.3434 34.6666 20.9171 36.9142 16.9164 40.915C12.9156 44.9158 10.668 50.342 10.668 56"
                  stroke="#717BBC"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Typography
                color="white"
                fontWeight="700"
                fontSize="16px"
                lineHeight="26px"
              >
                Connect with this user to see their <br /> map of connections
              </Typography>
              <AutOsButton
                onClick={openInteractionsModal}
                type="button"
                color="primary"
                size="small"
                variant="outlined"
              >
                <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                  Create a Link
                </Typography>
              </AutOsButton>
            </Box>
          )}
          <Box
            ref={ref}
            className="map-wrapper"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100%",
              height: "100%",
              "& > DIV": {
                width: "100%"
              },
              ...(showInteractionLayer && {
                mixBlendMode: "plus-lighter",
                opacity: 0.6,
                filter: "blur(20px)"
              })
            }}
          >
            {mapData?.centralNode && (
              <InteractionMap
                mapData={mapData}
                isActive={!showInteractionLayer}
                parentRef={ref}
              />
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default memo(AutMap);
