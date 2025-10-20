import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/free-solid-svg-icons/faMedal";

export default function Card({ auto }) {
	const API_URL = import.meta.env.VITE_API_URL;
	const imageUrl = `${API_URL}/files/${auto.img[0]}`;
	    const createSlug = (str) => {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9áéíóúñü ]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const marcaSlug = createSlug(auto.marca);
    const modeloSlug = createSlug(auto.modelo);

	const hasValidKm = (kmValue) => {
		return kmValue !== null && kmValue !== '';
	};

	return (
		<Link
			to={`/${auto.id}/${marcaSlug}-${modeloSlug}`}
			className="card-link"
			style={{ textDecoration: "none", color: "inherit" }}
			state={{ fromCatalogo: true }}
		>
			<div className="card" style={{ width: "16rem", position: "relative" }}>
				{auto.oferta && <div className="oferta-nube">¡Oferta!</div>}
				{auto.destacar && (
					<div className="oferta-icon">
						<FontAwesomeIcon icon={faMedal} />
					</div>
				)}
				<img src={imageUrl} className="card-img-top" alt={auto.modelo} />

				<div className="card-body">
					<div className="title-container">
						<span className="car-brand">{auto.marca}</span>
						<h5 className="card-title">
							{auto.modelo} ({auto.anio})
						</h5>
					</div>

					<div className="price-display">
						{auto.oferta ? (
							<>
								<div className="price-row">
									<span className="offer-price">
										{auto.moneda === "AR$" ? "$" : "U$D"}
										{auto.precio_oferta}
									</span>
								</div>
								<div className="price-row">
									<span className="original-price">
										{auto.moneda === "AR$" ? "$" : "U$D"}
										{auto.precio}
									</span>
									<span className="mileage">{auto.km} km</span>
								</div>
							</>
						) : (
							<div className="price-row">
								<span className="normal-price">
									{auto.moneda === "AR$" ? "$" : "U$D"}
									{auto.precio}
								</span>
								{hasValidKm(auto.km) && (<span className="mileage">{auto.km} km</span>)}
							</div>
						)}
					</div>

					<div className="btn btn-primary verMas">Ver más</div>
				</div>
			</div>
		</Link>
	);
}
