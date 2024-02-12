import React, { memo, useState } from "react";
import AutToolBar from "../AutHolder/AutLeft/AutToolBar";
import MainBackground from "src/MainBackground";
import AutSearch from "./AutSearch";
import { Box, styled } from "@mui/material";
import gql from "graphql-tag";
import { fetchMetadata, queryParamsAsString } from "@aut-labs/sdk";
import { useApolloClient } from "@apollo/client";
import { BaseNFTModel } from "@aut-labs/sdk/dist/models/baseNFTModel";
import { environment } from "@api/environment";
import { ipfsCIDToHttpUrl } from "@api/storage.api";

const AutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "50%",
  [theme.breakpoints.down("xl")]: {
    justifyContent: "center"
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}));

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const ensureSpecificItemCount = (array, itemCount) => {
  let tempArray = [...array];
  while (tempArray.length < itemCount) {
    tempArray = [...tempArray, ...array.slice(0, itemCount - tempArray.length)];
  }
  tempArray = shuffleArray(tempArray);

  return tempArray.slice(0, itemCount);
};

const enhanceItemsWithAvatars = async (items) => {
  const enhancedItems = await Promise.all(
    items.map(async (item) => {
      try {
        const autIdMetadata = await fetchMetadata<BaseNFTModel<any>>(
          item.metadataUri,
          environment.ipfsGatewayUrl
        );
        const { thumbnailAvatar } = autIdMetadata.properties;

        return {
          ...item,
          avatar: ipfsCIDToHttpUrl(thumbnailAvatar)
        };
      } catch (error) {
        console.error("Failed to fetch metadata for item:", item.id, error);
        return {
          ...item,
          thumbnailAvatar: null,
          timestamp: null
        };
      }
    })
  );

  return enhancedItems;
};

const AutHome = () => {
  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0
  });

  const [faces, setFaces] = useState([]);
  const apolloClient = useApolloClient();

  React.useEffect(() => {
    if (!faces?.length) {
      const fetchData = async () => {
        const queryArgsString = queryParamsAsString({
          skip: 0,
          take: 99
        });
        const query = gql`
          query AutIds {
            autIDs(${queryArgsString}) {
              id
              username
              metadataUri
            }
          }
        `;
        try {
          const response = await apolloClient.query({
            query
          });
          // eslint-disable-next-line no-unsafe-optional-chaining
          const { autIDs } = response.data;
          const itemCount = 9;
          const autIdFaces = ensureSpecificItemCount(autIDs, itemCount);

          enhanceItemsWithAvatars(autIdFaces).then((enhancedItems) => {
            setFaces(enhancedItems);
          });
        } catch (error) {
          console.error("Error fetching the data:", error);
        }
      };

      fetchData();
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <AutToolBar hideSearch={true}></AutToolBar>
      <MainBackground dimensions={dimensions} faces={faces}></MainBackground>
      <AutBox
        sx={{
          position: "fixed",
          width: "520px",
          height: "200px"
        }}
      >
        <AutSearch mode="full" />
      </AutBox>
    </>
  );
};

export default memo(AutHome);
