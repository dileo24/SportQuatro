import { createContext, useState, useEffect, useContext } from "react";

const FiltrosContext = createContext();

export const FiltrosProvider = ({ children }) => {
	const cargarFiltrosIniciales = () => {
		if (typeof window !== "undefined") {
			try {
				const guardados = sessionStorage.getItem("filtrosCatalogo");
				return guardados ? JSON.parse(guardados) : getFiltrosVacios();
			} catch {
				return getFiltrosVacios();
			}
		}
		return getFiltrosVacios();
	};

	const getFiltrosVacios = () => ({
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
	});

	const [filtros, _setFiltros] = useState(cargarFiltrosIniciales());

	useEffect(() => {
		if (typeof window !== "undefined") {
			sessionStorage.setItem("filtrosCatalogo", JSON.stringify(filtros));
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
