export function isPlanActive(startDate: string | null, durationDays: number | null) {
    if (!startDate || durationDays == null) return false
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + durationDays)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return end >= today
  }