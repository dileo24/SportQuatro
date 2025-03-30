import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./Wpp.css";

export default function Wpp() {
	return (
		<a
			href="https://api.whatsapp.com/send?phone=543517917367&text=Hola!%20Estuve%20en%20la%20web%20de%20SportQuatro%2C%20quisiera%20realizar%20una%20consulta."
			target="_blank"
			rel="noopener noreferrer"
			className="float"
		>
			<FontAwesomeIcon icon={faWhatsapp} size="2x" />
		</a>
	);
}
