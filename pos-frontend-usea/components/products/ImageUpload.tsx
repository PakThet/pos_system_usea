import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadIcon, XIcon, Loader2Icon } from "lucide-react";

interface ImageUploadProps {
  imagePreview: string | null;
  uploadingImage: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onTriggerFileInput: () => void;
}

export const ImageUpload = ({
  imagePreview,
  uploadingImage,
  onImageUpload,
  onRemoveImage,
  onTriggerFileInput,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-2">
      <Label htmlFor="image">Product Image</Label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageUpload}
          accept="image/*"
          className="hidden"
        />
        
        {imagePreview ? (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Product preview" 
              className="w-20 h-20 rounded-md object-cover border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6"
              onClick={onRemoveImage}
            >
              <XIcon className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="w-20 h-20 border-2 border-dashed rounded-md flex items-center justify-center">
            {uploadingImage ? (
              <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <UploadIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        )}
        
        <div className="flex-1">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onTriggerFileInput}
            disabled={uploadingImage}
            className="w-full"
          >
            {uploadingImage ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG or WebP. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};