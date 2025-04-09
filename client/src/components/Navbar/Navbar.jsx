import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/user.service";
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Button,
	Menu,
	MenuItem,
	Box,
	useMediaQuery,
	Divider,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import imgLogo from "../../assets/logo_sinFondo_blanco.png";

export default function Navbar() {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const isMobile = useMediaQuery("(max-width:600px)");
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		try {
			await logoutUser();
			logout();
			navigate("/");
			handleClose();
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	};

	const navItems = [
		{ label: "Inicio", path: "/" },
		{ label: "Vehículos", path: "/catalogo" },
		{ label: "Financiación", path: "/financiacion" },
		{ label: "Nosotros", path: "/nosotros" },
		{ label: "Contacto", path: "/contacto" },
		{ label: "Compramos tu auto", path: "/compramos" },
		...(isAuthenticated ? [{ label: "Nuevo auto", path: "/nuevo_auto" }] : []),
	];

	// Función para verificar si un item está activo
	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<AppBar position="fixed" sx={{ bgcolor: "rgb(29, 29, 29)" }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box
					component="img"
					src={imgLogo}
					alt="logo"
					sx={{ height: 40, cursor: "pointer" }}
					onClick={() => navigate("/")}
				/>

				{isMobile ? (
					<>
						<IconButton
							size="large"
							edge="end"
							color="inherit"
							aria-label="menu"
							onClick={handleMenu}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
							PaperProps={{
								sx: {
									bgcolor: "rgb(29, 29, 29)",
									color: "white",
									width: "70%",
									maxWidth: "300px",
								},
							}}
						>
							{navItems.map((item) => (
								<MenuItem
									key={item.path}
									onClick={() => {
										navigate(item.path);
										handleClose();
									}}
									sx={{
										"&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
										bgcolor: isActive(item.path)
											? "rgba(255, 0, 0, 0.2)"
											: "transparent",
										borderLeft: isActive(item.path)
											? "3px solid #d80606"
											: "none",
									}}
								>
									<ListItemText
										primaryTypographyProps={{
											fontWeight: isActive(item.path) ? "bold" : "normal",
											color: isActive(item.path) ? "#d80606" : "inherit",
										}}
									>
										{item.label}
									</ListItemText>
								</MenuItem>
							))}
							{isAuthenticated && (
								<>
									<Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
									<MenuItem
										onClick={handleLogout}
										sx={{
											color: "#d80606",
											"&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
										}}
									>
										<ListItemIcon>
											<AccountCircle sx={{ color: "#d80606" }} />
										</ListItemIcon>
										<ListItemText>Cerrar sesión</ListItemText>
									</MenuItem>
								</>
							)}
						</Menu>
					</>
				) : (
					<Box sx={{ display: "flex", gap: 2 }}>
						{navItems.map((item) => (
							<Button
								key={item.path}
								color="inherit"
								onClick={() => navigate(item.path)}
								sx={{
									textTransform: "none",
									fontSize: "1rem",
									"&:hover": {
										transform: "scale(1.05)",
										color: "white",
									},
									fontWeight: isActive(item.path) ? "bold" : "normal",
									color: isActive(item.path) ? "#d80606" : "inherit",
									borderBottom: isActive(item.path)
										? "2px solid #d80606"
										: "none",
									borderRadius: 0,
								}}
							>
								{item.label}
							</Button>
						))}
						{isAuthenticated && (
							<Button
								color="error"
								onClick={handleLogout}
								startIcon={<AccountCircle />}
								sx={{
									textTransform: "none",
									fontSize: "1rem",
									"&:hover": {
										transform: "scale(1.05)",
									},
								}}
							>
								Cerrar sesión
							</Button>
						)}
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
}
