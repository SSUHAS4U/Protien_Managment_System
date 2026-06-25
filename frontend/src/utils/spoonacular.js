// Helpers to normalize Spoonacular recipe objects into the shape our UI needs.

export function getNutrient(recipe, name) {
  const nutrients = recipe?.nutrition?.nutrients;
  if (!Array.isArray(nutrients)) return null;
  const n = nutrients.find((x) => x.name?.toLowerCase() === name.toLowerCase());
  return n ? Math.round(n.amount) : null;
}

export function getMacros(recipe) {
  return {
    energy: getNutrient(recipe, 'Calories'),
    protein: getNutrient(recipe, 'Protein'),
    fat: getNutrient(recipe, 'Fat'),
    carbs: getNutrient(recipe, 'Carbohydrates'),
  };
}

/** Flattened, ordered list of cooking step strings. */
export function getSteps(recipe) {
  const ai = recipe?.analyzedInstructions;
  if (Array.isArray(ai) && ai.length) {
    const steps = [];
    ai.forEach((block) => (block.steps || []).forEach((s) => steps.push(s.step)));
    if (steps.length) return steps;
  }
  // Fallback: split plain-text instructions.
  if (recipe?.instructions) {
    return recipe.instructions
      .replace(/<[^>]+>/g, '')
      .split(/\.\s+|\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function getIngredients(recipe) {
  const list = recipe?.extendedIngredients;
  if (!Array.isArray(list)) return [];
  return list.map((i) => i.original || i.name).filter(Boolean);
}

export function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, '').trim();
}

/**
 * Upgrade a Spoonacular image URL to a higher resolution. Their CDN serves
 * sized variants like `<id>-312x231.jpg`; swap to a crisp 636x393.
 */
export function hiResImage(url) {
  if (!url) return 'https://placehold.co/636x393/eafce9/15803d?text=ProteinPro';
  return url.replace(/-(\d+)x(\d+)\.(jpg|png|jpeg)/i, '-636x393.$3');
}

export const MACRO_META = {
  energy: { label: 'Calories', unit: 'kcal', color: '#f59e0b' },
  protein: { label: 'Protein', unit: 'g', color: '#6366f1' },
  carbs: { label: 'Carbs', unit: 'g', color: '#10b981' },
  fat: { label: 'Fat', unit: 'g', color: '#f43f5e' },
};
