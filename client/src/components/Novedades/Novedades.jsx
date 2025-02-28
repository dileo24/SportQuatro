import React, { useEffect, useState } from "react";
import "./Novedades.css";
import axios from "axios";
import Card from "../Card/Card";

export default function Novedades() {
	let [autos, setAutos] = useState([]);

	useEffect(() => {
		handleAutos();
	}, []);

	async function handleAutos() {
		try {
			const resp = await axios.get("http://localhost:3001/autos/destacados");
			setAutos(resp.data.resp);
		} catch (error) {
			console.error("Error al obtener autos:", error);
		}
	}

	return (
		<div className="nov-cards-container">
			{autos && autos.map((auto) => <Card auto={auto} key={auto.id}/>)}
		</div>
	);
}
