import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Button, Stack } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { getMacros, MACRO_META } from '../utils/spoonacular';

function MacroPill({ k, value }) {
  const meta = MACRO_META[k];
  if (value == null) return null;
  return (
    <Box
      sx={{
        flex: 1,
        textAlign: 'center',
        py: 0.75,
        borderRadius: 2,
        bgcolor: `${meta.color}14`,
        border: `1px solid ${meta.color}33`,
      }}
    >
      <Typography sx={{ fontWeight: 800, fontFamily: "'Barlow Condensed'", fontSize: 18, color: meta.color, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{meta.label}</Typography>
    </Box>
  );
}

/** Vibrant recipe card with macro coding + hover lift. */
export default function FoodCard({ recipe, onView, index = 0 }) {
  const macros = getMacros(recipe);
  const diets = (recipe.diets || []).slice(0, 2);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        animation: 'pp-fade-up .5s ease both',
        animationDelay: `${Math.min(index, 8) * 0.05}s`,
        transition: 'transform .25s ease, box-shadow .25s ease',
        '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 26px 50px -22px rgba(22,163,74,.45)' },
      }}
      onClick={() => onView(recipe)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={recipe.image || 'https://placehold.co/480x320?text=Recipe'}
          alt={recipe.title}
          sx={{ objectFit: 'cover' }}
        />
        {macros.protein != null && (
          <Chip
            icon={<LocalFireDepartmentRoundedIcon sx={{ color: '#fff !important' }} />}
            label={`${macros.protein}g protein`}
            sx={{
              position: 'absolute', top: 12, left: 12, color: '#fff', fontWeight: 700,
              background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            }}
          />
        )}
        {recipe.readyInMinutes ? (
          <Chip
            icon={<AccessTimeRoundedIcon sx={{ color: '#0f172a !important' }} />}
            label={`${recipe.readyInMinutes} min`}
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,.92)', fontWeight: 700 }}
          />
        ) : null}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 21, lineHeight: 1.1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 46,
          }}
        >
          {recipe.title}
        </Typography>

        {diets.length > 0 && (
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {diets.map((d) => (
              <Chip key={d} label={d} size="small" sx={{ bgcolor: '#eafce9', color: '#15803d', fontWeight: 600, textTransform: 'capitalize' }} />
            ))}
          </Stack>
        )}

        <Box sx={{ display: 'flex', gap: 0.75, mt: 'auto' }}>
          <MacroPill k="energy" value={macros.energy} />
          <MacroPill k="protein" value={macros.protein} />
          <MacroPill k="carbs" value={macros.carbs} />
          <MacroPill k="fat" value={macros.fat} />
        </Box>

        <Button fullWidth variant="contained" startIcon={<MenuBookRoundedIcon />} sx={{ mt: 0.5 }}>
          View recipe &amp; steps
        </Button>
      </CardContent>
    </Card>
  );
}
