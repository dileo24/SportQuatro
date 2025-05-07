import React, { useEffect, useState } from "react";
import {
	Typography,
	Box,
	CircularProgress,
	Grid,
	useMediaQuery,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { getAutosRelacionados } from "../../services/autos.service";
import Card from "../Card/Card";

export default function CardsRelacionados({ categorias, idAutoActual }) {
	const [relacionados, setRelacionados] = useState([]);
	const [loading, setLoading] = useState(true);
	const isMobile = useMediaQuery("(max-width:600px)");

	useEffect(() => {
		if (categorias && categorias.length > 0) {
			fetchRelacionados(categorias);
		}
	}, [categorias]);

	const fetchRelacionados = async (idCategorias) => {
		try {
			const response = await getAutosRelacionados(idCategorias);
			const relacionadosFiltrados = response.filter(
				(auto) => auto.id !== idAutoActual
			);
			setRelacionados(relacionadosFiltrados);
		} catch (error) {
			console.error("Error al obtener autos relacionados:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight={200}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!relacionados.length) {
		return null;
	}

	const grupos = isMobile
		? relacionados.map((auto) => [auto])
		: Array.from({ length: Math.ceil(relacionados.length / 4) }, (_, i) =>
				relacionados.slice(i * 4, i * 4 + 4)
		  );

	return (
		<Box sx={{ mt: 4, p: 2, width: "100%" }}>
			<Typography variant="h5" fontWeight="bold" gutterBottom>
				🚗 Autos Relacionados
			</Typography>

			<Carousel
				animation="slide"
				autoPlay
				interval={3000}
				navButtonsAlwaysVisible
			>
				{grupos.map((grupo, idx) => (
					<Grid
						container
						spacing={2}
						key={idx}
						justifyContent="center"
						sx={{ width: "100%", margin: "0 auto" }}
					>
						{grupo.map((auto, index) => {
							const imagenAuto = auto.img?.length
								? `${import.meta.env.VITE_API_URL}/files/${auto.img[0]}`
								: "/placeholder.jpg";

							return (
								<Grid
									item
									xs={12}
									sm={6}
									md={3}
									key={index}
									sx={{
										display: "flex",
										justifyContent: "center",
									}}
								>
									<Card auto={auto} />
								</Grid>
							);
						})}
					</Grid>
				))}
			</Carousel>
		</Box>
	);
}
