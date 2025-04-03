import React, { useEffect } from "react";
import "./Home.css";
import Novedades from "../../components/Novedades/Novedades";
import { NavLink } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

export default function Home() {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="home-container">
			<div className="hero-container">
				<div className="texto">
					<p className="texto1">
						Pasá a modo
						<br />
						SPORT
					</p>
					<p className="texto2">Agencia de seleccionados en Córdoba capital</p>
				</div>

				<div className="imgDivContainer">
					<div className="imgDiv"></div>
				</div>
			</div>
			<div className="button-container">
				<NavLink className="NavLink" to={`/catalogo`}>
					VER CATÁLOGO
				</NavLink>
			</div>

			<Box sx={{ py: 6, backgroundColor: "#f5f5f5" }}>
				<Container maxWidth="lg">
					<Typography
						variant="h4"
						align="center"
						sx={{
							fontWeight: "bold",
							mb: 2,
							color: "rgba(255, 0, 0, 0.925)",
							textShadow: "3px 3px 3px rgba(0, 0, 0, 0.329)",
						}}
					>
						Novedades
					</Typography>
					<Typography variant="h6" align="center" sx={{ mb: 4 }}>
						¡Ingresos destactados!
					</Typography>
					<Novedades />
				</Container>
			</Box>
		</div>
	);
}
