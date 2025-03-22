import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom"; 

const MotionCard = motion(Card);

const CustomNavButton = ({ direction, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      [direction === "left" ? "left" : "right"]: 16,
      top: "50%",
      bgcolor: "rgba(255, 255, 255, 0.25)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      borderRadius: "50%",
      width: 40,
      height: 40,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": { bgcolor: "white" },
      zIndex: 2,
    }}
  >
    {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
  </IconButton>
);

export default function CarruselRelacionados({ categorias }) {
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categorias && categorias.length > 0) {
      fetchRelacionados(categorias);
    }
  }, [categorias]);

  const fetchRelacionados = async (idCategorias) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/autos/relacionados",
        { id_categ: idCategorias.map(String) },
        { headers: { "Content-Type": "application/json" } }
      );

      setRelacionados(response.data.resp);
    } catch (error) {
      console.error("Error al obtener autos relacionados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!relacionados.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🚗 Autos Relacionados
      </Typography>
      <Carousel
        navButtonsAlwaysVisible
        animation="slide"
        autoPlay={true}
        indicators={false}
        interval={3000}
        NavButton={({ onClick, next }) => (
          <CustomNavButton onClick={onClick} direction={next ? "right" : "left"} />
        )}
      >
        {relacionados.map((auto, index) => {
          const imagenAuto = auto.img?.length ? `http://localhost:3001/files/${auto.img[0]}` : "/placeholder.jpg";
          return (
            <Link to={`/detalle/${auto.id}`} key={index} style={{ textDecoration: "none", color: "inherit" }}>
              <MotionCard
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center", height: 600 }}
              >
                <img
                  src={imagenAuto}
                  alt={auto.modelo}
                  style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{auto.modelo}</Typography>
                  <Typography variant="body2" color="text.secondary">${auto.precio}</Typography>
                </CardContent>
              </MotionCard>
            </Link>
          );
        })}
      </Carousel>
    </Box>
  );
}
