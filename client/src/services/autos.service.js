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

export const getMarcas = async () => {
	try {
		const response = await axios.get(`${API_URL}/marcas`);
		return response.data;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const getAutoById = async (id) => {
	try {
		const response = await axios.get(`${API_URL}/${id}`);
		return response;
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

export const postAuto = async (formData) => {
	try {
		const response = await axios.post(`${API_URL}`, formData);
		return response;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const postImagen = async (file) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/files`,
			file,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const updateAuto = async (id, data) => {
	try {
		const response = await axios.put(`${API_URL}/${id}`, data);
		return response;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const deleteAuto = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}/${id}`);
		return response;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};

export const updateImgInAuto = async (id, updatedImages) => {
	try {
		const response = await axios.put(`${API_URL}/${id}`, {
			img: updatedImages,
		});
		return response;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};
