import React from "react";
import "./Beneficios.css";
import Novedades from "../../components/Novedades/Novedades";

export default function Beneficios() {
	return (
		<div className="">
			<div className="facilidades-container">
				<div className="texto">
					<p className="texto1">Facilidades</p>
					<p className="texto2">No solo vendemos autos...</p>
				</div>
			</div>
			<div className="text-container">
				<p className="text1">
					Cada día pensamos en cómo seguir mejorando para brindar la mejor
					atención al cliente y nos vuelvan a elegir.
					<br />
					Para nosotros la opinión de nuestros clientes es muy importante para
					así seguir mejorando en un futuro.
					<br />
					<br />
				</p>

				<p className="text2">
					<br />
					Poseemos financiación en varias entidades bancaria y ofrecemos cuotas
					fijas. Estas se pueden realizar en 12-24-36-48 y hasta 60 cuotas.
					Además tomamos usados al mejor precio para que puedas llevarte el auto
					de tus sueños.
					<br />
					<br />
				</p>
				<p className="text2">
					<br />
					En caso de querer vender tu vehículo contamos con la mejor
					consignación:
					<br />• Venta asegurada plazo 60 días.
					<br />
					<br />• Te adelantamos el 10% o 20% según la unidad.
					<br />
					<br />• Transferencia inmediata al momento de la venta.
					<br />
					<br />• Alistaje del vehículo por cuenta de la agencia.
					<br />
					<br />• Alistaje de detalles a cuanta del titular.
					<br /><br /><br />
				</p>
			</div>
			<div className="nov-container">
				<p className="texto1" style={{fontSize: "3vw"}}>Novedades</p>
				<p className="texto3">¡Últimos ingresos!</p>

				<Novedades />
			</div>
		</div>
	);
}
