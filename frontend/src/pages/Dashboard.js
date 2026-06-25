import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, Avatar, Stack, LinearProgress, Chip, Divider } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import EggAltRoundedIcon from '@mui/icons-material/EggAltRounded';
import ScaleRoundedIcon from '@mui/icons-material/ScaleRounded';
import WavingHandRoundedIcon from '@mui/icons-material/WavingHandRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';

ChartJS.register(ArcElement, Tooltip, Legend);

const MACRO = { energy: '#f59e0b', protein: '#6366f1', fat: '#f43f5e', carbs: '#10b981' };

function MetricCard({ icon: Icon, color, label, value, unit, sub }) {
  return (
    <Card sx={{ p: 2.5, height: '100%', position: 'relative', overflow: 'hidden', transition: 'transform .25s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <Box sx={{ position: 'absolute', right: -16, top: -16, width: 90, height: 90, borderRadius: '50%', bgcolor: `${color}14` }} />
      <Avatar sx={{ bgcolor: `${color}1a`, color, width: 44, height: 44, mb: 1.5 }}><Icon /></Avatar>
      <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 34, lineHeight: 1, color }}>
        {value}<Typography component="span" sx={{ fontSize: 15, color: 'text.secondary', ml: 0.5 }}>{unit}</Typography>
      </Typography>
      <Typography sx={{ fontWeight: 700, mt: 0.5 }}>{label}</Typography>
      {sub && <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{sub}</Typography>}
    </Card>
  );
}

function MacroDoughnut({ title, stats }) {
  const data = {
    labels: ['Energy', 'Protein', 'Fat', 'Carbs'],
    datasets: [{
      data: [stats.totalEnergy || 0, stats.totalProtein || 0, stats.totalFat || 0, stats.totalNetCarbs || 0],
      backgroundColor: [MACRO.energy, MACRO.protein, MACRO.fat, MACRO.carbs],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };
  const empty = !(stats.totalEnergy || stats.totalProtein || stats.totalFat || stats.totalNetCarbs);
  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 2 }}>{title}</Typography>
      {empty ? (
        <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
          <Typography sx={{ fontSize: 40 }}>🍽️</Typography>
          <Typography>No data yet — start logging to see your breakdown.</Typography>
        </Box>
      ) : (
        <Box sx={{ maxWidth: 280, mx: 'auto' }}>
          <Doughnut data={data} options={{ cutout: '62%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } } } }} />
        </Box>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const [userData, setUserData] = useState({ email: '', weight: '', heightFeet: '', heightInches: '', gender: '', bio: '' });
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({});
  const [exerciseStats, setExerciseStats] = useState({});
  const [targetKcal] = useState(Number(localStorage.getItem('targetKcal')) || 2000);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');
    if (!email || !authToken) return;
    const h = { headers: { Authorization: `Bearer ${authToken}` } };
    axios.get(`${API_BASE}/users?email=${email}`, h).then((res) => {
      const u = res.data.user;
      if (u) {
        setUserName(u.name);
        sessionStorage.setItem('userName', u.name);
        setUserData({ email: u.email, weight: u.weight, heightFeet: u.heightFeet, heightInches: u.heightInches, gender: u.gender, bio: u.bio });
      }
    }).catch(() => {});
    axios.get(`${API_BASE}/fooddiary/foodstats`, { headers: { email } }).then((r) => setStats(r.data || {})).catch(() => setStats({}));
    axios.get(`${API_BASE}/exercisediary/exercisestats`, { headers: { email } }).then((r) => setExerciseStats(r.data || {})).catch(() => setExerciseStats({}));
  }, []);

  const consumed = Math.round(stats.totalEnergy || 0);
  const burned = Math.round(exerciseStats.totalEnergy || 0);
  const net = consumed - burned;
  const protein = Math.round(stats.totalProtein || 0);
  const targetPct = Math.min(100, Math.round((net / targetKcal) * 100));

  return (
    <AppLayout title="Dashboard">
      {/* Welcome hero */}
      <Box sx={{ borderRadius: 5, p: { xs: 3, md: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#15803d,#84cc16)', boxShadow: '0 24px 50px -24px rgba(22,163,74,.6)' }}>
        <WavingHandRoundedIcon sx={{ position: 'absolute', right: -8, top: -8, fontSize: 150, opacity: 0.14 }} />
        <Typography sx={{ opacity: 0.9, fontWeight: 600 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Typography>
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 32, md: 44 }, lineHeight: 1 }}>
          Welcome back, {userName || 'there'}!
        </Typography>
        <Typography sx={{ opacity: 0.95, mt: 1, maxWidth: 520 }}>
          Here's your nutrition snapshot. Net energy is {net} kcal toward your {targetKcal} kcal target.
        </Typography>
        <Box sx={{ mt: 2, maxWidth: 360 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 13, opacity: 0.9 }}>Daily target</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{targetPct}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={targetPct} sx={{ height: 10, borderRadius: 99, bgcolor: 'rgba(255,255,255,.25)', '& .MuiLinearProgress-bar': { bgcolor: '#fff', borderRadius: 99 } }} />
        </Box>
      </Box>

      {/* Bento metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}><MetricCard icon={LocalFireDepartmentRoundedIcon} color={MACRO.energy} label="Calories In" value={consumed} unit="kcal" sub="from your food diary" /></Grid>
        <Grid item xs={6} md={3}><MetricCard icon={BoltRoundedIcon} color="#16a34a" label="Calories Out" value={burned} unit="kcal" sub="from your workouts" /></Grid>
        <Grid item xs={6} md={3}><MetricCard icon={ScaleRoundedIcon} color="#2563eb" label="Net Energy" value={net} unit="kcal" sub={`target ${targetKcal} kcal`} /></Grid>
        <Grid item xs={6} md={3}><MetricCard icon={EggAltRoundedIcon} color={MACRO.protein} label="Protein" value={protein} unit="g" sub="total logged" /></Grid>
      </Grid>

      {/* Charts + profile */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}><MacroDoughnut title="Nutrition breakdown" stats={stats} /></Grid>
        <Grid item xs={12} md={4}><MacroDoughnut title="Exercise breakdown" stats={exerciseStats} /></Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 2 }}>Your profile</Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: '#16a34a', fontWeight: 800, fontSize: 28 }}>{(userName || 'U').charAt(0).toUpperCase()}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{userName}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{userData.email}</Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.2}>
              {[['Gender', userData.gender], ['Weight', userData.weight ? `${userData.weight} kg` : '—'], ['Height', userData.heightFeet ? `${userData.heightFeet}'${userData.heightInches || 0}"` : '—']].map(([k, v]) => (
                <Stack key={k} direction="row" justifyContent="space-between">
                  <Typography sx={{ color: 'text.secondary' }}>{k}</Typography>
                  <Typography sx={{ fontWeight: 700, textTransform: 'capitalize' }}>{v || '—'}</Typography>
                </Stack>
              ))}
            </Stack>
            <Chip label="Edit in Account" onClick={() => (window.location.href = '/account')} sx={{ mt: 2, bgcolor: '#eafce9', color: '#15803d', fontWeight: 700, cursor: 'pointer' }} />
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
