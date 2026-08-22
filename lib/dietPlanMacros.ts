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