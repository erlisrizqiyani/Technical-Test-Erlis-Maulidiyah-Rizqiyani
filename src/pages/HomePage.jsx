import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Divider
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PageHeader from "../components/common/PageHeader";
import { packagesService } from "../services/packages";
import { customersService } from "../services/customers";
import { transactionsService } from "../services/transactions";
import { useAuth } from "../context/AuthContext";
import { formatIDR, safeNumber } from "../utils/format";

function PackageCard({ item, onBuy }) {
  return (
    <Card sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ p: 3, flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
          <Chip size="small" label={item.provider} />
          {item.tag ? (
            <Chip size="small" color="primary" variant="outlined" label={item.tag} />
          ) : null}
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
          {item.name}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Dapatkan kuota hingga <b>{item.quotaGb} GB</b> <br />
          Masa aktif <b>{item.validDays} hari</b>
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 900, mt: 2 }}>
          {formatIDR(item.price)}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCartOutlinedIcon />}
          onClick={() => onBuy(item)}
        >
          Beli Sekarang
        </Button>
      </Box>
    </Card>
  );
}

export default function HomePage() {
  const { customer, refreshMe } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  const [packages, setPackages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [selectedPkg, setSelectedPkg] = React.useState(null);

  // ✅ ganti qty -> nomor tujuan
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, type: "success", msg: "" });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const p = await packagesService.list();
      if (Array.isArray(p)) {
        setPackages(p);
      } else {
        console.error("Unexpected packages payload:", p);
        setPackages([]);
        setToast({ open: true, type: "error", msg: "Format data paket tidak sesuai (bukan array)" });
      }
    } catch (e) {
      console.error("Fetch packages error:", e);
      setPackages([]);
      setToast({ open: true, type: "error", msg: "Gagal memuat katalog. Cek json-server/port." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  // ✅ ambil query ?q= dari URL (untuk search)
  const params = new URLSearchParams(loc.search);
  const qSearch = (params.get("q") || "").trim().toLowerCase();

  // ✅ filter katalog berdasarkan query
  const filteredPackages = React.useMemo(() => {
    if (!qSearch) return packages;
    return packages.filter((p) => {
      const hay = `${p.name} ${p.provider} ${p.tag || ""} ${p.quotaGb || ""} ${p.validDays || ""}`.toLowerCase();
      return hay.includes(qSearch);
    });
  }, [packages, qSearch]);

  const openCheckout = (pkg) => {
    setSelectedPkg(pkg);

    // ✅ auto isi nomor dari profil customer (opsional)
    setPhoneNumber(customer?.phone || "");

    setCheckoutOpen(true);
  };

  // ✅ tanpa qty: subtotal = harga paket
  const subtotal = safeNumber(selectedPkg?.price, 0);
  const balance = safeNumber(customer?.balance, 0);

  const goToTopUp = () => {
    nav("/account");
  };

  const doCheckout = async () => {
    if (!selectedPkg) return;

    // ✅ validasi nomor tujuan
    const normalized = (phoneNumber || "").replace(/\s+/g, "");
    if (!normalized) {
      setToast({ open: true, type: "warning", msg: "Nomor HP tujuan wajib diisi" });
      return;
    }
    if (!/^08\d{8,12}$/.test(normalized)) {
      setToast({ open: true, type: "error", msg: "Format nomor tidak valid. Contoh: 08123456789" });
      return;
    }

    // ✅ cek saldo
    if (balance < subtotal) {
      setToast({ open: true, type: "error", msg: "Saldo kamu tidak cukup. Silakan top up." });
      return;
    }

    setSaving(true);
    try {
      await transactionsService.create({
        customerId: customer.id,
        packageId: selectedPkg.id,
        phoneNumber: normalized, // ✅ simpan nomor tujuan
        total: subtotal,
        status: "SUCCESS",
        createdAt: new Date().toISOString()
      });

      await customersService.patch(customer.id, { balance: balance - subtotal });
      await refreshMe();

      setToast({ open: true, type: "success", msg: "Pembelian berhasil ✅ (cek menu Transaksi)" });
      setCheckoutOpen(false);
      setPhoneNumber("");
    } catch (e) {
      console.error(e);
      setToast({ open: true, type: "error", msg: "Checkout gagal" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Beranda"
        subtitle={
          qSearch
            ? `Menampilkan hasil untuk: "${qSearch}" • Saldo kamu: ${formatIDR(balance)}`
            : `Halo, ${customer?.name}. Saldo kamu: ${formatIDR(balance)}`
        }
        right={
          <Chip
            color={loading ? "default" : "primary"}
            label={loading ? "Memuat..." : `${filteredPackages.length} paket`}
          />
        }
      />

      <Grid container spacing={2}>
        {filteredPackages.map((it) => (
          <Grid key={it.id} item xs={12} sm={6} md={4}>
            <PackageCard item={it} onBuy={openCheckout} />
          </Grid>
        ))}

        {!loading && filteredPackages.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                {qSearch ? (
                  <>
                    Tidak ada paket yang cocok dengan pencarian <b>"{qSearch}"</b>.
                  </>
                ) : (
                  <>Belum ada paket.</>
                )}
              </CardContent>
            </Card>
          </Grid>
        ) : null}
      </Grid>

      <Dialog
        open={checkoutOpen}
        onClose={saving ? undefined : () => setCheckoutOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Checkout</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedPkg ? (
            <Box>
              <Card sx={{ borderRadius: 2, mb: 2 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 900 }}>{selectedPkg.name}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {selectedPkg.provider} • {selectedPkg.quotaGb}GB • {selectedPkg.validDays} hari
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, mt: 1 }}>
                    {formatIDR(selectedPkg.price)}
                  </Typography>
                </CardContent>
              </Card>

              <Stack spacing={2}>
                {/* ✅ nomor tujuan */}
                <TextField
                  label="Nomor HP Tujuan"
                  placeholder="Contoh: 08123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  fullWidth
                />

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography color="text.secondary">Harga</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {formatIDR(subtotal)}
                  </Typography>
                </Box>

                <Alert
                  severity={balance >= subtotal ? "success" : "error"}
                  action={
                    balance < subtotal ? (
                      <Button color="inherit" size="small" onClick={goToTopUp}>
                        Top Up
                      </Button>
                    ) : null
                  }
                >
                  Saldo kamu: <b>{formatIDR(balance)}</b> — {balance >= subtotal ? "cukup" : "tidak cukup"}
                </Alert>
              </Stack>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setCheckoutOpen(false)} disabled={saving}>
            Batal
          </Button>
          <Button variant="contained" onClick={doCheckout} disabled={saving}>
            {saving ? "Memproses..." : "Bayar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      >
        <Alert severity={toast.type} onClose={() => setToast((p) => ({ ...p, open: false }))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
