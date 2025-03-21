import React from "react";
import "./Home.css";
import Novedades from "../../components/Novedades/Novedades";
import { NavLink } from "react-router-dom";

export default function Home() {
	return (
		<div className="home-container">
			<div className="hero-container">
				<div className="texto">
					<p className="texto1">
						Pasá a modo
						<br />
						SPORT
					</p>
					<p className="texto2">Agencia de seleccionados en Córdoba capital</p>
				</div>

				<div className="imgDivContainer">
					<div className="imgDiv"></div>
				</div>
			</div>
			<div className="button-container">
				<NavLink className="NavLink" to={`/catalogo`}>VER CATÁLOGO</NavLink>
			</div>

			<div className="nov-container">
				<p className="texto1">Novedades</p>
				<p className="texto3">¡Últimos ingresos!</p>

				<Novedades />
			</div>
		</div>
	);
}
