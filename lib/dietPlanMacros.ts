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