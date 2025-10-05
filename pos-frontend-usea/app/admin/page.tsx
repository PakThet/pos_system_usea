'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend
} from 'recharts'
import { DollarSign, TrendingUp, Users, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { KPICard } from '@/components/kpi-card'
import { BarChartComponent } from '@/components/charts/bar-chart'
import { LineChartComponent } from '@/components/charts/line-chart'
import { PieChartComponent } from '@/components/charts/pie-chart'

// Predefined chart colors
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

// ------------------ MAIN PAGE ------------------
export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [totalRevenue] = useState(1250.75)
  const [revenueChange] = useState(-12.5)
  const [totalOrders] = useState(89)
  const [ordersChange] = useState(8.2)
  const [activeCustomers] = useState(1247)
  const [customersChange] = useState(5.3)
  const [conversionRate] = useState(3.2)
  const [conversionChange] = useState(1.1)

  const profitData = [
    { date: '2025-09-01', margin: 300, previous: 280 },
    { date: '2025-09-02', margin: 450, previous: 420 },
    { date: '2025-09-03', margin: 200, previous: 220 },
    { date: '2025-09-04', margin: 500, previous: 480 },
    { date: '2025-09-05', margin: 350, previous: 320 },
    { date: '2025-09-06', margin: 420, previous: 400 },
    { date: '2025-09-07', margin: 480, previous: 450 },
  ]

  const cashFlow = [
    { date: '2025-09-01', amount: 200, forecast: 180 },
    { date: '2025-09-02', amount: 350, forecast: 320 },
    { date: '2025-09-03', amount: 150, forecast: 200 },
    { date: '2025-09-04', amount: 400, forecast: 380 },
    { date: '2025-09-05', amount: 320, forecast: 300 },
    { date: '2025-09-06', amount: 280, forecast: 260 },
    { date: '2025-09-07', amount: 450, forecast: 420 },
  ]

  const expensesByCategory = [
    { name: 'Rent', value: 500, color: CHART_COLORS.blue },
    { name: 'Salaries', value: 1200, color: CHART_COLORS.green },
    { name: 'Utilities', value: 300, color: CHART_COLORS.red },
    { name: 'Marketing', value: 450, color: CHART_COLORS.yellow },
    { name: 'Software', value: 200, color: CHART_COLORS.purple },
  ]

  const revenueByCategory = [
    { name: 'Product A', value: 800, color: CHART_COLORS.blue },
    { name: 'Product B', value: 600, color: CHART_COLORS.green },
    { name: 'Services', value: 950, color: CHART_COLORS.purple },
    { name: 'Subscriptions', value: 400, color: CHART_COLORS.orange },
  ]

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      change: revenueChange,
      icon: DollarSign,
      description: '+12.5% from last week',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: ordersChange,
      icon: ShoppingCart,
      description: '+8.2% from last week',
    },
    {
      title: 'Active Customers',
      value: activeCustomers.toLocaleString(),
      change: customersChange,
      icon: Users,
      description: '+5.3% from last week',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: conversionChange,
      icon: TrendingUp,
      description: '+1.1% from last week',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Track your business performance and key metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <KPICard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Profit Margin Trend</CardTitle>
                  <CardDescription>
                    Daily profit margin compared to previous period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartComponent data={profitData} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Q3 2025 revenue distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChartComponent data={revenueByCategory} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Cash Flow Analysis</CardTitle>
                  <CardDescription>
                    Actual vs forecasted cash flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChartComponent data={cashFlow} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Expenses Breakdown</CardTitle>
                  <CardDescription>Monthly operational costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChartComponent data={expensesByCategory} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}






