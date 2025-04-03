import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
	Container,
	Card,
	CardContent,
	Typography,
	Grid,
	CircularProgress,
	Box,
	Paper,
	useTheme,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
	IconButton,
	Alert,
	List,
	ListItem,
	ListItemText,
	Divider,
	Chip,
	Avatar,
	Badge,
} from "@mui/material";
import { Close, AddPhotoAlternate } from "@mui/icons-material";
import SpecItem from "../../components/SpecItem/SpectItem";
import Carousel from "react-material-ui-carousel";
import { motion } from "framer-motion";
import CardsRelacionados from "../../components/Cards_Relacionados/CardsRelacionados";
import { useAuth } from "../../context/AuthContext";
import CustomNavButton from "../../components/CustomNavButton/CustomNavButton";
import {
	tiposCombustible,
	tiposTransmision,
	categoriaToCreate,
} from "../../data/filters";
import {
	deleteAuto,
	getAutoById,
	postImagen,
	updateAuto,
	updateImgInAuto,
} from "../../services/autos.service";

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MAX_IMAGES = 10;

export default function Detalle() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [auto, setAuto] = useState(null);
	const [images, setImages] = useState([]);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [imageError, setImageError] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const theme = useTheme();
	const [categorias, setCategorias] = useState([]);
	const { isAuthenticated } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [editedAuto, setEditedAuto] = useState({});
	const [moneda, setMoneda] = useState("AR$");
	const [years, setYears] = useState([]);
	const [submitError, setSubmitError] = useState(null);
	const fileInputRef = useRef(null);

	const yearRef = useRef(null);
	const motorRef = useRef(null);
	const kmRef = useRef(null);
	const transmisionRef = useRef(null);
	const combustibleRef = useRef(null);
	const modeloRef = useRef(null);
	const precioRef = useRef(null);

	useEffect(() => {
		window.scrollTo(0, 0);
		fetchAuto();

		const currentYear = new Date().getFullYear();
		const yearsArray = [];
		for (let i = currentYear; i >= currentYear - 25; i--) {
			yearsArray.push(i);
		}
		setYears(yearsArray);
	}, [id]);

	const fetchAuto = async () => {
		try {
			const response = await getAutoById(id);
			if (response.data.status === 200) {
				const autoData = response.data.resp;
				setAuto(autoData);
				setMoneda(autoData.moneda);
				setEditedAuto(autoData);
				setCategorias(autoData.categorias.map((cat) => cat.id));

				const loadedImages =
					autoData.img && autoData.img.length > 0
						? autoData.img.map(
								(img) => `${import.meta.env.VITE_API_URL}/files/${img}`
						  )
						: ["/placeholder.jpg"];

				setImages(loadedImages);
				setSelectedImageIndex(0);
			}
		} catch (error) {
			console.error("Error al obtener los datos del auto:", error);
		}
	};

	const handleThumbnailClick = (index) => {
		setSelectedImageIndex(index);
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleChange = (e, key) => {
		const { name, value, type, checked } = e.target;

		if (name === "precio" || name === "precio_oferta" || name === "km") {
			const cleanValue = value.replace(/[^0-9.]/g, "");
			const numericValue = cleanValue.replace(/\./g, "");
			const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

			setEditedAuto((prev) => ({
				...prev,
				[name]: formattedValue,
			}));
		} else {
			setEditedAuto((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}
		setFocusedField(key || name);
	};

	const handleCategoryChange = (event) => {
		const { value } = event.target;
		const selectedCategories =
			typeof value === "string" ? value.split(",") : value;

		setEditedAuto((prev) => ({
			...prev,
			categorias: selectedCategories.map((id) => ({
				id: Number(id),
				categ: categoriaToCreate.find((cat) => cat.value === id)?.label || "",
			})),
		}));
	};

	const handleSave = async () => {
		try {
			const payload = {
				...editedAuto,
				moneda: moneda,
			};

			const response = await updateAuto(id, payload);
			if (response.data.status === 200) {
				setAuto(payload);
				setIsEditing(false);
			}
		} catch (error) {
			console.error("Error al guardar los cambios:", error);
		}
	};

	const handleImageUploadClick = () => {
		fileInputRef.current.click();
	};

	const handleImageUpload = async (e) => {
		const files = Array.from(e.target.files);
		setImageError("");

		if (images.length + files.length > MAX_IMAGES) {
			setImageError(
				`Solo se pueden subir ${MAX_IMAGES} imágenes. Ya hay ${images.length} cargada y estás intentando agregar ${files.length} más.`
			);
			return;
		}

		try {
			setIsUploading(true);

			let currentImages = [...auto.img];
			let newImageUrls = [...images];

			const uploadPromises = files.map((file) => {
				const formData = new FormData();
				formData.append("file", file);
				return postImagen(formData);
			});

			const responses = await Promise.all(uploadPromises);

			responses.forEach((response) => {
				if (response.data.fileName) {
					currentImages.push(response.data.fileName);
					newImageUrls.push(
						`${import.meta.env.VITE_API_URL}/files/${response.data.fileName}`
					);
				}
			});

			await updateImgInAuto(id, currentImages);

			setAuto((prev) => ({ ...prev, img: currentImages }));
			setImages(newImageUrls);
		} catch (error) {
			console.error("Error al subir imágenes:", error);
			setImageError("Error al subir las imágenes. Intente nuevamente.");
			setTimeout(() => {
				setImageError("");
			}, 3000);
		} finally {
			setIsUploading(false);
			e.target.value = "";
		}
	};

	const handleRemoveImage = async (index) => {
		const imageToRemove = auto.img[index];

		try {
			// Primero eliminar la imagen del servidor
			await axios.delete(
				`${import.meta.env.VITE_API_URL}/files/${imageToRemove}`
			);

			// Luego actualizar el estado local
			const newImageArray = auto.img.filter((_, i) => i !== index);
			await updateImgInAuto(id, newImageArray);

			setAuto((prev) => ({
				...prev,
				img: newImageArray,
			}));

			setImages((prev) => prev.filter((_, i) => i !== index));

			if (selectedImageIndex === index) {
				setSelectedImageIndex(0);
			}
		} catch (error) {
			console.error("Error al eliminar la imagen:", error);
			setImageError("Error al eliminar la imagen. Intente nuevamente.");
			setTimeout(() => {
				setImageError("");
			}, 3000);
		}
	};

	const handleDeleteAuto = async (id) => {
		try {
			const response = await deleteAuto(id);
			if (response.data.status === "200") {
				navigate("/catalogo");
			}
		} catch (error) {
			console.error("Error al eliminar el auto: ", error);
			setImageError("Error al eliminar el auto. Intente nuevamente.");
			setTimeout(() => {
				setImageError("");
			}, 3000);
		}
	};

	if (!auto)
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
			>
				<CircularProgress size={60} thickness={4} />
			</Box>
		);

	const filteredCombustible = tiposCombustible.filter(
		(opt) => opt.value !== ""
	);
	const filteredTransmision = tiposTransmision.filter(
		(opt) => opt.value !== ""
	);

	return (
		<Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<MotionCard
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						sx={{
							borderRadius: 2,
							background: "#fff",
							boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
						}}
					>
						<Carousel
							index={selectedImageIndex}
							onChange={(index) => setSelectedImageIndex(index)}
							animation="slide"
							navButtonsAlwaysVisible
							indicators={false}
							interval={5000}
							NavButton={({ onClick, className, style, next, prev }) => (
								<CustomNavButton
									onClick={onClick}
									direction={next ? "right" : "left"}
								/>
							)}
						>
							{images.map((image, index) => (
								<Box
									key={index}
									sx={{
										height: 525,
										position: "relative",
										overflow: "hidden",
										borderRadius: "8px 8px 0 0",
									}}
								>
									<img
										src={image}
										alt={`Auto ${index + 1}`}
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								</Box>
							))}
						</Carousel>

						<Box
							sx={{
								p: 2,
								display: "flex",
								gap: 1,
								overflowX: "auto",
								alignItems: "center",
								"&::-webkit-scrollbar": {
									height: 6,
								},
								"&::-webkit-scrollbar-track": {
									backgroundColor: "#f1f1f1",
								},
								"&::-webkit-scrollbar-thumb": {
									backgroundColor: "#888",
									borderRadius: 3,
									"&:hover": {
										backgroundColor: "#555",
									},
								},
							}}
						>
							{images.map((image, index) => (
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
												handleRemoveImage(index);
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
							))}

							{isAuthenticated && isEditing && images.length < MAX_IMAGES && (
								<Box
									sx={{
										width: 80,
										height: 60,
										flexShrink: 0,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										border: "2px dashed #ddd",
										borderRadius: 1,
										cursor: "pointer",
										"&:hover": {
											borderColor: "#1976d2",
										},
									}}
									onClick={handleImageUploadClick}
								>
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleImageUpload}
										accept="image/*"
										multiple
										style={{ display: "none" }}
										disabled={isUploading}
									/>
									{isUploading ? (
										<CircularProgress size={24} />
									) : (
										<AddPhotoAlternate color="action" />
									)}
								</Box>
							)}
						</Box>

						{imageError && (
							<Box sx={{ px: 2, pb: 2 }}>
								<Alert severity="error" sx={{ mb: 1 }}>
									{imageError}
								</Alert>
							</Box>
						)}
					</MotionCard>
				</Grid>

				<Grid item xs={12} md={4}>
					<MotionCard
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						sx={{
							borderRadius: 4,
							height: "100%",
							background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
						}}
					>
						<CardContent>
							{isEditing ? (
								<TextField
									inputRef={modeloRef}
									label="Modelo"
									name="modelo"
									value={editedAuto.modelo}
									onChange={(e) => handleChange(e, "modelo")}
									fullWidth
									margin="normal"
								/>
							) : (
								<MotionTypography
									variant="h4"
									gutterBottom
									sx={{ fontWeight: "bold", mb: 2, mt: 2, textAlign: "center" }}
								>
									{auto.modelo}
								</MotionTypography>
							)}

							{isEditing ? (
								<>
									<Box display="flex" alignItems="center">
										<TextField
											inputRef={precioRef}
											label="Precio"
											name="precio"
											value={editedAuto.precio}
											onChange={(e) => handleChange(e, "precio")}
											fullWidth
											margin="normal"
										/>
										<Select
											value={moneda}
											onChange={(e) => setMoneda(e.target.value)}
											sx={{ ml: 1, minWidth: 80 }}
										>
											<MenuItem value="AR$">AR$</MenuItem>
											<MenuItem value="U$D">U$D</MenuItem>
										</Select>
									</Box>

									<FormControlLabel
										control={
											<Checkbox
												checked={editedAuto.destacar || false}
												onChange={(e) => handleChange(e, "destacar")}
												name="destacar"
											/>
										}
										label="Destacar"
									/>

									<FormControlLabel
										control={
											<Checkbox
												checked={editedAuto.oferta || false}
												onChange={(e) => handleChange(e, "oferta")}
												name="oferta"
											/>
										}
										label="En oferta"
									/>

									{editedAuto.oferta && (
										<TextField
											label="Precio de oferta"
											name="precio_oferta"
											value={editedAuto.precio_oferta || ""}
											onChange={(e) => handleChange(e, "precio_oferta")}
											fullWidth
											margin="normal"
										/>
									)}
								</>
							) : (
								<Box
									sx={{
										fontSize: "1.5rem",
										fontWeight: "bold",
										mb: 2,
										textAlign: "center",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									{auto.oferta && (
										<Box
											component="span"
											sx={{
												color: "red",
												fontSize: "1.5rem",
												fontWeight: "bold",
												mb: 1,
											}}
										>
											{auto.moneda} {auto.precio_oferta}
										</Box>
									)}
									<Box
										component="span"
										sx={{
											color: auto.oferta ? "grey.600" : "inherit",
											textDecoration: auto.oferta ? "line-through" : "none",
											opacity: auto.oferta ? 0.7 : 1,
										}}
									>
										{auto.moneda} {auto.precio}
									</Box>
								</Box>
							)}

							<Grid container spacing={2} sx={{ mt: 2 }}>
								{isEditing ? (
									<Grid item xs={6}>
										<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
											<FormControl fullWidth>
												<InputLabel>Año</InputLabel>
												<Select
													inputRef={yearRef}
													name="anio"
													value={editedAuto.anio}
													onChange={(e) => handleChange(e, "anio")}
													label="Año"
												>
													{years.map((year) => (
														<MenuItem key={year} value={year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Paper>
									</Grid>
								) : (
									<Grid item xs={4}>
										<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
											<SpecItem icon="📅" label="Modelo" value={auto.anio} />
										</Paper>
									</Grid>
								)}
								<Grid item xs={4}>
									<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
										{isEditing ? (
											<TextField
												inputRef={motorRef}
												label="Motor"
												name="motor"
												value={editedAuto.motor}
												onChange={(e) => handleChange(e, "motor")}
												fullWidth
											/>
										) : (
											<SpecItem icon="🚗" label="Motor" value={auto.motor} />
										)}
									</Paper>
								</Grid>
								{isEditing ? (
									<Grid item xs={6}>
										<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
											<TextField
												inputRef={kmRef}
												label="Km"
												name="km"
												value={editedAuto.km}
												onChange={(e) => handleChange(e, "km")}
												fullWidth
											/>
										</Paper>
									</Grid>
								) : (
									<Grid item xs={4}>
										<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
											<SpecItem icon="📊" label="Km" value={auto.km} />
										</Paper>
									</Grid>
								)}

								<Grid item xs={6}>
									<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
										{isEditing ? (
											<FormControl fullWidth>
												<InputLabel>Transmisión</InputLabel>
												<Select
													inputRef={transmisionRef}
													name="transmision"
													value={editedAuto.transmision}
													onChange={(e) => handleChange(e, "transmision")}
													label="Transmisión"
												>
													{filteredTransmision.map((option) => (
														<MenuItem key={option.value} value={option.value}>
															{option.label}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										) : (
											<SpecItem
												icon="⚙️"
												label="Transmisión"
												value={auto.transmision}
											/>
										)}
									</Paper>
								</Grid>

								{isEditing ? (
									<Grid item xs={12}>
										<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
											<FormControl fullWidth>
												<InputLabel>Combustible</InputLabel>
												<Select
													inputRef={combustibleRef}
													name="combustible"
													value={editedAuto.combustible}
													onChange={(e) => handleChange(e, "combustible")}
													label="Combustible"
												>
													{filteredCombustible.map((option) => (
														<MenuItem key={option.value} value={option.value}>
															{option.label}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Paper>
									</Grid>
								) : (
									<Grid item xs={6}>
										<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
											<SpecItem
												icon="⛽"
												label="Combustible"
												value={auto.combustible}
											/>
										</Paper>
									</Grid>
								)}

								<Grid item xs={12}>
									<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
										{isEditing ? (
											<FormControl fullWidth>
												<InputLabel>Categoría/s</InputLabel>
												<Select
													multiple
													name="categorias"
													value={
														editedAuto.categorias?.map((cat) =>
															cat.id.toString()
														) || []
													}
													onChange={handleCategoryChange}
													label="Categoría/s"
													renderValue={(selected) =>
														selected
															.map((id) => {
																const cat = categoriaToCreate.find(
																	(c) => c.value === id
																);
																return cat?.label || id;
															})
															.join(", ")
													}
												>
													{categoriaToCreate.map((option) => (
														<MenuItem key={option.value} value={option.value}>
															<Checkbox
																checked={editedAuto.categorias?.some(
																	(c) => c.id.toString() === option.value
																)}
															/>
															{option.label}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										) : (
											<SpecItem
												icon="🏷️"
												label="Categoría/s"
												value={
													auto.categorias?.map((cat) => cat.categ).join(", ") ||
													"Sin categoría"
												}
											/>
										)}
									</Paper>
								</Grid>
							</Grid>

							{isAuthenticated && (
								<Box>
									{isEditing ? (
										<Grid container spacing={2} sx={{ mt: 2 }}>
											<Grid item xs={4}>
												<Button
													variant="contained"
													color="primary"
													fullWidth
													onClick={handleSave}
												>
													Guardar
												</Button>
											</Grid>

											<Grid item xs={4}>
												<Button
													variant="contained"
													color="error"
													fullWidth
													onClick={() => handleDeleteAuto(auto.id)}
												>
													Eliminar
												</Button>
											</Grid>
											<Grid item xs={4}>
												<Button
													variant="outlined"
													color="secondary"
													fullWidth
													onClick={() => setIsEditing(false)}
												>
													Cancelar
												</Button>
											</Grid>
										</Grid>
									) : (
										<Box display="flex" justifyContent="center" mt={2}>
											<Button
												variant="outlined"
												color="primary"
												onClick={handleEdit}
											>
												Editar
											</Button>
										</Box>
									)}
								</Box>
							)}
						</CardContent>
					</MotionCard>
				</Grid>

				<Grid item xs={12}>
					<MotionCard
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						sx={{
							borderRadius: 4,
							mt: 4,
							background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
							p: 3,
						}}
					>
						<CardContent>
							<Typography
								variant="h5"
								gutterBottom
								sx={{
									fontWeight: "bold",
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								🛡️ Beneficios Exclusivos
							</Typography>

							<Grid container spacing={2} sx={{ mt: 2 }}>
								{[
									{ icon: "✨", title: "Entrega Inmediata" },
									{ icon: "🔄", title: "Recibimos tu usado (Consultar)" },
									{ icon: "💰", title: "Financiación DNI (Hasta 50% - 80%)" },
									{ icon: "🛡️", title: "Garantía por escrito" },
								].map((beneficio, index) => (
									<Grid item xs={12} sm={6} key={index}>
										<Paper
											elevation={3}
											sx={{
												p: 2,
												display: "flex",
												alignItems: "center",
												gap: 2,
												borderRadius: 2,
												background:
													theme.palette.mode === "dark" ? "#333" : "#fff",
												boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
											}}
										>
											<Typography variant="h4" component="span">
												{beneficio.icon}
											</Typography>
											<Box>
												<Typography variant="h6" fontWeight="bold">
													{beneficio.title}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{beneficio.description}
												</Typography>
											</Box>
										</Paper>
									</Grid>
								))}
							</Grid>
						</CardContent>
					</MotionCard>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<CardsRelacionados categorias={categorias} />
			</Grid>
		</Container>
	);
}
