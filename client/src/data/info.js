import {
	faWhatsapp,
	faInstagram,
	faFacebook,
	faTiktok,
} from "@fortawesome/free-brands-svg-icons";

export const paperStyles = {
	p: 1,
	height: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	gap: 1,
	textAlign: "center",
};

export const socialLinks = [
	{
		icon: faWhatsapp,
		color: "#25D366",
		href: "https://api.whatsapp.com/send?phone=543517917367&text=Hola!%20Estuve%20en%20la%20web%20de%20SportQuatro%2C%20quisiera%20realizar%20una%20consulta.",
	},
	{
		icon: faInstagram,
		color: "#E1306C",
		href: "https://www.instagram.com/sportquatro.automotores/",
	},
	{
		icon: faFacebook,
		color: "#4267B2",
		href: "https://www.facebook.com/profile.php?id=100033954375807",
	},
	{
		icon: faTiktok,
		color: "#000000",
		href: "https://www.tiktok.com/@sportquatro.automotores",
	},
];

export const linkStyles = {
	display: "inline-block",
	transition: "transform 0.2s ease",
	"&:hover": {
		transform: "translateY(-3px)",
	},
};
