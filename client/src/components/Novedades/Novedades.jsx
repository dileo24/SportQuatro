import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Card from "../Card/Card";
import { getAutosDestacados } from "../../services/autos.service";

export default function Novedades() {
	const [autos, setAutos] = useState([]);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		handleAutos();
	}, []);

	async function handleAutos() {
		try {
			const data = await getAutosDestacados();
			setAutos(data.resp);
		} catch (error) {
			console.error("Error al obtener autos:", error);
		}
	}

	return (
		<Box
			sx={{
				mt: isMobile ? "30px" : "70px",
				padding: isMobile ? "10px" : "20px",
				minHeight: "80vh",
				backgroundColor: "#f8f9fa",
			}}
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "repeat(1, 1fr)",
						sm: "repeat(2, 1fr)",
						md: "repeat(3, 1fr)",
					},
					gap: { xs: "15px", sm: "20px", md: "30px" },
					justifyItems: "center",
					maxWidth: "1200px",
					margin: "0 auto",
				}}
			>
				{autos &&
					autos.map((auto) => (
						<Box
							key={auto.id}
							sx={{
								transition: "transform 0.3s, box-shadow 0.3s",
								"&:hover": {
									transform: isMobile ? "none" : "scale(1.05)",
									boxShadow: isMobile
										? "none"
										: "0px 4px 20px rgba(0, 0, 0, 0.2)",
								},
							}}
						>
							<Card auto={auto} />
						</Box>
					))}
			</Box>
		</Box>
	);
}
