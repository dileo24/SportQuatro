import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const DraggableImage = ({
	image,
	index,
	moveImage,
	onClick,
	isSelected,
	onRemove,
	isEditing,
	isAuthenticated,
}) => {
	const ref = React.useRef(null);
	console.log(image);

	const [{ isDragging }, drag] = useDrag({
		type: "IMAGE",
		item: { index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		canDrag: isEditing,
	});

	const [, drop] = useDrop({
		accept: "IMAGE",
		hover(item, monitor) {
			if (!ref.current || !isEditing) return;
			const dragIndex = item.index;
			const hoverIndex = index;

			if (dragIndex === hoverIndex) return;

			moveImage(dragIndex, hoverIndex);
			item.index = hoverIndex;
		},
	});

	drag(drop(ref));

	return (
		<Box
			ref={ref}
			onClick={() => onClick(index)}
			sx={{
				width: 80,
				height: 60,
				flexShrink: 0,
				cursor: isEditing ? "move" : "default",
				position: "relative",
				borderRadius: 1,
				overflow: "hidden",
				border: isSelected ? "2px solid #d21919" : "2px solid #ddd",
				transition: "all 0.2s ease-in-out",
				opacity: isDragging ? 0.5 : 1,
				"&:hover": {
					transform: isEditing ? "scale(1.05)" : "none",
				},
			}}
		>
			{isAuthenticated && isEditing && (
				<IconButton
					size="small"
					sx={{
						position: "absolute",
						top: 2,
						right: 2,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						color: "white",
						"&:hover": {
							backgroundColor: "rgba(0, 0, 0, 0.7)",
						},
						padding: 0.5,
					}}
					onClick={(e) => {
						e.stopPropagation();
						onRemove(index);
					}}
				>
					<Close fontSize="small" />
				</IconButton>
			)}
			<img
				src={image}
				alt={`Thumbnail ${index + 1}`}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
			/>
		</Box>
	);
};

export default DraggableImage;
