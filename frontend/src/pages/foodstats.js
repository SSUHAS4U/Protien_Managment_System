import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Card, Typography, Avatar, Button, Stack, Divider,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from '@mui/material';
import Calendar from 'react-calendar';
import '../Styles/Enhanced.css';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import EggAltRoundedIcon from '@mui/icons-material/EggAltRounded';
import GrainRoundedIcon from '@mui/icons-material/GrainRounded';
import OpacityRoundedIcon from '@mui/icons-material/OpacityRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';

const fmt = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];

const MACROS = [
  { key: 'totalEnergy', label: 'Energy', unit: 'kcal', color: '#f59e0b', icon: LocalFireDepartmentRoundedIcon },
  { key: 'totalProtein', label: 'Protein', unit: 'g', color: '#6366f1', icon: EggAltRoundedIcon },
  { key: 'totalNetCarbs', label: 'Net Carbs', unit: 'g', color: '#10b981', icon: GrainRoundedIcon },
  { key: 'totalFat', label: 'Fat', unit: 'g', color: '#f43f5e', icon: OpacityRoundedIcon },
];

export default function FoodStatistics() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [details, setDetails] = useState(null);
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });

  const email = sessionStorage.getItem('email');
  const authToken = sessionStorage.getItem('authToken');

  const load = useCallback(async () => {
    if (!email) return;
    const date = fmt(selectedDate);
    const h = { headers: { email, Authorization: `Bearer ${authToken}` } };
    try {
      const [list, st] = await Promise.all([
        axios.get(`${API_BASE}/fooddiary/list/${date}`, h),
        axios.get(`${API_BASE}/fooddiary/stats/${date}`, { headers: { email } }),
      ]);
      setItems(Array.isArray(list.data) ? list.data : []);
      setStats(st.data || {});
    } catch {
      setItems([]); setStats({});
    }
  }, [selectedDate, email, authToken]);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    try {
      await axios.delete(`${API_BASE}/fooddiary/delete/${id}`, { headers: { email, Authorization: `Bearer ${authToken}` } });
      setItems((x) => x.filter((i) => i.id !== id));
      setSnack({ open: true, severity: 'success', message: 'Entry removed.' });
      load();
    } catch { setSnack({ open: true, severity: 'error', message: 'Could not delete.' }); }
  };

  const showDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/fooddiary/details/${id}`, { headers: { email, Authorization: `Bearer ${authToken}` } });
      setDetails(res.data);
    } catch { /* ignore */ }
  };

  return (
    <AppLayout title="Food Stats">
      <Grid container spacing={3}>
        {/* Left: calendar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1.5 }}>Pick a day</Typography>
            <Calendar onChange={setSelectedDate} value={selectedDate} className="custom-calendar" />
            <Typography sx={{ textAlign: 'center', mt: 2, fontWeight: 700, color: 'primary.dark' }}>{selectedDate.toDateString()}</Typography>
          </Card>
        </Grid>

        {/* Right: totals + table */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {MACROS.map((m) => (
              <Grid item xs={6} sm={3} key={m.key}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: `${m.color}1a`, color: m.color, width: 40, height: 40, mx: 'auto', mb: 1 }}><m.icon /></Avatar>
                  <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26, color: m.color, lineHeight: 1 }}>
                    {Math.round(stats[m.key] || 0)}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{m.label} ({m.unit})</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ p: 2.5, mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22 }}>Logged meals</Typography>
              <Button size="small" variant="contained" onClick={() => (window.location.href = '/addfood')}>+ Add food</Button>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 36 }}>🍽️</Typography>
                <Typography>No food logged for this day.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Energy</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((it) => (
                      <TableRow key={it.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{it.name}</TableCell>
                        <TableCell>{it.category || '—'}</TableCell>
                        <TableCell align="right">{Math.round(it.energy || 0)} kcal</TableCell>
                        <TableCell align="right">
                          <Button size="small" onClick={() => showDetails(it.id)} sx={{ minWidth: 0 }}>Details</Button>
                          <Button size="small" color="error" onClick={() => del(it.id)} sx={{ minWidth: 0 }}><DeleteOutlineRoundedIcon fontSize="small" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>

      <Dialog open={Boolean(details)} onClose={() => setDetails(null)} PaperProps={{ sx: { borderRadius: 4, width: 380 } }}>
        <DialogTitle sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800 }}>{details?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {[['Energy', `${Math.round(details?.energy || 0)} kcal`], ['Protein', `${Math.round(details?.protein || 0)} g`], ['Fat', `${Math.round(details?.fat || 0)} g`], ['Net Carbs', `${Math.round(details?.netCarbs || 0)} g`], ['Category', details?.category || '—'], ['Quantity', details?.quantity || '—']].map(([k, v]) => (
              <Stack key={k} direction="row" justifyContent="space-between"><Typography color="text.secondary">{k}</Typography><Typography fontWeight={700}>{v}</Typography></Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setDetails(null)}>Close</Button></DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
}
