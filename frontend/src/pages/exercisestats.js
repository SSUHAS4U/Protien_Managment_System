import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Card, Typography, Button, Stack, Divider, Chip, IconButton, Snackbar, Alert,
} from '@mui/material';
import Calendar from 'react-calendar';
import '../Styles/Enhanced.css';
import { Flame, Dumbbell, Timer, Trash2 } from 'lucide-react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';

const fmt = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];

export default function ExerciseStatistics() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });

  const email = sessionStorage.getItem('email');
  const authToken = sessionStorage.getItem('authToken');

  const load = useCallback(async () => {
    if (!email) return;
    try {
      const res = await axios.get(`${API_BASE}/exercisediary/list/${fmt(selectedDate)}`, { headers: { email, Authorization: `Bearer ${authToken}` } });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch { setItems([]); }
  }, [selectedDate, email, authToken]);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    try {
      await axios.delete(`${API_BASE}/exercisediary/delete/${id}`, { headers: { email, Authorization: `Bearer ${authToken}` } });
      setItems((x) => x.filter((i) => i.id !== id));
      setSnack({ open: true, severity: 'success', message: 'Workout removed.' });
    } catch { setSnack({ open: true, severity: 'error', message: 'Could not delete.' }); }
  };

  const totalBurned = Math.round(items.reduce((s, i) => s + (i.energy || 0), 0));
  const totalMinutes = Math.round(items.reduce((s, i) => s + (i.duration || 0), 0));

  const CARDS = [
    { label: 'Calories Burned', value: totalBurned, unit: 'kcal', color: '#16a34a', Icon: Flame, progress: Math.min(100, (totalBurned / 500) * 100) },
    { label: 'Workouts', value: items.length, unit: '', color: '#2563eb', Icon: Dumbbell, progress: null },
    { label: 'Active Minutes', value: totalMinutes, unit: 'min', color: '#fb923c', Icon: Timer, progress: Math.min(100, (totalMinutes / 60) * 100) },
  ];

  return (
    <AppLayout title="Exercise Stats">
      <Box sx={{ borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#2563eb,#22d3ee)', boxShadow: '0 24px 50px -22px rgba(37,99,235,.5)' }}>
        <Dumbbell style={{ position: 'absolute', right: -12, top: -12, width: 140, height: 140, opacity: 0.16 }} />
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 28, sm: 38 }, lineHeight: 1 }}>Your workout log</Typography>
        <Typography sx={{ opacity: 0.95, mt: 1, maxWidth: 560 }}>Pick a day to see the calories you burned. Workouts you log show up here right away.</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {CARDS.map((c, i) => (
          <Grid item xs={12} sm={4} key={c.label}>
            <StatCard label={c.label} value={c.value} unit={c.unit} color={c.color} Icon={c.Icon} progress={c.progress} delay={i * 0.06} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1.5 }}>Pick a day</Typography>
            <Calendar onChange={setSelectedDate} value={selectedDate} className="custom-calendar" />
            <Typography sx={{ textAlign: 'center', mt: 2, fontWeight: 700, color: 'primary.dark' }}>{selectedDate.toDateString()}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22 }}>Logged workouts</Typography>
              <Button size="small" variant="contained" startIcon={<AddRoundedIcon />} onClick={() => (window.location.href = '/addexercise')}>Log</Button>
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 40 }}>🏋️</Typography>
                <Typography>No workouts logged for this day.</Typography>
              </Box>
            ) : (
              <Grid container spacing={1.5}>
                {items.map((it) => (
                  <Grid item xs={12} sm={6} key={it.id}>
                    <Box sx={{ p: 1.75, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #eef2f1', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: '#16a34a1a', color: '#16a34a', flexShrink: 0 }}><Flame size={18} /></Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14.5, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.3 }}>
                          {it.category && <Chip size="small" label={it.category} sx={{ height: 20, fontSize: 11, bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, textTransform: 'capitalize' }} />}
                          <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{Math.round(it.duration || 0)} min · {Math.round(it.energy || 0)} kcal</Typography>
                        </Stack>
                      </Box>
                      <IconButton size="small" color="error" onClick={() => del(it.id)}><Trash2 size={16} /></IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
}
