import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Container,Card,CardContent,Typography,Grid,CircularProgress,Box,Paper,useTheme,IconButton} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import CardsRelacionados from "../../components/Cards_Relacionados/CardsRelacionados";

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function Detalle() {
  const { id } = useParams();
  const [auto, setAuto] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();
  const [categorias, setCategorias] = useState([]);


  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la página al inicio
    fetchAuto();
  }, [id]);



const fetchAuto = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/autos/${id}`);
    if (response.data.status === 200) {
      const autoData = response.data.resp;
      setAuto(autoData);
      setCategorias(autoData.categorias.map((cat) => cat.id));

      const loadedImages =
        autoData.img && autoData.img.length > 0
          ? autoData.img.map((img) => `http://localhost:3001/files/${img}`)
          : ["/placeholder.jpg"];

      setImages(loadedImages);
    } else {
      console.error("Error al obtener los datos del auto:", response.data.resp);
    }
  } catch (error) {
    console.error("Error al obtener los datos del auto:", error);
  }
};

if (!auto)
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress size={60} thickness={4} />
    </Box>
  );



  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const CustomNavButton = ({ direction, onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        [direction === 'left' ? 'left' : 'right']: 16,
        top: '50%',
        bgcolor: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        borderRadius: '50%', 
        width: 40, 
        height: 40, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
          bgcolor: 'white',
        },
        zIndex: 2,
      }}
    >
      {direction === 'left' ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  );
  
  
  const SpecItem = ({ icon, label, value }) => (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <Typography variant="body1" component="span" sx={{ color: theme.palette.primary.main }}>
        {icon}
      </Typography>
      <Typography variant="body1" component="span" fontWeight="medium">
        {label}:
      </Typography>
      <Typography variant="body1" component="span" color="text.secondary">
        {value}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ 
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
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
                direction={next ? 'right' : 'left'}
              />
            )}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  height: 500,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <img
                  src={image}
                  alt={`Auto ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
          </Carousel>

            
            {/* Thumbnails Gallery */}
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              gap: 1, 
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: '#555',
                },
              },
            }}>
              {images.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  sx={{
                    width: 100,
                    height: 70,
                    flexShrink: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: index === selectedImageIndex ? '3px solid #d21919' : '3px solid transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </MotionCard>
        </Grid>

        <Grid item xs={6} md={4}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ 
              borderRadius: 4,
              height: '100%',
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }}
          >
            <CardContent>
              <MotionTypography
                variant="h3"
                gutterBottom
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg,rgb(0, 0, 0),rgb(0, 0, 0))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2,
                  mt:2

                }}
              >
                {auto.modelo}
              </MotionTypography>
              <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', mb:2 }}>
                ${auto.precio}
              </Box>
                            

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {[
                  { icon: "📅", label: "Modelo", value: auto.anio },
                  { icon: "🚗", label: "Motor", value: auto.motor },
                  { icon: "📊", label: "Kilometraje", value: `${auto.km} km` },
                  { icon: "⚙️", label: "Transmisión", value: auto.transmision },
                  { icon: "⛽", label: "Combustible", value: auto.combustible }
                ].map((spec, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5, 
                        borderRadius: 2,
                        background: theme.palette.mode === 'dark' ? '#333' : '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography variant="h8" component="span">{spec.icon}</Typography>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">{spec.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{spec.value}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
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
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              p: 3
            }}
          >
            <CardContent>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                🛡️ Beneficios Exclusivos
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {[
                  { icon: "✨", title: "Entrega Inmediata" },
                  { icon: "🔄", title: "Recibimos tu usado (Consultar)" },
                  { icon: "💰", title: "Financiación DNI (Hasta 50% - 80%)"},
                  { icon: "🛡️", title: "Garantía por escrito" }
                  
                ].map((beneficio, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        borderRadius: 2,
                        background: theme.palette.mode === 'dark' ? '#333' : '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography variant="h4" component="span">{beneficio.icon}</Typography>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{beneficio.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{beneficio.description}</Typography>
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