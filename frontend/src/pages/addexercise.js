import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, Stack, TextField,
  InputAdornment, Select, MenuItem, FormControl, InputLabel, IconButton, Button,
  Skeleton, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar,
  Collapse,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/api';

const MUSCLES = ['', 'biceps', 'triceps', 'chest', 'lats', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'abdominals', 'shoulders', 'forearms'];
const TYPES = ['', 'strength', 'cardio', 'stretching', 'plyometrics', 'powerlifting', 'strongman'];
const DIFF_COLOR = { beginner: '#16a34a', intermediate: '#f59e0b', expert: '#f43f5e' };

// Map a catalogue exercise to a general activity the calories API understands.
const activityForType = (type, name) => {
  switch ((type || '').toLowerCase()) {
    case 'cardio': return 'running';
    case 'stretching': return 'stretching';
    case 'plyometrics': return 'jumping';
    case 'strength':
    case 'powerlifting':
    case 'strongman':
    case 'olympic_weightlifting': return 'weight lifting';
    default: return name;
  }
};

const titleCase = (s) => (s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : s);

export default function Addexercise() {
  const navigate = useNavigate();
  const [muscle, setMuscle] = useState('');
  const [type, setType] = useState('');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [weightLb, setWeightLb] = useState(160);

  const [dialogItem, setDialogItem] = useState(null);
  const [duration, setDuration] = useState(30);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });

  // Auth guard + pull the user's weight (kg -> lb) for accurate calorie math.
  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken || !email) {
      navigate('/signin');
      return;
    }
    axios
      .get(`${API_BASE}/users?email=${email}`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then((res) => {
        const kg = Number(res.data?.user?.weight);
        if (kg > 0) setWeightLb(Math.round(kg * 2.20462));
      })
      .catch(() => {});
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/exercises`, {
        params: { name: query.trim() || undefined, muscle: muscle || undefined, type: type || undefined },
      });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.hint || err.response?.data?.error || 'Could not load exercises.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [muscle, type, query]);

  useEffect(() => {
    const t = setTimeout(fetchData, query ? 450 : 0);
    return () => clearTimeout(t);
  }, [fetchData, query]);

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const saveLog = async () => {
    const email = sessionStorage.getItem('email');
    if (!email || !dialogItem) return;
    const mins = Math.max(1, Number(duration) || 1);
    setSaving(true);
    try {
      // 1) estimate calories burned via the activity calories API
      let calories = 0;
      try {
        const cal = await axios.get(`${API_BASE}/api/exercises/calories`, {
          params: { activity: activityForType(dialogItem.type, dialogItem.name), weight: weightLb, duration: mins },
        });
        calories = Math.round(cal.data?.[0]?.total_calories || 0);
      } catch {
        calories = Math.round(5 * mins); // graceful fallback estimate
      }
      // 2) record it in the exercise diary (energy = calories burned)
      await axios.post(
        `${API_BASE}/exercisediary/add`,
        {
          name: dialogItem.name,
          energy: calories,
          protein: 0,
          fat: 0,
          netCarbs: 0,
          category: titleCase(dialogItem.muscle || dialogItem.type),
          duration: mins,
        },
        { headers: { email } }
      );
      setSnack({ open: true, severity: 'success', message: `Logged ${dialogItem.name} — ~${calories} kcal burned.` });
      setDialogItem(null);
      setDuration(30);
    } catch (err) {
      setSnack({ open: true, severity: 'error', message: 'Could not log exercise. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Top bar */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10, py: 1.5, background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(22,163,74,.12)' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/Dashboard')} aria-label="Back to dashboard"><ArrowBackRoundedIcon /></IconButton>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24, flexGrow: 1 }}>Log a Workout</Typography>
          <Button color="inherit" startIcon={<LogoutRoundedIcon />} onClick={logout} sx={{ color: 'text.secondary' }}>Logout</Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Hero */}
        <Box sx={{ borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#2563eb,#22d3ee)', boxShadow: '0 24px 50px -22px rgba(37,99,235,.55)' }}>
          <FitnessCenterRoundedIcon sx={{ position: 'absolute', right: -10, top: -10, fontSize: 160, opacity: 0.15 }} />
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 30, sm: 40 }, lineHeight: 1 }}>Find &amp; log your exercise</Typography>
          <Typography sx={{ opacity: 0.92, mt: 1, maxWidth: 560 }}>
            Browse exercises by muscle or type, follow the step-by-step instructions, and log the calories you burn — calculated from your body weight and workout duration.
          </Typography>
        </Box>

        {/* Controls */}
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth placeholder="Search an exercise…" value={query} onChange={(e) => setQuery(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment>), sx: { bgcolor: '#fff', borderRadius: 999 } }}
          />
          <FormControl sx={{ minWidth: 170 }}>
            <InputLabel>Muscle</InputLabel>
            <Select label="Muscle" value={muscle} onChange={(e) => setMuscle(e.target.value)} sx={{ bgcolor: '#fff', borderRadius: 999 }}>
              {MUSCLES.map((m) => <MenuItem key={m || 'any'} value={m}>{m ? titleCase(m) : 'Any muscle'}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Type</InputLabel>
            <Select label="Type" value={type} onChange={(e) => setType(e.target.value)} sx={{ bgcolor: '#fff', borderRadius: 999 }}>
              {TYPES.map((t) => <MenuItem key={t || 'any'} value={t}>{t ? titleCase(t) : 'Any type'}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        {error && <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} md={6} key={i}><Skeleton variant="rounded" height={150} sx={{ borderRadius: 4 }} /></Grid>
              ))
            : items.map((ex, i) => (
                <Grid item xs={12} md={6} key={`${ex.name}-${i}`}>
                  <Card sx={{ height: '100%', p: 1, animation: 'pp-fade-up .5s ease both', animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>{ex.name}</Typography>
                        <Chip size="small" label={titleCase(ex.difficulty)} sx={{ color: '#fff', fontWeight: 700, bgcolor: DIFF_COLOR[ex.difficulty] || '#64748b' }} />
                      </Stack>
                      <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                        {ex.type && <Chip size="small" label={titleCase(ex.type)} sx={{ bgcolor: '#eafce9', color: '#15803d', fontWeight: 600 }} />}
                        {ex.muscle && <Chip size="small" label={titleCase(ex.muscle)} sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600 }} />}
                        {ex.equipment && ex.equipment !== 'body_only' && <Chip size="small" label={titleCase(ex.equipment)} variant="outlined" />}
                      </Stack>

                      <Button size="small" onClick={() => setExpanded(expanded === i ? null : i)} endIcon={<ExpandMoreRoundedIcon sx={{ transform: expanded === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />} sx={{ mt: 1.5, color: 'text.secondary' }}>
                        {expanded === i ? 'Hide instructions' : 'How to perform'}
                      </Button>
                      <Collapse in={expanded === i}>
                        <Typography sx={{ fontSize: 14.5, lineHeight: 1.6, color: 'text.secondary', mt: 1 }}>{ex.instructions}</Typography>
                      </Collapse>

                      <Button fullWidth variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogItem(ex)} sx={{ mt: 2 }}>
                        Log this workout
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {!loading && !error && items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography sx={{ fontSize: 48 }}>🏋️</Typography>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 700 }}>No exercises found</Typography>
            <Typography>Try a different muscle, type, or search term.</Typography>
          </Box>
        )}
      </Container>

      {/* Log dialog */}
      <Dialog open={Boolean(dialogItem)} onClose={() => setDialogItem(null)} PaperProps={{ sx: { borderRadius: 4, width: 420 } }}>
        <DialogTitle sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalFireDepartmentRoundedIcon sx={{ color: '#fb923c' }} />
            <span>Log "{dialogItem?.name}"</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: 14 }}>
            Calories are estimated from your body weight (~{weightLb} lb) and duration.
          </Typography>
          <TextField
            fullWidth type="number" label="Duration (minutes)" value={duration}
            onChange={(e) => setDuration(e.target.value)} inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogItem(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={saveLog} disabled={saving}>{saving ? 'Logging…' : 'Log workout'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
