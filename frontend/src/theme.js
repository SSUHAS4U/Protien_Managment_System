import { createTheme } from '@mui/material/styles';

// ============================================================
// ProteinPro design system — "Vibrant Light + Bento"
// Fresh health green + warm energy accents, Barlow type,
// big rounded shapes, soft colourful shadows, lively motion.
// ============================================================

export const palette = {
  primary: '#16a34a',
  primaryDark: '#15803d',
  lime: '#84cc16',
  accent: '#fb923c',
  coral: '#fb7185',
  blue: '#2563eb',
  ink: '#0f172a',
  muted: '#5b6b72',
  surface: '#ffffff',
  border: '#e6efe6',
  // macro coding
  protein: '#6366f1',
  energy: '#f59e0b',
  fat: '#f43f5e',
  carbs: '#10b981',
};

export const gradients = {
  brand: 'linear-gradient(135deg, #16a34a 0%, #84cc16 100%)',
  energy: 'linear-gradient(135deg, #fb923c 0%, #f43f5e 100%)',
  ocean: 'linear-gradient(135deg, #2563eb 0%, #22d3ee 100%)',
  mint: 'linear-gradient(135deg, #d1fae5 0%, #ecfccb 100%)',
};

export const shadows = {
  soft: '0 10px 30px -12px rgba(16, 163, 74, 0.28)',
  lift: '0 22px 48px -18px rgba(16, 163, 74, 0.38)',
  card: '0 8px 24px -14px rgba(15, 23, 42, 0.18)',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.primary, dark: palette.primaryDark, contrastText: '#ffffff' },
    secondary: { main: palette.accent, contrastText: '#ffffff' },
    info: { main: palette.blue },
    success: { main: palette.carbs },
    warning: { main: palette.energy },
    error: { main: palette.fat },
    text: { primary: palette.ink, secondary: palette.muted },
    background: { default: '#f4fbf3', paper: palette.surface },
    divider: palette.border,
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: "'Barlow', sans-serif",
    h1: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, letterSpacing: 0.2 },
    h2: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 },
    h3: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0.2 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 22, paddingBlock: 10 },
        containedPrimary: {
          background: gradients.brand,
          boxShadow: shadows.soft,
          '&:hover': { boxShadow: shadows.lift, transform: 'translateY(-1px)' },
          transition: 'all .2s ease',
        },
        containedSecondary: {
          background: gradients.energy,
          '&:hover': { transform: 'translateY(-1px)' },
          transition: 'all .2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: `1px solid ${palette.border}`,
          boxShadow: shadows.card,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 20 } } },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 999 } },
    },
    MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 14 } },
    },
  },
});

export default theme;
