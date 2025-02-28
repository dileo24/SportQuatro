import Footer from "./components/Footer/Footer";
import Home from "./views/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	return (
		<div className="app-container">
			<Navbar />
			<main className="main-content">
				<Home />
			</main>
			<Footer />
		</div>
	);
}

export default App;
