import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Grid } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import { Link } from "react-router-dom";

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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!relacionados.length) {
    return null;
  }

  // 🔹 Agrupar en filas de 4 autos
  const grupos = [];
  for (let i = 0; i < relacionados.length; i += 4) {
    grupos.push(relacionados.slice(i, i + 4));
  }

  return (
    <Box sx={{ mt: 4, p: 2, width: "100%" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🚗 Autos Relacionados
      </Typography>

      <Carousel animation="slide" autoPlay interval={3000} navButtonsAlwaysVisible>
        {grupos.map((grupo, idx) => (
          <Grid container spacing={2} key={idx} justifyContent="center">
            {grupo.map((auto, index) => {
              const imagenAuto = auto.img?.length
                ? `http://localhost:3001/files/${auto.img[0]}`
                : "/placeholder.jpg";

              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <div className="card" style={{ width: "100%" }}>
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
        ))}
      </Carousel>
    </Box>
  );
}
