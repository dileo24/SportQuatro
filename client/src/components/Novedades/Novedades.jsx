import React, { useEffect, useState } from "react";
import "./Novedades.css";
import axios from "axios";
import Card from "../Card/Card";
import { getAutosDestacados } from "../../services/autos.service";

export default function Novedades() {
	let [autos, setAutos] = useState([]);

	useEffect(() => {
		handleAutos();
	}, []);

	async function handleAutos() {
		try {
			const data = await getAutosDestacados();
			setAutos(data.resp);
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
