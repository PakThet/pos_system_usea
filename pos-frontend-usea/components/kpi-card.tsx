import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  description,
}: {
  title: string
  value: string
  change: number
  icon: any
  description: string
}) {
  const isPositive = change >= 0
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card className="relative overflow-hidden border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div
            className={`p-2 rounded-lg ${
              isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-slate-500 ml-1">{description}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}