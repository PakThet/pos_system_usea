import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
}

export const ErrorAlert = ({ error, onDismiss }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md border border-destructive/20">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-6 w-6 p-0 hover:bg-destructive/20"
        >
          <XIcon className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};