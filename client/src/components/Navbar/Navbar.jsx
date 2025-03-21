import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import imgLogo from "../../assets/logo_sinFondo_blanco.png";

export default function Navbar() {
	return (
		<nav className="navbar navbar-expand-lg fixed-top">
			<div className="container-fluid">
				<Link to={`/`} className="navbar-brand">
					<img src={imgLogo} alt="logo" width="150" />
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mb-2 mb-lg-0">
						<li className="nav-item me-2">
							<Link to={`/`} className="nav-link active" aria-current="page">
								Inicio
							</Link>
						</li>
						<li className="nav-item me-2">
							<Link
								to={`/catalogo`}
								className="nav-link active"
								aria-current="page"
							>
								Vehículos
							</Link>
						</li>
						<li className="nav-item me-2">
							<Link
								to={`/about`}
								className="nav-link"
								aria-current="page"
							>
								Sobre la agencia
							</Link>
						</li>
						<li className="nav-item me-2">
							<Link
								to={`/beneficios`}
								className="nav-link"
								aria-current="page"
							>
								Beneficios y servicios
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
