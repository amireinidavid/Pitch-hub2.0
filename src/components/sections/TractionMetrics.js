"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function TractionMetrics({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({
      traction: {
        ...(data.traction || {}),
        [field]: value,
      },
    });
  };

  // Customer Management
  const addCustomer = () => {
    const currentCustomers = data.traction?.customers || [];
    handleChange("customers", [
      ...currentCustomers,
      {
        name: "",
        logo: "",
        testimonial: "",
        industry: "",
        useCase: "",
      },
    ]);
  };

  const updateCustomer = (index, field, value) => {
    const newCustomers = [...(data.traction?.customers || [])];
    newCustomers[index] = {
      ...newCustomers[index],
      [field]: value,
    };
    handleChange("customers", newCustomers);
  };

  const removeCustomer = (index) => {
    const newCustomers = [...(data.traction?.customers || [])];
    newCustomers.splice(index, 1);
    handleChange("customers", newCustomers);
  };

  // Metrics Management
  const addMetric = (type) => {
    const currentMetrics = data.traction?.[type] || [];
    handleChange(type, [
      ...currentMetrics,
      {
        name: "",
        value: "",
        trend: "",
        timeframe: "",
        description: "",
      },
    ]);
  };

  const updateMetric = (type, index, field, value) => {
    const newMetrics = [...(data.traction?.[type] || [])];
    newMetrics[index] = {
      ...newMetrics[index],
      [field]: value,
    };
    handleChange(type, newMetrics);
  };

  const removeMetric = (type, index) => {
    const newMetrics = [...(data.traction?.[type] || [])];
    newMetrics.splice(index, 1);
    handleChange(type, newMetrics);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Traction & Metrics</h2>
        <p className="text-sm text-gray-500 mb-4">
          Showcase your company's growth and key performance indicators.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Key Performance Metrics</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addMetric("keyMetrics")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </div>

        {(data.traction?.keyMetrics || []).map((metric, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Metric Name</Label>
                    <Input
                      value={metric.name}
                      onChange={(e) =>
                        updateMetric(
                          "keyMetrics",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Monthly Active Users"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={metric.value}
                      onChange={(e) =>
                        updateMetric(
                          "keyMetrics",
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Current value"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trend</Label>
                    <Input
                      value={metric.trend}
                      onChange={(e) =>
                        updateMetric(
                          "keyMetrics",
                          index,
                          "trend",
                          e.target.value
                        )
                      }
                      placeholder="e.g., +20% MoM"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={metric.description}
                    onChange={(e) =>
                      updateMetric(
                        "keyMetrics",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Explain this metric and its significance"
                    rows={2}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMetric("keyMetrics", index)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Metrics */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Growth Metrics</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addMetric("growthMetrics")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Growth Metric
          </Button>
        </div>

        {(data.traction?.growthMetrics || []).map((metric, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Metric</Label>
                    <Input
                      value={metric.name}
                      onChange={(e) =>
                        updateMetric(
                          "growthMetrics",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Revenue Growth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Timeframe</Label>
                    <Input
                      value={metric.timeframe}
                      onChange={(e) =>
                        updateMetric(
                          "growthMetrics",
                          index,
                          "timeframe",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Q1 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={metric.value}
                      onChange={(e) =>
                        updateMetric(
                          "growthMetrics",
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Growth rate or value"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={metric.description}
                    onChange={(e) =>
                      updateMetric(
                        "growthMetrics",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Explain this growth metric and its context"
                    rows={2}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMetric("growthMetrics", index)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Key Customers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Key Customers</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomer}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {(data.traction?.customers || []).map((customer, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input
                      value={customer.name}
                      onChange={(e) =>
                        updateCustomer(index, "name", e.target.value)
                      }
                      placeholder="Company/Customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input
                      value={customer.industry}
                      onChange={(e) =>
                        updateCustomer(index, "industry", e.target.value)
                      }
                      placeholder="Customer's industry"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Use Case</Label>
                  <Textarea
                    value={customer.useCase}
                    onChange={(e) =>
                      updateCustomer(index, "useCase", e.target.value)
                    }
                    placeholder="Describe how they use your product/service"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Testimonial</Label>
                  <Textarea
                    value={customer.testimonial}
                    onChange={(e) =>
                      updateCustomer(index, "testimonial", e.target.value)
                    }
                    placeholder="Customer testimonial or success story"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input
                    value={customer.logo}
                    onChange={(e) =>
                      updateCustomer(index, "logo", e.target.value)
                    }
                    placeholder="URL to customer's logo"
                    type="url"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCustomer(index)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
