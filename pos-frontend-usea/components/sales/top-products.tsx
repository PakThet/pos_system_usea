"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopProduct } from "@/types/sale";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { motion } from "framer-motion";

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const rankColors = [
    "from-yellow-500 to-yellow-600",
    "from-gray-400 to-gray-500", 
    "from-orange-500 to-orange-600",
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20 h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-all duration-300 group cursor-pointer"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${rankColors[index]} text-white rounded-full text-sm font-bold shadow-lg`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.category}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="font-bold text-lg">{formatCurrency(product.revenue)}</div>
                  <div className="flex items-center gap-1 text-xs justify-end">
                    {product.growth >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <Badge 
                      variant={product.growth >= 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {product.quantity} sold
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}