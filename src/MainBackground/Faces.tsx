/* eslint-disable max-len */
/* eslint-disable prefer-const */
import { FollowPopover } from "@components/FollowPopover";
import { Bubble } from "@components/UserBubbles";
import {
  motion,
  transform,
  useMotionValue,
  useScroll,
  useTransform
} from "framer-motion";
import { useEffect, useState } from "react";

const users = [
  {
    name: "Tao",
    avatar: "https://picsum.photos/200/300"
  },
  {
    name: "Jessica",
    avatar: "https://picsum.photos/300/300"
  },
  {
    name: "Daniel",
    avatar: "https://picsum.photos/200/200"
  },
  {
    name: "Selena",
    avatar: "https://picsum.photos/200/400"
  },
  {
    name: "Tom",
    avatar: "https://picsum.photos/200/250"
  },
  {
    name: "Angela",
    avatar: "https://picsum.photos/250/250"
  },
  {
    name: "Angela",
    avatar: "https://picsum.photos/250/260"
  },
  {
    name: "Angela",
    avatar: "https://picsum.photos/250/280"
  },
  {
    name: "Angela",
    avatar: "https://picsum.photos/250/270"
  }
];

const AvatarCircle = ({
  user,
  x,
  y,
  circleDimension,
  key,
  setPopoverEl
}: any) => {
  return (
    <foreignObject
      x={x - circleDimension / 2}
      y={y - circleDimension / 2}
      style={{
        width: `${circleDimension}px`,
        height: `${circleDimension}px`,
        overflow: "visible",
        cursor: "pointer"
      }}
    >
      <Bubble user={user} key={key} />
    </foreignObject>
  );
};

const Faces = ({ dimensions, setPopoverEl }: any) => {
  const designWidth = 1440;
  const designHeight = 800;

  const circleDimension = 64;

  // Calculate scale factors
  let scaleX = dimensions.width / designWidth;
  let scaleY = dimensions.height / designHeight;

  // Use the smaller scale factor to keep the aspect ratio
  let scale = Math.min(scaleX, scaleY);

  // Centre the design if the aspect ratios don't match
  let translateX = (dimensions.width - designWidth * scale) / 2;
  let translateY = (dimensions.height - designHeight * scale) / 2;
  return (
    <g
      transform={`translate(${translateX}, ${translateY}) scale(${scale},${scale})`}
    >
      {/* <circle
        cx={323}
        cy={361}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      /> */}
      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={331.5}
        y={359}
        circleDimension={circleDimension}
        user={users[0]}
        key="bubble1"
      />

      {/* <circle
        id="face-to-zoom"
        cx={1074}
        cy={744}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        strokeWidth={1.33}
      /> */}

      <circle
        cx={90}
        cy={451}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />

      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={90}
        y={451}
        circleDimension={circleDimension}
        user={users[1]}
        key="bubble2"
      />

      {/* 
      bottom empty circle, removed
      <circle
        cx={179}
        cy={814}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      /> */}
      <circle
        cx={160}
        cy={200}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />

      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={160}
        y={200}
        circleDimension={circleDimension}
        user={users[2]}
        key="bubble3"
      />

      <circle
        cx={302}
        cy={592.167}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />

      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={301}
        y={592.167}
        circleDimension={circleDimension}
        user={users[3]}
        key="bubble4"
      />

      <circle
        cx={510}
        cy={182}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />
      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={510}
        y={182}
        circleDimension={circleDimension}
        user={users[4]}
        key="bubble5"
      />
      <circle
        cx={946}
        id="face-to-zoom"
        cy={626}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />
      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={946}
        y={626}
        circleDimension={circleDimension}
        user={users[5]}
        key="bubble6"
      />

      <circle
        cx={1232}
        id="zoom-face"
        cy={454}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />
      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={1232}
        y={454}
        circleDimension={circleDimension}
        user={users[6]}
        key="bubble7"
      />
      <circle
        id="face-to-zoom"
        cx={1357}
        cy={92}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />
      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={1357}
        y={92}
        circleDimension={circleDimension}
        user={users[7]}
        key="bubble8"
      />
      <circle
        cx={873}
        cy={88}
        r={25.335}
        fill="black"
        fillOpacity={0.01}
        stroke="#F0F5FF"
        strokeWidth={1.33}
      />
      <AvatarCircle
        setPopoverEl={setPopoverEl}
        x={873}
        y={88}
        circleDimension={circleDimension}
        user={users[8]}
        key="bubble9"
      />
    </g>
  );
};

export default Faces;
