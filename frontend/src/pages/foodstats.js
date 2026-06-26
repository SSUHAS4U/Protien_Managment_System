import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Card, Typography, Button, Stack, Divider, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from '@mui/material';
import Calendar from 'react-calendar';
import '../Styles/Enhanced.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Flame, Drumstick, Wheat, Droplet, Trash2 } from 'lucide-react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const fmt = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
const MACROS = [
  { key: 'totalEnergy', label: 'Energy', unit: 'kcal', color: '#f59e0b', Icon: Flame, target: 2000 },
  { key: 'totalProtein', label: 'Protein', unit: 'g', color: '#6366f1', Icon: Drumstick, target: 150 },
  { key: 'totalNetCarbs', label: 'Net Carbs', unit: 'g', color: '#10b981', Icon: Wheat, target: 250 },
  { key: 'totalFat', label: 'Fat', unit: 'g', color: '#f43f5e', Icon: Droplet, target: 70 },
];
const CAT_COLOR = { Breakfast: '#f59e0b', Lunch: '#16a34a', Dinner: '#6366f1', Snacks: '#fb7185' };

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
    } catch { setItems([]); setStats({}); }
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

  const macroEmpty = !(stats.totalProtein || stats.totalNetCarbs || stats.totalFat);
  const donut = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{ data: [stats.totalProtein || 0, stats.totalNetCarbs || 0, stats.totalFat || 0], backgroundColor: ['#6366f1', '#10b981', '#f43f5e'], borderWidth: 0, hoverOffset: 6 }],
  };

  return (
    <AppLayout title="Food Stats">
      <Box sx={{ borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#f59e0b,#fb923c)', boxShadow: '0 24px 50px -22px rgba(245,158,11,.5)' }}>
        <Flame style={{ position: 'absolute', right: -12, top: -12, width: 140, height: 140, opacity: 0.16 }} />
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 28, sm: 38 }, lineHeight: 1 }}>Your food diary</Typography>
        <Typography sx={{ opacity: 0.95, mt: 1, maxWidth: 560 }}>Pick a day to review your meals and macros. Foods you add from Browse Food show up here instantly.</Typography>
      </Box>

      {/* Macro StatCards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {MACROS.map((m, i) => (
          <Grid item xs={6} md={3} key={m.key}>
            <StatCard label={m.label} value={Math.round(stats[m.key] || 0)} unit={m.unit} color={m.color} Icon={m.Icon} delay={i * 0.06} progress={Math.min(100, ((stats[m.key] || 0) / m.target) * 100)} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Calendar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1.5 }}>Pick a day</Typography>
            <Calendar onChange={setSelectedDate} value={selectedDate} className="custom-calendar" />
            <Typography sx={{ textAlign: 'center', mt: 2, fontWeight: 700, color: 'primary.dark' }}>{selectedDate.toDateString()}</Typography>
          </Card>
        </Grid>

        {/* Macro split */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1 }}>Macro split</Typography>
            {macroEmpty ? (
              <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 40 }}>🍽️</Typography>
                <Typography>No data for this day.</Typography>
              </Box>
            ) : (
              <Box sx={{ maxWidth: 230, mx: 'auto' }}>
                <Doughnut data={donut} options={{ cutout: '64%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } } } }} />
              </Box>
            )}
          </Card>
        </Grid>

        {/* Logged meals as cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22 }}>Logged meals</Typography>
              <Button size="small" variant="contained" startIcon={<AddRoundedIcon />} onClick={() => (window.location.href = '/addfood')}>Add</Button>
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 36 }}>🥗</Typography>
                <Typography>No food logged for this day.</Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {items.map((it) => (
                  <Box key={it.id} sx={{ p: 1.5, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #eef2f1', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.4 }}>
                        {it.category && <Chip size="small" label={it.category} sx={{ height: 20, fontSize: 11, bgcolor: `${CAT_COLOR[it.category] || '#64748b'}1a`, color: CAT_COLOR[it.category] || '#64748b', fontWeight: 700 }} />}
                        <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{Math.round(it.energy)} kcal</Typography>
                      </Stack>
                    </Box>
                    <Button size="small" onClick={() => showDetails(it.id)} sx={{ minWidth: 0, fontSize: 12 }}>Details</Button>
                    <IconButton size="small" color="error" onClick={() => del(it.id)}><Trash2 size={16} /></IconButton>
                  </Box>
                ))}
              </Stack>
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
