import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, {
  NodeObject,
  ForceGraphMethods,
  GraphData,
  LinkObject
} from "react-force-graph-2d";
import * as d3 from "d3-force";
import PublicIcon from "@mui/icons-material/Public"; // Example icon for market indication
import PeopleIcon from "@mui/icons-material/People"; // Example icon for member count
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  NODE_PADDING,
  NODE_BORDER_WIDTH,
  LINK_COLOR,
  NODE_FILL_COLOR,
  STROKE_COLOR
} from "./misc/map-constants";
import { FollowPopover } from "@components/FollowPopover";
import {
  Badge,
  BadgeProps,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
  styled
} from "@mui/material";
import {
  calculatePLCircleCentersAndRadii,
  getProximityLevels
} from "./misc/pl-generator";
import { generateGraphData, cloneGraphData, linkWidth } from "./misc/map-utils";
import { MapLink, MapNode } from "./node.model";
import { AutOsButton } from "@components/AutButton";
import { AutInteractionsDialog } from "@components/AutInteractionsDialog";
import { useAppDispatch } from "@store/store.model";
import { setOpenInteractions } from "@store/ui-reducer";
import { useSelector } from "react-redux";
import { AdddInteractions } from "@store/interactions/interactions.reducer";
import jabyl from "@assets/aut-team-avatars/jabyl.png";
import { interactionsMock } from "./misc/mock";
import { useAccount } from "wagmi";
import { IsConnected } from "@auth/auth.reducer";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0"
  }
}));

function InteractionMap({ parentRef: containerRef, isActive }) {
  const fgRef = useRef<ForceGraphMethods>();
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [highlightedPl, setHighlightedPl] = useState(null);
  const [pLevels, setProximityLevels] = useState([]);
  const [initialGraphData, setInitialGraphData] = useState<
    GraphData<MapNode, LinkObject<MapNode, MapLink>>
  >({
    nodes: [],
    links: []
  });
  const [graphData, setGraphData] = useState<
    GraphData<MapNode, LinkObject<MapNode, MapLink>>
  >({
    nodes: [],
    links: []
  });
  const [isDragging, setIsDragging] = useState(false);
  const { address } = useAccount();

  const dispatch = useAppDispatch();
  const { openInteractions } = useSelector((state: any) => state.ui);
  const addedInteractions = useSelector(AdddInteractions);
  const isConnected = useSelector(IsConnected);

  const handleClose = () => {
    dispatch(setOpenInteractions(false));
  };

  const openInteractionsModal = () => {
    dispatch(setOpenInteractions(true));
  };

  const onRenderFramePre = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const circleData = calculatePLCircleCentersAndRadii(graphData.nodes);

      Object.values(circleData).forEach((circle: any) => {
        ctx.beginPath();
        ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle =
          circle?.pl === highlightedPl
            ? "rgba(54, 191, 250, 1)"
            : "rgba(54, 191, 250, 0.3)";
        ctx.lineWidth = circle?.pl === highlightedPl ? 1 : 0.5;
        ctx.stroke();
      });
    },
    [highlightedPl]
  );

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    }
    if (containerRef.current) {
      updateSize();
    }
  }, [containerRef]);

  useEffect(() => {
    if (addedInteractions?.length) {
      const newuser = {
        owner: "ownerE",
        username: "jabyl",
        avatar: jabyl,
        commitment: 10,
        role: 2,
        interactions: JSON.parse(JSON.stringify(interactionsMock))
      };
      const isNewCentralId =
        isConnected && address !== "0xa082eA7C6583517F4094C8FbbB71035c9C27C919";
      addedInteractions.forEach((_, index) => {
        newuser.interactions[index].status = "Complete";
      });

      const { proximityLevels, centralAutId } = getProximityLevels(
        newuser,
        isNewCentralId
      );
      const _graphData = generateGraphData(centralAutId, proximityLevels);
      setInitialGraphData(_graphData);
      setProximityLevels(proximityLevels);
      setGraphData(cloneGraphData(_graphData));
    } else {
      const { proximityLevels, centralAutId } = getProximityLevels(null, false);
      const _graphData = generateGraphData(centralAutId, proximityLevels);
      setInitialGraphData(_graphData);
      setGraphData(cloneGraphData(_graphData));
      setProximityLevels(proximityLevels);
    }
  }, [addedInteractions, address, isConnected]);

  const handleNodeHover = useCallback(
    (node: NodeObject<MapNode>) => {
      if (isDragging || !isActive) return;
      setShowPopover(!!node);
      if (!node) return;
      setHoveredNode(node);
      const bbox = fgRef.current.getGraphBbox((n) => n.id === node.id);

      const graphCenter = {
        x: (bbox.x[0] + bbox.x[1]) / 2,
        y: (bbox.y[0] + bbox.y[1]) / 2
      };

      const centerScreen = fgRef.current.graph2ScreenCoords(
        graphCenter.x,
        graphCenter.y
      );

      const containerRect = containerRef.current.getBoundingClientRect();

      const popoverX = centerScreen.x + containerRect.left;
      const popoverY = centerScreen.y + containerRect.top;

      setAnchorPos({ x: popoverX, y: popoverY + node.size });
    },
    [fgRef, containerRef, isDragging, isActive]
  );

  const handleNodeDrag = useCallback(() => {
    setIsDragging(true);
    setShowPopover(false);
  }, []);

  const handleNodeDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.d3Force(
      "collision",
      d3.forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
    );
  }, [fgRef]);

  const drawNode = useCallback(
    (node: NodeObject<MapNode>, ctx: CanvasRenderingContext2D) => {
      const size = node.size;
      const nodeOuterSize = size + NODE_PADDING * 2 + NODE_BORDER_WIDTH * 2;

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeOuterSize / 2, 0, Math.PI * 2, false);
      ctx.fillStyle = NODE_FILL_COLOR; // Use the lighter color for the fill
      ctx.fill();

      // Draw the circular image
      if (node.img && node.img.complete && node.img.naturalWidth !== 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          node.img,
          node.x - size / 2,
          node.y - size / 2,
          size,
          size
        );

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeOuterSize / 2, 0, Math.PI * 2, false);
      ctx.lineWidth = NODE_BORDER_WIDTH;
      ctx.strokeStyle = STROKE_COLOR;
      ctx.stroke();
    },
    []
  );

  const getNovaInfoByPl = (level: number): any => {
    return pLevels.find((pl) => pl.level === level)?.members[0].nova || {};
  };

  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        onRenderFramePre={onRenderFramePre}
        onEngineStop={() => fgRef.current.zoomToFit(300)}
        nodeVal={(node: NodeObject<MapNode>) =>
          node.size + NODE_BORDER_WIDTH * 2
        }
        nodeLabel={() => null}
        linkColor={() => LINK_COLOR}
        onNodeHover={handleNodeHover}
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={() => {
          handleNodeDragEnd();
          setGraphData(cloneGraphData(initialGraphData));
        }}
        linkWidth={linkWidth}
        nodeCanvasObject={drawNode}
        linkDirectionalParticles={0.5}
        linkDirectionalParticleWidth={3}
        d3VelocityDecay={1}
        cooldownTicks={0}
        // enableZoomInteraction={false}
      />
      <AutInteractionsDialog
        open={openInteractions}
        title="Interactions"
        onClose={handleClose}
      />
      <FollowPopover
        type="custom"
        anchorPos={anchorPos}
        data={hoveredNode}
        open={showPopover && !isDragging && isActive}
      />
      <Box
        sx={{
          borderRadius: "8px",
          overflow: "hidden",
          position: "absolute",
          minWidth: "200px",
          top: "0",
          right: "0",
          boxShadow: 2,
          background: "rgba(240, 245, 255, 0.05)",
          backdropFilter: "blur(12px)",
          zIndex: 10
        }}
      >
        <List
          sx={{
            py: 0
          }}
        >
          {pLevels.map(({ level, name, description, members }) => {
            const novaInfo = getNovaInfoByPl(level);
            return (
              <ListItem
                key={`pl-${level}`}
                disablePadding
                onMouseEnter={() => setHighlightedPl(level)}
                onMouseLeave={() => setHighlightedPl(null)}
              >
                <ListItemButton
                  sx={{
                    pt: 0
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      sx: {
                        display: "flex"
                      }
                    }}
                    primary={
                      <>
                        <StyledBadge
                          badgeContent={
                            <Tooltip title={description}>
                              <HelpOutlineIcon
                                color="primary"
                                sx={{ width: "12px", ml: 1 }}
                              />
                            </Tooltip>
                          }
                        >
                          <Typography
                            color="white"
                            textAlign="center"
                            variant="subtitle2"
                          >
                            {name}
                          </Typography>
                        </StyledBadge>
                      </>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center"
                          }}
                          variant="caption"
                          display="block"
                          color="white"
                        >
                          <PublicIcon
                            sx={{
                              fontSize: "12px",
                              mr: 0.5
                            }}
                          />
                          Market: {novaInfo?.market || "N/A"}
                        </Typography>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center"
                          }}
                          variant="caption"
                          display="block"
                          color="white"
                        >
                          <PeopleIcon
                            sx={{
                              fontSize: "12px",
                              mr: 0.5
                            }}
                          />
                          Members: {members?.length || 0}
                        </Typography>
                        {/* <Typography variant="caption" display="block">
                            <BadgeIcon fontSize="small" color="secondary" />
                            Roles: {novaInfo?.roles.join(", ") || "None"}
                          </Typography> */}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pb: 1
          }}
        >
          <AutOsButton
            onClick={openInteractionsModal}
            type="button"
            color="primary"
            size="small"
            variant="outlined"
          >
            <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
              View Interactions
            </Typography>
          </AutOsButton>
        </Box>
      </Box>
    </>
  );
}

export default InteractionMap;
