import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";

export default function ImagenUploader({ onImageUpload, autoId }) {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        alert("Por favor, selecciona un archivo de imagen válido.");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !autoId) {
      alert("No se puede subir la imagen sin un ID de auto.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Subir la imagen al servidor
      const response = await axios.post("http://localhost:3001/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === 200) {
        const fileName = response.data.fileName;

        // Obtener el auto actual antes de hacer el PUT
        const autoResponse = await axios.get(`http://localhost:3001/autos/${autoId}`);
        const currentAuto = autoResponse.data;

        console.log("Datos actuales del auto:", currentAuto);

        // Asegurar que el campo img sea un array y agregar la nueva imagen
        const updatedImages = (currentAuto.img ?? []).concat(fileName);



        console.log("Datos enviados al PUT:", { img: updatedImages });

        // Actualizar el auto con la nueva lista de imágenes
        await axios.put(`http://localhost:3001/autos/${autoId}`, { img: updatedImages });

        onImageUpload((prevImages) => [...prevImages, fileName]);
        setFile(null);
        setImagePreview(null);
        
        console.log("Imagen subida y auto actualizado:", updatedImages);
        console.log("Datos despues de la subida del auto:", currentAuto);
      }
    } catch (error) {
      console.error("Error al subir la imagen o actualizar el auto:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreview && (
        <div>
          <img
            src={imagePreview}
            alt="Vista previa"
            style={{ width: 300, height: 200, objectFit: "cover" }}
          />
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
      >
        Subir Imagen
      </Button>
    </div>
  );
}
