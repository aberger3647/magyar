import { ImagePlus } from "lucide-react";
import { FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "./ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageTitle } from "./PageTitle";

export const CreateFlashCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      word: "",
    },
    onSubmit:async({value})=>{
      setErrMsg(null)
      if (!selectedFile) {
setErrMsg('Upload an image')
return
      }
      if (!value.word || value.word.trim()===''){
        setErrMsg('Enter a word')
        return
      }
    }

  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("selected file: ", file.name);
      setSelectedFile(file);
    }
  };

  const imageUrl=useMemo(()=>{
    if(!selectedFile) return null
    return URL.createObjectURL(selectedFile)
  },[selectedFile])

  useEffect(() => {
      return () => {
        if (imageUrl)         URL.revokeObjectURL(imageUrl);
      };

  }, [imageUrl]);
  return (
    <>
    <PageTitle title="Create Flash Cards" />

    <div className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6 flex flex-col justify-between items-center">
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

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="selected image"
          className="w-full max-h-48 object-contain cursor-pointer"
          onClick={handleBoxClick}
        />
      ) : (
        <Button
          className="border-dashed border-black flex-1 m-8 w-56"
          variant="outline"
          size="icon-lg"
          onClick={handleBoxClick}
        >
          <ImagePlus />
        </Button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
<p className="text-xs">{errMsg}</p>
      <Button onClick={()=>form.handleSubmit()}>Create Card</Button>
    </div>
    </>
  );
};
