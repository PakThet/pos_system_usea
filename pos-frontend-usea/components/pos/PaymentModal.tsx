// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Customer } from '@/types';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { CreditCard, Wallet, Smartphone, User } from 'lucide-react';

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   total: number;
//   customer: Customer | null;
//   onCheckout: (paymentData: any) => void;
// }

// export default function PaymentModal({
//   isOpen,
//   onClose,
//   total,
//   customer,
//   onCheckout,
// }: PaymentModalProps) {
//   const [paymentMethod, setPaymentMethod] = useState('card');
//   const [notes, setNotes] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onCheckout({
//       method: paymentMethod,
//       notes,
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Complete Payment</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {customer && (
//             <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
//               <User className="h-4 w-4 text-blue-600" />
//               <span className="text-sm font-medium">
//                 {customer.first_name} {customer.last_name}
//               </span>
//             </div>
//           )}

//           <div className="text-center p-4 bg-gray-50 rounded-lg">
//             <p className="text-sm text-gray-600">Total Amount</p>
//             <p className="text-3xl font-bold text-green-600">
//               KSh {total.toLocaleString()}
//             </p>
//           </div>

//           <div className="space-y-3">
//             <Label>Payment Method</Label>
//             <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="card" id="card" />
//                 <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
//                   <CreditCard className="h-4 w-4" />
//                   <span>Credit Card</span>
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="cash" id="cash" />
//                 <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
//                   <Wallet className="h-4 w-4" />
//                   <span>Cash</span>
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="mobile" id="mobile" />
//                 <Label htmlFor="mobile" className="flex items-center space-x-2 cursor-pointer">
//                   <Smartphone className="h-4 w-4" />
//                   <span>Mobile Money</span>
//                 </Label>
//               </div>
//             </RadioGroup>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="notes">Order Notes (Optional)</Label>
//             <Textarea
//               id="notes"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="Add any special instructions..."
//               rows={3}
//             />
//           </div>

//           <div className="flex space-x-2 pt-4">
//             <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" className="flex-1">
//               Complete Sale
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }