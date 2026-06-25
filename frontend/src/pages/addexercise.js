import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Card, CardContent, CardMedia, Chip, Stack, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Button, Skeleton, Alert, Typography,
  Collapse, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Avatar,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';

const BODY_PARTS = ['', 'back', 'chest', 'shoulders', 'upper arms', 'lower arms', 'upper legs', 'lower legs', 'waist', 'cardio', 'neck'];
const titleCase = (s) => (s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : s);
const activityFor = (bodyPart) => ((bodyPart || '').toLowerCase() === 'cardio' ? 'running' : 'weight lifting');

export default function Addexercise() {
  const [bodyPart, setBodyPart] = useState('');
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
  const [brokenGifs, setBrokenGifs] = useState({});

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');
    if (!email || !authToken) return;
    axios.get(`${API_BASE}/users?email=${email}`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then((res) => { const kg = Number(res.data?.user?.weight); if (kg > 0) setWeightLb(Math.round(kg * 2.20462)); })
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/exercises`, {
        params: { name: query.trim() || undefined, bodyPart: bodyPart || undefined, limit: 24 },
      });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.hint || err.response?.data?.error || 'Could not load exercises.');
      setItems([]);
    } finally { setLoading(false); }
  }, [bodyPart, query]);

  useEffect(() => { const t = setTimeout(fetchData, query ? 450 : 0); return () => clearTimeout(t); }, [fetchData, query]);

  const saveLog = async () => {
    const email = sessionStorage.getItem('email');
    if (!email || !dialogItem) return;
    const mins = Math.max(1, Number(duration) || 1);
    setSaving(true);
    try {
      let calories = 0;
      try {
        const cal = await axios.get(`${API_BASE}/api/exercises/calories`, {
          params: { activity: activityFor(dialogItem.bodyPart), weight: weightLb, duration: mins },
        });
        calories = Math.round(cal.data?.[0]?.total_calories || 0);
      } catch { calories = Math.round(5 * mins); }
      const today = new Date();
      const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      await axios.post(`${API_BASE}/exercisediary/add`, {
        name: dialogItem.name, energy: calories, protein: 0, fat: 0, netCarbs: 0,
        category: titleCase(dialogItem.bodyPart), duration: mins, date: localDate,
      }, { headers: { email } });
      setSnack({ open: true, severity: 'success', message: `Logged ${dialogItem.name} — ~${calories} kcal burned.` });
      setDialogItem(null); setDuration(30);
    } catch { setSnack({ open: true, severity: 'error', message: 'Could not log exercise. Try again.' }); }
    finally { setSaving(false); }
  };

  return (
    <AppLayout title="Log Exercise">
      <Box sx={{ borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#2563eb,#22d3ee)', boxShadow: '0 24px 50px -22px rgba(37,99,235,.55)' }}>
        <FitnessCenterRoundedIcon sx={{ position: 'absolute', right: -10, top: -10, fontSize: 160, opacity: 0.15 }} />
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 28, sm: 38 }, lineHeight: 1 }}>Find &amp; log your workout</Typography>
        <Typography sx={{ opacity: 0.92, mt: 1, maxWidth: 560 }}>
          Browse animated exercises by body part, follow the steps, and log the calories you burn — based on your body weight and duration.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ mb: 3 }}>
        <TextField fullWidth placeholder="Search an exercise…" value={query} onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment>), sx: { bgcolor: '#fff', borderRadius: 999 } }} />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Body part</InputLabel>
          <Select label="Body part" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)} sx={{ bgcolor: '#fff', borderRadius: 999 }}>
            {BODY_PARTS.map((b) => <MenuItem key={b || 'any'} value={b}>{b ? titleCase(b) : 'All body parts'}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {error && <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rounded" height={260} sx={{ borderRadius: 4 }} /></Grid>
            ))
          : items.map((ex, i) => (
              <Grid item xs={12} sm={6} md={4} key={`${ex.name}-${i}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'pp-fade-up .5s ease both', animationDelay: `${Math.min(i, 8) * 0.05}s`, transition: 'transform .25s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  {ex.gifUrl && !brokenGifs[i] ? (
                    <CardMedia
                      component="img" height="190" image={ex.gifUrl} alt={ex.name} loading="lazy"
                      onError={() => setBrokenGifs((b) => ({ ...b, [i]: true }))}
                      sx={{ objectFit: 'contain', bgcolor: '#f7fdf6' }}
                    />
                  ) : (
                    <Box sx={{ height: 190, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#eafce9,#dbeafe)' }}>
                      <Avatar sx={{ width: 64, height: 64, bgcolor: '#16a34a1a', color: '#16a34a' }}><FitnessCenterRoundedIcon sx={{ fontSize: 34 }} /></Avatar>
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 21, lineHeight: 1.1, textTransform: 'capitalize' }}>{ex.name}</Typography>
                    <Stack direction="row" gap={0.6} flexWrap="wrap" sx={{ mt: 1 }}>
                      {ex.bodyPart && <Chip size="small" label={titleCase(ex.bodyPart)} sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600 }} />}
                      {ex.target && <Chip size="small" label={titleCase(ex.target)} sx={{ bgcolor: '#eafce9', color: '#15803d', fontWeight: 600 }} />}
                      {ex.equipment && ex.equipment !== 'body weight' && ex.equipment !== 'body_only' && <Chip size="small" variant="outlined" label={titleCase(ex.equipment)} />}
                    </Stack>
                    {Array.isArray(ex.instructions) && ex.instructions.length > 0 && (
                      <>
                        <Button size="small" onClick={() => setExpanded(expanded === i ? null : i)} endIcon={<ExpandMoreRoundedIcon sx={{ transform: expanded === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />} sx={{ mt: 1, color: 'text.secondary' }}>
                          {expanded === i ? 'Hide steps' : 'How to perform'}
                        </Button>
                        <Collapse in={expanded === i}>
                          <Stack spacing={0.5} sx={{ mt: 1 }}>
                            {ex.instructions.map((s, idx) => (
                              <Typography key={idx} sx={{ fontSize: 13.5, lineHeight: 1.5, color: 'text.secondary' }}>{s.replace(/^Step:\d+\s*/i, `${idx + 1}. `)}</Typography>
                            ))}
                          </Stack>
                        </Collapse>
                      </>
                    )}
                    <Button fullWidth variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogItem(ex)} sx={{ mt: 2 }}>Log this workout</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {!loading && !error && items.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Typography sx={{ fontSize: 48 }}>🏋️</Typography>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 700 }}>No exercises found</Typography>
          <Typography>Try a different body part or search term.</Typography>
        </Box>
      )}

      <Dialog open={Boolean(dialogItem)} onClose={() => setDialogItem(null)} PaperProps={{ sx: { borderRadius: 4, width: 420 } }}>
        <DialogTitle sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalFireDepartmentRoundedIcon sx={{ color: '#fb923c' }} />
            <span style={{ textTransform: 'capitalize' }}>Log "{dialogItem?.name}"</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: 14 }}>Calories are estimated from your body weight (~{weightLb} lb) and duration.</Typography>
          <TextField fullWidth type="number" label="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} inputProps={{ min: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogItem(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={saveLog} disabled={saving}>{saving ? 'Logging…' : 'Log workout'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
}
