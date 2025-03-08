import React, { useEffect, useState } from "react";
import "./Detalle.css";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Detalle() {
	const { id } = useParams();
	const [auto, setAuto] = useState(null);
	const [imagePrincipalUrl, setImagePrincipalUrl] = useState("");

	useEffect(() => {
		fetchAuto();
	}, [id]);

	const fetchAuto = async () => {
		try {
			const response = await axios.get(`http://localhost:3001/autos/${id}`);
			if (response.data.status === 200) {
				const autoData = response.data.resp;
				setAuto(autoData);

				if (autoData.img && autoData.img.length > 0) {
					setImagePrincipalUrl(
						`http://localhost:3001/files/${autoData.img[0]}`
					);
				}
			} else {
				console.error(
					"Error al obtener los datos del auto:",
					response.data.resp
				);
			}
		} catch (error) {
			console.error("Error al obtener los datos del auto:", error);
		}
	};

	if (!auto) return <p>Cargando...</p>;

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-7 col-lg-4 mb-5 mb-lg-0 wow fadeIn">
					<div className="card border-0 shadow">
						{imagePrincipalUrl && (
							<img
								src={imagePrincipalUrl}
								className="card-img-top"
								alt={auto.modelo}
							/>
						)}
						<div className="card-body p-1-9 p-xl-5"></div>
					</div>
				</div>
				<div className="col-lg-8">
					<div className="ps-lg-1-6 ps-xl-5">
						<div className="mb-5 wow fadeIn">
							<div className="text-start mb-1-6 wow fadeIn">
								<h2 className="h1 mb-4 text-primary">{auto.modelo}</h2>
							</div>
							<p>Marca: {auto.marca}</p>
							<p>Motor: {auto.motor}</p>
							<p>Año: {auto.anio}</p>
							<p>Km: {auto.km}</p>
							<p>Transmisión: {auto.transmision}</p>
							<p>Combustible: {auto.combustible}</p>
							<p>
								🤝Entrega inmediata
								<br />
								🚘Recibimos tu usado (Consultar)
								<br />
								💰Financiación DNI (Hasta 50% - 80%)
								<br />
								✍️Garantía por escrito
								<br />
								📍Av. Caraffa 2247 - Av. Caraffa 2378
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
