import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Card,
	CardContent,
	Typography,
	Grid,
	TextField,
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Box,
	IconButton,
	Alert,
	CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import {
	tiposCombustible,
	tiposTransmision,
	categoriaToCreate,
} from "../../data/filters";
import { useAuth } from "../../context/AuthContext";
import {
	postAuto,
	postImagen,
	updateImgInAuto,
} from "../../services/autos.service";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableImage from "../../components/DraggableImage/DraggableImage";


const MotionCard = motion(Card);
const MAX_IMAGES = 10;

export default function NuevoAuto() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		marca: "",
		modelo: "",
		motor: "",
		anio: "",
		km: "",
		transmision: "",
		combustible: "",
		moneda: "AR$",
		precio: "",
		destacar: false,
		oferta: false,
		precio_oferta: "",
		img: [],
		id_categ: [],
	});

	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [images, setImages] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);
	const [years, setYears] = useState([]);
	const [imageError, setImageError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	useEffect(() => {
		const currentYear = new Date().getFullYear();
		const yearsArray = [];
		for (let i = currentYear; i >= currentYear - 25; i--) {
			yearsArray.push(i);
		}
		setYears(yearsArray);
	}, []);
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name === "precio" || name === "precio_oferta" || name === "km") {
			const cleanValue = value.replace(/[^0-9.]/g, "");
			const numericValue = cleanValue.replace(/\./g, "");
			const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

			setFormData((prev) => ({
				...prev,
				[name]: formattedValue,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}
		if (submitError) setSubmitError(null);
	};

	const handleCategoryChange = (event) => {
		const {
			target: { value },
		} = event;
		setFormData((prev) => ({
			...prev,
			id_categ: typeof value === "string" ? value.split(",") : value,
		}));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		setImageError("");

		if (images.length + files.length > MAX_IMAGES) {
			setImageError(
				`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes. Inténtelo de nuevo.`
			);
			return;
		}

		setImages((prev) => [...prev, ...files]);

		const previews = files.map((file) => URL.createObjectURL(file));
		setImagePreviews((prev) => [...prev, ...previews]);
	};

	const handleRemoveImage = (index) => {
		const newImages = [...images];
		newImages.splice(index, 1);
		setImages(newImages);

		const newPreviews = [...imagePreviews];
		URL.revokeObjectURL(newPreviews[index]);
		newPreviews.splice(index, 1);
		setImagePreviews(newPreviews);
		setImageError("");
		
		if (selectedImageIndex === index) {
			setSelectedImageIndex(0);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitError(null);

		if (images.length === 0) {
			setImageError("Debes subir al menos una imagen");
			setIsSubmitting(false);
			return;
		}

		try {
			const autoResponse = await postAuto(formData);

			const autoId = autoResponse.data.id;

			const fileNamesArray = [];
			for (const [index, image] of images.entries()) {
				try {
					const formDataImg = new FormData();
					formDataImg.append("file", image);

					const uploadResponse = await postImagen(formDataImg);

					if (uploadResponse.data.fileName) {
						fileNamesArray.push(uploadResponse.data.fileName);
					}
				} catch (uploadError) {
					console.error(`Error subiendo imagen ${index + 1}:`, uploadError);
				}
			}

			if (fileNamesArray.length === 0) {
				throw new Error("No se pudo subir ninguna imagen");
			}

			await updateImgInAuto(autoId, fileNamesArray);

			navigate(`/detalle/${autoId}`);
		} catch (error) {
			console.error("Error en el proceso:", error);
			setSubmitError(
				error.response?.data?.message ||
					"Ocurrió un error al crear el auto. Por favor intenta nuevamente."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const filteredCombustible = tiposCombustible.filter(
		(opt) => opt.value !== ""
	);
	const filteredTransmision = tiposTransmision.filter(
		(opt) => opt.value !== ""
	);

	const handleThumbnailClick = (index) => {
		setSelectedImageIndex(index);
	};

	const moveImage = (fromIndex, toIndex) => {
		// Mover en images
		const updatedImages = [...images];
		const [movedImage] = updatedImages.splice(fromIndex, 1);
		updatedImages.splice(toIndex, 0, movedImage);
		setImages(updatedImages);
		
		// Mover en imagePreviews
		const updatedPreviews = [...imagePreviews];
		const [movedPreview] = updatedPreviews.splice(fromIndex, 1);
		updatedPreviews.splice(toIndex, 0, movedPreview);
		setImagePreviews(updatedPreviews);
		
		// Ajustar el índice seleccionado si es necesario
		if (selectedImageIndex === fromIndex) {
		  setSelectedImageIndex(toIndex);
		} else if (
		  (fromIndex < selectedImageIndex && toIndex >= selectedImageIndex) ||
		  (fromIndex > selectedImageIndex && toIndex <= selectedImageIndex)
		) {
		  setSelectedImageIndex(prev => prev + (fromIndex < toIndex ? -1 : 1));
		}
	  };

	return (
		<>
			{isAuthenticated && (
				<DndProvider backend={HTML5Backend}>
					<Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
						<MotionCard
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							sx={{
								borderRadius: 4,
								background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
								boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
								p: 4,
							}}
						>
							<form
								onSubmit={handleSubmit}
								style={{
									maxWidth: "100%",
									height: "100%",
									boxShadow: "none",
									padding: "0px",
									background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
								}}
							>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Typography variant="h5" component="h1" gutterBottom>
											Crear Nuevo Auto
										</Typography>
									</Grid>

									<Grid item xs={12} md={3}>
										<TextField
											autoComplete="off"
											label="Marca"
											name="marca"
											value={formData.marca}
											onChange={handleChange}
											fullWidth
											required
										/>
									</Grid>
									<Grid item xs={12} md={9}>
										<TextField
											autoComplete="off"
											label="Modelo"
											name="modelo"
											value={formData.modelo}
											onChange={handleChange}
											fullWidth
											required
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											autoComplete="off"
											label="Motor"
											name="motor"
											value={formData.motor}
											onChange={handleChange}
											fullWidth
											required
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<FormControl fullWidth required>
											<InputLabel>Año</InputLabel>
											<Select
												name="anio"
												value={formData.anio}
												onChange={handleChange}
												label="Año"
												MenuProps={{
													disableScrollLock: true,
												}}
											>
												{years.map((year) => (
													<MenuItem key={year} value={year}>
														{year}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											autoComplete="off"
											label="Kilometraje"
											name="km"
											value={formData.km}
											onChange={handleChange}
											fullWidth
											required
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<FormControl fullWidth required>
											<InputLabel>Categoría</InputLabel>
											<Select
												multiple
												name="id_categ"
												value={formData.id_categ}
												onChange={handleCategoryChange}
												label="Categoría"
												MenuProps={{
													disableScrollLock: true,
												}}
											>
												{categoriaToCreate.map((option) => (
													<MenuItem key={option.value} value={option.value}>
														{option.label}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} md={4}>
										<FormControl fullWidth required>
											<InputLabel>Transmisión</InputLabel>
											<Select
												name="transmision"
												value={formData.transmision}
												onChange={handleChange}
												label="Transmisión"
												MenuProps={{
													disableScrollLock: true,
												}}
											>
												{filteredTransmision.map((option) => (
													<MenuItem key={option.value} value={option.value}>
														{option.label}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} md={4}>
										<FormControl fullWidth required>
											<InputLabel>Combustible</InputLabel>
											<Select
												name="combustible"
												value={formData.combustible}
												onChange={handleChange}
												label="Combustible"
												MenuProps={{
													disableScrollLock: true,
												}}
											>
												{filteredCombustible.map((option) => (
													<MenuItem key={option.value} value={option.value}>
														{option.label}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} md={4}>
										<Box display="flex" alignItems="center">
											<TextField
												autoComplete="off"
												label="Precio"
												name="precio"
												value={formData.precio}
												onChange={handleChange}
												fullWidth
												required
											/>
											<FormControl sx={{ ml: 2, minWidth: 80 }}>
												<Select
													name="moneda"
													value={formData.moneda}
													onChange={handleChange}
													MenuProps={{
														disableScrollLock: true,
													}}
												>
													<MenuItem value="AR$">AR$</MenuItem>
													<MenuItem value="U$D">U$D</MenuItem>
												</Select>
											</FormControl>
										</Box>
									</Grid>
									<Grid item xs={12} md={6}>
										<FormControlLabel
											control={
												<Checkbox
													name="destacar"
													checked={formData.destacar}
													onChange={handleChange}
												/>
											}
											label="Destacar este vehículo"
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<Box display="flex" alignItems="center" gap={2}>
											<FormControlLabel
												control={
													<Checkbox
														name="oferta"
														checked={formData.oferta}
														onChange={handleChange}
													/>
												}
												label="En oferta"
											/>
											{formData.oferta && (
												<TextField
													autoComplete="off"
													label="Precio de oferta"
													name="precio_oferta"
													value={formData.precio_oferta}
													onChange={handleChange}
													sx={{ width: "65%" }}
													required
												/>
											)}
										</Box>
									</Grid>
									<Grid item xs={12}>
										<Box sx={{ mb: 2 }}>
											<Typography variant="subtitle1" gutterBottom>
												Imágenes del vehículo (Máximo {MAX_IMAGES})
											</Typography>
											<Box sx={{ display: "flex", flexDirection: "column" }}>
												<Button
													variant="outlined"
													component="label"
													sx={{ width: "fit-content" }}
													disabled={images.length >= MAX_IMAGES || isSubmitting}
												>
													Seleccionar imágenes
													<input
														type="file"
														accept="image/*"
														multiple
														onChange={handleImageUpload}
														hidden
														disabled={images.length >= MAX_IMAGES || isSubmitting}
													/>
												</Button>
												{images.length > 0 && (
													<Typography variant="caption" sx={{ mt: 1 }}>
														{images.length} archivo(s) seleccionado(s)
													</Typography>
												)}
												{imageError && (
													<Alert severity="error" sx={{ mt: 1 }}>
														{imageError}
													</Alert>
												)}
											</Box>
										</Box>
										{imagePreviews.length > 0 && (
											<Box
												sx={{
													display: "flex",
													gap: 2,
													overflowX: "auto",
													py: 2,
												}}
											>
												{imagePreviews.map((preview, index) => (
													<DraggableImage
														key={index}
														image={preview}
														index={index}
														moveImage={moveImage}
														onClick={handleThumbnailClick}
														isSelected={index === selectedImageIndex}
														onRemove={() => handleRemoveImage(index)}
														isEditing={true}
														isAuthenticated={isAuthenticated}
													/>
												))}
											</Box>
										)}
									</Grid>

									{submitError && (
										<Grid item xs={12}>
											<Alert severity="error" sx={{ mb: 2 }}>
												{submitError}
											</Alert>
										</Grid>
									)}

									<Grid item xs={12}>
										<Box display="flex" justifyContent="flex-end" gap={2}>
											<Button
												variant="outlined"
												color="secondary"
												onClick={() => navigate(-1)}
												disabled={isSubmitting}
											>
												Cancelar
											</Button>
											<Button
												type="submit"
												variant="contained"
												color="primary"
												disabled={isSubmitting}
												startIcon={
													isSubmitting ? <CircularProgress size={20} /> : null
												}
											>
												{isSubmitting ? "Creando..." : "Crear Auto"}
											</Button>
										</Box>
									</Grid>
								</Grid>
							</form>
						</MotionCard>
					</Container>
				</DndProvider>
			)}
		</>
	);
}
