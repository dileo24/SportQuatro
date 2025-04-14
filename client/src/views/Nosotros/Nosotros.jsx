import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Grid,
	Container,
	Divider,
	IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Novedades from "../../components/Novedades/Novedades";
import img1Nosotros from "../../assets/img1_nosotros.jpg";
import img2Nosotros from "../../assets/img2_nosotros.jpeg";
import heroNosotros from "../../assets/hero_nosotros.jpeg";
import img4Nosotros from "../../assets/img4_nosotros.jpg";
import { useAuth } from "../../context/AuthContext";

export default function Nosotros() {
	const [carouselImages, setCarouselImages] = useState([]);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		fetchCarouselImages();
	}, []);

	useEffect(() => {
		if (carouselImages.length <= 1) return;

		const interval = setInterval(() => {
			setSelectedImageIndex((prevIndex) =>
				prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
			);
		}, 3000);

		return () => clearInterval(interval);
	}, [carouselImages.length]);

	const fetchCarouselImages = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/files/carousel`
			);
			const data = await response.json();
			if (data.resp) {
				setCarouselImages(data.files);
			}
		} catch (error) {
			console.error("Error fetching carousel images:", error);
		}
	};

	const handleImageUpload = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/files/carousel`,
				{
					method: "POST",
					body: formData,
				}
			);
			const data = await response.json();

			if (data.resp) {
				await fetchCarouselImages();
				if (carouselImages.length === 0) {
					setSelectedImageIndex(0);
				}
			} else {
				alert(data.message || "Error al cargar imágenes");
			}
		} catch (error) {
			console.error("Error uploading images:", error);
			alert("Error al cargar imágenes");
		}
	};

	const handleRemoveImage = async (fileName) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/files/carousel/${encodeURIComponent(
					fileName
				)}`,
				{
					method: "DELETE",
				}
			);
			const data = await response.json();

			if (data.resp) {
				await fetchCarouselImages();
				setSelectedImageIndex((prevIndex) => {
					if (prevIndex >= carouselImages.length - 1) {
						return carouselImages.length - 2 >= 0
							? carouselImages.length - 2
							: 0;
					}
					return prevIndex;
				});
			} else {
				alert(data.message || "Error al eliminar imagen");
			}
		} catch (error) {
			console.error("Error deleting image:", error);
			alert("Error al eliminar imagen");
		}
	};

	const handleThumbnailClick = (index) => {
		setSelectedImageIndex(index);
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
					Un auto para tu calidad de vida.
				</Typography>
			</Box>

			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Grid container spacing={6} alignItems="center" sx={{ mb: 6 }}>
					<Grid item xs={12} md={6}>
						<Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
							Desde el año 2010 nos encontramos ubicados en la localidad de
							Córdoba capital calle Avenida Caraffa 2247. Tenemos más de 20 años
							de trayectoria y experiencia en el rubro. Luego de mucho esfuerzo
							y dedicación en el año 2022 abrimos nuestras puertas a un segundo
							local, en Avenida Caraffa 2378.
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
							Ofrecemos servicio de gestoría general para que te lleves tu nuevo
							vehículo sin preocupaciones y listo para utilizarlo. Para nosotros
							la opinión de nuestros clientes es muy importante para así seguir
							mejorando en un futuro.
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
							sx={{
								width: "100%",
								height: 400,
								borderRadius: 2,
								boxShadow: 3,
								overflow: "hidden",
								position: "relative",
							}}
						>
							{carouselImages.length > 0 ? (
								<img
									src={carouselImages[selectedImageIndex].url}
									alt={`Consignación ${selectedImageIndex + 1}`}
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
										transition: "opacity 0.5s ease-in-out",
									}}
								/>
							) : (
								<Box
									sx={{
										width: "100%",
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "#eee",
									}}
								>
									<Typography variant="body1">
										No hay imágenes cargadas
									</Typography>
								</Box>
							)}
						</Box>

						{isAuthenticated && (
							<>
								<Box
									sx={{
										display: "flex",
										gap: 2,
										mt: 2,
										overflowX: "auto",
										py: 1,
									}}
								>
									{carouselImages.map((image, index) => (
										<Box
											key={index}
											onClick={() => handleThumbnailClick(index)}
											sx={{
												width: 80,
												height: 60,
												flexShrink: 0,
												cursor: "pointer",
												position: "relative",
												borderRadius: 1,
												overflow: "hidden",
												border:
													index === selectedImageIndex
														? "2px solid #d21919"
														: "2px solid #ddd",
												transition: "all 0.2s ease-in-out",
												"&:hover": {
													transform: "scale(1.05)",
												},
											}}
										>
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
													handleRemoveImage(image.id || image.fileName);
												}}
											>
												<Close fontSize="small" />
											</IconButton>
											<img
												src={image.url}
												alt={`Thumbnail ${index + 1}`}
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
										</Box>
									))}
								</Box>

								<Box sx={{ mt: 2 }}>
									<input
										accept="image/*"
										id="upload-images"
										type="file"
										multiple
										onChange={handleImageUpload}
										style={{ display: "none" }}
										disabled={carouselImages.length >= 10}
									/>
									<label htmlFor="upload-images">
										<Box
											sx={{
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
												padding: "8px 16px",
												backgroundColor:
													carouselImages.length >= 10 ? "#ccc" : "#d21919",
												color: "white",
												borderRadius: 1,
												cursor:
													carouselImages.length >= 10
														? "not-allowed"
														: "pointer",
												"&:hover": {
													backgroundColor:
														carouselImages.length >= 10 ? "#ccc" : "#b31515",
												},
											}}
										>
											<Typography variant="body2">
												{carouselImages.length >= 10
													? "Máximo de imágenes alcanzado (10/10)"
													: `Cargar imágenes (${carouselImages.length}/10)`}
											</Typography>
										</Box>
									</label>
								</Box>
							</>
						)}
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
							Consignaciones
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
										¡Vende tu auto sin preocupaciones con nosotros!
									</Typography>

									<Box component="ul" sx={{ pl: 3, mb: 3, mt: 2 }}>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Trasferencia inmediata al momento de la venta.
										</Typography>
										<Typography
											component="li"
											paragraph
											sx={{ fontSize: "1.1rem" }}
										>
											Venta asegurada plazo 60 días.
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
											Alistaje de detalles por cuenta del titular.
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
											Publicamos su auto en nuestras redes oficiales.
										</Typography>
									</Box>
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
