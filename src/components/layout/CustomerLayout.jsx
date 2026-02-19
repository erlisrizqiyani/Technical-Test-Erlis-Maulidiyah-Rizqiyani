import React from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useAuth } from "../../context/AuthContext";

export default function CustomerLayout() {
  const { customer, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // ✅ search routing
  const nav = useNavigate();
  const loc = useLocation();
  const [q, setQ] = React.useState("");

  // sync input with url (?q=...)
  React.useEffect(() => {
    const params = new URLSearchParams(loc.search);
    setQ(params.get("q") || "");
  }, [loc.search]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(loc.search);

    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");

    // ✅ selalu arahkan ke halaman katalog (home) saat search
    nav({ pathname: "/", search: params.toString() });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.main" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
            Speed<span style={{ opacity: 0.9 }}>ternet</span>
          </Typography>

          {/* ✅ SEARCH BAR (works) */}
          <Box sx={{ flex: 1 }}>
            <form onSubmit={onSubmitSearch}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  px: 2,
                  py: 0.6
                }}
              >
                <SearchIcon sx={{ opacity: 0.9 }} />
                <InputBase
                  placeholder="Cari paket data, provider, kuota..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  sx={{ ml: 1, color: "white", width: "100%" }}
                />
              </Box>
            </form>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button
              component={NavLink}
              to="/"
              color="inherit"
              startIcon={<StorefrontOutlinedIcon />}
              sx={{ "&.active": { bgcolor: "rgba(255,255,255,0.18)" } }}
            >
              Beranda
            </Button>
            <Button
              component={NavLink}
              to="/transactions"
              color="inherit"
              startIcon={<ReceiptLongOutlinedIcon />}
              sx={{ "&.active": { bgcolor: "rgba(255,255,255,0.18)" } }}
            >
              Transaksi
            </Button>
            <Button
              component={NavLink}
              to="/account"
              color="inherit"
              startIcon={<PersonOutlineOutlinedIcon />}
              sx={{ "&.active": { bgcolor: "rgba(255,255,255,0.18)" } }}
            >
              Akun
            </Button>
          </Box>

          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.25)" }}>
              {customer?.name?.[0]?.toUpperCase() || "C"}
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>{customer?.name}</MenuItem>
            <MenuItem component={NavLink} to="/account" onClick={() => setAnchorEl(null)}>
              Akun Saya
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
