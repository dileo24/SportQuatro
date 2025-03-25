import React, { useEffect, useState } from "react";
import "./Catalogo.css";
import Card from "../../components/Card/Card";
import { getAutos } from "../../services/autos.service";
import { Typography, Box, useMediaQuery, Grid } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Pagination from "../../components/Pagination/Pagination";
import Filtros from "../../components/Filtros/Filtros";
import { useFiltros } from "../../context/FiltrosContext";

export default function Catalogo() {
	const [autos, setAutos] = useState([]);
	const [filteredAutos, setFilteredAutos] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;
	const isMobile = useMediaQuery("(max-width:600px)");
	const { filtros, setFiltros } = useFiltros();

	useEffect(() => {
		fetchAutos();
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentPage]);

	useEffect(() => {
		aplicarFiltros();
	}, [filtros, autos]);

	const fetchAutos = async () => {
		try {
			const data = await getAutos();
			if (data?.resp) {
				setAutos(data.resp);
			}
		} catch (error) {
			console.error("Error al obtener autos:", error);
		}
	};

	const aplicarFiltros = () => {
		let autosFiltrados = autos.filter((auto) => {
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
					parseInt(auto.precio.replace(/\./g, "")) >=
						parseInt(filtros.precioDesde)) &&
				(filtros.precioHasta === "" ||
					parseInt(auto.precio.replace(/\./g, "")) <=
						parseInt(filtros.precioHasta)) &&
				(filtros.transmision === "" ||
					auto.transmision === filtros.transmision) &&
				(filtros.combustible === "" ||
					auto.combustible === filtros.combustible) &&
				(filtros.categoria === "" ||
					auto.categorias.some((cat) => cat.categ === filtros.categoria))
			);
		});
		if (filtros.ordenamiento) {
			autosFiltrados = [...autosFiltrados].sort((a, b) => {
				const precioA = parseInt(a.precio.replace(/\./g, ""));
				const precioB = parseInt(b.precio.replace(/\./g, ""));

				if (filtros.ordenamiento === "precio-asc") {
					return precioA - precioB;
				} else if (filtros.ordenamiento === "precio-desc") {
					return precioB - precioA;
				}
				return 0;
			});
		}
		setFilteredAutos(autosFiltrados);
		setCurrentPage(1);
	};

	const totalPages = Math.ceil(filteredAutos.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentAutos = filteredAutos.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	return (
		<Box
			sx={{
				mt: isMobile ? "30px" : "70px",
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
					{filteredAutos.length > 0 ? (
						<>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "repeat(1, 1fr)",
										sm: "repeat(2, 1fr)",
										md: "repeat(3, 1fr)",
									},
									gap: { xs: "15px", sm: "20px", md: "30px" },
									justifyItems: "center",
								}}
							>
								{currentAutos.map((auto) => (
									<Box
										key={auto.id}
										sx={{
											transition: "transform 0.3s, box-shadow 0.3s",
											"&:hover": {
												transform: isMobile ? "none" : "scale(1.05)",
												boxShadow: isMobile
													? "none"
													: "0px 4px 20px rgba(0, 0, 0, 0.2)",
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
					) : (
						<Box sx={{ textAlign: "center", mt: 5 }}>
							<DirectionsCarIcon sx={{ fontSize: 60, color: "#aaa" }} />
							<Typography variant="h6" sx={{ mt: 2, color: "#555" }}>
								No hay autos disponibles con los filtros seleccionados.
							</Typography>
						</Box>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}
