import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  TextField,
  MenuItem
} from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import { transactionsService } from "../services/transactions";
import { packagesService } from "../services/packages";
import { useAuth } from "../context/AuthContext";
import { formatIDR, formatDateTime } from "../utils/format";

const statusOptions = ["ALL", "SUCCESS", "PENDING", "FAILED", "REFUNDED"];

function StatusChip({ status }) {
  const map = {
    SUCCESS: { color: "success", label: "SUCCESS" },
    PENDING: { color: "warning", label: "PENDING" },
    FAILED: { color: "error", label: "FAILED" },
    REFUNDED: { color: "default", label: "REFUNDED" }
  };
  const it = map[status] || { color: "default", label: status || "-" };
  return <Chip size="small" color={it.color} label={it.label} />;
}

export default function TransactionsPage() {
  const { customer } = useAuth();
  const [tx, setTx] = React.useState([]);
  const [packages, setPackages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState("ALL");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([transactionsService.list(), packagesService.list()]);

      setPackages(Array.isArray(p) ? p : []);
      const allTx = Array.isArray(t) ? t : [];

      // hanya transaksi customer yang sedang login
      setTx(allTx.filter((x) => x.customerId === customer.id));
    } catch (e) {
      setPackages([]);
      setTx([]);
    } finally {
      setLoading(false);
    }
  }, [customer.id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const packageName = (id) => packages.find((p) => p.id === id)?.name || `Paket #${id}`;
  const filtered = tx.filter((t) => (filterStatus === "ALL" ? true : t.status === filterStatus));

  return (
    <Box>
      <PageHeader
        title="Transaksi"
        subtitle="Riwayat pembelian paket data kamu."
        right={
          <Chip
            color={loading ? "default" : "primary"}
            label={loading ? "Memuat..." : `${filtered.length} transaksi`}
          />
        }
      />

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              select
              label="Filter Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              fullWidth
            >
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={80}>ID</TableCell>
                  <TableCell>Paket</TableCell>
                  <TableCell>Nomor Tujuan</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Waktu</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.id}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{packageName(r.packageId)}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{r.phoneNumber || "-"}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900 }}>
                      {formatIDR(r.total)}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={r.status} />
                    </TableCell>
                    <TableCell>{formatDateTime(r.createdAt)}</TableCell>
                  </TableRow>
                ))}

                {!loading && filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                      Belum ada transaksi. Yuk beli paket di Beranda.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
