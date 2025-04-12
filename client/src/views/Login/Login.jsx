import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser /*, verifyCode*/ } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Container,
	Grid,
	CircularProgress,
} from "@mui/material";
import { ArrowBack, Email } from "@mui/icons-material";

const Login = () => {
	const [form, setForm] = useState({ email: "", pass: "" });
	const [state, setState] = useState({
		errors: {},
		// verificationStep: false, // Comentado para implementación futura
		// verificationCode: "",    // Comentado para implementación futura
		// codeError: "",          // Comentado para implementación futura
		// attemptsLeft: 5,        // Comentado para implementación futura
		loading: false,
		// showMaxAttemptsError: false, // Comentado para implementación futura
	});

	const { login /*, setPendingEmail, pendingEmail*/ } = useAuth();
	const navigate = useNavigate();

	// useEffect comentado para implementación futura
	/*
  useEffect(() => {
    if (!state.verificationStep) {
      setState((prev) => ({
        ...prev,
        codeError: "",
        showMaxAttemptsError: false,
      }));
    }
  }, [state.verificationStep]);
  */

	const handleChange = (e) => {
		const { name, value } = e.target;
		// Código de verificación comentado para implementación futura
		/*
    if (state.verificationStep && name === "code") {
      setState((prev) => ({ ...prev, verificationCode: value, codeError: "" }));
    } else {
    */
		setForm((prev) => ({ ...prev, [name]: value }));
		setState((prev) => ({ ...prev, errors: { ...prev.errors, [name]: "" } }));
		// }
	};

	const handleSubmit = async (e, isVerification = false) => {
		e.preventDefault();
		setState((prev) => ({
			...prev,
			loading: true,
			// ...(isVerification ? {} : { errors: {} }), // Comentado para implementación futura
			errors: {}, // Simplificado sin verificación
		}));

		try {
			// Eliminada la verificación por código (isVerification siempre false)
			const data = await loginUser(form);

			if (data.status === 200) {
				// Eliminada la lógica de verificación requerida
				login();
				navigate("/");
			}
		} catch (error) {
			// Eliminado el manejo de errores de verificación
			if (error.errors) {
				const apiErrors = {};
				error.errors.forEach((err) => (apiErrors[err.input] = err.resp));
				setState((prev) => ({ ...prev, errors: apiErrors }));
			}
		} finally {
			setState((prev) => ({ ...prev, loading: false }));
		}
	};

	// Función comentada para implementación futura
	/*
  const backToLogin = () => {
    setState((prev) => ({
      ...prev,
      verificationStep: false,
      verificationCode: "",
      codeError: "",
      attemptsLeft: 5,
      showMaxAttemptsError: false,
    }));
  };
  */

	const buttonStyles = {
		primary: {
			backgroundColor: "#dc3545",
			color: "#fff",
			"&:hover": { backgroundColor: "#bb2d3b" },
			"&:disabled": { backgroundColor: "#dc354580" },
		},
		outlined: {
			color: "#dc3545",
			borderColor: "#dc3545",
			"&:hover": {
				borderColor: "#bb2d3b",
				backgroundColor: "rgba(220, 53, 69, 0.04)",
			},
		},
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 8 }}>
			<Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
				{/* Eliminado el condicional de verificationStep y dejado solo el formulario de login */}
				<Box
					component="form"
					onSubmit={(e) => handleSubmit(e, false)}
					sx={{ mt: 2 }}
				>
					<Typography
						variant="h5"
						component="h1"
						gutterBottom
						align="center"
						sx={{ mb: 4, fontWeight: "bold" }}
					>
						Iniciar sesión
					</Typography>

					<TextField
						fullWidth
						label="Email"
						name="email"
						value={form.email}
						onChange={handleChange}
						error={!!state.errors.email}
						helperText={state.errors.email}
						margin="normal"
						InputProps={{
							startAdornment: <Email color="action" sx={{ mr: 1 }} />,
						}}
					/>

					<TextField
						fullWidth
						label="Contraseña"
						name="pass"
						type="password"
						value={form.pass}
						onChange={handleChange}
						error={!!state.errors.pass}
						helperText={state.errors.pass}
						margin="normal"
					/>

					<Button
						fullWidth
						type="submit"
						variant="contained"
						size="large"
						sx={{ ...buttonStyles.primary, mt: 3, mb: 2, py: 1.5 }}
						disabled={state.loading}
					>
						{state.loading ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							"Iniciar sesión"
						)}
					</Button>
				</Box>

				{/* Sección de verificación por código comentada para implementación futura */}
				{/*
        {state.verificationStep ? (
          <Box
            component="form"
            onSubmit={(e) => handleSubmit(e, true)}
            sx={{ mt: 2 }}
          >
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              Verificación requerida
            </Typography>

            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              Hemos enviado un código de verificación a{" "}
              <strong>{pendingEmail}</strong>
            </Typography>

            <TextField
              fullWidth
              label="Código de verificación"
              name="code"
              value={state.verificationCode}
              onChange={handleChange}
              error={!!state.codeError}
              helperText={state.codeError}
              margin="normal"
              inputProps={{ maxLength: 6 }}
              disabled={state.showMaxAttemptsError}
            />

            <Typography
              variant="body2"
              sx={{ mt: 1, mb: 2 }}
              color={state.attemptsLeft <= 2 ? "error" : "text.secondary"}
            >
              Intentos restantes: {state.attemptsLeft}
            </Typography>

            {state.showMaxAttemptsError && (
              <Typography
                variant="body2"
                color="error"
                align="center"
                sx={{ mb: 2 }}
              >
                Demasiados intentos fallidos. Será redirigido automáticamente...
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={backToLogin}
                  disabled={state.loading || state.showMaxAttemptsError}
                  sx={{ ...buttonStyles.outlined, py: 1.5 }}
                >
                  Volver
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={
                    state.verificationCode.length !== 6 ||
                    state.loading ||
                    state.showMaxAttemptsError
                  }
                  sx={{ ...buttonStyles.primary, py: 1.5 }}
                >
                  {state.loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verificar"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={(e) => handleSubmit(e, false)}
            sx={{ mt: 2 }}
          >
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              align="center"
              sx={{ mb: 4, fontWeight: "bold" }}
            >
              Iniciar sesión
            </Typography>

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={!!state.errors.email}
              helperText={state.errors.email}
              margin="normal"
              InputProps={{
                startAdornment: <Email color="action" sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="pass"
              type="password"
              value={form.pass}
              onChange={handleChange}
              error={!!state.errors.pass}
              helperText={state.errors.pass}
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ ...buttonStyles.primary, mt: 3, mb: 2, py: 1.5 }}
              disabled={state.loading}
            >
              {state.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </Box>
        )}
        */}
			</Paper>
		</Container>
	);
};

export default Login;
