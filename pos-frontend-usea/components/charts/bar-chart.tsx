import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";

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


export function BarChartComponent({ data }: { data: any[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="margin" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} name="Current Period" />
          <Bar dataKey="previous" fill={CHART_COLORS.slate} radius={[4, 4, 0, 0]} name="Previous Period" opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}