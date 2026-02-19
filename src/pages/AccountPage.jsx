import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { customersService } from "../services/customers";
import { formatIDR, safeNumber } from "../utils/format";

export default function AccountPage() {
  const { customer, refreshMe } = useAuth();

  const [name, setName] = React.useState(customer?.name || "");
  const [phone, setPhone] = React.useState(customer?.phone || "");
  const [saving, setSaving] = React.useState(false);

  // ✅ Top up state
  const [topupOpen, setTopupOpen] = React.useState(false);
  const [topupAmount, setTopupAmount] = React.useState(50000);
  const [topupLoading, setTopupLoading] = React.useState(false);

  const [toast, setToast] = React.useState({ open: false, type: "success", msg: "" });

  React.useEffect(() => {
    setName(customer?.name || "");
    setPhone(customer?.phone || "");
  }, [customer]);

  const saveProfile = async () => {
    if (!name.trim() || !phone.trim()) {
      setToast({ open: true, type: "warning", msg: "Nama dan No HP wajib diisi" });
      return;
    }
    setSaving(true);
    try {
      await customersService.patch(customer.id, { name: name.trim(), phone: phone.trim() });
      await refreshMe();
      setToast({ open: true, type: "success", msg: "Profil berhasil diperbarui" });
    } catch {
      setToast({ open: true, type: "error", msg: "Gagal menyimpan profil" });
    } finally {
      setSaving(false);
    }
  };

  const doTopup = async () => {
    const amt = safeNumber(topupAmount, 0);
    if (amt <= 0) {
      setToast({ open: true, type: "warning", msg: "Nominal top up harus lebih dari 0" });
      return;
    }

    setTopupLoading(true);
    try {
      const current = safeNumber(customer?.balance, 0);
      await customersService.patch(customer.id, { balance: current + amt });
      await refreshMe();

      setToast({ open: true, type: "success", msg: `Top up berhasil +${formatIDR(amt)}` });
      setTopupOpen(false);
    } catch {
      setToast({ open: true, type: "error", msg: "Top up gagal" });
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Akun Saya"
        subtitle="Kelola profil dan saldo kamu."
        right={
          <Stack direction="row" spacing={1} alignItems="center">
            <Alert severity="success">Saldo: <b>{formatIDR(customer?.balance)}</b></Alert>
            <Button variant="contained" onClick={() => setTopupOpen(true)}>
              Top Up
            </Button>
          </Stack>
        }
      />

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Profil</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Perubahan profil hanya memengaruhi akun kamu (simulasi).
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Email" value={customer?.email || ""} disabled />
            <TextField label="Nama" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="No HP" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <Button variant="contained" onClick={saveProfile} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ Top Up Dialog */}
      <Dialog open={topupOpen} onClose={topupLoading ? undefined : () => setTopupOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Top Up Saldo</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              Saldo saat ini: <b>{formatIDR(customer?.balance)}</b>
            </Alert>

            <TextField
              label="Nominal Top Up"
              type="number"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>
              }}
              inputProps={{ min: 0 }}
              fullWidth
            />

            <Stack direction="row" spacing={1}>
              {[50000, 100000, 200000].map((n) => (
                <Button key={n} variant="outlined" onClick={() => setTopupAmount(n)} fullWidth>
                  {formatIDR(n)}
                </Button>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setTopupOpen(false)} disabled={topupLoading}>
            Batal
          </Button>
          <Button variant="contained" onClick={doTopup} disabled={topupLoading}>
            {topupLoading ? "Memproses..." : "Konfirmasi Top Up"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast((p) => ({ ...p, open: false }))}>
        <Alert severity={toast.type} onClose={() => setToast((p) => ({ ...p, open: false }))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
