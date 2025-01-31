"use client";

// ... previous imports ...
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

function MediaDocs({ data, updateData }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ... previous form setup ...

  const uploadFile = async (file, fileType) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUploading(false);
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
      setUploading(false);
      return null;
    }
  };

  const handleFileUpload = async (e, field, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, type);
    if (url) {
      field.onChange(url);
      handleFieldChange();
    }
  };

  return (
    <Form {...form}>
      <form onChange={handleFieldChange} className="space-y-8">
        {/* Main Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold">Main Media</h3>

          {/* Pitch Deck Upload */}
          <FormField
            control={form.control}
            name="media.pitchDeck"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pitch Deck</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) => handleFileUpload(e, field, "document")}
                      className="max-w-[300px]"
                    />
                    {field.value && (
                      <a
                        href={field.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Deck
                      </a>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Video Upload */}
          <FormField
            control={form.control}
            name="media.video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Pitch</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, field, "video")}
                      className="max-w-[300px]"
                    />
                    {field.value && (
                      <video
                        src={field.value}
                        controls
                        className="max-w-[200px]"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Upload Progress */}
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

        {/* ... rest of the component ... */}
      </form>
    </Form>
  );
}

export default MediaDocs;
