import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./Wpp.css";

export default function Wpp() {
	return (
		<a href="https://api.whatsapp.com/send?phone=3516863857" target="_blank" rel="noopener noreferrer" className="float">
			<FontAwesomeIcon icon={faWhatsapp} size="2x" />
		</a>
	);
}
