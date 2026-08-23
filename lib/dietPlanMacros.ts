export type FoodMacroSource = {
  quantity: number | null
  unit: string | null
  carbs: number | null
  protein: number | null
  fats: number | null
  sugar: number | null
  fiber: number | null
  calories: number | null
  rich_in: string | null
} | null

export function scaleFoodMacros(food: FoodMacroSource, itemQuantity: number | null) {
  if (!food || !food.quantity || itemQuantity == null) {
    return {
      carbs: null,
      protein: null,
      fats: null,
      sugar: null,
      fiber: null,
      calories: null,
      unit: food?.unit ?? null,
      rich_in: food?.rich_in ?? null,
    }
  }

  const factor = itemQuantity / food.quantity
  const round = (value: number | null) => (value == null ? null : Math.round(value * factor * 10) / 10)

  return {
    carbs: round(food.carbs),
    protein: round(food.protein),
    fats: round(food.fats),
    sugar: round(food.sugar),
    fiber: round(food.fiber),
    calories: round(food.calories),
    unit: food.unit,
    rich_in: food.rich_in,
  }
  
}

export function sumMacros(
  items: { food: FoodMacroSource; quantity: number | null }[]
) {
  let calories = 0
  let carbs = 0
  let protein = 0
  let fats = 0
  let sugar = 0
  let fiber = 0

  for (const { food, quantity } of items) {
    const macros = scaleFoodMacros(food, quantity)
    calories += macros.calories ?? 0
    carbs += macros.carbs ?? 0
    protein += macros.protein ?? 0
    fats += macros.fats ?? 0
    sugar += macros.sugar ?? 0
    fiber += macros.fiber ?? 0
  }

  return {
    calories: Math.round(calories),
    carbs: Math.round(carbs),
    protein: Math.round(protein),
    fats: Math.round(fats),
    sugar: Math.round(sugar),
    fiber: Math.round(fiber),
  }
}

export type RecipeMacroSource = {
  total_calories: number | null
  total_carbs: number | null
  total_protein: number | null
  total_fats: number | null
  total_sugar: number | null
  total_fiber: number | null
} | null

export function scaleRecipeMacros(recipe: RecipeMacroSource, multiplier: number | null) {
  if (!recipe || multiplier == null) {
    return { calories: null, carbs: null, protein: null, fats: null, sugar: null, fiber: null, unit: null, rich_in: null }
  }
  const round = (v: number | null) => (v == null ? null : Math.round(v * multiplier * 10) / 10)
  return {
    calories: round(recipe.total_calories),
    carbs: round(recipe.total_carbs),
    protein: round(recipe.total_protein),
    fats: round(recipe.total_fats),
    sugar: round(recipe.total_sugar),
    fiber: round(recipe.total_fiber),
    unit: null,
    rich_in: null,
  }
}

export function sumScaledMacros(
  list: {
    calories: number | null
    carbs: number | null
    protein: number | null
    fats: number | null
    sugar: number | null
    fiber: number | null
  }[]
) {
  let calories = 0
  let carbs = 0
  let protein = 0
  let fats = 0
  let sugar = 0
  let fiber = 0

  for (const m of list) {
    calories += m.calories ?? 0
    carbs += m.carbs ?? 0
    protein += m.protein ?? 0
    fats += m.fats ?? 0
    sugar += m.sugar ?? 0
    fiber += m.fiber ?? 0
  }

  return {
    calories: Math.round(calories),
    carbs: Math.round(carbs),
    protein: Math.round(protein),
    fats: Math.round(fats),
    sugar: Math.round(sugar),
    fiber: Math.round(fiber),
  }
}