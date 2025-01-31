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
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function ExecutiveSummary({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({
      executiveSummary: {
        ...(data.executiveSummary || {}),
        [field]: value,
      },
    });
  };

  const handleTargetMarketChange = (field, value) => {
    updateData({
      executiveSummary: {
        ...(data.executiveSummary || {}),
        targetMarket: {
          ...(data.executiveSummary?.targetMarket || {}),
          [field]: value,
        },
      },
    });
  };

  const addMarketSegment = () => {
    const currentSegments = data.executiveSummary?.targetMarket?.segments || [];
    handleTargetMarketChange("segments", [...currentSegments, ""]);
  };

  const updateMarketSegment = (index, value) => {
    const newSegments = [...(data.executiveSummary?.targetMarket?.segments || [])];
    newSegments[index] = value;
    handleTargetMarketChange("segments", newSegments);
  };

  const removeMarketSegment = (index) => {
    const newSegments = [...(data.executiveSummary?.targetMarket?.segments || [])];
    newSegments.splice(index, 1);
    handleTargetMarketChange("segments", newSegments);
  };

  const handleDemographicsChange = (key, value) => {
    handleTargetMarketChange("demographics", {
      ...(data.executiveSummary?.targetMarket?.demographics || {}),
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Executive Summary</h2>
        <p className="text-sm text-gray-500 mb-4">
          Provide a comprehensive overview of your business opportunity.
        </p>
      </div>

      <div className="space-y-6">
        {/* Problem Statement */}
        <div className="space-y-2">
          <Label htmlFor="problem">Problem Statement *</Label>
          <Textarea
            id="problem"
            placeholder="What problem are you solving?"
            value={data.executiveSummary?.problem || ""}
            onChange={(e) => handleChange("problem", e.target.value)}
            required
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Clearly describe the problem or pain point your solution addresses
          </p>
        </div>

        {/* Solution */}
        <div className="space-y-2">
          <Label htmlFor="solution">Solution *</Label>
          <Textarea
            id="solution"
            placeholder="How does your product/service solve this problem?"
            value={data.executiveSummary?.solution || ""}
            onChange={(e) => handleChange("solution", e.target.value)}
            required
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Explain how your solution addresses the problem and its key features
          </p>
        </div>

        {/* Target Market */}
        <div className="space-y-4">
          <Label>Target Market</Label>
          
          {/* Market Size */}
          <div className="space-y-2">
            <Label htmlFor="marketSize">Market Size *</Label>
            <Input
              id="marketSize"
              placeholder="What is your total addressable market size?"
              value={data.executiveSummary?.targetMarket?.size || ""}
              onChange={(e) => handleTargetMarketChange("size", e.target.value)}
              required
            />
          </div>

          {/* Market Segments */}
          <div className="space-y-2">
            <Label>Market Segments</Label>
            <div className="space-y-2">
              {(data.executiveSummary?.targetMarket?.segments || []).map((segment, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={segment}
                    onChange={(e) => updateMarketSegment(index, e.target.value)}
                    placeholder="Describe this market segment"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeMarketSegment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMarketSegment}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Market Segment
              </Button>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-2">
            <Label>Target Demographics</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Age Range"
                value={data.executiveSummary?.targetMarket?.demographics?.ageRange || ""}
                onChange={(e) => handleDemographicsChange("ageRange", e.target.value)}
              />
              <Input
                placeholder="Income Level"
                value={data.executiveSummary?.targetMarket?.demographics?.incomeLevel || ""}
                onChange={(e) => handleDemographicsChange("incomeLevel", e.target.value)}
              />
              <Input
                placeholder="Geographic Location"
                value={data.executiveSummary?.targetMarket?.demographics?.location || ""}
                onChange={(e) => handleDemographicsChange("location", e.target.value)}
              />
              <Input
                placeholder="Other Demographics"
                value={data.executiveSummary?.targetMarket?.demographics?.other || ""}
                onChange={(e) => handleDemographicsChange("other", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Competitive Advantage */}
        <div className="space-y-2">
          <Label htmlFor="competitiveAdvantage">Competitive Advantage *</Label>
          <Textarea
            id="competitiveAdvantage"
            placeholder="What makes your solution unique and better than alternatives?"
            value={data.executiveSummary?.competitiveAdvantage || ""}
            onChange={(e) => handleChange("competitiveAdvantage", e.target.value)}
            required
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Describe your unique value proposition and competitive advantages
          </p>
        </div>
      </div>
    </div>
  );
}
