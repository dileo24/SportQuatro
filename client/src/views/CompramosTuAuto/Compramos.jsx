import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Grid,
	Container,
	TextField,
	Button,
	Paper,
	CardMedia,
} from "@mui/material";
import heroNosotros from "../../assets/hero_nosotros.jpeg";
import imgCompramos from "../../assets/img_compramos.jpg";

export default function CompramosTuAuto() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		email: "",
		telefono: "",
		marca: "",
		modelo: "",
		año: "",
		kilometros: "",
		detalles: "",
	});

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (
			!formData.nombre ||
			!formData.email ||
			!formData.telefono ||
			!formData.marca ||
			!formData.modelo ||
			!formData.año ||
			!formData.kilometros
		) {
			alert("Por favor completa todos los campos obligatorios");
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/compramos-tu-auto`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();

			if (response.ok) {
				setFormData({
					nombre: "",
					email: "",
					telefono: "",
					marca: "",
					modelo: "",
					año: "",
					kilometros: "",
					detalles: "",
				});
			}
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
			alert(
				"Error de conexión con el servidor. Por favor intenta nuevamente más tarde."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

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
					Vende tu auto con nosotros
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
					Obtené el mejor precio y evitá complicaciones
				</Typography>
			</Box>

			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Grid container spacing={6} alignItems="stretch">
					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={{ p: 4, height: "100%" }}>
							<Typography
								variant="h4"
								gutterBottom
								sx={{ fontWeight: "bold", color: "error.main" }}
							>
								Completa el formulario
							</Typography>
							<Typography variant="body1" gutterBottom>
								Déjanos tus datos y nos pondremos en contacto para ofrecerte la
								mejor cotización.
							</Typography>

							<form onSubmit={handleSubmit}>
								<Grid container spacing={3} sx={{ mt: 1 }}>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Nombre completo"
											name="nombre"
											value={formData.nombre}
											onChange={handleChange}
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Email"
											name="email"
											type="email"
											value={formData.email}
											onChange={handleChange}
											required
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Teléfono/Celular"
											name="telefono"
											value={formData.telefono}
											onChange={handleChange}
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Marca del vehículo"
											name="marca"
											value={formData.marca}
											onChange={handleChange}
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Modelo"
											name="modelo"
											value={formData.modelo}
											onChange={handleChange}
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Año"
											name="año"
											type="number"
											value={formData.año}
											onChange={handleChange}
											inputProps={{
												min: "1950",
												max: new Date().getFullYear() + 1,
											}}
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Kilómetros"
											name="kilometros"
											type="number"
											value={formData.kilometros}
											onChange={handleChange}
											required
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Detalles adicionales"
											name="detalles"
											value={formData.detalles}
											onChange={handleChange}
											multiline
											rows={4}
										/>
									</Grid>
									<Grid item xs={12}>
										<Button
											type="submit"
											variant="contained"
											size="large"
											fullWidth
											sx={{ py: 1.5 }}
											disabled={isSubmitting}
										>
											{isSubmitting ? "Cotizando..." : "!Cotizar!"}
										</Button>
									</Grid>
								</Grid>
							</form>
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Box sx={{ height: "100%", display: "flex" }}>
							<CardMedia
								component="img"
								image={imgCompramos}
								alt="Vende tu auto con confianza"
								sx={{
									borderRadius: 2,
									width: "100%",
									objectFit: "cover",
									height: "100%",
								}}
							/>
						</Box>
					</Grid>
				</Grid>
			</Container>
			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Box sx={{ textAlign: "center", mb: 6  }}>
					<Typography
						variant="h3"
						component="h2"
						sx={{
							fontWeight: "bold",
							color: "error.main",
							mb: 3,
						}}
					>
						¿Por qué vender tu auto con nosotros?
					</Typography>
					<Typography
						variant="h6"
						sx={{
							maxWidth: "800px",
							margin: "0 auto",
							lineHeight: 1.6,
						}}
					>
						Ofrecemos transparencia, seguridad y el mejor precio.
						Nuestro equipo de expertos evaluará tu vehículo y te hará una oferta
						justa.
					</Typography>
				</Box>

				{/* <Grid container spacing={4}>
					<Grid item xs={12} md={6}>
						<Paper
							elevation={3}
							sx={{ p: 4, height: "100%", backgroundColor: "#fff8e1" }}
						>
							<Typography
								variant="h4"
								component="h3"
								sx={{
									fontWeight: "bold",
									color: "primary.main",
									mb: 3,
								}}
							>
								Evitá estafas al vender tu auto
							</Typography>

							<Box component="ul" sx={{ pl: 3 }}>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									Nunca des dinero por adelantado
								</Typography>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									Revisá la identidad del comprador
								</Typography>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									No firmes documentos sin leerlos
								</Typography>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									Realizá transacciones en lugares seguros
								</Typography>
								<Typography component="li" variant="body1">
									Verificá el pago antes de entregar el vehículo
								</Typography>
							</Box>
						</Paper>
					</Grid>

			
					<Grid item xs={12} md={6}>
						<Paper
							elevation={3}
							sx={{ p: 4, height: "100%", backgroundColor: "#f5f5f5" }}
						>
							<Typography
								variant="h4"
								component="h3"
								sx={{
									fontWeight: "bold",
									color: "primary.main",
									mb: 3,
								}}
							>
								Proceso de compra
							</Typography>

							<Box component="ol" sx={{ pl: 3 }}>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									Completá el formulario con los datos de tu vehículo
								</Typography>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									Uno de nuestros asesores se contactará contigo
								</Typography>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									Coordinamos una inspección del vehículo
								</Typography>
								<Typography component="li" variant="body1" sx={{ mb: 2 }}>
									Recibí una oferta formal por tu auto
								</Typography>
								<Typography component="li" variant="body1">
									Acuerdo de compra-venta y pago inmediato
								</Typography>
							</Box>
						</Paper>
					</Grid>
				</Grid> */}
			</Container>

			{/* FAQ Section */}
			<Box sx={{ py: 6, backgroundColor: "#f5f5f5" }}>
				<Container maxWidth="lg">
					<Typography
						variant="h4"
						align="center"
						sx={{
							fontWeight: "bold",
							mb: 4,
							color: "rgba(255, 0, 0, 0.925)",
							textShadow: "3px 3px 3px rgba(0, 0, 0, 0.329)",
						}}
					>
						Preguntas frecuentes
					</Typography>

					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
								¿Cómo determinar el precio?
							</Typography>
							<Typography variant="body1" paragraph>
								Evaluamos el estado general del vehículo, kilometraje, año,
								modelo, demanda en el mercado y comparamos con valores actuales.
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
								¿Necesito tener toda la documentación?
							</Typography>
							<Typography variant="body1" paragraph>
							Si, es importante que cuentes con toda la documentación en regla para agilizar el proceso.
							En caso de que falte alguna documentación (08, verificación, informe de dominio, libre de deuda)
							se deja pago y nos encargamos, para agilizar la operación. No recibimos autos prendados, ni planes de ahorro.
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
								¿Cuánto tiempo tarda el proceso?
							</Typography>
							<Typography variant="body1" paragraph>
							Una vez que recibimos tu solicitud, nos contactamos dentro de las 24 horas.
							Luego pactamos una reunión para realizarle un peritaje a tu vehículo y cerrar la operación.
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
								¿Qué métodos de pago aceptan?
							</Typography>
							<Typography variant="body1" paragraph>
								Ofrecemos transferencia bancaria inmediata, cheque certificado o
								efectivo, según prefieras y con todas las garantías de
								seguridad.
							</Typography>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
}
