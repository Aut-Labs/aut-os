import { Box } from "@mui/material";

const Bubble = ({ size, top, left, user }) => (
  <Box
    sx={{
      willChange: "transform",
      transform: "translateY(-17.88px)",
      top: `${top}%`,
      left: `${left}%`,
      position: "absolute"
    }}
  >
    <img
      src={user?.avatar}
      style={{ borderRadius: "50%", width: `${size}px`, height: `${size}px` }}
      draggable="false"
      alt="Profile"
    />
  </Box>
);

const UserBubbles = ({ users }) => {
  console.log(users, "USERS");
  const sizes = [180, 90, 100, 90, 60, 150]; // size of bubbles
  const positions = [
    // positions of bubbles
    { top: 15, left: 75 }, // left top corner
    { top: 70, left: 85 }, // middle top
    { top: 80, left: 70 }, // right top corner
    { top: 70, left: 5 }, // left middle
    { top: 85, left: 15 }, // left middle
    { top: 25, left: 10 } // right middle
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute"
      }}
    >
      {users.map((user, index) => (
        <Bubble
          size={sizes[index]}
          top={positions[index].top}
          left={positions[index].left}
          user={user}
          key={index}
        />
      ))}
    </Box>
  );
};

export default UserBubbles;
