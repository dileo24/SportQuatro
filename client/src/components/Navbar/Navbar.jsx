import React from "react";
import { NavLink } from "react-router-dom"; // Importa NavLink
import "./Navbar.css";
import imgLogo from "../../assets/logo_sinFondo_blanco.png";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
	const { isAuthenticated } = useAuth();

	return (
		<nav className="navbar navbar-expand-lg fixed-top">
			<div className="container-fluid">
				<NavLink to={`/`} className="navbar-brand">
					<img src={imgLogo} alt="logo" width="150" />
				</NavLink>
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
							<NavLink
								to={`/`}
								className={({ isActive }) =>
									isActive ? "nav-link active" : "nav-link"
								}
								aria-current="page"
							>
								Inicio
							</NavLink>
						</li>
						<li className="nav-item me-2">
							<NavLink
								to={`/catalogo`}
								className={({ isActive }) =>
									isActive ? "nav-link active" : "nav-link"
								}
								aria-current="page"
							>
								Vehículos
							</NavLink>
						</li>
						<li className="nav-item me-2">
							<NavLink
								to={`/nosotros`}
								className={({ isActive }) =>
									isActive ? "nav-link active" : "nav-link"
								}
								aria-current="page"
							>
								Nosotros
							</NavLink>
						</li>
						<li className="nav-item me-2">
							<NavLink
								to={`/contacto`}
								className={({ isActive }) =>
									isActive ? "nav-link active" : "nav-link"
								}
								aria-current="page"
							>
								Contacto
							</NavLink>
						</li>
						{isAuthenticated && (
							<li className="nav-item me-2">
								<NavLink
									to={`/nuevo_auto`}
									className={({ isActive }) =>
										isActive ? "nav-link active" : "nav-link"
									}
									aria-current="page"
								>
									Nuevo auto
								</NavLink>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}
