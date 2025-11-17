import React, { useEffect, useState } from "react";
import "./Catalogo.css";
import Card from "../../components/Card/Card";
import { getAutos } from "../../services/autos.service";
import {
	Typography,
	Box,
	useMediaQuery,
	Grid,
	CircularProgress,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Pagination from "../../components/Pagination/Pagination";
import Filtros from "../../components/Filtros/Filtros";
import { useFiltros } from "../../context/FiltrosContext";

export default function Catalogo() {
	const [isLoading, setIsLoading] = useState(true);
	const [autos, setAutos] = useState([]);
	const [filteredAutos, setFilteredAutos] = useState([]);
	const [currentPage, setCurrentPage] = useState(() => {
		const savedPage = localStorage.getItem("catalogoCurrentPage");
		return savedPage ? parseInt(savedPage) : 1;
	});
	const [dolarBlue, setDolarBlue] = useState(null);
	const itemsPerPage = 12;
	const isMobile = useMediaQuery("(max-width:600px)");
	const { filtros, setFiltros } = useFiltros();

	useEffect(() => {
		const fetchDolarBlue = async () => {
			try {
				const response = await fetch("https://api.bluelytics.com.ar/v2/latest");
				const data = await response.json();
				setDolarBlue(data.blue.value_avg);
			} catch (error) {
				console.error("Error al obtener el valor del dólar:", error);
			}
		};

		fetchDolarBlue();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [filtros]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const data = await getAutos();
				if (data?.resp) {
					setAutos(data.resp);
				}
			} catch (error) {
				console.error("Error al obtener autos:", error);
			} finally {
				setIsLoading(false);
			}
		};

		const savedFilters = localStorage.getItem("catalogoFilters");
		if (savedFilters) {
			setFiltros(JSON.parse(savedFilters));
		}

		fetchData();
	}, []);

	useEffect(() => {
		if (autos.length === 0 || dolarBlue === null) return;

		const getPrecioEnPesos = (auto) => {
			const precioString = auto.oferta ? auto.precio_oferta : auto.precio;
			const precioNum = parseInt(precioString.replace(/\./g, ""));

			if (auto.moneda === "U$D") {
				return precioNum * dolarBlue;
			}
			return precioNum;
		};

		let autosFiltrados = autos.filter((auto) => {
			const precioAuto = getPrecioEnPesos(auto);

			return (
				(filtros.anioDesde === "" ||
					parseInt(auto.anio) >= parseInt(filtros.anioDesde)) &&
				(filtros.anioHasta === "" ||
					parseInt(auto.anio) <= parseInt(filtros.anioHasta)) &&
				(filtros.kmDesde === "" ||
					parseInt(auto.km.replace(/\./g, "")) >= parseInt(filtros.kmDesde)) &&
				(filtros.kmHasta === "" ||
					parseInt(auto.km.replace(/\./g, "")) <= parseInt(filtros.kmHasta)) &&
				(filtros.precioDesde === "" ||
					precioAuto >= parseInt(filtros.precioDesde)) &&
				(filtros.precioHasta === "" ||
					precioAuto <= parseInt(filtros.precioHasta)) &&
				(filtros.transmision === "" ||
					auto.transmision === filtros.transmision) &&
				(filtros.combustible === "" ||
					auto.combustible === filtros.combustible) &&
				(filtros.oferta === "" || auto.oferta === filtros.oferta) &&
				(filtros.categoria === "" ||
					auto.categorias.some((cat) => cat.categ === filtros.categoria)) &&
				(filtros.marca === "" || auto.marca === filtros.marca)
			);
		});

		if (
			filtros.ordenamiento === "precio-asc" ||
			filtros.ordenamiento === "precio-desc"
		) {
			autosFiltrados.sort((a, b) => {
				const precioA = getPrecioEnPesos(a);
				const precioB = getPrecioEnPesos(b);

				return filtros.ordenamiento === "precio-asc"
					? precioA - precioB
					: precioB - precioA;
			});
		}

		setFilteredAutos(autosFiltrados);

		if (autosFiltrados.length > 0) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			localStorage.setItem("catalogoFilters", JSON.stringify(filtros));

			if (currentPage !== 1) {
				localStorage.setItem("catalogoCurrentPage", currentPage);
			}
		}
	}, [autos, filtros, currentPage, dolarBlue]);

	const totalPages = Math.ceil(filteredAutos.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentAutos = filteredAutos.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	return (
		<Box
			sx={{
				mt: "70px",
				padding: isMobile ? "10px" : "20px",
				minHeight: "80vh",
				backgroundColor: "#f8f9fa",
			}}
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Filtros />
				</Grid>

				<Grid item xs={12} md={9}>
					{isLoading ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "300px",
							}}
						>
							<CircularProgress size={60} />
						</Box>
					) : (
						<>
							{filteredAutos.length === 0 ? (
								<Box sx={{ textAlign: "center", mt: 5 }}>
									<DirectionsCarIcon sx={{ fontSize: 60, color: "#aaa" }} />
									<Typography variant="h6" sx={{ mt: 2, color: "#555" }}>
										No hay vehículos disponibles.
									</Typography>
								</Box>
							) : (
								<>
									<Box
										sx={{
											display: "grid",
											gridTemplateColumns: {
												xs: "repeat(1, 1fr)",
												sm: "repeat(2, 1fr)",
												md: "repeat(3, 1fr)",
												lg: "repeat(3, 1fr)",
												xl: "repeat(4, 1fr)",
											},
											"@media (min-width: 900px) and (max-width: 1600px)": {
												gridTemplateColumns: "repeat(3, 1fr)",
											},
											gap: {
												xs: "15px",
												sm: "20px",
												md: "25px",
												lg: "30px",
												xl: "30px",
											},
											justifyItems: "center",
										}}
									>
										{currentAutos.map((auto) => (
											<Box
												key={auto.id}
												sx={{
													transition: "transform 0.3s",
													"&:hover": {
														transform: isMobile ? "none" : "scale(1.05)",
													},
												}}
											>
												<Card auto={auto} />
											</Box>
										))}
									</Box>

									<Box sx={{ mt: 3 }}>
										<Pagination
											totalPages={totalPages}
											currentPage={currentPage}
											setCurrentPage={setCurrentPage}
										/>
									</Box>
								</>
							)}
						</>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}
