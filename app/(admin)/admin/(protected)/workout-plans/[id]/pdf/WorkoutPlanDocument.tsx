import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica' },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: { width: 24, height: 24, marginRight: 8, borderRadius: 12 },
  brandTitle: { fontSize: 16, fontWeight: 700 },
  clientLine: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  underline: { borderBottom: '2pt solid #f59e0b', marginBottom: 16, width: '100%' },
  section: { marginBottom: 14 },
  dayTitle: { fontSize: 12, fontWeight: 700, marginBottom: 6 },
  table: { display: 'flex', width: '100%', marginBottom: 4 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #ddd' },
  tableHeaderRow: { flexDirection: 'row', borderBottom: '1pt solid #333', paddingBottom: 2, marginBottom: 2 },
  cellName: { width: '60%', paddingVertical: 2 },
  cellSmall: { width: '20%', paddingVertical: 2 },
  headerCell: { fontWeight: 700 },
  notesText: { marginBottom: 4, lineHeight: 1.4 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
})

const PLACE_LABELS: Record<number, string> = { 0: 'None', 1: 'Home', 2: 'Gym' }
const GOAL_LABELS: Record<number, string> = {
  0: 'None',
  1: 'Weight Loss',
  2: 'Muscle Gain',
  3: 'Strength',
  4: 'General Fitness / Endurance',
}
const EXPERIENCE_LABELS: Record<number, string> = { 1: 'Basic', 2: 'Intermediate', 3: 'Advance' }

type Exercise = { exercise_name_snapshot: string | null; sets: string | null; reps: string | null }
type Day = { day_title: string | null; exercises: Exercise[] }
type WorkoutPlan = {
  plan_name: string | null
  total_days: number | null
  place: number | null
  goal: number | null
  experience: number | null
  workout_notes: string | null
  remarks: string | null
  people?: { name: string } | null
}

export function WorkoutPlanDocument({
  workoutPlan,
  days,
  logoBuffer,
}: {
  workoutPlan: WorkoutPlan
  days: Day[]
  logoBuffer: Buffer | null
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          {logoBuffer && <Image src={logoBuffer} style={styles.logo} />}
          <Text style={styles.brandTitle}>FJunction Workout Plan</Text>
        </View>

        <Text style={styles.clientLine}>
          {workoutPlan.people?.name ?? ''} — {workoutPlan.plan_name}
        </Text>
        <View style={styles.underline} />

        <Text style={{ marginBottom: 12, color: '#555' }}>
          {workoutPlan.total_days ? `${workoutPlan.total_days} days` : ''}
          {workoutPlan.place != null ? ` · ${PLACE_LABELS[workoutPlan.place] ?? ''}` : ''}
          {workoutPlan.goal != null ? ` · ${GOAL_LABELS[workoutPlan.goal] ?? ''}` : ''}
          {workoutPlan.experience != null ? ` · ${EXPERIENCE_LABELS[workoutPlan.experience] ?? ''}` : ''}
        </Text>

        {workoutPlan.workout_notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Notes</Text>
            <Text style={styles.notesText}>{workoutPlan.workout_notes}</Text>
          </View>
        )}

        {days.map((day, idx) => (
          <View key={idx} style={styles.section} wrap={false}>
            <Text style={styles.dayTitle}>{day.day_title || `Day ${idx + 1}`}</Text>

            {day.exercises.length === 0 ? (
              <Text style={{ color: '#888' }}>No exercises</Text>
            ) : (
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.cellName, styles.headerCell]}>Exercise</Text>
                  <Text style={[styles.cellSmall, styles.headerCell]}>Sets</Text>
                  <Text style={[styles.cellSmall, styles.headerCell]}>Reps</Text>
                </View>
                {day.exercises.map((ex, exIdx) => (
                  <View key={exIdx} style={styles.tableRow}>
                    <Text style={styles.cellName}>{ex.exercise_name_snapshot}</Text>
                    <Text style={styles.cellSmall}>{ex.sets}</Text>
                    <Text style={styles.cellSmall}>{ex.reps}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {workoutPlan.remarks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remarks</Text>
            <Text style={styles.notesText}>{workoutPlan.remarks}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}