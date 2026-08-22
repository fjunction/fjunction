import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica' },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: { width: 24, height: 24, marginRight: 8, borderRadius: 12 },
  brandTitle: { fontSize: 16, fontWeight: 700 },
  clientLine: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  underline: { borderBottom: '2pt solid #f59e0b', marginBottom: 16, width: '100%' },
  section: { marginBottom: 14 },
  mealTitle: { fontSize: 12, fontWeight: 700, marginBottom: 6 },
  table: { display: 'flex', width: '100%', marginBottom: 4 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #ddd' },
  tableHeaderRow: { flexDirection: 'row', borderBottom: '1pt solid #333', paddingBottom: 2, marginBottom: 2 },
  cellName: { width: '28%', paddingVertical: 2 },
  cellQty: { width: '16%', paddingVertical: 2 },
  cellSmall: { width: '8%', paddingVertical: 2 },
  cellRich: { width: '32%', paddingVertical: 2, color: '#555' },
  headerCell: { fontWeight: 700 },
  notesText: { marginBottom: 4, lineHeight: 1.4 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
  summaryBox: { marginTop: 16, padding: 10, border: '1pt solid #f59e0b', borderRadius: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
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

export function DietPlanDocument({
  dietPlan,
  meals,
  totals,
  logoBuffer,
}: {
  dietPlan: DietPlan
  meals: Meal[]
  totals: Totals
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

        {(dietPlan.veg_type != null || dietPlan.total_calories) && (
          <Text style={{ marginBottom: 12, color: '#555' }}>
            {dietPlan.veg_type != null ? VEG_LABELS[dietPlan.veg_type] ?? '' : ''}
            {dietPlan.veg_type != null && dietPlan.total_calories ? ' · ' : ''}
            {dietPlan.total_calories ? `${dietPlan.total_calories} kcal` : ''}
          </Text>
        )}

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
                  <View key={itemIdx} style={styles.tableRow}>
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

        <View style={styles.summaryBox} wrap={false}>
          <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>Plan Summary</Text>
          <View style={styles.summaryRow}>
            <Text>Calories</Text>
            <Text>{totals.calories} kcal</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Carbs</Text>
            <Text>{totals.carbs} g</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Protein</Text>
            <Text>{totals.protein} g</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Fats</Text>
            <Text>{totals.fats} g</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Sugar</Text>
            <Text>{totals.sugar} g</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Fiber</Text>
            <Text>{totals.fiber} g</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}