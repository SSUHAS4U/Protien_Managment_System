import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Grid, Chip, Stack, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, IconButton, Button, Skeleton, Alert,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/api';
import FoodCard from '../components/FoodCard';
import RecipeModal from '../components/RecipeModal';

const FILTERS = [
  { key: 'high-protein', label: 'High Protein', emoji: '💪' },
  { key: 'high-energy', label: 'High Energy', emoji: '🔥' },
  { key: 'low-calorie', label: 'Low Calorie', emoji: '🪶' },
  { key: 'low-carb', label: 'Low Carb', emoji: '🥗' },
  { key: 'low-fat', label: 'Low Fat', emoji: '🌿' },
  { key: 'balanced', label: 'Balanced', emoji: '⚖️' },
];

const DIETS = ['', 'vegetarian', 'vegan', 'ketogenic', 'paleo', 'gluten free', 'pescetarian'];

export default function Recommendations() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('high-protein');
  const [diet, setDiet] = useState('');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken || !email) navigate('/signin');
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = query.trim()
        ? `${API_BASE}/api/foods/search`
        : `${API_BASE}/api/foods/recommendations`;
      const params = query.trim()
        ? { query: query.trim(), diet: diet || undefined, number: 12 }
        : { filter, diet: diet || undefined, number: 12 };
      const res = await axios.get(url, { params });
      setItems(res.data?.results || []);
    } catch (err) {
      setError(err.response?.data?.hint || err.response?.data?.error || 'Could not load recommendations.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter, diet, query]);

  useEffect(() => {
    const t = setTimeout(fetchData, query ? 450 : 0);
    return () => clearTimeout(t);
  }, [fetchData, query]);

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const openRecipe = (r) => {
    setSelected(r);
    setModalOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Top bar */}
      <Box
        sx={{
          position: 'sticky', top: 0, zIndex: 10, py: 1.5,
          background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(22,163,74,.12)',
        }}
      >
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/Dashboard')} aria-label="Back to dashboard">
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24, flexGrow: 1 }}>
            Discover Meals
          </Typography>
          <Button color="inherit" startIcon={<LogoutRoundedIcon />} onClick={logout} sx={{ color: 'text.secondary' }}>
            Logout
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Hero strip */}
        <Box
          sx={{
            borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff',
            background: 'linear-gradient(135deg,#16a34a,#84cc16)',
            boxShadow: '0 24px 50px -22px rgba(22,163,74,.6)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ position: 'absolute', right: -10, top: -10, fontSize: 160, opacity: 0.15 }} />
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 30, sm: 40 }, lineHeight: 1 }}>
            Find your next favourite meal
          </Typography>
          <Typography sx={{ opacity: 0.92, mt: 1, maxWidth: 560 }}>
            Filter by your goal — high-protein, low-carb, energy-packed and more. Every dish comes with full macros and step-by-step cooking instructions.
          </Typography>
        </Box>

        {/* Controls */}
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search any dish or ingredient…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon color="action" />
                </InputAdornment>
              ),
              sx: { bgcolor: '#fff', borderRadius: 999 },
            }}
          />
          <FormControl sx={{ minWidth: 190 }}>
            <InputLabel>Diet</InputLabel>
            <Select label="Diet" value={diet} onChange={(e) => setDiet(e.target.value)} sx={{ bgcolor: '#fff', borderRadius: 999 }}>
              {DIETS.map((d) => (
                <MenuItem key={d || 'any'} value={d}>{d ? d.replace(/^\w/, (c) => c.toUpperCase()) : 'Any diet'}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Filter chips */}
        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 3, opacity: query ? 0.5 : 1, pointerEvents: query ? 'none' : 'auto' }}>
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={`${f.emoji} ${f.label}`}
              onClick={() => setFilter(f.key)}
              sx={{
                px: 1, py: 2.4, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                color: filter === f.key ? '#fff' : 'text.primary',
                background: filter === f.key ? 'linear-gradient(135deg,#16a34a,#84cc16)' : '#fff',
                border: '1px solid', borderColor: filter === f.key ? 'transparent' : 'divider',
                '&:hover': { boxShadow: '0 10px 22px -12px rgba(22,163,74,.5)' },
              }}
            />
          ))}
        </Stack>

        {/* Results */}
        {error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Skeleton variant="rounded" height={180} sx={{ borderRadius: 4 }} />
                  <Skeleton width="80%" sx={{ mt: 1 }} />
                  <Skeleton width="50%" />
                </Grid>
              ))
            : items.map((r, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={r.id || i}>
                  <FoodCard recipe={r} index={i} onView={openRecipe} />
                </Grid>
              ))}
        </Grid>

        {!loading && !error && items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography sx={{ fontSize: 48 }}>🍽️</Typography>
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 700 }}>No meals found</Typography>
            <Typography>Try a different filter, diet, or search term.</Typography>
          </Box>
        )}
      </Container>

      <RecipeModal recipe={selected} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}
