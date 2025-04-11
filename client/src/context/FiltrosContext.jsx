import { createContext, useState, useEffect, useContext } from "react";

const FiltrosContext = createContext();

export const FiltrosProvider = ({ children }) => {
	const cargarFiltrosIniciales = () => {
		if (typeof window !== "undefined") {
			const guardados = localStorage.getItem("filtrosCatalogo");
			return guardados
				? JSON.parse(guardados)
				: {
						anioDesde: "",
						anioHasta: "",
						kmDesde: "",
						kmHasta: "",
						precioDesde: "",
						precioHasta: "",
						transmision: "",
						combustible: "",
						categoria: "",
						oferta: "",
						ordenamiento: "",
				  };
		}
		return {
			anioDesde: "",
			anioHasta: "",
			kmDesde: "",
			kmHasta: "",
			precioDesde: "",
			precioHasta: "",
			transmision: "",
			combustible: "",
			categoria: "",
			oferta: "",
			ordenamiento: "",
		};
	};

	const [filtros, _setFiltros] = useState(cargarFiltrosIniciales);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("filtrosCatalogo", JSON.stringify(filtros));
		}
	}, [filtros]);

	const setFiltros = (nuevosFiltros) => {
		_setFiltros(nuevosFiltros);
	};

	return (
		<FiltrosContext.Provider value={{ filtros, setFiltros }}>
			{children}
		</FiltrosContext.Provider>
	);
};

export const useFiltros = () => useContext(FiltrosContext);
