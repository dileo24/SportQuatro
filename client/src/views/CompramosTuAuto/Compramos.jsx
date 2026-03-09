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
	MenuItem,
} from "@mui/material";
import heroCompramos from "../../assets/heroCompramos.webp";
import imgCompramos from "../../assets/img_compramos.jpeg";

export default function CompramosTuAuto() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		email: "",
		telefono: "",
		marca: "",
		modelo: "",
		transmision: "",
		año: "",
		kilometros: "",
		detalles: "",
	});

	useEffect(() => {
		localStorage.removeItem("catalogoCurrentPage");
		localStorage.removeItem("catalogoFilters");
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const handleChange = (e) => {
		const { name, value, selectionStart } = e.target;

		if (name === "kilometros") {
			const cursorPos = selectionStart;

			const rawValue = value.replace(/\./g, "");

			if (rawValue === "" || /^\d+$/.test(rawValue)) {
				const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

				setFormData(
					(prev) => ({
						...prev,
						[name]: formattedValue,
					}),
					() => {
						if (e.target) {
							const newCursorPos =
								cursorPos - (value.length - formattedValue.length);
							e.target.setSelectionRange(newCursorPos, newCursorPos);
						}
					}
				);
			}
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
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
			!formData.transmision ||
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
					transmision: "",
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
					backgroundImage: `url(${heroCompramos})`,
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
					¿Estás buscando otra opción y no está en el catálogo?
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
					Nos encargamos de conseguir el auto ideal para vos: rápido, seguro y con la mejor financiación
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
								Dejanos tus datos, el/los vehículos que estás buscando y nosotros nos contactaremos para ofrecerle las mejores opciones.
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
									<Grid item xs={12} sm={6}>
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
											label="Modelo y versión"
											name="modelo"
											value={formData.modelo}
											onChange={handleChange}
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										select
										label="Transmisión"
										name="transmision"
										value={formData.transmision}
										onChange={handleChange}
										required
									>
										<MenuItem value="Manual">Manual</MenuItem>
										<MenuItem value="Automática">Automática</MenuItem>
									</TextField>
									</Grid>
									<Grid item xs={6} sm={6}>
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
									<Grid item xs={6} sm={6}>
										<TextField
											fullWidth
											label="Kilómetros"
											name="kilometros"
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
								¿Cómo funciona la búsqueda del auto?
							</Typography>
							<Typography variant="body1" paragraph>
								Nos indicás la marca, modelo, año o características que estás buscando. Nuestro equipo revisa nuestra red de proveedores, concesionarias y particulares para encontrar las mejores opciones disponibles.
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
								¿Cuánto tarda encontrar un vehículo?
							</Typography>
							<Typography variant="body1" paragraph>
								Depende del modelo y la disponibilidad en el mercado. En muchos casos podemos ofrecer opciones dentro de las primeras 24 a 72 horas.
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
								¿Tiene algún costo la búsqueda?
							</Typography>
							<Typography variant="body1" paragraph>
								No. La búsqueda del vehículo es totalmente gratuita. Solo pagás en caso de avanzar con la compra del auto que elijas.
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
								¿Puedo financiar el vehículo que consigan?
							</Typography>
							<Typography variant="body1" paragraph>
								Sí. Trabajamos con distintas opciones de financiación para que puedas acceder al vehículo que buscás de la forma más conveniente.
							</Typography>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
}
