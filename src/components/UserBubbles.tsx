import { Box } from "@mui/material";
import theme from "@theme/theme";
import { useRef, useState } from "react";
import { FollowPopover } from "./FollowPopover";

export const Bubble = ({ user, setPopoverEl }) => {
  const [showPopover, setShowPopover] = useState(false);
  console.log("showPopover: ", showPopover);
  const ref = useRef();

  return (
    <Box
      ref={ref}
      sx={{
        willChange: "transform"
      }}
    >
      <img
        src={user?.avatar}
        onMouseEnter={() => setPopoverEl(ref.current)}
        onMouseLeave={() => setPopoverEl(null)}
        style={{
          cursor: "pointer",
          borderRadius: "50%",
          width: `64px`,
          height: `64px`,
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.00) 100%)",
          boxShadow:
            // eslint-disable-next-line max-len
            `0px 16px 80px 0px ${theme.palette.primary.main}, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)`,
          backdropFilter: "blur(8px)"
        }}
        draggable="false"
        alt="Profile"
      />
    </Box>
  );
};

// const UserBubbles = ({ users }) => {
//   const sizes = [180, 90, 100, 90, 60, 150]; // size of bubbles
//   const positions = [
//     // positions of bubbles
//     { top: 15, left: 75 }, // left top corner
//     { top: 70, left: 85 }, // middle top
//     { top: 80, left: 70 }, // right top corner
//     { top: 70, left: 5 }, // left middle
//     { top: 85, left: 15 }, // left middle
//     { top: 25, left: 10 } // right middle
//   ];

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100%",
//         position: "absolute"
//       }}
//     >
//       {users.map((user, index) => (
//         <Bubble user={user} key={index} />
//       ))}
//     </Box>
//   );
// };

// export default UserBubbles;
