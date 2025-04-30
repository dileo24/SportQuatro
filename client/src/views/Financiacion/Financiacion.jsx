import React, { useEffect } from "react";
import Novedades from "../../components/Novedades/Novedades";
import { Box, Typography, Grid, Container, Divider } from "@mui/material";
import heroFinanciacion from "../../assets/hero_financiacion.jpg";
import img1Finan from "../../assets/img1_finan.jpg";
import img2Finan from "../../assets/img2_finan.jpg";
import img3Finan from "../../assets/img3_finan.jpg";
import hsbcLogo from "../../assets/hsbc_logo.png";
import colLogo from "../../assets/col_logo.png";
import galLogo from "../../assets/gal_logo.png";
import srLogo from "../../assets/sr_logo.png";
import svLogo from "../../assets/sv_logo.png";

export default function Financiacion() {
	useEffect(() => {
		localStorage.removeItem("catalogoCurrentPage");
		localStorage.removeItem("catalogoFilters");
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<Box sx={{ overflowX: "hidden" }}>
			<Box
				sx={{
					backgroundImage: `url(${heroFinanciacion})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "60vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					position: "relative",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0,0,0,0.5)",
					},
					color: "rgba(255, 0, 0, 0.925)",
					textShadow: "3px 3px 3px rgba(0, 0, 0, 0.329)",
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
					Financiación a tu medida
				</Typography>
				<Typography
					variant="h5"
					sx={{
						position: "relative",
						zIndex: 1,
						maxWidth: "800px",
						color: "white",
						px: 2,
					}}
				>
					Soluciones crediticias simples y accesibles para que puedas adquirir
					tu vehículo soñado
				</Typography>
			</Box>

			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Grid container spacing={6} alignItems="center" sx={{ mb: 6 }}>
					<Grid item xs={12} md={6}>
						<Typography variant="h4" paragraph sx={{ fontWeight: "bold" }}>
							Créditos Prendarios
						</Typography>
						<br />
						<Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
							En Sportquatro entendemos que cada cliente tiene necesidades
							financieras diferentes. Por eso hemos diseñado un sistema de
							créditos prendarios que se adapta a tu situación particular, con
							condiciones claras y trámites simplificados.
						</Typography>
						<br />

						<Box component="ul" sx={{ pl: 3, mb: 3 }}>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Solo necesitás tu DNI para iniciar el trámite
							</Typography>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Entrega inmediata del vehículo una vez aprobado
							</Typography>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								No es necesario estar bancarizado
							</Typography>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Todos los trámites se realizan y firman directamente en nuestra
								agencia
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							component="img"
							src={img1Finan}
							alt="Financiación de autos"
							sx={{
								width: "100%",
								borderRadius: 2,
								boxShadow: 3,
								maxHeight: "400px",
								objectFit: "cover",
							}}
						/>
					</Grid>
				</Grid>

				<Grid container spacing={6} alignItems="center" sx={{ mb: 6 }}>
					<Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
						<Box
							component="img"
							src={img2Finan}
							alt="Opciones de crédito"
							sx={{
								width: "100%",
								borderRadius: 2,
								boxShadow: 3,
								maxHeight: "400px",
								objectFit: "cover",
							}}
						/>
					</Grid>
					<Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
						<Typography variant="h4" paragraph sx={{ fontWeight: "bold" }}>
							Nuestras opciones de crédito
						</Typography>{" "}
						<br />
						<Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
							Trabajamos con múltiples alternativas financieras para que
							encuentres el plan que mejor se ajuste a tus posibilidades.
							Nuestros asesores te guiarán en todo el proceso para que tomes la
							mejor decisión.
						</Typography>
						<br />
						<Box component="ul" sx={{ pl: 3 }}>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Financiación exclusiva hasta el 80% del valor (según la unidad).
							</Typography>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Créditos en UVAs o tasas fijas en pesos.
							</Typography>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Plazos flexibles: 12, 24, 36, 48 o 60 cuotas.
							</Typography>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Aceptamos tu usado como parte de pago (consultar).
							</Typography>
							<Typography component="li" paragraph sx={{ fontSize: "1.1rem" }}>
								Sin requisitos de garantes ni recibo de sueldo.
							</Typography>
						</Box>
					</Grid>
				</Grid>

				{/* Nueva sección: Trabajamos con bancos */}
				<Box sx={{ py: 8, backgroundColor: "#f5f5f5", borderRadius: 2, mb: 6 }}>
					<Container maxWidth="lg">
						<Typography
							variant="h3"
							component="h2"
							align="center"
							sx={{
								fontWeight: "bold",
								mb: 6,
								color: "rgba(255, 0, 0, 0.925)",
								textShadow: "3px 3px 3px rgba(0, 0, 0, 0.329)",
							}}
						>
							Trabajamos con los bancos de tu confianza
						</Typography>

						<Grid
							container
							spacing={4}
							justifyContent="center"
							alignItems="center"
						>
							{[
								{ logo: hsbcLogo, name: "HSBC" },
								{ logo: colLogo, name: "Columbia" },
								{ logo: galLogo, name: "Galicia" },
								{ logo: srLogo, name: "Santander Río" },
								{ logo: svLogo, name: "Supervielle" },
							].map((bank, index) => (
								<Grid item xs={6} sm={4} md={2.4} key={index}>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											p: 2,
										}}
									>
										<Box
											component="img"
											src={bank.logo}
											alt={bank.name}
											sx={{
												height: { xs: 60, md: 80 },
												width: "auto",
												maxWidth: "100%",
												objectFit: "contain",
												filter: "grayscale(30%)",
												transition: "all 0.3s ease",
												"&:hover": {
													filter: "grayscale(0%)",
													transform: "scale(1.1)",
												},
											}}
										/>
										<Typography variant="body1" sx={{ mt: 2 }}>
											{bank.name}
										</Typography>
									</Box>
								</Grid>
							))}
						</Grid>
					</Container>
				</Box>

				<Box sx={{ py: 8, backgroundColor: "#f9f9f9", borderRadius: 2, mt: 6 }}>
					<Container maxWidth="lg">
						<Typography
							variant="h3"
							component="h2"
							align="center"
							sx={{
								fontWeight: "bold",
								mb: 3,
								color: "rgba(255, 0, 0, 0.925)",
								textShadow: "3px 3px 3px rgba(0, 0, 0, 0.329)",
							}}
						>
							Simulador de cuotas
						</Typography>

						<Divider sx={{ mb: 6 }} />

						<Grid container spacing={4} alignItems="center">
							<Grid item xs={12} md={6}>
								<Typography
									variant="body1"
									paragraph
									sx={{ fontSize: "1.1rem" }}
								>
									¿Querés saber cuánto pagarías por el auto de tus sueños?
									Nuestro simulador te permite calcular cuotas estimativas en el
									momento, sin compromiso.
								</Typography>
								<Typography
									variant="body1"
									paragraph
									sx={{ fontSize: "1.1rem" }}
								>
									Indícanos cómo tenés pensado realizar la operación (monto
									inicial, plazo deseado, etc.) y nuestros asesores te
									prepararán una simulación personalizada el mismo día, con
									todas las opciones disponibles.
								</Typography>
								<Typography
									variant="body1"
									paragraph
									sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
								>
									¡Contactanos y llevate tu auto hoy mismo con un plan de pago a
									tu medida!
								</Typography>
							</Grid>

							<Grid item xs={12} md={6}>
								<Box
									component="img"
									src={img3Finan}
									alt="Simulador de cuotas"
									sx={{
										width: "100%",
										borderRadius: 2,
										boxShadow: 3,
										maxHeight: "400px",
										objectFit: "cover",
									}}
								/>
							</Grid>
						</Grid>
					</Container>
				</Box>
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
						¡Modelos con planes de financiación especial!
					</Typography>
					<Novedades />
				</Container>
			</Box>
		</Box>
	);
}
