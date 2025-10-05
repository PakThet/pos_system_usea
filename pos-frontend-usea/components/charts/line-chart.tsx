import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const CHART_COLORS = {
  blue: 'hsl(221 83% 53%)',
  green: 'hsl(142 76% 36%)',
  red: 'hsl(0 84% 60%)',
  yellow: 'hsl(38 92% 50%)',
  purple: 'hsl(262 83% 58%)',
  orange: 'hsl(27 96% 61%)',
  indigo: 'hsl(234 89% 59%)',
  pink: 'hsl(330 81% 60%)',
  slate: 'hsl(210 16% 93%)',
}

export function LineChartComponent({ data }: { data: any[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke={CHART_COLORS.green} strokeWidth={3} dot={{ r: 4 }} name="Actual" />
          <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS.slate} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}