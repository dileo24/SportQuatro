import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(
		localStorage.getItem("isAuthenticated") === "true"
	);
	const [pendingEmail, setPendingEmail] = useState(null);

	const login = () => {
		setIsAuthenticated(true);
		localStorage.setItem("isAuthenticated", "true");
	};

	const logout = () => {
		setIsAuthenticated(false);
		localStorage.removeItem("isAuthenticated");
		setPendingEmail(null);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				pendingEmail,
				login,
				logout,
				setPendingEmail,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
