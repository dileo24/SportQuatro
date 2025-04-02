import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/free-solid-svg-icons/faMedal";

export default function Card({ auto }) {
	const imageUrl = `http://localhost:3001/files/${auto.img[0]}`;

	return (
		<Link
			to={`/detalle/${auto.id}`}
			className="card-link"
			style={{ textDecoration: "none", color: "inherit" }}
		>
			<div className="card" style={{ width: "18rem", position: "relative" }}>
				{auto.oferta && <div className="oferta-nube">¡Oferta!</div>}
				{auto.destacar && (
					<div className="oferta-icon">
						<FontAwesomeIcon icon={faMedal} />
					</div>
				)}
				<img src={imageUrl} className="card-img-top" alt={auto.modelo} />

				<div className="card-body">
					<h5 className="card-title">{auto.modelo}</h5>
					<div className="card-text">
						{auto.oferta ? (
							<div className="precio-container">
								<p className="fw-bold text-danger">
									{auto.moneda === "AR$" ? "$" : "U$D"}
									{auto.precio_oferta}
								</p>
								<p className="text-muted text-decoration-line-through">
									{auto.moneda === "AR$" ? "$" : "U$D"}
									{auto.precio}
								</p>
							</div>
						) : (
							<p>
								{auto.moneda === "AR$" ? "$" : "U$D"}
								{auto.precio}
							</p>
						)}
						<p>{auto.km} km</p>
					</div>
					<div className="btn btn-primary verMas">Ver más</div>
				</div>
			</div>
		</Link>
	);
}
