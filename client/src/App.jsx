import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Home from "./views/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Detalle from "./views/Detalle/Detalle";
import "./App.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./views/LogIn/Login";
import PruebaContext from "./views/PruebaContext";

function App() {
	return (
		<div className="app-container">
			<Navbar />
			<main className="main-content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/loginAdminP" element={<Login />} />
					<Route path="/detalle/:id" element={<Detalle />} />
					<Route path="/pruebacontext" element={<PruebaContext />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
