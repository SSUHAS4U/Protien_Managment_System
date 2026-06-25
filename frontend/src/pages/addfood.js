import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, TextField, InputAdornment, Stack, Chip, Skeleton, Alert, Typography,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import AppLayout from '../components/AppLayout';
import FoodCard from '../components/FoodCard';
import RecipeModal from '../components/RecipeModal';

const QUICK = ['paneer', 'chicken curry', 'dal', 'biryani', 'dosa', 'chickpea', 'salad', 'oats'];
const CUISINES = ['', 'Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Mediterranean', 'American', 'Japanese'];

export default function AddFood() {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // With a query -> search; without -> show a tasty default set.
      const url = query.trim() ? `${API_BASE}/api/foods/search` : `${API_BASE}/api/foods/recommendations`;
      const params = query.trim()
        ? { query: query.trim(), cuisine: cuisine || undefined, number: 12 }
        : { filter: 'balanced', cuisine: cuisine || undefined, number: 12 };
      const res = await axios.get(url, { params });
      setItems(res.data?.results || []);
    } catch (err) {
      setError(err.response?.data?.hint || err.response?.data?.error || 'Could not load foods.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [query, cuisine]);

  useEffect(() => {
    const t = setTimeout(fetchData, query ? 450 : 0);
    return () => clearTimeout(t);
  }, [fetchData, query]);

  const openRecipe = (r) => { setSelected(r); setOpen(true); };

  return (
    <AppLayout title="Browse Food">
      <Box sx={{ borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff', background: 'linear-gradient(135deg,#16a34a,#84cc16)', boxShadow: '0 24px 50px -22px rgba(22,163,74,.6)' }}>
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 28, sm: 38 }, lineHeight: 1 }}>
          Search any food, log it instantly
        </Typography>
        <Typography sx={{ opacity: 0.92, mt: 1 }}>
          Real dishes with full macros, images and cooking steps — tap a card to view and add it to your diary.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ mt: 2.5, maxWidth: 680 }}>
          <TextField
            fullWidth placeholder="Search a food or dish…" value={query} onChange={(e) => setQuery(e.target.value)}
            sx={{ bgcolor: '#fff', borderRadius: 999 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment>), sx: { borderRadius: 999 } }}
          />
          <FormControl sx={{ minWidth: 170 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,.9)' }}>Cuisine</InputLabel>
            <Select label="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} sx={{ bgcolor: '#fff', borderRadius: 999 }}>
              {CUISINES.map((c) => <MenuItem key={c || 'any'} value={c}>{c || 'Any cuisine'}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 3 }}>
        {QUICK.map((q) => (
          <Chip key={q} label={q} onClick={() => setQuery(q)} sx={{ bgcolor: query === q ? '#16a34a' : '#fff', color: query === q ? '#fff' : 'text.primary', border: '1px solid', borderColor: 'divider', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer' }} />
        ))}
      </Stack>

      {error && <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rounded" height={180} sx={{ borderRadius: 4 }} />
                <Skeleton width="80%" sx={{ mt: 1 }} /><Skeleton width="50%" />
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
          <Typography sx={{ fontSize: 48 }}>🥗</Typography>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 700 }}>No foods found</Typography>
          <Typography>Try another search term.</Typography>
        </Box>
      )}

      <RecipeModal recipe={selected} open={open} onClose={() => setOpen(false)} />
    </AppLayout>
  );
}
