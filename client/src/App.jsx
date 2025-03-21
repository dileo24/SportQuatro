import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Home from "./views/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Detalle from "./views/Detalle/Detalle";
import "./App.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./views/Login/Login";
import PruebaContext from "./views/PruebaContext";
import Catalogo from "./views/Catalogo/Catalogo";
import Beneficios from "./views/Beneficios/Beneficios";
import About from "./views/About/About";
import Wpp from "./components/Wpp/Wpp";

function App() {
	return (
		<div className="app-container">
			<Navbar />
			<main className="main-content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/loginAdminP" element={<Login />} />
					<Route path="/catalogo" element={<Catalogo />} />
					<Route path="/beneficios" element={<Beneficios />} />
					<Route path="/about" element={<About />} />
					<Route path="/detalle/:id" element={<Detalle />} />
					<Route path="/pruebacontext" element={<PruebaContext />} />
				</Routes>
			</main>
			<Wpp />
			<Footer />
		</div>
	);
}

export default App;
