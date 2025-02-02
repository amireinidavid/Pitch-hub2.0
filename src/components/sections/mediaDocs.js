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
import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFileAction } from "@/actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FileText } from "lucide-react";

const formSchema = z.object({
  media: z.object({
    logo: z.object({
      url: z.string().url().optional(),
      publicId: z.string().optional(),
    }),
    pitchDeck: z.string().url().optional(),
    video: z.object({
      url: z.string().url().optional(),
      publicId: z.string().optional(),
      thumbnail: z.string().url().optional(),
    }),
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

// Helper function to fetch file size from URL
const getFileSizeFromUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const size = response.headers.get('content-length');
    return formatFileSize(parseInt(size));
  } catch (error) {
    console.error('Error fetching file size:', error);
    return 'Size unknown';
  }
};

// Helper function to format file size in human-readable format
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const handleFieldChange = (form) => {
  form.trigger();
};

const handleMultipleFileUpload = async (e, field, type, form, toast) => {
  const files = Array.from(e.target.files || []);
  const existingFiles = field.value || [];
  
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", type);
      
      const result = await uploadFileAction(formData);
      
      if (!result.success) {
        throw new Error(`Failed to upload ${file.name}`);
      }
      
      return {
        url: result.url,
        publicId: result.publicId,
        title: file.name.split('.')[0],
        type: type === 'document' ? 'other' : undefined,
        description: '',
        order: type === 'slide' ? existingFiles.length : undefined,
      };
    });
    
    const newFiles = await Promise.all(uploadPromises);
    field.onChange([...existingFiles, ...newFiles]);
    
    toast({
      title: "Upload Successful",
      description: `Successfully uploaded ${files.length} file(s)`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    toast({
      title: "Upload Failed",
      description: error.message,
      variant: "destructive",
    });
  }
};

const handleDocumentTitleChange = (index, value, field) => {
  const newDocs = [...field.value];
  newDocs[index] = { ...newDocs[index], title: value };
  field.onChange(newDocs);
};

const handleDocumentTypeChange = (index, value, field) => {
  const newDocs = [...field.value];
  newDocs[index] = { ...newDocs[index], type: value };
  field.onChange(newDocs);
};

const handleDocumentDescriptionChange = (index, value, field) => {
  const newDocs = [...field.value];
  newDocs[index] = { ...newDocs[index], description: value };
  field.onChange(newDocs);
};

const handleRemoveDocument = (index, field) => {
  const newDocs = [...field.value];
  newDocs.splice(index, 1);
  field.onChange(newDocs);
};

const handleSlideChange = (index, key, value, field) => {
  const newSlides = [...field.value];
  newSlides[index] = { ...newSlides[index], [key]: value };
  field.onChange(newSlides);
};

const handleRemoveSlide = (index, field) => {
  const newSlides = [...field.value];
  newSlides.splice(index, 1);
  field.onChange(newSlides);
};

const handleSlideDragEnd = (result, field) => {
  if (!result.destination) return;

  const items = Array.from(field.value);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  // Update order numbers
  const updatedItems = items.map((item, index) => ({
    ...item,
    order: index,
  }));

  field.onChange(updatedItems);
};


function MediaDocs({ data, updateData }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVideo, setPreviewVideo] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      media: data.media || {
        logo: { url: "", publicId: "" },
        pitchDeck: "",
        video: { url: "", publicId: "", thumbnail: "" },
        documents: [],
        images: [],
        slides: [],
      },
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

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", type);
      formData.append("fileSize", file.size);

      if (type === 'video') {
        // Create video preview
        setPreviewVideo(URL.createObjectURL(file));
      }

      const result = await uploadFileAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      field.onChange({
        url: result.url,
        publicId: result.publicId,
        fileSize: formatFileSize(file.size),
        ...(type === 'video' && { thumbnail: result.thumbnail }),
      });
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
        <div className="grid gap-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800">Media & Documents</h2>
            <p className="text-gray-600 mt-2">
              Enhance your pitch with compelling visuals and documentation
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <FormField
                control={form.control}
                name="media.logo"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-4">
                      <FormLabel className="text-lg font-semibold">Company Logo</FormLabel>
                      {field.value?.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange({ url: "", publicId: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl hover:border-primary/50 transition-all bg-gray-50/50">
                      <div className="space-y-2 text-center">
                        {field.value?.url ? (
                          <div className="relative w-32 h-32 mx-auto">
                            <Image
                              src={field.value.url}
                              alt="Company Logo"
                              fill
                              className="object-contain rounded-lg"
                            />
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80">
                                <span>Upload logo</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, field, "logo")}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Video Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <FormField
                control={form.control}
                name="media.video"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-4">
                      <FormLabel className="text-lg font-semibold">Pitch Video</FormLabel>
                      {field.value?.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange({ url: "", publicId: "", thumbnail: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {(field.value?.url || previewVideo) ? (
                      <div className="relative rounded-lg overflow-hidden">
                        <video
                          src={field.value?.url || previewVideo}
                          controls
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl hover:border-primary/50 transition-all bg-gray-50/50">
                        <div className="space-y-2 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80">
                              <span>Upload video</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="video/*"
                                onChange={(e) => handleFileUpload(e, field, "video")}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* Documents Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <FormField
              control={form.control}
              name="media.documents"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-4">
                    <FormLabel className="text-lg font-semibold">Documents</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = '.pdf,.doc,.docx';
                        fileInput.multiple = true;
                        fileInput.onchange = (e) => handleMultipleFileUpload(e, field, "document");
                        fileInput.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {field.value?.map((doc, index) => (
                      <motion.div
                        key={doc.url}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-md shadow-sm">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Input
                              value={doc.title}
                              onChange={(e) => handleDocumentTitleChange(index, e.target.value, field)}
                              placeholder="Document Title"
                              className="font-medium mb-1"
                            />
                            <Select
                              value={doc.type}
                              onValueChange={(value) => handleDocumentTypeChange(index, value, field)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="financial">Financial Report</SelectItem>
                                <SelectItem value="legal">Legal Document</SelectItem>
                                <SelectItem value="technical">Technical Documentation</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <Textarea
                              value={doc.description}
                              onChange={(e) => handleDocumentDescriptionChange(index, e.target.value, field)}
                              placeholder="Brief description..."
                              className="mt-2 text-sm"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveDocument(index, field)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                          <span>{formatFileSize(getFileSizeFromUrl(doc.url))}</span>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            View Document
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </motion.div>

          {/* Slides Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <FormField
              control={form.control}
              name="media.slides"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-4">
                    <FormLabel className="text-lg font-semibold">Presentation Slides</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.multiple = true;
                        fileInput.onchange = (e) => handleMultipleFileUpload(e, field, "slide");
                        fileInput.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Slides
                    </Button>
                  </div>

                  <DragDropContext onDragEnd={(result) => handleSlideDragEnd(result, field)}>
                    <Droppable droppableId="slides" direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
                        >
                          {field.value?.map((slide, index) => (
                            <Draggable key={slide.url} draggableId={slide.url} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative group"
                                  >
                                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                      <Image
                                        src={slide.url}
                                        alt={slide.title || `Slide ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute top-2 right-2 flex space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveSlide(index, field)}
                                          >
                                            <X className="h-4 w-4 text-white" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <Input
                                      value={slide.title}
                                      onChange={(e) => handleSlideChange(index, 'title', e.target.value, field)}
                                      placeholder={`Slide ${index + 1}`}
                                      className="mt-2 text-sm"
                                    />
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </FormItem>
              )}
            />
          </motion.div>
        </div>
      </form>
    </Form>
  );
}

export default MediaDocs;

