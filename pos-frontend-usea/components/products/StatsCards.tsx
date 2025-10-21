import { motion } from 'framer-motion';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { Product } from '@/types/product';
import { KPICard } from '../kpi-card';

interface StatsCardsProps {
  products: Product[];          // current month products
  prevProducts?: Product[];     // previous month products
}

export function StatsCards({ products, prevProducts = [] }: StatsCardsProps) {
  // Helper to calculate total value
  const totalValue = (items: Product[]) => 
    items.reduce((sum, p) => sum + parseFloat(p.price) * p.quantity, 0);

  // Helper to calculate average price
  const avgPrice = (items: Product[]) => {
    const totalQty = items.reduce((sum, p) => sum + p.quantity, 0);
    return totalQty > 0 ? totalValue(items) / totalQty : 0;
  };

  // Helper to calculate percentage change
  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const kpiCards = [
    {
      title: 'Total Products',
      value: products.length.toString(),
      change: calcChange(products.length, prevProducts.length),
      icon: Package,
      description: 'from last month',
    },
    {
      title: 'Total Value',
      value: `$${totalValue(products).toLocaleString()}`,
      change: calcChange(totalValue(products), totalValue(prevProducts)),
      icon: DollarSign,
      description: 'from last month',
    },
    {
      title: 'Low Stock',
      value: products.filter(p => p.quantity <= p.quantity_alert).length.toString(),
      change: calcChange(
        products.filter(p => p.quantity <= p.quantity_alert).length,
        prevProducts.filter(p => p.quantity <= p.quantity_alert).length
      ),
      icon: AlertTriangle,
      description: 'items need restock',
    },
    {
      title: 'Avg Price',
      value: `$${avgPrice(products).toFixed(2)}`,
      change: calcChange(avgPrice(products), avgPrice(prevProducts)),
      icon: TrendingUp,
      description: 'from last month',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
  );
}
