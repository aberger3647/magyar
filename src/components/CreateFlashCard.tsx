import { ImagePlus } from "lucide-react";
import { FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "./ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageTitle } from "./PageTitle";
import { useTheme } from "./theme-provider";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import { Toaster } from "sonner";

const getExtensionForType = (mimeType: string) => {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
};

const makeSafeStorageKey = (text: string) => {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "card";
};

const ConfiguredCreateFlashCard = () => {
  const supabase = getSupabaseClient();
  const { resolved } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      word: "",
    },
    onSubmit: async ({ value }) => {
      setErrMsg(null);
      if (!selectedFile) {
        setErrMsg("Upload an image before creating a card.");
        return;
      }
      if (!value.word || value.word.trim() === "") {
        setErrMsg("Enter a word before creating a card.");
        return;
      }
      setIsSubmitting(true);
      try {
        const uuid = crypto.randomUUID();
        const extension = getExtensionForType(selectedFile.type);
        const safeWord = makeSafeStorageKey(value.word);
        const filePath = `${safeWord}-${uuid}.${extension}`;
        const result = await supabase.storage
          .from("cardimages")
          .upload(filePath, selectedFile);
        if (result.error) {
          console.error(result.error);
          setErrMsg(`Image upload failed: ${result.error.message}`);
          return;
        }
        const { data: { publicUrl } } = supabase.storage
          .from("cardimages")
          .getPublicUrl(filePath);
        const { error } = await supabase
          .from("flashcards")
          .insert({ word: value.word.trim(), img_url: publicUrl });
        if (error) {
          setErrMsg(`Could not create card: ${error.message}`);
          console.error(error);
          return;
        }
        toast.success("Card created");
        form.reset();
        setSelectedFile(null);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectedImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrMsg("Choose an image file (PNG, JPG, or WebP).");
      return;
    }
    setSelectedFile(file);
    setErrMsg(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectedImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleSelectedImage(file);
    }
  };

  const imageUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <>
      <PageTitle title="Create Flash Cards" />

      <div className="flex min-h-96 w-full flex-col items-center justify-between gap-4 rounded-lg border bg-card p-6 sm:max-w-md">
        <div className="w-full">
          <form.Field
            name="word"
            children={(field) => (
              <FieldGroup className="gap-2">
                <FieldLabel htmlFor={field.name} className="self-center text-sm font-medium">
                  Word
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  lang="hu"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="kutya"
                  className="w-full max-w-xs self-center text-center text-xl shadow-none placeholder:text-muted-foreground"
                />
                {field.state.meta.errors?.length ? (
                  <p role="alert" className="text-center text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </FieldGroup>
            )}
          />
        </div>

        <Button
          type="button"
          aria-label={imageUrl ? "Change selected image" : "Upload card image"}
          className={`m-4 min-h-44 w-full max-w-64 flex-1 overflow-hidden border-dashed border-input p-0 ${isDraggingImage ? "border-primary bg-primary/10" : ""}`}
          variant="outline"
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Card preview"
              className="h-full w-full object-cover outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
              <ImagePlus aria-hidden="true" />
              <span>Select or drag an image</span>
            </div>
          )}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {errMsg && (
          <p role="alert" className="text-center text-sm text-destructive">
            {errMsg}
          </p>
        )}
        <Button type="button" disabled={isSubmitting} onClick={() => form.handleSubmit()}>
          {isSubmitting ? "Creating…" : "Create Card"}
        </Button>
      </div>
      <Toaster theme={resolved} />
    </>
  );
};

export const CreateFlashCard = () => {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageTitle title="Create Flash Cards" />
        <p role="alert" className="max-w-md text-center text-muted-foreground">
          Creating Flash Cards requires Supabase configuration. Add the project
          URL and an anon or publishable key, then restart Magyar.
        </p>
      </>
    );
  }

  return <ConfiguredCreateFlashCard />;
};
