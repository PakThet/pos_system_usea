import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Grid3X3, Table, Plus } from 'lucide-react';

interface PageHeaderProps {
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onAddProduct: () => void;
}

export function PageHeader({ viewMode, onViewModeChange, onAddProduct }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
      <div className="space-y-2">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Product Management
        </motion.h1>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Manage your product inventory with ease
        </motion.p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('grid')}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('table')}
            className="flex items-center gap-2"
          >
            <Table className="h-4 w-4" />
            Table
          </Button>
        </div>
        <Button 
          onClick={onAddProduct}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
}