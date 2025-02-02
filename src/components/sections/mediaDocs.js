"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFileAction } from "@/actions";

const formSchema = z.object({
  media: z.object({
    logo: z.string().url().optional(),
    pitchDeck: z.string().url().optional(),
    video: z.string().url().optional(),
    images: z.array(
      z.object({
        url: z.string().url(),
        caption: z.string(),
      })
    ),
    slides: z.array(
      z.object({
        url: z.string().url(),
        order: z.number(),
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  documents: z.array(
    z.object({
      title: z.string(),
      type: z.string(),
      url: z.string().url(),
      description: z.string().optional(),
    })
  ),
  pressLinks: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      date: z.date(),
      source: z.string(),
    })
  ),
});

function MediaDocs({ data, updateData }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      media: data.media || {
        pitchDeck: "",
        video: "",
        images: [],
        slides: [],
      },
      documents: data.documents || [],
      pressLinks: data.pressLinks || [],
    },
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    updateData(values);
  };

  const handleFileUpload = async (e, field, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const fileTypeMap = {
        'image': 'PITCH_IMAGES',
        'video': 'PITCH_VIDEOS',
        'document': 'PITCH_DOCUMENTS',
        'slide': 'PITCH_SLIDES',
        'audio': 'PITCH_AUDIO'
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileTypeMap[type] || 'PITCH_DOCUMENTS');

      const result = await uploadFileAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      field.onChange(result.url);
      handleFieldChange();

      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addImage = () => {
    const current = form.getValues("media.images");
    form.setValue("media.images", [...current, { url: "", caption: "" }]);
    handleFieldChange();
  };

  const addSlide = () => {
    const currentSlides = form.getValues("media.slides") || [];
    form.setValue("media.slides", [
      ...currentSlides,
      {
        url: "",
        order: currentSlides.length + 1,
        title: "",
        description: "",
      },
    ]);
    handleFieldChange();
  };

  const moveSlide = (index, direction) => {
    const currentSlides = form.getValues("media.slides");
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= currentSlides.length) return;

    const updatedSlides = [...currentSlides];
    [updatedSlides[index], updatedSlides[newIndex]] = [
      updatedSlides[newIndex],
      updatedSlides[index],
    ];

    updatedSlides.forEach((slide, i) => {
      slide.order = i + 1;
    });

    form.setValue("media.slides", updatedSlides);
    handleFieldChange();
  };

  const addDocument = () => {
    const currentDocs = form.getValues("documents");
    form.setValue("documents", [
      ...currentDocs,
      {
        title: "",
        type: "",
        url: "",
        description: "",
        uploadDate: new Date().toISOString().split("T")[0],
      },
    ]);
    handleFieldChange();
  };

  const updateDocument = (index, field, value) => {
    const newDocs = [...form.getValues("documents")];
    newDocs[index] = {
      ...newDocs[index],
      [field]: value,
    };
    form.setValue("documents", newDocs);
    handleFieldChange();
  };

  const removeDocument = (index) => {
    const newDocs = [...form.getValues("documents")];
    newDocs.splice(index, 1);
    form.setValue("documents", newDocs);
    handleFieldChange();
  };

  const addPressLink = () => {
    const current = form.getValues("pressLinks");
    form.setValue("pressLinks", [
      ...current,
      { title: "", url: "", date: new Date(), source: "" },
    ]);
    handleFieldChange();
  };

  const documentTypes = [
    "pitch_deck",
    "financial_model",
    "business_plan",
    "market_research",
    "technical_documentation",
    "legal_document",
    "other",
  ];

  return (
    <Form {...form}>
      <form onChange={handleFieldChange} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Media & Documents</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload and manage your pitch deck, logo, images, videos, and other
            supporting documents.
          </p>
        </div>

        {/* Company Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="media.logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, field, "image")}
                    />
                    {field.value && (
                      <div className="mt-2">
                        <Image
                          src={field.value}
                          alt="Company Logo"
                          width={100}
                          height={100}
                          className="rounded-md object-contain"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Pitch Deck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Label htmlFor="pitchDeck">Pitch Deck URL *</Label>
          <Input
            id="pitchDeck"
            value={data.media?.pitchDeck || ""}
            onChange={(e) => {
              form.setValue("media.pitchDeck", e.target.value);
              handleFieldChange();
            }}
            placeholder="URL to your pitch deck"
            type="url"
            required
          />
          <p className="text-xs text-gray-500">
            Upload your pitch deck to a cloud service and provide the link here
          </p>
        </motion.div>

        {/* Presentation Slides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Presentation Slides</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSlide}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>

          <AnimatePresence>
            {form.watch("media.slides")?.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 border rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Slide {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSlide(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSlide(index, "down")}
                      disabled={index === form.watch("media.slides").length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const current = form.getValues("media.slides");
                        form.setValue(
                          "media.slides",
                          current.filter((_, i) => i !== index)
                        );
                        handleFieldChange();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`media.slides.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slide Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`media.slides.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slide Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, field, "slide")
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`media.slides.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Slide Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch(`media.slides.${index}.url`) && (
                  <div className="mt-2">
                    <Image
                      src={form.watch(`media.slides.${index}.url`)}
                      alt={`Slide ${index + 1}`}
                      width={200}
                      height={150}
                      className="rounded-md"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Images Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Images Gallery</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImage}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>

          <AnimatePresence>
            {form.watch("media.images").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={form.watch(`media.images.${index}.url`)}
                        onChange={(e) => {
                          form.setValue(
                            `media.images.${index}.url`,
                            e.target.value
                          );
                          handleFieldChange();
                        }}
                        placeholder="URL to the image"
                        type="url"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Caption</Label>
                      <Input
                        value={form.watch(`media.images.${index}.caption`)}
                        onChange={(e) => {
                          form.setValue(
                            `media.images.${index}.caption`,
                            e.target.value
                          );
                          handleFieldChange();
                        }}
                        placeholder="Image caption"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const current = form.getValues("media.images");
                      form.setValue(
                        "media.images",
                        current.filter((_, i) => i !== index)
                      );
                      handleFieldChange();
                    }}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Supporting Documents</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDocument}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>

          <AnimatePresence>
            {form.watch("documents").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Document Title</Label>
                        <Input
                          value={form.watch(`documents.${index}.title`)}
                          onChange={(e) =>
                            updateDocument(index, "title", e.target.value)
                          }
                          placeholder="Enter document title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Document Type</Label>
                        <Select
                          value={form.watch(`documents.${index}.type`)}
                          onValueChange={(value) =>
                            updateDocument(index, "type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Document URL</Label>
                      <Input
                        value={form.watch(`documents.${index}.url`)}
                        onChange={(e) =>
                          updateDocument(index, "url", e.target.value)
                        }
                        placeholder="URL to the document"
                        type="url"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={form.watch(`documents.${index}.description`)}
                        onChange={(e) =>
                          updateDocument(index, "description", e.target.value)
                        }
                        placeholder="Brief description of the document"
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Press Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Press Coverage</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPressLink}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Press Link
            </Button>
          </div>

          <AnimatePresence>
            {form.watch("pressLinks").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 border rounded-lg"
              >
                {/* Press link fields */}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <Progress value={uploadProgress} />
            <p className="text-sm text-gray-500">Uploading...</p>
          </motion.div>
        )}
      </form>
    </Form>
  );
}

export default MediaDocs;
