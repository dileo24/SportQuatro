import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = `http://localhost:3001/admin`;

export const loginUser = async (formData) => {
	try {
		const response = await axios.post(`${API_URL}/login`, formData);
		return response.data;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const verifyCode = async (codigo) => {
	try {
		const response = await axios.post(`${API_URL}/verify-code`, {
			codigo,
		});
		return response.data;
	} catch (error) {
		throw error.response
			? error.response.data
			: {
					status: 400,
					errors: [{ resp: "Error al verificar el código", input: "code" }],
					intentosRestantes: error.response?.data?.intentosRestantes || 0,
			  };
	}
};

export const logoutUser = async () => {
	try {
		const response = await axios.post(`${API_URL}/logout`);
		return response.data;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};
