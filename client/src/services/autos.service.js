import axios from "axios";

const API_URL = `http://localhost:3001/autos`;

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
