// 'use client';

import DashboardPage from "./dashboard/page"

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   ShoppingCart, 
//   Users, 
//   Package, 
//   DollarSign,
//   TrendingUp,
//   CreditCard,
//   Package2
// } from "lucide-react";
// import { api } from '@/lib/api';
// import { formatCurrency } from '@/lib/utils';

// interface DashboardStats {
//   total_sales: number;
//   total_revenue: number;
//   total_customers: number;
//   total_products: number;
//   today_sales: number;
//   today_revenue: number;
// }

// export default function AdminDashboard() {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       const [salesRes, customersRes, productsRes] = await Promise.all([
//         api.get('/sales/stats'),
//         api.get('/customers/stats'),
//         api.get('/products')
//       ]);

//       const salesData = salesRes.data.data;
      
//       setStats({
//         total_sales: salesData.total_sales || 0,
//         total_revenue: salesData.total_revenue || 0,
//         total_customers: customersRes.data.data.total || 0,
//         total_products: productsRes.data.data.length || 0,
//         today_sales: salesData.status_breakdown?.completed || 0,
//         today_revenue: salesData.total_revenue ? salesData.total_revenue * 0.1 : 0,
//       });
//     } catch (error) {
//       console.error('Failed to load dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     {
//       title: 'Total Revenue',
//       value: stats ? formatCurrency(stats.total_revenue) : '0',
//       icon: DollarSign,
//       description: '+20% from last month',
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//     },
//     {
//       title: 'Total Sales',
//       value: stats?.total_sales.toString() || '0',
//       icon: ShoppingCart,
//       description: '+12% from last month',
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       title: 'Customers',
//       value: stats?.total_customers.toString() || '0',
//       icon: Users,
//       description: '+18% from last month',
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-50',
//     },
//     {
//       title: 'Products',
//       value: stats?.total_products.toString() || '0',
//       icon: Package,
//       description: '+5% from last month',
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-50',
//     },
//   ];

//   const quickActions = [
//     {
//       title: 'New Sale',
//       description: 'Process a new sale',
//       icon: ShoppingCart,
//       href: '/admin/pos',
//       color: 'bg-blue-500',
//     },
//     {
//       title: 'Manage Products',
//       description: 'View and edit products',
//       icon: Package2,
//       href: '/admin/products',
//       color: 'bg-green-500',
//     },
//     {
//       title: 'View Customers',
//       description: 'Manage customer data',
//       icon: Users,
//       href: '/admin/customers',
//       color: 'bg-purple-500',
//     },
//     {
//       title: 'Sales Report',
//       description: 'View sales analytics',
//       icon: TrendingUp,
//       href: '/admin/sales',
//       color: 'bg-orange-500',
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">
//                       {stat.title}
//                     </p>
//                     <p className="text-2xl font-bold mt-1">
//                       {stat.value}
//                     </p>
//                     <p className="text-xs text-green-600 mt-1">
//                       {stat.description}
//                     </p>
//                   </div>
//                   <div className={`p-3 rounded-full ${stat.bgColor}`}>
//                     <stat.icon className={`h-6 w-6 ${stat.color}`} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {quickActions.map((action, index) => (
//           <motion.div
//             key={action.title}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: index * 0.1 + 0.4 }}
//           >
//             <Card className="cursor-pointer hover:shadow-lg transition-shadow">
//               <CardContent className="p-6">
//                 <Button
//                   variant="ghost"
//                   className="w-full h-auto p-0 flex flex-col items-center gap-3"
//                   onClick={() => window.location.href = action.href}
//                 >
//                   <div className={`p-3 rounded-full ${action.color} text-white`}>
//                     <action.icon className="h-6 w-6" />
//                   </div>
//                   <div className="text-center">
//                     <h3 className="font-semibold">{action.title}</h3>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {action.description}
//                     </p>
//                   </div>
//                 </Button>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Recent Activity & Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Sales */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Sales</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[1, 2, 3, 4, 5].map((item) => (
//                 <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div>
//                     <p className="font-medium">Sale #{1000 + item}</p>
//                     <p className="text-sm text-muted-foreground">Customer {item}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-green-600">
//                       {formatCurrency(100 + item * 25)}
//                     </p>
//                     <p className="text-xs text-muted-foreground capitalize">
//                       Completed
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <Button variant="outline" className="w-full mt-4">
//               View All Sales
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Performance Metrics */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Performance Metrics</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <CreditCard className="h-8 w-8 text-blue-600" />
//                 <div>
//                   <p className="font-medium">Today's Revenue</p>
//                   <p className="text-sm text-muted-foreground">Total sales today</p>
//                 </div>
//               </div>
//               <p className="text-xl font-bold text-blue-600">
//                 {stats ? formatCurrency(stats.today_revenue) : '$0.00'}
//               </p>
//             </div>
            
//             <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <ShoppingCart className="h-8 w-8 text-green-600" />
//                 <div>
//                   <p className="font-medium">Today's Orders</p>
//                   <p className="text-sm text-muted-foreground">Total orders today</p>
//                 </div>
//               </div>
//               <p className="text-xl font-bold text-green-600">
//                 {stats?.today_sales || 0}
//               </p>
//             </div>
            
//             <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <Users className="h-8 w-8 text-purple-600" />
//                 <div>
//                   <p className="font-medium">New Customers</p>
//                   <p className="text-sm text-muted-foreground">This month</p>
//                 </div>
//               </div>
//               <p className="text-xl font-bold text-purple-600">
//                 +{Math.floor((stats?.total_customers || 0) * 0.1)}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

const page = () => {
  return (
    <div>
      <DashboardPage />
    </div>
  )
}

export default page
