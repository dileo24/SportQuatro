import React, { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Typography,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	useMediaQuery,
	Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import {
	tiposCombustible,
	tiposTransmision,
	ordenamientos,
	categoria,
	oferta,
} from "../../data/filters";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useFiltros } from "../../context/FiltrosContext";
import { getMarcas } from "../../services/autos.service";

const Filtros = () => {
	const isMobile = useMediaQuery("(max-width:600px)");
	const [expanded, setExpanded] = useState(!isMobile);
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: currentYear - 2004 }, (_, i) => 2005 + i);
	const [marcas, setMarcas] = useState([]);

	useEffect(() => {
		const fetchMarcas = async () => {
			try {
				const data = await getMarcas();
				setMarcas(data.map((marca) => ({ value: marca, label: marca })));
			} catch (error) {
				console.error("Error cargando marcas:", error);
			}
		};

		fetchMarcas();
	}, []);

	const { filtros, setFiltros } = useFiltros();
	const [labelShrink, setLabelShrink] = useState({
		anioDesde: false,
		anioHasta: false,
		transmision: false,
		combustible: false,
		oferta: false,
		categoria: false,
		marca: false,
	});

	const [tempValues, setTempValues] = useState({
		kmDesde: filtros.kmDesde,
		kmHasta: filtros.kmHasta,
		precioDesde: filtros.precioDesde,
		precioHasta: filtros.precioHasta,
	});

	const handleClearField = (fieldName) => {
		setFiltros((prev) => ({ ...prev, [fieldName]: "" }));
		setTempValues((prev) => ({ ...prev, [fieldName]: "" }));
		setLabelShrink((prev) => ({ ...prev, [fieldName]: false }));
	};

	const renderTextFieldWithClear = (name, label) => (
		<TextField
			fullWidth
			label={label}
			name={name}
			value={tempValues[name]}
			onChange={handleTextFieldChange}
			onBlur={handleTextFieldBlur}
			slotProps={{ inputLabel: { shrink: true } }}
			InputProps={{
				endAdornment: tempValues[name] && (
					<InputAdornment position="end">
						<IconButton
							edge="end"
							onClick={() => handleClearField(name)}
							size="small"
							sx={{ marginRight: -1 }}
						>
							<ClearIcon fontSize="small" />
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);

	const formatNumber = (value) => {
		if (!value) return "";
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};
	const parseNumber = (formattedValue) => {
		if (!formattedValue) return "";
		return formattedValue.replace(/\./g, "");
	};
	const handleTextFieldChange = (e) => {
		const { name, value } = e.target;
		const rawValue = value.replace(/[^\d]/g, "");
		const formattedValue = formatNumber(rawValue);
		setTempValues((prev) => ({ ...prev, [name]: formattedValue }));
	};

	const hasActiveFilters = Object.values(filtros).some(
		(value) => value !== "" && value !== null && value !== undefined
	);

	const handleClearFilters = () => {
		setFiltros({
			anioDesde: "",
			anioHasta: "",
			kmDesde: "",
			kmHasta: "",
			precioDesde: "",
			precioHasta: "",
			transmision: "",
			combustible: "",
			marca: "",
			oferta: "",
			categoria: "",
			ordenamiento: "",
		});
		setTempValues({
			kmDesde: "",
			kmHasta: "",
			precioDesde: "",
			precioHasta: "",
		});
		setLabelShrink({
			anioDesde: false,
			anioHasta: false,
			transmision: false,
			combustible: false,
			oferta: false,
			categoria: false,
			marca: false,
		});
	};

	const handleAccordionChange = () => {
		setExpanded(!expanded);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (
			[
				"anioDesde",
				"anioHasta",
				"transmision",
				"combustible",
				"oferta",
				"categoria",
				"marca",
				"ordenamiento",
			].includes(name)
		) {
			setFiltros((prev) => ({ ...prev, [name]: value }));
			setLabelShrink((prev) => ({ ...prev, [name]: true }));
		} else {
			setTempValues((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleTextFieldBlur = (e) => {
		const { name, value } = e.target;
		const parsedValue = parseNumber(value);
		setFiltros((prev) => ({ ...prev, [name]: parsedValue }));
		setLabelShrink((prev) => ({ ...prev, [name]: !!parsedValue }));
		setTempValues((prev) => ({ ...prev, [name]: formatNumber(parsedValue) }));
	};

	const handleFocus = (name) => {
		setLabelShrink((prev) => ({ ...prev, [name]: true }));
	};

	const handleBlur = (name, value) => {
		const hasValue = value !== "" && value !== null && value !== undefined;
		setLabelShrink((prev) => ({ ...prev, [name]: hasValue }));
	};

	const renderSelect = (name, label, options) => {
		const value = filtros[name] === undefined ? "" : filtros[name];
		const hasValue = value !== "" && value !== null && value !== undefined;

		return (
			<FormControl fullWidth>
				<InputLabel id={`${name}-label`} shrink={labelShrink[name] || hasValue}>
					{label}
				</InputLabel>
				<Select
					labelId={`${name}-label`}
					name={name}
					value={value}
					onChange={handleChange}
					onFocus={() => handleFocus(name)}
					onBlur={() => handleBlur(name, value)}
					label={label}
					MenuProps={{
						disableScrollLock: true,
					}}
				>
					{options.map((option) => (
						<MenuItem key={String(option.value)} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	const renderFilters = () => (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<Box sx={{ display: "flex", gap: 1 }}>
				{renderSelect("ordenamiento", "Ordenar por", ordenamientos)}
				{renderSelect("marca", "Marca", marcas)}
			</Box>
			<Box sx={{ display: "flex", gap: 1 }}>
				{renderSelect(
					"anioDesde",
					"Año Desde",
					years.map((year) => ({ value: year, label: year }))
				)}
				{renderSelect(
					"anioHasta",
					"Año Hasta",
					years.map((year) => ({ value: year, label: year }))
				)}
			</Box>

			<Box sx={{ display: "flex", gap: 1 }}>
				{renderTextFieldWithClear("precioDesde", "Precio Desde")}
				{renderTextFieldWithClear("precioHasta", "Precio Hasta")}
			</Box>

			<Box sx={{ display: "flex", gap: 1 }}>
				{renderTextFieldWithClear("kmDesde", "Km Desde")}
				{renderTextFieldWithClear("kmHasta", "Km Hasta")}
			</Box>

			<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
				{renderSelect("categoria", "Categoria", categoria)}
				{renderSelect("transmision", "Transmisión", tiposTransmision)}
				{renderSelect("combustible", "Combustible", tiposCombustible)}
				{renderSelect("oferta", "En oferta", oferta)}
			</Box>

			{isMobile && hasActiveFilters && (
				<Button
					variant="outlined"
					color="error"
					startIcon={<ClearIcon />}
					onClick={handleClearFilters}
					sx={{ mt: 1 }}
					fullWidth
				>
					Limpiar Filtros
				</Button>
			)}
		</Box>
	);

	if (isMobile) {
		return (
			<Accordion
				expanded={expanded}
				onChange={handleAccordionChange}
				sx={{ mb: 2 }}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="filtros-content"
					id="filtros-header"
				>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Filtros{" "}
						{expanded
							? ""
							: `(${
									Object.values(filtros).filter((v) => v !== "").length
							  } aplicados)`}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>{renderFilters()}</AccordionDetails>
			</Accordion>
		);
	}

	return (
		<Paper elevation={3} sx={{ p: 2, mb: 2 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: "bold" }}>
					Filtros
				</Typography>
				{hasActiveFilters && (
					<Button
						variant="outlined"
						color="error"
						startIcon={<ClearIcon />}
						onClick={handleClearFilters}
						size="small"
					>
						Limpiar
					</Button>
				)}
			</Box>
			{renderFilters()}
		</Paper>
	);
};

export default Filtros;
