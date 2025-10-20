// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { PaymentMethod } from "@/types/pos";
// import { CreditCard, Smartphone, Wallet, DollarSign } from "lucide-react";

// interface PaymentMethodsProps {
//   selectedMethod: PaymentMethod | null;
//   onSelectMethod: (method: PaymentMethod) => void;
//   onProcessPayment: () => void;
//   total: number;
//   isLoading?: boolean;
// }

// const paymentMethods: PaymentMethod[] = [
//   {
//     id: 'cash',
//     type: 'cash',
//     name: 'Cash',
//     icon: 'cash'
//   },
//   {
//     id: 'card',
//     type: 'card',
//     name: 'Credit/Debit Card',
//     icon: 'card'
//   },
//   {
//     id: 'mobile',
//     type: 'mobile',
//     name: 'Mobile Payment',
//     icon: 'mobile'
//   },
//   {
//     id: 'credit',
//     type: 'credit',
//     name: 'Store Credit',
//     icon: 'credit'
//   }
// ];

// export function PaymentMethods({ 
//   selectedMethod, 
//   onSelectMethod, 
//   onProcessPayment, 
//   total,
//   isLoading = false 
// }: PaymentMethodsProps) {
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   const getIcon = (icon: string) => {
//     switch (icon) {
//       case 'cash': return <DollarSign className="h-6 w-6" />;
//       case 'card': return <CreditCard className="h-6 w-6" />;
//       case 'mobile': return <Smartphone className="h-6 w-6" />;
//       case 'credit': return <Wallet className="h-6 w-6" />;
//       default: return <CreditCard className="h-6 w-6" />;
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="font-semibold text-lg">Select Payment Method</h3>
      
//       <div className="grid grid-cols-2 gap-3">
//         {paymentMethods.map((method) => (
//           <Card
//             key={method.id}
//             className={`cursor-pointer transition-all border-2 ${
//               selectedMethod?.id === method.id
//                 ? 'border-primary bg-primary/5'
//                 : 'border-muted hover:border-primary/50'
//             }`}
//             onClick={() => onSelectMethod(method)}
//           >
//             <CardContent className="p-4 text-center">
//               <div className="flex flex-col items-center gap-2">
//                 {getIcon(method.icon)}
//                 <span className="text-sm font-medium">{method.name}</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {selectedMethod && (
//         <div className="space-y-3 pt-4 border-t">
//           <div className="flex justify-between items-center text-lg">
//             <span className="font-semibold">Total Amount:</span>
//             <span className="font-bold">{formatCurrency(total)}</span>
//           </div>
          
//           <Button
//             onClick={onProcessPayment}
//             disabled={isLoading || total === 0}
//             className="w-full h-12 text-lg"
//             size="lg"
//           >
//             {isLoading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }