import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, Avatar, Stack, Button, Divider, LinearProgress } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import { Flame, Drumstick, Wheat, Droplet, Dumbbell, ArrowRight, Utensils } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TARGETS = { energy: 2000, protein: 150, carbs: 250, fat: 70 };
const fmt = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [food, setFood] = useState({});
  const [ex, setEx] = useState({});
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [week, setWeek] = useState([]);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');
    if (!email || !authToken) return;
    const h = { headers: { email, Authorization: `Bearer ${authToken}` } };
    const eh = { headers: { email } };
    const today = fmt(new Date());

    axios.get(`${API_BASE}/users?email=${email}`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then((r) => { if (r.data.user) { setUserName(r.data.user.name); sessionStorage.setItem('userName', r.data.user.name); } }).catch(() => {});
    axios.get(`${API_BASE}/fooddiary/stats/${today}`, eh).then((r) => setFood(r.data || {})).catch(() => {});
    axios.get(`${API_BASE}/exercisediary/stats/${today}`, eh).then((r) => setEx(r.data || {})).catch(() => {});
    axios.get(`${API_BASE}/fooddiary/list/${today}`, h).then((r) => setMeals(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    axios.get(`${API_BASE}/exercisediary/list/${today}`, h).then((r) => setWorkouts(Array.isArray(r.data) ? r.data : [])).catch(() => {});

    // 7-day trend (calories in vs out)
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
    Promise.all(days.map((d) => {
      const ds = fmt(d);
      return Promise.all([
        axios.get(`${API_BASE}/fooddiary/stats/${ds}`, eh).then((r) => r.data?.totalEnergy || 0).catch(() => 0),
        axios.get(`${API_BASE}/exercisediary/stats/${ds}`, eh).then((r) => r.data?.totalEnergy || 0).catch(() => 0),
      ]).then(([inn, out]) => ({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), in: Math.round(inn), out: Math.round(out) }));
    })).then(setWeek).catch(() => {});
  }, []);

  const consumed = Math.round(food.totalEnergy || 0);
  const burned = Math.round(ex.totalEnergy || 0);
  const net = consumed - burned;
  const protein = Math.round(food.totalProtein || 0);
  const targetPct = Math.max(0, Math.min(100, Math.round((net / TARGETS.energy) * 100)));

  const macroDonut = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [food.totalProtein || 0, food.totalNetCarbs || 0, food.totalFat || 0],
      backgroundColor: ['#6366f1', '#10b981', '#f43f5e'],
      borderWidth: 0, hoverOffset: 6,
    }],
  };
  const macroEmpty = !(food.totalProtein || food.totalNetCarbs || food.totalFat);

  const trend = {
    labels: week.map((w) => w.label),
    datasets: [
      { label: 'Calories in', data: week.map((w) => w.in), backgroundColor: '#f59e0b', borderRadius: 6, maxBarThickness: 18 },
      { label: 'Calories out', data: week.map((w) => w.out), backgroundColor: '#16a34a', borderRadius: 6, maxBarThickness: 18 },
    ],
  };

  return (
    <AppLayout title="Dashboard">
      {/* Greeting + net balance */}
      <Box sx={{ borderRadius: 5, p: { xs: 3, md: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#15803d,#84cc16)', boxShadow: '0 24px 50px -24px rgba(22,163,74,.6)' }}>
        <Flame style={{ position: 'absolute', right: -12, top: -12, width: 150, height: 150, opacity: 0.14 }} />
        <Typography sx={{ opacity: 0.9, fontWeight: 600 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Typography>
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 30, md: 42 }, lineHeight: 1 }}>
          Hi {userName || 'there'} 👋
        </Typography>
        <Grid container spacing={2} sx={{ mt: 0.5, maxWidth: 620 }}>
          {[['Eaten', consumed, 'kcal'], ['Burned', burned, 'kcal'], ['Net', net, 'kcal']].map(([l, v, u]) => (
            <Grid item xs={4} key={l}>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 30, lineHeight: 1 }}>{v}</Typography>
              <Typography sx={{ opacity: 0.9, fontSize: 13 }}>{l} ({u})</Typography>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, maxWidth: 420 }}>
          <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontSize: 13, opacity: 0.9 }}>Daily target {TARGETS.energy} kcal</Typography><Typography sx={{ fontSize: 13, fontWeight: 700 }}>{targetPct}%</Typography></Stack>
          <LinearProgress variant="determinate" value={targetPct} sx={{ mt: 0.5, height: 10, borderRadius: 99, bgcolor: 'rgba(255,255,255,.25)', '& .MuiLinearProgress-bar': { bgcolor: '#fff', borderRadius: 99 } }} />
        </Box>
      </Box>

      {/* Macro StatCards (today) */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Energy', value: consumed, unit: 'kcal', color: '#f59e0b', Icon: Flame, p: (consumed / TARGETS.energy) * 100 },
          { label: 'Protein', value: protein, unit: 'g', color: '#6366f1', Icon: Drumstick, p: (protein / TARGETS.protein) * 100 },
          { label: 'Net Carbs', value: Math.round(food.totalNetCarbs || 0), unit: 'g', color: '#10b981', Icon: Wheat, p: ((food.totalNetCarbs || 0) / TARGETS.carbs) * 100 },
          { label: 'Fat', value: Math.round(food.totalFat || 0), unit: 'g', color: '#f43f5e', Icon: Droplet, p: ((food.totalFat || 0) / TARGETS.fat) * 100 },
        ].map((m, i) => (
          <Grid item xs={6} md={3} key={m.label}>
            <StatCard label={m.label} value={m.value} unit={m.unit} color={m.color} Icon={m.Icon} progress={Math.min(100, m.p)} delay={i * 0.06} />
          </Grid>
        ))}
      </Grid>

      {/* Trend + macro donut */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 2 }}>This week — calories in vs out</Typography>
            <Box sx={{ height: 280 }}>
              <Bar data={trend} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#eef2f1' }, beginAtZero: true } } }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 2 }}>Today's macros</Typography>
            {macroEmpty ? (
              <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 40 }}>🍽️</Typography>
                <Typography>Log a meal to see your split.</Typography>
              </Box>
            ) : (
              <Box sx={{ maxWidth: 240, mx: 'auto' }}>
                <Doughnut data={macroDonut} options={{ cutout: '64%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } } } }} />
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Today's meals + workouts + quick actions */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Avatar sx={{ bgcolor: '#f59e0b1a', color: '#f59e0b', width: 36, height: 36 }}><Utensils size={18} /></Avatar>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22 }}>Today's meals</Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {meals.length === 0 ? <Typography sx={{ color: 'text.secondary', py: 2 }}>No meals logged yet.</Typography> : (
              <Stack divider={<Divider />} spacing={0}>
                {meals.slice(0, 5).map((m) => (
                  <Stack key={m.id} direction="row" justifyContent="space-between" sx={{ py: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14, flexShrink: 0 }}>{Math.round(m.energy)} kcal</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Avatar sx={{ bgcolor: '#2563eb1a', color: '#2563eb', width: 36, height: 36 }}><Dumbbell size={18} /></Avatar>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22 }}>Today's workouts</Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {workouts.length === 0 ? <Typography sx={{ color: 'text.secondary', py: 2 }}>No workouts logged yet.</Typography> : (
              <Stack divider={<Divider />} spacing={0}>
                {workouts.slice(0, 5).map((w) => (
                  <Stack key={w.id} direction="row" justifyContent="space-between" sx={{ py: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, pr: 1, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14, flexShrink: 0 }}>{Math.round(w.energy)} kcal</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1.5 }}>Quick actions</Typography>
            <Stack spacing={1.5}>
              {[['Browse Food', '/addfood', '#16a34a'], ['Log a Workout', '/addexercise', '#2563eb'], ['Get Recommendations', '/Recommendations', '#6366f1']].map(([label, path, color]) => (
                <Button key={path} onClick={() => (window.location.href = path)} endIcon={<ArrowRight size={18} />}
                  sx={{ justifyContent: 'space-between', px: 2, py: 1.3, borderRadius: 3, color: '#fff', fontWeight: 700, background: `linear-gradient(135deg, ${color}, ${color}cc)`, '&:hover': { filter: 'brightness(.95)' } }}>
                  {label}
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
