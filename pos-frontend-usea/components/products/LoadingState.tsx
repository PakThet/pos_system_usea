import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <motion.div 
      className="flex justify-center items-center h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    </motion.div>
  );
}