import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Home from "./views/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Detalle from "./views/Detalle/Detalle";
import "./App.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./views/Login/Login";
import Catalogo from "./views/Catalogo/Catalogo";
import Nosotros from "./views/Nosotros/Nosotros";
import Wpp from "./components/Wpp/Wpp";
import Contacto from "./views/Contacto/Contacto";
import NuevoAuto from "./views/NuevoAuto/NuevoAuto";
import Financiacion from "./views/Financiacion/Financiacion";

function App() {
	return (
		<div className="app-container">
			<Navbar />
			<main className="main-content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/loginAdminP" element={<Login />} />
					<Route path="/catalogo" element={<Catalogo />} />
					<Route path="/nosotros" element={<Nosotros />} />
					<Route path="/financiacion" element={<Financiacion />} />
					<Route path="/contacto" element={<Contacto />} />
					<Route path="/nuevo_auto" element={<NuevoAuto />} />
					<Route path="/detalle/:id" element={<Detalle />} />
				</Routes>
			</main>
			<Wpp />
			<Footer />
		</div>
	);
}

export default App;
