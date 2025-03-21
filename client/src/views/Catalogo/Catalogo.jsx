import React, { useEffect, useState } from "react";
import "./Catalogo.css";
import axios from "axios";
import Card from "../../components/Card/Card";
import { getAutos, getAutosDestacados } from "../../services/autos.service";

export default function Catalogo() {
    let [autos, setAutos] = useState([]);

    useEffect(() => {
        handleAutos();
    }, []);

    async function handleAutos() {
        try {
            const data = await getAutos();
            setAutos(data.resp);
        } catch (error) {
            console.error("Error al obtener autos:", error);
        }
    }

    return (
        <div >
            {autos && autos.map((auto) => <Card auto={auto} key={auto.id}/>)}
        </div>
    );
}
