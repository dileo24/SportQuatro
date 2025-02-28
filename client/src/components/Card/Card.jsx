import React from "react";
import "./Card.css";

export default function Card({ auto }) {
	const imageUrl = `http://localhost:3001/files/${auto.img[0]}`;

	return (
		<div className="card" style={{ width: "18rem" }}>
			<img src={imageUrl} className="card-img-top" alt={auto.modelo} />

			<div className="card-body">
				<h5 className="card-title">{auto.modelo}</h5>
				<div className="card-text">
					<p>${auto.precio}</p>
					<p>{auto.km} km</p>
				</div>
				<a href="#" className="btn btn-primary">
					Ver más
				</a>
			</div>
		</div>
	);
}
