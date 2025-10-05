import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LucideIcon } from 'lucide-react';

const MyCard = ({
  name,
  icon: Icon,
  value,
}: {
  name: string;
  icon?: LucideIcon;
  value: string | number;
}) => {
  return (
    <div>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{name}</CardTitle>
            {Icon && <Icon size={30} /> }
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof value === "number" ? `${value.toFixed(2)}` : value}
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default MyCard
