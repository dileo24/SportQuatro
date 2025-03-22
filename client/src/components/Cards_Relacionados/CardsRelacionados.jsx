import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Card/Card.css";

const MotionCard = motion(Card);

export default function CardsRelacionados({ categorias }) {
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
    return <p>Cargando...</p>;
  }

  if (!relacionados.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🚗 Autos Relacionados
      </Typography>
      <Grid container spacing={2} justifyContent="center">
  {relacionados.map((auto, index) => {
    const imagenAuto = auto.img?.length ? `http://localhost:3001/files/${auto.img[0]}` : "/placeholder.jpg";
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ width: "18rem" }}>
          <img src={imagenAuto} className="card-img-top" alt={auto.modelo} />
          <div className="card-body">
            <h5 className="card-title">{auto.modelo}</h5>
            <div className="card-text">
              <p>${auto.precio}</p>
              <p>{auto.km} km</p>
            </div>
            <Link to={`/detalle/${auto.id}`} className="btn btn-primary">
              Ver más
            </Link>
          </div>
        </div>
      </Grid>
    );
  })}
</Grid>
    </Box>
  );
}
