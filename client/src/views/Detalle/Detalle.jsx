import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress,
  Box,
  Chip,
  Paper,
  useTheme,
  IconButton
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function Detalle() {
  const { id } = useParams();
  const [auto, setAuto] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    fetchAuto();
  }, [id]);

  const fetchAuto = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/autos/${id}`);
      if (response.data.status === 200) {
        const autoData = response.data.resp;
        setAuto(autoData);

        const loadedImages = autoData.img && autoData.img.length > 0
          ? autoData.img.map(img => `http://localhost:3001/files/${img}`)
          : ["/placeholder.jpg"];

        setImages(loadedImages);
      } else {
        console.error("Error al obtener los datos del auto:", response.data.resp);
      }
    } catch (error) {
      console.error("Error al obtener los datos del auto:", error);
    }
  };

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
        // transform: 'translateY(-50%)',
        bgcolor: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        borderRadius: '50%', // Hace que el botón sea circular
        width: 40, // Ajusta el tamaño del círculo
        height: 40, // Ajusta el tamaño del círculo
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
  
  

  if (!auto) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress size={60} thickness={4} />
    </Box>
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
                  color: 'transparent'
                }}
              >
                {auto.modelo}
              </MotionTypography>
              
              <Box sx={{color: '#d21919',fontSize: '1.5rem',fontWeight: 'bold', mb: 1 }}
              >Marca: {auto.marca}</Box>
                            

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SpecItem icon="🚗" label="Motor" value={auto.motor} />
                  <SpecItem icon="📊" label="Kilometraje" value={`${auto.km} km`} />
                  <SpecItem icon="⚙️" label="Transmisión" value={auto.transmision} />
                  <SpecItem icon="⛽" label="Combustible" value={auto.combustible} />
                </Grid>
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
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }}
          >
            <CardContent>
              <Typography 
                variant="h5" 
                // color="primary" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                🛡️ Beneficios y Ubicación
              </Typography>
              
              <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom >
                      Beneficios Exclusivos
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="body1">
                        ✨ Entrega inmediata
                      </Typography>
                      <Typography variant="body1">
                        🔄 Recibimos tu usado (Consultar)
                      </Typography>
                      <Typography variant="body1">
                        💰 Financiación DNI (Hasta 50% - 80%)
                      </Typography>
                      <Typography variant="body1">
                        🛡️ Garantía por escrito
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      📍 Ubicación
                    </Typography>
                    <Typography variant="body1">
                      Av. Caraffa 2247 - Av. Caraffa 2378
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Container>
  );
}