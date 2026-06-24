import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, Box, Typography, IconButton, Chip, Stack, Divider,
  Button, Select, MenuItem, FormControl, InputLabel, TextField, Snackbar, Alert,
  CircularProgress, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';
import { getMacros, getSteps, getIngredients, stripHtml, MACRO_META } from '../utils/spoonacular';

export default function RecipeModal({ recipe, open, onClose }) {
  const [full, setFull] = useState(recipe);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    setFull(recipe);
    setCategory('');
    setQuantity(1);
    // Fetch full details if cooking steps aren't already present.
    if (open && recipe?.id && getSteps(recipe).length === 0) {
      setLoading(true);
      axios
        .get(`${API_BASE}/api/foods/${recipe.id}`)
        .then((res) => setFull({ ...recipe, ...res.data }))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [recipe, open]);

  if (!full) return null;

  const macros = getMacros(full);
  const steps = getSteps(full);
  const ingredients = getIngredients(full);

  const addToDiary = async () => {
    const email = sessionStorage.getItem('email');
    if (!email) {
      setSnack({ open: true, severity: 'error', message: 'Please sign in to add to your diary.' });
      return;
    }
    if (!category) {
      setSnack({ open: true, severity: 'warning', message: 'Pick a meal category first.' });
      return;
    }
    const q = Math.max(1, Number(quantity) || 1);
    try {
      await axios.post(
        `${API_BASE}/fooddiary/add`,
        {
          name: full.title,
          energy: (macros.energy || 0) * q,
          protein: (macros.protein || 0) * q,
          fat: (macros.fat || 0) * q,
          netCarbs: (macros.carbs || 0) * q,
          category,
          quantity: q,
        },
        { headers: { email } }
      );
      setSnack({ open: true, severity: 'success', message: `Added "${full.title}" to ${category}!` });
    } catch (err) {
      setSnack({ open: true, severity: 'error', message: 'Could not add to diary. Try again.' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
      {/* Hero */}
      <Box sx={{ position: 'relative', height: 240 }}>
        <Box
          component="img"
          src={full.image || 'https://placehold.co/800x400?text=Recipe'}
          alt={full.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.78) 100%)' }} />
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,.9)', '&:hover': { bgcolor: '#fff' } }}>
          <CloseRoundedIcon />
        </IconButton>
        <Box sx={{ position: 'absolute', bottom: 16, left: 20, right: 20, color: '#fff' }}>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 32, lineHeight: 1.05 }}>
            {full.title}
          </Typography>
          <Stack direction="row" gap={1} sx={{ mt: 1 }} flexWrap="wrap">
            {full.readyInMinutes ? (
              <Chip size="small" icon={<AccessTimeRoundedIcon sx={{ color: '#fff !important' }} />} label={`${full.readyInMinutes} min`} sx={{ bgcolor: 'rgba(255,255,255,.18)', color: '#fff' }} />
            ) : null}
            {full.servings ? (
              <Chip size="small" icon={<RestaurantRoundedIcon sx={{ color: '#fff !important' }} />} label={`${full.servings} servings`} sx={{ bgcolor: 'rgba(255,255,255,.18)', color: '#fff' }} />
            ) : null}
          </Stack>
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Macros */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {Object.keys(MACRO_META).map((k) => (
            <Box key={k} sx={{ flex: 1, textAlign: 'center', py: 1.25, borderRadius: 3, bgcolor: `${MACRO_META[k].color}12`, border: `1px solid ${MACRO_META[k].color}33` }}>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24, color: MACRO_META[k].color, lineHeight: 1 }}>
                {macros[k] ?? '—'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {MACRO_META[k].label} ({MACRO_META[k].unit})
              </Typography>
            </Box>
          ))}
        </Box>

        {full.summary && (
          <Typography sx={{ color: 'text.secondary', fontSize: 14.5, lineHeight: 1.6, mb: 2 }}>
            {stripHtml(full.summary).slice(0, 260)}…
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' }, gap: 3 }}>
            {ingredients.length > 0 && (
              <Box>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1 }}>Ingredients</Typography>
                <Stack gap={0.5}>
                  {ingredients.map((ing, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', mt: '7px', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 14.5 }}>{ing}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22, mb: 1 }}>Steps to cook</Typography>
              {steps.length > 0 ? (
                <List disablePadding>
                  {steps.map((s, i) => (
                    <ListItem key={i} alignItems="flex-start" disableGutters sx={{ pb: 1.25 }}>
                      <ListItemIcon sx={{ minWidth: 38 }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 14, background: 'linear-gradient(135deg,#16a34a,#84cc16)' }}>
                          {i + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 14.5, lineHeight: 1.55 }} primary={s} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>No step-by-step instructions available for this recipe.</Typography>
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2.5 }} />

        {/* Add to diary */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Meal</InputLabel>
            <Select label="Meal" value={category} onChange={(e) => setCategory(e.target.value)}>
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            type="number"
            label="Servings"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ width: 110 }}
            inputProps={{ min: 1 }}
          />
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={addToDiary} sx={{ ml: 'auto' }}>
            Add to my diary
          </Button>
        </Box>
      </DialogContent>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} icon={snack.severity === 'success' ? <CheckCircleRoundedIcon /> : undefined}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
