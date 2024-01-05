import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, {
  NodeObject,
  ForceGraphMethods,
  GraphData
} from "react-force-graph-2d";
import {
  cloneGraphData,
  generateGraphData,
  getProximityLevels,
  linkWidth
} from "./utils";
import * as d3 from "d3-force";

import {
  NODE_PADDING,
  NODE_BORDER_WIDTH,
  LINK_COLOR,
  NODE_FILL_COLOR
} from "./map-constants";
import { FollowPopover } from "@components/FollowPopover";

const { plValues, centralAutId } = getProximityLevels();
const _graphData = generateGraphData(centralAutId, plValues);

function InteractionMap({ parentRef: containerRef }) {
  const fgRef = useRef<ForceGraphMethods>();
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [graphData, setGraphData] = useState<GraphData>(
    cloneGraphData(_graphData)
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

    // const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      //   resizeObserver.observe(containerRef.current);
      updateSize();
    }

    // return () => resizeObserver.disconnect();
  }, [containerRef]);

  const handleNodeHover = useCallback(
    (node: NodeObject) => {
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

      setAnchorPos({ x: popoverX, y: popoverY });
    },
    [fgRef, containerRef]
  );

  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.d3Force(
      "collision",
      d3.forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
    );
  }, [fgRef]);

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D) => {
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

      // Draw the border with padding
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeOuterSize / 2, 0, Math.PI * 2, false);
      ctx.lineWidth = NODE_BORDER_WIDTH;
      ctx.strokeStyle = "#36BFFA";
      ctx.stroke();
    },
    []
  );

  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        onNodeDragEnd={() => setGraphData(cloneGraphData(_graphData))}
        onEngineStop={() => fgRef.current.zoomToFit(300)}
        nodeVal={(node: NodeObject) => node.size + NODE_BORDER_WIDTH * 2}
        nodeLabel={() => null}
        linkColor={() => LINK_COLOR}
        onNodeHover={handleNodeHover}
        linkWidth={linkWidth}
        nodeCanvasObject={drawNode}
        linkDirectionalParticles={0.5}
        linkDirectionalParticleWidth={3}
        d3VelocityDecay={1}
        cooldownTicks={0}
        enableZoomInteraction={false}
      />
      <FollowPopover
        type="custom"
        anchorPos={anchorPos}
        data={hoveredNode}
        open={showPopover}
      />
    </>
  );
}

export default InteractionMap;
