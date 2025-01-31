"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const industries = [
  "Software & Technology",
  "Healthcare & Biotech",
  "Fintech",
  "E-commerce & Retail",
  "Clean Technology",
  "Education",
  "Real Estate",
  "Manufacturing",
  "Agriculture",
  "Entertainment & Media",
  "Transportation & Logistics",
  "Consumer Goods",
  "Energy",
  "AI & Machine Learning",
  "Blockchain & Crypto",
  "Other",
];

export default function BasicInfo({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <p className="text-sm text-gray-500 mb-4">
              Provide the essential details about your venture.
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Enter your project title"
                value={data?.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                placeholder="A brief, catchy description of your venture"
                value={data?.tagline || ""}
                onChange={(e) => handleChange("tagline", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Keep it concise and memorable (50 characters max)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of your venture"
                value={data?.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                required
                rows={5}
              />
              <p className="text-xs text-gray-500">
                Explain what your venture does, its mission, and its vision
              </p>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={data?.industry || ""}
                onValueChange={(value) => handleChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://your-website.com"
                value={data?.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
                value={data?.tags?.join(", ") || ""}
                onChange={(e) => {
                  const tagsArray = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== "");
                  handleChange("tags", tagsArray);
                }}
              />
              <p className="text-xs text-gray-500">
                Add relevant tags to help investors find your pitch (e.g., SaaS,
                B2B, Mobile)
              </p>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <Input
                id="categories"
                placeholder="Enter categories separated by commas"
                value={data?.categories?.join(", ") || ""}
                onChange={(e) => {
                  const categoriesArray = e.target.value
                    .split(",")
                    .map((category) => category.trim())
                    .filter((category) => category !== "");
                  handleChange("categories", categoriesArray);
                }}
              />
              <p className="text-xs text-gray-500">
                Add business categories that best describe your venture
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
