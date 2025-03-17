import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function PruebaContext() {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	return (
		<div style={{ marginTop: "5rem" }}>
			{isAuthenticated ? (
				<>
					<p>hola</p>
					<button
						onClick={() => {
							logout();
							Navigate("/pruebacontext");
						}}
					>
						cerrar sesión
					</button>
				</>
			) : (
				<>
					<p>logeate</p>
					<button
						onClick={() => {
							logout();
							navigate("/loginAdminP");
						}}
					>
						iniciar sesión
					</button>
				</>
			)}
		</div>
	);
}

export default PruebaContext;
