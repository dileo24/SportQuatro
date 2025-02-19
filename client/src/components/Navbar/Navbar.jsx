import React from "react";
import "./Navbar.css";

export default function Navbar() {
	return (
		<nav className="navbar navbar-expand-lg bg-dark bg-gradient fixed-top">
			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					<img src="src/assets/logo_sinFondo_blanco.png" alt="logo" width="150" />
				</a>
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
							<a className="nav-link active" aria-current="page" href="#">
								Inicio
							</a>
						</li>
						<li className="nav-item me-2">
							<a className="nav-link active" aria-current="page" href="#">
								Vehículos
							</a>
						</li>
						<li className="nav-item me-2">
							<a className="nav-link" href="#">
								Sobre la agencia
							</a>
						</li>
						<li className="nav-item me-2">
							<a className="nav-link" href="#">
								Beneficios y servicios
							</a>
						</li>

						<li className="nav-item">
							<a className="nav-link" href="#">
								Contacto
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
