import { Loader2Icon } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2Icon className="mx-auto h-12 w-12 animate-spin text-primary" />
    </div>
  );
};