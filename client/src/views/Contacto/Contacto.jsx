import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Room } from "@mui/icons-material";
import { Container, Grid, Typography, Paper, Box } from "@mui/material";
import { paperStyles, socialLinks, linkStyles } from "../../data/info";
import heroContacto from "../../assets/hero_contacto.jpg";
import Novedades from "../../components/Novedades/Novedades";

export default function Contacto() {
	const API_KEY = import.meta.env.VITE_API_GOOGLE_MAPS;

	useEffect(() => {
		const loadGoogleMaps = () => {
			if (!window.google) {
				const script = document.createElement("script");
				script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
				script.async = true;
				script.defer = true;
				document.head.appendChild(script);
			} else {
				initMap();
			}
		};

		const initMap = () => {
			const location = { lat: -31.389060974121094, lng: -64.2093734741211 };
			const map = new window.google.maps.Map(document.getElementById("map"), {
				center: location,
				zoom: 15,
			});
			new window.google.maps.Marker({
				position: location,
				map: map,
				title: "SportQuatro",
			});
		};

		window.initMap = initMap;
		loadGoogleMaps();

		return () => {
			if (window.initMap) {
				delete window.initMap;
			}
		};
	}, []);

	return (
		<Box sx={{ overflowX: "hidden" }}>
			<Box
				sx={{
					backgroundImage: `url(${heroContacto})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "60vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					position: "relative",
					color: "rgba(255, 0, 0, 0.925)",
					textShadow: "3px 3px 3px rgba(0, 0, 0, 0.329)",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0,0,0,0.5)",
					},
				}}
			>
				<Typography
					variant="h3"
					component="h1"
					sx={{
						position: "relative",
						zIndex: 1,
						fontWeight: "bold",
						mb: 2,
						fontSize: { xs: "2rem", md: "3rem" },
					}}
				>
					¡Ponete en contacto!
				</Typography>
			</Box>

			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} md={3}>
						<Paper elevation={3} sx={paperStyles}>
							<Typography variant="body1" paragraph sx={{ fontWeight: "bold" }}>
								Dirección
							</Typography>
							<Typography
								variant="body1"
								sx={{ display: "flex", alignItems: "center", gap: 1 }}
							>
								<Room fontSize="small" />
								<Box
									component="a"
									href="https://maps.app.goo.gl/oir1AdmuN38tEz8V8"
									target="_blank"
									rel="noopener noreferrer"
									sx={{
										color: "inherit",
										textDecoration: "none",
										"&:hover": { textDecoration: "underline" },
										cursor: "pointer",
									}}
								>
									Av. Emilio Caraffa 2247
								</Box>
							</Typography>
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={paperStyles}>
							<Typography variant="body1" paragraph sx={{ fontWeight: "bold" }}>
								Horario
							</Typography>
							<Typography variant="body1" paragraph>
								Lunes a viernes de 9:00 a 13:00 y de 16:30 a 20:00
							</Typography>
							<Typography variant="body1">Sábados de 9:00 a 13:00</Typography>
						</Paper>
					</Grid>

					<Grid item xs={12} md={3}>
						<Paper elevation={3} sx={paperStyles}>
							<Typography variant="body1" paragraph sx={{ fontWeight: "bold" }}>
								Redes
							</Typography>
							<Box sx={{ display: "flex", gap: 3 }}>
								{socialLinks.map((social, index) => (
									<Box
										key={index}
										component="a"
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										sx={linkStyles}
									>
										<FontAwesomeIcon
											icon={social.icon}
											style={{ fontSize: "2rem", color: social.color }}
										/>
									</Box>
								))}
							</Box>
						</Paper>
					</Grid>
				</Grid>

				<Paper elevation={3}>
					<div
						id="map"
						style={{ height: "400px", width: "100%", borderRadius: "4px" }}
					/>
				</Paper>
			</Container>

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
		</Box>
	);
}
