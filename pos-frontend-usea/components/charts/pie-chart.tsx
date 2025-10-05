import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"


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


export function PieChartComponent({ data }: { data: any[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex flex-col items-center w-full">
      {/* Chart wrapper with fixed height */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}