import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/autos`;

export const getAutosDestacados = async () => {
	try {
		const response = await axios.get(`${API_URL}/destacados`);
		return response.data;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const getAutos = async () => {
	try {
		const response = await axios.get(`${API_URL}`);
		return response.data;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const getAutosRelacionados = async (idCateg) => {
	try {
		const response = await axios.post(`${API_URL}/relacionados`, {
			id_categ: idCateg.map(String),
		});
		return response.data.resp;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};
