import React, { useEffect, useState } from "react";
import "./Catalogo.css";
import Card from "../../components/Card/Card";
import { getAutos } from "../../services/autos.service";
import { Typography, Box, useMediaQuery } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function Catalogo() {
    const [autos, setAutos] = useState([]);
    const isMobile = useMediaQuery("(max-width:600px)");

    useEffect(() => {
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
        fetchAutos();
    }, []);

    return (
        <Box 
            sx={{ 
                mt: isMobile ? "30px" : "70px", 
                padding: isMobile ? "10px" : "20px", 
                minHeight: "80vh", 
                backgroundColor: "#f8f9fa" 
            }}
        >
            <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                    textAlign: "center", 
                    mb: isMobile ? "30px" : "40px",
                    mt: isMobile ? "40px" : "20px",
                    fontWeight: "bold", 
                    color: "#333" 
                }}
            >
                Catálogo de Autos
            </Typography>

            {autos.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",  // 1 columna para celuss
                            sm: "repeat(2, 1fr)",  // 2 columnas para tabletss
                            md: "repeat(3, 1fr)",  // 3 columnas en pantallas medianas
                            lg: "repeat(4, 1fr)",  // Máximo 4 columnas
                        },
                        gap: { xs: "15px", sm: "20px", md: "30px", lg: "40px" }, 
                        justifyItems: "center",  // Centra las cards
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}
                >
                    {autos.map((auto) => (
                        <Box
                            key={auto.id}
                            sx={{
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: isMobile ? "none" : "scale(1.05)",
                                    boxShadow: isMobile ? "none" : "0px 4px 20px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <Card auto={auto} />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <DirectionsCarIcon sx={{ fontSize: 60, color: "#aaa" }} />
                    <Typography variant="h6" sx={{ mt: 2, color: "#555" }}>
                        No hay autos disponibles en este momento.
                    </Typography>
                </Box>
            )}
        </Box>

    );
}
