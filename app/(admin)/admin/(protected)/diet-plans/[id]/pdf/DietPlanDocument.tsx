import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 32, paddingBottom: 48, fontSize: 10, fontFamily: 'Helvetica' },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: { width: 28, height: 28, marginRight: 10, borderRadius: 14 },
  brandTitle: { fontSize: 17, fontWeight: 700 },
  clientLine: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  underline: { borderBottom: '2pt solid #f59e0b', marginBottom: 16, width: '100%' },
  section: { marginBottom: 14 },
  mealTitle: { fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#111' },
  table: { display: 'flex', width: '100%', marginBottom: 4 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #eee', paddingVertical: 3 },
  tableRowAlt: { flexDirection: 'row', borderBottom: '0.5pt solid #eee', paddingVertical: 3, backgroundColor: '#fafafa' },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    paddingVertical: 5,
    marginBottom: 2,
    borderTop: '1pt solid #f59e0b',
    borderBottom: '1pt solid #f59e0b',
  },
  cellName: { width: '28%', paddingHorizontal: 4 },
  cellQty: { width: '16%', paddingHorizontal: 4 },
  cellSmall: { width: '8%', paddingHorizontal: 4 },
  cellRich: { width: '32%', paddingHorizontal: 4, color: '#666' },
  headerCell: { fontWeight: 700, color: '#92400e' },
  notesText: { marginBottom: 4, lineHeight: 1.4, color: '#333' },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#111' },
  summaryContainer: { marginTop: 18, alignItems: 'center' },
  summaryHeading: { fontSize: 13, fontWeight: 700, marginBottom: 10, textAlign: 'center', color: '#111' },
  summaryRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  statBox: {
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 6,
    backgroundColor: '#fff7ed',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    marginBottom: 8,
    minWidth: 78,
    alignItems: 'center',
  },
  statValue: { fontSize: 13, fontWeight: 700, color: '#111' },
  statLabel: { fontSize: 9, color: '#777', marginTop: 2 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  },
  recipeBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  recipeName: { fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#111' },
  recipeSubheading: { fontSize: 10, fontWeight: 700, color: '#92400e', marginBottom: 3 },
  recipeLine: { fontSize: 9, color: '#333', marginBottom: 2, lineHeight: 1.3 },
})

const VEG_LABELS: Record<number, string> = { 0: 'Veg', 1: 'Non-Veg', 2: 'Eggetarian' }

type Item = {
  food_name_snapshot: string | null
  quantity: number | null
  unit: string | null
  carbs: number | null
  protein: number | null
  fats: number | null
  calories: number | null
  rich_in: string | null
}
type Meal = { label: string | null; items: Item[] }
type Totals = {
  calories: number
  carbs: number
  protein: number
  fats: number
  sugar: number
  fiber: number
}
type DietPlan = {
  week_number: number | null
  choice_number: number | null
  total_calories: number | null
  veg_type: number | null
  diet_notes: string | null
  workout_notes: string | null
  people?: { name: string } | null
}

type RecipeDetail = { name: string | null; total_calories: number | null; ingredients: string[]; steps: string[] }

export function DietPlanDocument({
  dietPlan,
  meals,
  totals,
  recipes,
  logoBuffer,
}: {
  dietPlan: DietPlan
  meals: Meal[]
  totals: Totals
  recipes: RecipeDetail[]
  logoBuffer: Buffer | null
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          {logoBuffer && <Image src={logoBuffer} style={styles.logo} />}
          <Text style={styles.brandTitle}>FJunction Weekly Diet Plan</Text>
        </View>

        <Text style={styles.clientLine}>
          {dietPlan.people?.name ?? ''} (Week: {dietPlan.week_number}, Option: {dietPlan.choice_number})
        </Text>
        <View style={styles.underline} />

        {dietPlan.diet_notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diet Notes</Text>
            <Text style={styles.notesText}>{dietPlan.diet_notes}</Text>
          </View>
        )}

        {dietPlan.workout_notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Notes</Text>
            <Text style={styles.notesText}>{dietPlan.workout_notes}</Text>
          </View>
        )}

        {meals.map((meal, idx) => (
          <View key={idx} style={styles.section} wrap={false}>
            <Text style={styles.mealTitle}>{meal.label || `Meal ${idx + 1}`}</Text>

            {meal.items.length === 0 ? (
              <Text style={{ color: '#888' }}>No items</Text>
            ) : (
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.cellName, styles.headerCell]}>Food Name</Text>
                  <Text style={[styles.cellQty, styles.headerCell]}>Quantity</Text>
                  <Text style={[styles.cellSmall, styles.headerCell]}>C</Text>
                  <Text style={[styles.cellSmall, styles.headerCell]}>P</Text>
                  <Text style={[styles.cellSmall, styles.headerCell]}>F</Text>
                  <Text style={[styles.cellSmall, styles.headerCell]}>Cal</Text>
                  <Text style={[styles.cellRich, styles.headerCell]}>Rich In</Text>
                </View>
                {meal.items.map((item, itemIdx) => (
                  <View key={itemIdx} style={itemIdx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
                    <Text style={styles.cellName}>{item.food_name_snapshot}</Text>
                    <Text style={styles.cellQty}>
                      {item.quantity ?? ''} {item.unit ?? ''}
                    </Text>
                    <Text style={styles.cellSmall}>{item.carbs ?? ''}</Text>
                    <Text style={styles.cellSmall}>{item.protein ?? ''}</Text>
                    <Text style={styles.cellSmall}>{item.fats ?? ''}</Text>
                    <Text style={styles.cellSmall}>{item.calories ?? ''}</Text>
                    <Text style={styles.cellRich}>{item.rich_in ?? ''}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.summaryContainer} wrap={false}>
          <Text style={styles.summaryHeading}>Plan Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totals.calories} kcal</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totals.carbs} g</Text>
              <Text style={styles.statLabel}>Carbs</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totals.protein} g</Text>
              <Text style={styles.statLabel}>Protein</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totals.fats} g</Text>
              <Text style={styles.statLabel}>Fats</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totals.fiber} g</Text>
              <Text style={styles.statLabel}>Fiber</Text>
            </View>
          </View>
        </View>

    {recipes.length > 0 && (
      <View style={{ marginTop: 18 }}>
        <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 10 }]}>Recipes in This Plan</Text>
        {recipes.map((recipe, idx) => (
          <View key={idx} style={styles.recipeBox} wrap={false}>
            <Text style={styles.recipeName}>
              {recipe.name}
              {recipe.total_calories ? ` (${recipe.total_calories} kcal, full recipe)` : ''}
            </Text>

            <Text style={styles.recipeSubheading}>Ingredients</Text>
            {recipe.ingredients.map((ing, i) => (
              <Text key={i} style={styles.recipeLine}>
                • {ing}
              </Text>
            ))}

            <Text style={[styles.recipeSubheading, { marginTop: 6 }]}>Steps</Text>
            {recipe.steps.map((step, i) => (
              <Text key={i} style={styles.recipeLine}>
                {i + 1}. {step}
              </Text>
            ))}
          </View>
        ))}
      </View>
    )}

    <Text
      style={styles.footer}
      render={({ pageNumber, totalPages }) => `FJunction · Page ${pageNumber} of ${totalPages}`}
      fixed
    />
    </Page>
    </Document>
    )
}