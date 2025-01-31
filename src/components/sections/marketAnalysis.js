"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function MarketAnalysis({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({
      marketAnalysis: {
        ...(data.marketAnalysis || {}),
        [field]: value,
      },
    });
  };

  // Competitor Management
  const addCompetitor = () => {
    const currentCompetitors = data.marketAnalysis?.competitors || [];
    handleChange("competitors", [
      ...currentCompetitors,
      {
        name: "",
        strengths: [],
        weaknesses: [],
        marketShare: 0,
      },
    ]);
  };

  const updateCompetitor = (index, field, value) => {
    const newCompetitors = [...(data.marketAnalysis?.competitors || [])];
    newCompetitors[index] = {
      ...newCompetitors[index],
      [field]: value,
    };
    handleChange("competitors", newCompetitors);
  };

  const removeCompetitor = (index) => {
    const newCompetitors = [...(data.marketAnalysis?.competitors || [])];
    newCompetitors.splice(index, 1);
    handleChange("competitors", newCompetitors);
  };

  // Handle arrays for strengths and weaknesses
  const handleArrayInput = (index, field, value) => {
    const arrayValues = value.split(',').map(item => item.trim()).filter(item => item);
    updateCompetitor(index, field, arrayValues);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Market Analysis</h2>
        <p className="text-sm text-gray-500 mb-4">
          Analyze your market opportunity and competitive landscape.
        </p>
      </div>

      <div className="space-y-6">
        {/* Market Size */}
        <div className="space-y-2">
          <Label htmlFor="marketSize">Market Size *</Label>
          <Textarea
            id="marketSize"
            placeholder="Describe your total addressable market (TAM), serviceable addressable market (SAM), and serviceable obtainable market (SOM)"
            value={data.marketAnalysis?.marketSize || ""}
            onChange={(e) => handleChange("marketSize", e.target.value)}
            required
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Include market size in dollars and potential customer base
          </p>
        </div>

        {/* Market Growth */}
        <div className="space-y-2">
          <Label htmlFor="marketGrowth">Market Growth *</Label>
          <Textarea
            id="marketGrowth"
            placeholder="Describe market growth trends and future projections"
            value={data.marketAnalysis?.marketGrowth || ""}
            onChange={(e) => handleChange("marketGrowth", e.target.value)}
            required
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Include growth rate, trends, and factors driving market expansion
          </p>
        </div>

        {/* Competitors */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Competitors</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCompetitor}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </div>

          {(data.marketAnalysis?.competitors || []).map((competitor, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  {/* Competitor Name */}
                  <div className="space-y-2">
                    <Label>Competitor Name</Label>
                    <Input
                      value={competitor.name}
                      onChange={(e) => updateCompetitor(index, "name", e.target.value)}
                      placeholder="Enter competitor name"
                    />
                  </div>

                  {/* Market Share */}
                  <div className="space-y-2">
                    <Label>Market Share (%)</Label>
                    <Input
                      type="number"
                      value={competitor.marketShare}
                      onChange={(e) => updateCompetitor(index, "marketShare", parseFloat(e.target.value) || 0)}
                      placeholder="Enter market share percentage"
                    />
                  </div>

                  {/* Strengths */}
                  <div className="space-y-2">
                    <Label>Strengths</Label>
                    <Input
                      value={competitor.strengths?.join(", ") || ""}
                      onChange={(e) => handleArrayInput(index, "strengths", e.target.value)}
                      placeholder="Enter strengths (comma-separated)"
                    />
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-2">
                    <Label>Weaknesses</Label>
                    <Input
                      value={competitor.weaknesses?.join(", ") || ""}
                      onChange={(e) => handleArrayInput(index, "weaknesses", e.target.value)}
                      placeholder="Enter weaknesses (comma-separated)"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCompetitor(index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Market Strategy */}
        <div className="space-y-2">
          <Label htmlFor="marketStrategy">Market Strategy *</Label>
          <Textarea
            id="marketStrategy"
            placeholder="Describe your go-to-market strategy and how you plan to capture market share"
            value={data.marketAnalysis?.marketStrategy || ""}
            onChange={(e) => handleChange("marketStrategy", e.target.value)}
            required
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Include your market entry strategy, positioning, and competitive advantages
          </p>
        </div>
      </div>
    </div>
  );
}
