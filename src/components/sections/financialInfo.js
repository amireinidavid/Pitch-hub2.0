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
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  financials: z.object({
    currentRevenue: z.string().default(""),
    projectedRevenue: z.array(
      z.object({
        year: z.string(),
        amount: z.string().default(""),
      })
    ),
    burnRate: z.string().default(""),
    runway: z.string().default(""),
  }),
  funding: z.object({
    raised: z.string().default(""),
    seeking: z.string().default(""),
    valuation: z.string().default(""),
    preMoney: z.string().default(""),
    postMoney: z.string().default(""),
  }),
});

function FinancialInfo({ data, updateData }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financials: data.financials || {
        currentRevenue: "",
        projectedRevenue: [],
        burnRate: "",
        runway: "",
      },
      funding: data.funding || {
        raised: "",
        seeking: "",
        valuation: "",
        preMoney: "",
        postMoney: "",
      },
    },
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    updateData(values);
  };

  const addProjectedRevenue = () => {
    const current = form.getValues("financials.projectedRevenue");
    const nextYear =
      current.length > 0
        ? String(Math.max(...current.map((r) => parseInt(r.year))) + 1)
        : String(new Date().getFullYear() + 1);

    form.setValue("financials.projectedRevenue", [
      ...current,
      { year: nextYear, amount: "" },
    ]);
    handleFieldChange();
  };

  const handleChange = (field, value) => {
    updateData({
      financials: {
        ...(data.financials || {}),
        [field]: value,
      },
    });
  };

  const handleNestedChange = (parent, field, value) => {
    handleChange(parent, {
      ...(data.financials?.[parent] || {}),
      [field]: value,
    });
  };

  // Previous Funding Management
  const addPreviousFunding = () => {
    const currentFunding = data.financials?.previousFunding || [];
    handleChange("previousFunding", [
      ...currentFunding,
      {
        round: "",
        amount: "",
        date: "",
        investors: [],
      },
    ]);
  };

  const updatePreviousFunding = (index, field, value) => {
    const newFunding = [...(data.financials?.previousFunding || [])];
    newFunding[index] = {
      ...newFunding[index],
      [field]:
        field === "investors"
          ? value
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i)
          : value,
    };
    handleChange("previousFunding", newFunding);
  };

  const removePreviousFunding = (index) => {
    const newFunding = [...(data.financials?.previousFunding || [])];
    newFunding.splice(index, 1);
    handleChange("previousFunding", newFunding);
  };

  // Financial Projections Management
  const addFinancialProjection = () => {
    const currentProjections = data.financials?.financialProjections || [];
    handleChange("financialProjections", [
      ...currentProjections,
      {
        year: String(new Date().getFullYear()),
        revenue: "",
        expenses: "",
        profit: "",
        notes: "",
      },
    ]);
  };

  const updateFinancialProjection = (index, field, value) => {
    const newProjections = [...(data.financials?.financialProjections || [])];
    newProjections[index] = {
      ...newProjections[index],
      [field]: value,
    };
    handleChange("financialProjections", newProjections);
  };

  const removeFinancialProjection = (index) => {
    const newProjections = [...(data.financials?.financialProjections || [])];
    newProjections.splice(index, 1);
    handleChange("financialProjections", newProjections);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Financial Information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Provide detailed financial information about your venture.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Funding Goal ($)</Label>
            <Input
              type="text"
              value={data.financials?.fundingGoal || ""}
              onChange={(e) => handleChange("fundingGoal", e.target.value)}
              placeholder="Enter funding goal"
            />
          </div>
          <div className="space-y-2">
            <Label>Funding Raised to Date ($)</Label>
            <Input
              type="text"
              value={data.financials?.fundingRaised || ""}
              onChange={(e) => handleChange("fundingRaised", e.target.value)}
              placeholder="Enter amount raised"
            />
          </div>
          <div className="space-y-2">
            <Label>Current Valuation ($)</Label>
            <Input
              type="text"
              value={data.financials?.valuation || ""}
              onChange={(e) => handleChange("valuation", e.target.value)}
              placeholder="Enter current valuation"
            />
          </div>
        </div>

        {/* Revenue & Expenses */}
        <div className="space-y-4">
          <Label>Revenue</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Annual Revenue ($)</Label>
              <Input
                type="text"
                value={data.financials?.revenue?.current || ""}
                onChange={(e) =>
                  handleNestedChange("revenue", "current", e.target.value)
                }
                placeholder="Enter current revenue"
              />
            </div>
            <div className="space-y-2">
              <Label>Projected Annual Revenue ($)</Label>
              <Input
                type="text"
                value={data.financials?.revenue?.projected || ""}
                onChange={(e) =>
                  handleNestedChange("revenue", "projected", e.target.value)
                }
                placeholder="Enter projected revenue"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Expenses</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Annual Expenses ($)</Label>
              <Input
                type="text"
                value={data.financials?.expenses?.current || ""}
                onChange={(e) =>
                  handleNestedChange("expenses", "current", e.target.value)
                }
                placeholder="Enter current expenses"
              />
            </div>
            <div className="space-y-2">
              <Label>Projected Annual Expenses ($)</Label>
              <Input
                type="text"
                value={data.financials?.expenses?.projected || ""}
                onChange={(e) =>
                  handleNestedChange("expenses", "projected", e.target.value)
                }
                placeholder="Enter projected expenses"
              />
            </div>
          </div>
        </div>

        {/* Previous Funding Rounds */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Previous Funding Rounds</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPreviousFunding}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Funding Round
            </Button>
          </div>

          {(data.financials?.previousFunding || []).map((funding, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Round</Label>
                      <Input
                        value={funding.round}
                        onChange={(e) =>
                          updatePreviousFunding(index, "round", e.target.value)
                        }
                        placeholder="e.g., Seed, Series A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount ($)</Label>
                      <Input
                        type="text"
                        value={funding.amount}
                        onChange={(e) =>
                          updatePreviousFunding(index, "amount", e.target.value)
                        }
                        placeholder="Enter amount raised"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="text"
                        value={funding.date}
                        onChange={(e) =>
                          updatePreviousFunding(index, "date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Investors</Label>
                    <Input
                      value={funding.investors?.join(", ") || ""}
                      onChange={(e) =>
                        updatePreviousFunding(
                          index,
                          "investors",
                          e.target.value
                        )
                      }
                      placeholder="Enter investors (comma-separated)"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePreviousFunding(index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Projections */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Financial Projections</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFinancialProjection}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Projection
            </Button>
          </div>

          {(data.financials?.financialProjections || []).map(
            (projection, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          type="text"
                          value={projection.year}
                          onChange={(e) =>
                            updateFinancialProjection(
                              index,
                              "year",
                              e.target.value
                            )
                          }
                          placeholder="Enter year"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Revenue ($)</Label>
                        <Input
                          type="text"
                          value={projection.revenue}
                          onChange={(e) =>
                            updateFinancialProjection(
                              index,
                              "revenue",
                              e.target.value
                            )
                          }
                          placeholder="Projected revenue"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expenses ($)</Label>
                        <Input
                          type="text"
                          value={projection.expenses}
                          onChange={(e) =>
                            updateFinancialProjection(
                              index,
                              "expenses",
                              e.target.value
                            )
                          }
                          placeholder="Projected expenses"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Profit ($)</Label>
                        <Input
                          type="text"
                          value={projection.profit}
                          onChange={(e) =>
                            updateFinancialProjection(
                              index,
                              "profit",
                              e.target.value
                            )
                          }
                          placeholder="Projected profit"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={projection.notes}
                        onChange={(e) =>
                          updateFinancialProjection(
                            index,
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder="Add any relevant notes or assumptions"
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFinancialProjection(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialInfo;
