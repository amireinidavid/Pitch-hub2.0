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
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  revenueStreams: z.array(
    z.object({
      source: z.string(),
      description: z.string(),
      percentage: z.number().min(0).max(100),
    })
  ),
  costStructure: z.array(
    z.object({
      category: z.string(),
      description: z.string(),
      percentage: z.number().min(0).max(100),
    })
  ),
  channels: z.array(z.string()),
  partnerships: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      description: z.string(),
    })
  ),
});

export default function BusinessModel({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({
      businessModel: {
        ...(data.businessModel || {}),
        [field]: value,
      },
    });
  };

  // Revenue Streams Management
  const addRevenueStream = () => {
    const currentStreams = data.businessModel?.revenueStreams || [];
    handleChange("revenueStreams", [
      ...currentStreams,
      {
        source: "",
        description: "",
        percentage: 0,
      },
    ]);
  };

  const updateRevenueStream = (index, field, value) => {
    const newStreams = [...(data.businessModel?.revenueStreams || [])];
    newStreams[index] = {
      ...newStreams[index],
      [field]: field === "percentage" ? parseFloat(value) || 0 : value,
    };
    handleChange("revenueStreams", newStreams);
  };

  const removeRevenueStream = (index) => {
    const newStreams = [...(data.businessModel?.revenueStreams || [])];
    newStreams.splice(index, 1);
    handleChange("revenueStreams", newStreams);
  };

  // Cost Structure Management
  const handleCostStructure = (type, value) => {
    handleChange("costStructure", {
      ...(data.businessModel?.costStructure || {}),
      [type]: value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    });
  };

  // Partnerships Management
  const addPartnership = () => {
    const currentPartnerships = data.businessModel?.partnerships || [];
    handleChange("partnerships", [
      ...currentPartnerships,
      {
        name: "",
        type: "",
        description: "",
      },
    ]);
  };

  const updatePartnership = (index, field, value) => {
    const newPartnerships = [...(data.businessModel?.partnerships || [])];
    newPartnerships[index] = {
      ...newPartnerships[index],
      [field]: value,
    };
    handleChange("partnerships", newPartnerships);
  };

  const removePartnership = (index) => {
    const newPartnerships = [...(data.businessModel?.partnerships || [])];
    newPartnerships.splice(index, 1);
    handleChange("partnerships", newPartnerships);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Business Model</h2>
        <p className="text-sm text-gray-500 mb-4">
          Describe how your business creates, delivers, and captures value.
        </p>
      </div>

      <div className="space-y-6">
        {/* Revenue Streams */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Revenue Streams</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRevenueStream}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Revenue Stream
            </Button>
          </div>

          {(data.businessModel?.revenueStreams || []).map((stream, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Revenue Source</Label>
                    <Input
                      value={stream.source}
                      onChange={(e) =>
                        updateRevenueStream(index, "source", e.target.value)
                      }
                      placeholder="e.g., Subscription fees"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={stream.description}
                      onChange={(e) =>
                        updateRevenueStream(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe this revenue stream"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage of Revenue (%)</Label>
                    <Input
                      type="number"
                      value={stream.percentage}
                      onChange={(e) =>
                        updateRevenueStream(index, "percentage", e.target.value)
                      }
                      placeholder="Enter percentage"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRevenueStream(index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cost Structure */}
        <div className="space-y-4">
          <Label>Cost Structure</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fixed Costs</Label>
              <Textarea
                value={
                  data.businessModel?.costStructure?.fixed?.join(", ") || ""
                }
                onChange={(e) => handleCostStructure("fixed", e.target.value)}
                placeholder="Enter fixed costs (comma-separated)"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                e.g., Rent, Salaries, Insurance
              </p>
            </div>
            <div className="space-y-2">
              <Label>Variable Costs</Label>
              <Textarea
                value={
                  data.businessModel?.costStructure?.variable?.join(", ") || ""
                }
                onChange={(e) =>
                  handleCostStructure("variable", e.target.value)
                }
                placeholder="Enter variable costs (comma-separated)"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                e.g., Materials, Commission, Utilities
              </p>
            </div>
          </div>
        </div>

        {/* Partnerships */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Key Partnerships</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPartnership}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Partnership
            </Button>
          </div>

          {(data.businessModel?.partnerships || []).map(
            (partnership, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Partner Name</Label>
                      <Input
                        value={partnership.name}
                        onChange={(e) =>
                          updatePartnership(index, "name", e.target.value)
                        }
                        placeholder="Enter partner name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Partnership Type</Label>
                      <Input
                        value={partnership.type}
                        onChange={(e) =>
                          updatePartnership(index, "type", e.target.value)
                        }
                        placeholder="e.g., Strategic, Supplier, Distribution"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={partnership.description}
                        onChange={(e) =>
                          updatePartnership(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the partnership and its benefits"
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePartnership(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Distribution Channels */}
        <div className="space-y-2">
          <Label>Distribution Channels</Label>
          <Textarea
            value={data.businessModel?.channels?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "channels",
                e.target.value
                  .split(",")
                  .map((channel) => channel.trim())
                  .filter((channel) => channel)
              )
            }
            placeholder="Enter your distribution channels (comma-separated)"
            rows={3}
          />
          <p className="text-xs text-gray-500">
            e.g., Direct Sales, Online Platform, Retail Partners, Distributors
          </p>
        </div>
      </div>
    </div>
  );
}
