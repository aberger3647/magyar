import { ImagePlus } from "lucide-react";
import { FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "./ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageTitle } from "./PageTitle";
import { supabase } from "@/lib/supabase";
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

export const CreateFlashCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const form = useForm({
    defaultValues: {
      word: "",
    },
    onSubmit: async ({ value }) => {
      setErrMsg(null);
      if (!selectedFile) {
        setErrMsg("Upload an image");
        return;
      }
      if (!value.word || value.word.trim() === "") {
        setErrMsg("Enter a word");
        return;
      }
      const uuid = crypto.randomUUID();
      const extension = getExtensionForType(selectedFile.type);
      const safeWord = makeSafeStorageKey(value.word);
      const filePath = `${safeWord}-${uuid}.${extension}`;
      const result = await supabase.storage
        .from("cardimages")
        .upload(filePath, selectedFile);
      if (result.error) {
        console.log(result.error);
        setErrMsg(`Image upload failed: ${result.error.message}`);
        return;
      }
      const { data: { publicUrl } } = supabase.storage
        .from("cardimages")
        .getPublicUrl(filePath);
      const { error } = await supabase
        .from("flashcards")
        .insert({ word: value.word, img_url: publicUrl });
      if (error) {
        setErrMsg(`Failed to create card: ${error}`);
        console.log(error);
        return;
      } else {
        toast.success("Card created successfully");
      }
      form.reset();
      setSelectedFile(null);
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectedImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrMsg("Please upload an image file");
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

      <div className="w-full min-h-96 sm:max-w-md overflow-hidden rounded-lg border p-6 flex flex-col justify-between items-center gap-3">
        <div className="w-full">
          <form.Field
            name="word"
            children={(field) => (
              <FieldGroup className="gap-2">
                <FieldLabel htmlFor={field.name} className="self-center text-md">
                  Enter Word
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="kutya"
                  className="text-xl text-center border shadow-none focus-visible:ring-0 placeholder:text-slate-400 w-2/3 self-center"
                />
                {field.state.meta.errors ? (
                  <em className="text-[10px] text-red-500">
                    {field.state.meta.errors.join(",")}
                  </em>
                ) : null}
              </FieldGroup>
            )}
          />
        </div>

        <Button
          className={`border-dashed border-black flex-1 m-8 w-56 p-0 overflow-hidden ${isDraggingImage ? "border-blue-500 bg-blue-50" : ""}`}
          variant="outline"
          size="icon-lg"
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="selected image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500">
              <ImagePlus />
              <span>Click or drag image here</span>
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
        <p className="text-xs">{errMsg}</p>
        <Button onClick={() => form.handleSubmit()}>Create Card</Button>
      </div>
      <Toaster />
    </>
  );
};
