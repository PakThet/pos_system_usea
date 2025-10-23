"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color, 
  bgColor,
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full border-l-4 border-l-primary/20 hover:border-l-primary transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.2 }}
              >
                {value}
              </motion.p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <motion.div 
              className={`p-3 rounded-full ${bgColor}`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className={`h-5 w-5 ${color}`} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}