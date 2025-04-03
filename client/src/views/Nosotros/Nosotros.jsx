import React, { useEffect } from "react";
import Novedades from "../../components/Novedades/Novedades";
import { Box, Typography, Grid, Container, Divider } from "@mui/material";
import heroNosotros from "../../assets/hero_nosotros.jpeg";
import img1Nosotros from "../../assets/img1_nosotros.jpg";
import img2Nosotros from "../../assets/img2_nosotros.jpeg";
import img3Nosotros from "../../assets/img3_nosotros.jpeg";
import img4Nosotros from "../../assets/img4_nosotros.jpg";

export default function Nosotros() {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);
	return (
		<Box sx={{ overflowX: "hidden" }}>
			<Box
				sx={{
					backgroundImage: `url(${heroNosotros})`,
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
					Un auto para tu calidad de vida.
				</Typography>
			</Box>

			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Grid container spacing={6} alignItems="center" sx={{ mb: 6 }}>
					<Grid item xs={12} md={6}>
						<Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
							Desde el año 2010 nos encontramos ubicados en la localidad de
							Córdoba capital calle avenida Caraffa 2247. Tenemos más de 20 años
							de trayectoria y experiencia en el rubro. Luego de mucho esfuerzo
							y dedicación en el año 2022 abrimos nuestras puertas a un segundo
							local, en avenida Caraffa 2378.
						</Typography>
						<Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
							En Sportquatro sabemos la importancia que es comprar un vehículo
							usado, por esto tenemos una línea de los mejores vehículos
							seleccionados para que te puedas llevar la mejor experiencia.
							Además, contamos con disponibilidad de vehículos 0km de varias
							marcas.
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							component="img"
							src={img1Nosotros}
							alt="Local SportQuatro"
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
							src={img2Nosotros}
							alt="Vehículos SportQuatro"
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
						<Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
							Ofrecemos servicio de gestoría propia y seguros en varias
							compañías, para que te lleves tu nuevo vehículo sin preocupaciones
							y listo para utilizarlo. Para nosotros la opinión de nuestros
							clientes es muy importante para así seguir mejorando en un futuro.
						</Typography>
					</Grid>
				</Grid>

				<Grid container spacing={6} alignItems="center" sx={{ mb: 6 }}>
					<Grid item xs={12} md={6}>
						<Typography variant="h4" paragraph sx={{ fontWeight: "bold" }}>
							Pasión por los autos, elegimos lo mejor, tenés lo mejor.
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							component="img"
							src={img3Nosotros}
							alt="Equipo SportQuatro"
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

				<Box sx={{ py: 8, backgroundColor: "#f9f9f9", mt: 6 }}>
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
							Facilidades
						</Typography>

						<Typography
							variant="h5"
							component="p"
							align="center"
							sx={{
								mb: 4,
								fontStyle: "italic",
							}}
						>
							No solo vendemos autos...
						</Typography>

						<Divider sx={{ mb: 6 }} />

						<Grid container spacing={4}>
							<Grid item xs={12} md={6}>
								<Box
									component="img"
									src={img4Nosotros}
									alt="Local SportQuatro"
									sx={{
										width: "100%",
										borderRadius: 2,
										boxShadow: 3,
										maxHeight: "400px",
										objectFit: "cover",
									}}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<Box
									sx={{
										p: 4,
										backgroundColor: "white",
										borderRadius: 2,
										boxShadow: 3,
										height: "98.5%",
									}}
								>
									<Typography
										variant="body1"
										paragraph
										sx={{ fontSize: "1.1rem" }}
									>
										Poseemos financiación en varias entidades bancarias y
										ofrecemos cuotas fijas.
									</Typography>

									<Box component="ul" sx={{ pl: 3, mb: 3 }}>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Planes de 12, 24, 36, 48 y hasta 60 cuotas.
										</Typography>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Transferencia inmediata al momento de la venta.
										</Typography>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Alistaje del vehículo por cuenta de la agencia.
										</Typography>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Tomamos tu usado como parte de pago.
										</Typography>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Te adelantamos el 10% o 20% según la unidad.
										</Typography>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Venta asegurada plazo 60 días.
										</Typography>
									</Box>

									<Typography variant="body1" sx={{ fontStyle: "italic" }}>
										Te ayudamos a conseguir el auto de tus sueños.
									</Typography>
								</Box>
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
						¡Ingresos destactados!
					</Typography>
					<Novedades />
				</Container>
			</Box>
		</Box>
	);
}
