'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

const COLORS = ['#f97316', '#fbbf24', '#ea580c', '#facc15', '#fb923c']

const CARD_STYLE: React.CSSProperties = {
  padding: 20,
  borderRadius: 12,
  background: 'var(--brand-surface)',
  border: '1px solid var(--brand-border)',
}

export function DashboardCharts({
  newClientsByMonth,
  planTypeCounts,
  vegTypeCounts,
  trainerCounts,
}: {
  newClientsByMonth: { label: string; count: number }[]
  planTypeCounts: { name: string; count: number }[]
  vegTypeCounts: { name: string; value: number }[]
  trainerCounts: { trainer: string; count: number }[]
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={CARD_STYLE}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#ccc' }}>
          New Clients (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={newClientsByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
            <XAxis dataKey="label" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ background: 'var(--brand-bg)', border: '1px solid var(--brand-border)' }} />
            <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={CARD_STYLE}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#ccc' }}>Active Plans by Type</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={planTypeCounts}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
            <XAxis dataKey="name" stroke="#888" fontSize={11} />
            <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ background: 'var(--brand-bg)', border: '1px solid var(--brand-border)' }} />
            <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={CARD_STYLE}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#ccc' }}>Diet Plans by Veg Type</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={vegTypeCounts}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {vegTypeCounts.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: 'var(--brand-bg)', border: '1px solid var(--brand-border)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#ccc' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={CARD_STYLE}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#ccc' }}>Clients per Trainer</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trainerCounts} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
            <XAxis type="number" stroke="#888" fontSize={12} allowDecimals={false} />
            <YAxis dataKey="trainer" type="category" stroke="#888" fontSize={11} width={120} />
            <Tooltip contentStyle={{ background: 'var(--brand-bg)', border: '1px solid var(--brand-border)' }} />
            <Bar dataKey="count" fill="#fbbf24" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}