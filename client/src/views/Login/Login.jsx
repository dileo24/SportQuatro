import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
	let [form, setForm] = useState({ email: "", pass: "" });
	let [errors, setErrors] = useState({});
	const { login } = useAuth();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		try {
			const response = await axios.post(
				`http://localhost:3001/admin/login`,
				form
			);

			if (response.data.status === 200 && response.data.resp === true) {
				login();
				console.log("Inicio de sesión exitoso");
			}
		} catch (error) {
			if (error.response && error.response.data.errors) {
				const apiErrors = {};
				error.response.data.errors.forEach((err) => {
					apiErrors[err.input] = err.resp;
				});
				setErrors(apiErrors);
			}
		}
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						className={`form-control ${errors.email ? "is-invalid" : ""}`}
						id="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						placeholder="Ingrese su email..."
					/>
					{errors.email && (
						<div className="invalid-feedback">{errors.email}</div>
					)}
				</div>
				<div className="form-group">
					<label htmlFor="pass">Contraseña</label>
					<input
						type="password"
						className={`form-control ${errors.pass ? "is-invalid" : ""}`}
						id="pass"
						name="pass"
						value={form.pass}
						onChange={handleChange}
						placeholder="Ingrese su contraseña..."
					/>
					{errors.pass && <div className="invalid-feedback">{errors.pass}</div>}
				</div>
				<button type="submit" className="btn btn-danger">
					Iniciar sesión
				</button>
			</form>
		</div>
	);
}
