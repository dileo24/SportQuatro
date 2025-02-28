import React from "react";
import "./Home.css";
import imgHero from "../../assets/imgHero.jpg";
import Novedades from "../../components/Novedades/Novedades";

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
				<button>VER CATÁLOGO</button>
			</div>

			<div className="nov-container">
				<p className="texto1">Novedades</p>
				<p className="texto3">¡Últimos ingresos!</p>

				<Novedades />
			</div>
		</div>
	);
}
