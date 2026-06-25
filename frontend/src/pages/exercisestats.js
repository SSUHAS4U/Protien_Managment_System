import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Card, Typography, Avatar, Button, Stack, Divider,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Snackbar, Alert,
} from '@mui/material';
import Calendar from 'react-calendar';
import '../Styles/Enhanced.css';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';

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
    { label: 'Calories Burned', value: totalBurned, unit: 'kcal', color: '#16a34a', icon: LocalFireDepartmentRoundedIcon },
    { label: 'Workouts', value: items.length, unit: '', color: '#2563eb', icon: FitnessCenterRoundedIcon },
    { label: 'Active Minutes', value: totalMinutes, unit: 'min', color: '#fb923c', icon: TimerRoundedIcon },
  ];

  return (
    <AppLayout title="Exercise Stats">
      <Box sx={{ borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#2563eb,#22d3ee)', boxShadow: '0 24px 50px -22px rgba(37,99,235,.5)' }}>
        <FitnessCenterRoundedIcon sx={{ position: 'absolute', right: -10, top: -10, fontSize: 150, opacity: 0.16 }} />
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 28, sm: 38 }, lineHeight: 1 }}>Your workout log</Typography>
        <Typography sx={{ opacity: 0.95, mt: 1, maxWidth: 560 }}>Pick a day to see the calories you burned. Log workouts from Log Exercise and they appear here right away.</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1.5 }}>Pick a day</Typography>
            <Calendar onChange={setSelectedDate} value={selectedDate} className="custom-calendar" />
            <Typography sx={{ textAlign: 'center', mt: 2, fontWeight: 700, color: 'primary.dark' }}>{selectedDate.toDateString()}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {CARDS.map((c) => (
              <Grid item xs={12} sm={4} key={c.label}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: `${c.color}1a`, color: c.color, width: 40, height: 40, mx: 'auto', mb: 1 }}><c.icon /></Avatar>
                  <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26, color: c.color, lineHeight: 1 }}>{c.value}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{c.label} {c.unit && `(${c.unit})`}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ p: 2.5, mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22 }}>Logged workouts</Typography>
              <Button size="small" variant="contained" onClick={() => (window.location.href = '/addexercise')}>+ Log workout</Button>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 36 }}>🏋️</Typography>
                <Typography>No workouts logged for this day.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Exercise</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Body part</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Duration</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Burned</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Remove</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((it) => (
                      <TableRow key={it.id} hover>
                        <TableCell sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{it.name}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{it.category || '—'}</TableCell>
                        <TableCell align="right">{Math.round(it.duration || 0)} min</TableCell>
                        <TableCell align="right">{Math.round(it.energy || 0)} kcal</TableCell>
                        <TableCell align="right">
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

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
}
