import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  // ✅ default demo: erlis
  const [email, setEmail] = React.useState("erlis@mail.com");
  const [password, setPassword] = React.useState("erlis");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* LEFT: Image column */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
          bgcolor: "grey.100",
          overflow: "hidden"
        }}
      >
        {/* ✅ Ganti src ini dengan gambar kamu (bisa url atau import asset) */}
        <Box
          component="img"
          src="src/assets/banner.jpg"
          alt="Login Visual"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }}
        />

        {/* overlay biar elegan */}
        <Box
          sx={{
            position: "absolute",
            inset: 0
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: 40,
            bottom: 40,
            right: 40,
            color: "white"
          }}
        >
          
        </Box>
      </Box>

      {/* RIGHT: Form column */}
      <Box
        sx={{
          flex: 1,
          minWidth: { xs: "100%", md: 520 },
          bgcolor: "background.default",
          display: "grid",
          placeItems: "center",
          p: { xs: 2, md: 4 }
        }}
      >
        <Card sx={{ width: "min(520px, 100%)", borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  display: "grid",
                  placeItems: "center",
                  color: "white"
                }}
              >
                <LockOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  Login
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Masuk untuk membeli paket data
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}

            <form onSubmit={onSubmit}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Masuk..." : "Login"}
              </Button>
            </form>

            {/* ✅ Demo hint: erlis */}
            <Box sx={{ mt: 2 }}>
              <Alert severity="info">
                Demo: <b>erlis@mail.com</b> / <b>erlis</b>
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
