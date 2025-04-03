import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import {
	getAutoById,
	postImagen,
	updateImgInAuto,
} from "../../services/autos.service";

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

		const file = new FormData();
		file.append("file", file);

		try {
			const response = await postImagen(file);

			if (response.data.status === 200) {
				const fileName = response.data.fileName;

				const autoResponse = await getAutoById(autoId);
				const currentAuto = autoResponse.data;

				const updatedImages = (currentAuto.img ?? []).concat(fileName);

				await updateImgInAuto(autoId, updatedImages);

				onImageUpload((prevImages) => [...prevImages, fileName]);
				setFile(null);
				setImagePreview(null);
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
