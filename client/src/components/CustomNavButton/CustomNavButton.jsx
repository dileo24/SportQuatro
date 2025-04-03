import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function CustomNavButton({ direction, onClick }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        [direction === "left" ? "left" : "right"]: 16,
        top: "50%",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        borderRadius: "50%",
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          bgcolor: "white",
        },
        zIndex: 2,
      }}
    >
      {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  );
}
