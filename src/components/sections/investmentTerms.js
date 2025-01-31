"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const InvestmentTerms = ({ data, updateData }) => {
  const [investmentTerms, setInvestmentTerms] = useState({
    instrumentType: "",
    minimumInvestment: "",
    maximumInvestment: "",
    pricePerShare: "",
    numberOfShares: "",
    equityOffered: "",
    investmentStructure: "",
    useOfFunds: [],
    investorRights: [],
    exitStrategy: "",
    timeline: "",
  });

  const [newUseOfFunds, setNewUseOfFunds] = useState("");
  const [newInvestorRight, setNewInvestorRight] = useState("");

  // Initialize with existing data if available
  useEffect(() => {
    if (data?.investmentTerms) {
      setInvestmentTerms(data.investmentTerms);
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updatedTerms = { ...investmentTerms, [field]: value };
    setInvestmentTerms(updatedTerms);
    updateData({ investmentTerms: updatedTerms });
  };

  const addUseOfFunds = () => {
    if (newUseOfFunds.trim()) {
      const updatedTerms = {
        ...investmentTerms,
        useOfFunds: [
          ...(investmentTerms.useOfFunds || []),
          newUseOfFunds.trim(),
        ],
      };
      setInvestmentTerms(updatedTerms);
      updateData({ investmentTerms: updatedTerms });
      setNewUseOfFunds("");
    }
  };

  const removeUseOfFunds = (index) => {
    const updatedTerms = {
      ...investmentTerms,
      useOfFunds: investmentTerms.useOfFunds.filter((_, i) => i !== index),
    };
    setInvestmentTerms(updatedTerms);
    updateData({ investmentTerms: updatedTerms });
  };

  const addInvestorRight = () => {
    if (newInvestorRight.trim()) {
      const updatedTerms = {
        ...investmentTerms,
        investorRights: [
          ...(investmentTerms.investorRights || []),
          newInvestorRight.trim(),
        ],
      };
      setInvestmentTerms(updatedTerms);
      updateData({ investmentTerms: updatedTerms });
      setNewInvestorRight("");
    }
  };

  const removeInvestorRight = (index) => {
    const updatedTerms = {
      ...investmentTerms,
      investorRights: investmentTerms.investorRights.filter(
        (_, i) => i !== index
      ),
    };
    setInvestmentTerms(updatedTerms);
    updateData({ investmentTerms: updatedTerms });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Type */}
        <div className="space-y-2">
          <Label htmlFor="instrumentType">Investment Type</Label>
          <Select
            value={investmentTerms.instrumentType}
            onValueChange={(value) => handleChange("instrumentType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select investment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="convertible_note">Convertible Note</SelectItem>
              <SelectItem value="safe">SAFE</SelectItem>
              <SelectItem value="debt">Debt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Investment Structure */}
        <div className="space-y-2">
          <Label htmlFor="investmentStructure">Investment Structure</Label>
          <Input
            id="investmentStructure"
            value={investmentTerms.investmentStructure}
            onChange={(e) =>
              handleChange("investmentStructure", e.target.value)
            }
            placeholder="e.g., Series A Preferred Shares"
          />
        </div>

        {/* Minimum Investment */}
        <div className="space-y-2">
          <Label htmlFor="minimumInvestment">Minimum Investment</Label>
          <Input
            id="minimumInvestment"
            value={investmentTerms.minimumInvestment}
            onChange={(e) => handleChange("minimumInvestment", e.target.value)}
            placeholder="e.g., $50,000"
          />
        </div>

        {/* Maximum Investment */}
        <div className="space-y-2">
          <Label htmlFor="maximumInvestment">Maximum Investment</Label>
          <Input
            id="maximumInvestment"
            value={investmentTerms.maximumInvestment}
            onChange={(e) => handleChange("maximumInvestment", e.target.value)}
            placeholder="e.g., $500,000"
          />
        </div>

        {/* Price Per Share */}
        <div className="space-y-2">
          <Label htmlFor="pricePerShare">Price Per Share</Label>
          <Input
            id="pricePerShare"
            value={investmentTerms.pricePerShare}
            onChange={(e) => handleChange("pricePerShare", e.target.value)}
            placeholder="e.g., $10.00"
          />
        </div>

        {/* Number of Shares */}
        <div className="space-y-2">
          <Label htmlFor="numberOfShares">Number of Shares</Label>
          <Input
            id="numberOfShares"
            value={investmentTerms.numberOfShares}
            onChange={(e) => handleChange("numberOfShares", e.target.value)}
            placeholder="e.g., 100,000"
          />
        </div>

        {/* Equity Offered */}
        <div className="space-y-2">
          <Label htmlFor="equityOffered">Equity Offered</Label>
          <Input
            id="equityOffered"
            value={investmentTerms.equityOffered}
            onChange={(e) => handleChange("equityOffered", e.target.value)}
            placeholder="e.g., 20%"
          />
        </div>
      </div>

      {/* Use of Funds */}
      <div className="space-y-4">
        <Label>Use of Funds</Label>
        <div className="flex gap-2">
          <Input
            value={newUseOfFunds}
            onChange={(e) => setNewUseOfFunds(e.target.value)}
            placeholder="Add use of funds"
          />
          <Button type="button" onClick={addUseOfFunds}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {investmentTerms.useOfFunds?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-secondary/20 rounded-full px-3 py-1"
            >
              <span>{item}</span>
              <button
                onClick={() => removeUseOfFunds(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Investor Rights */}
      <div className="space-y-4">
        <Label>Investor Rights</Label>
        <div className="flex gap-2">
          <Input
            value={newInvestorRight}
            onChange={(e) => setNewInvestorRight(e.target.value)}
            placeholder="Add investor right"
          />
          <Button type="button" onClick={addInvestorRight}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {investmentTerms.investorRights?.map((right, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-secondary/20 rounded-full px-3 py-1"
            >
              <span>{right}</span>
              <button
                onClick={() => removeInvestorRight(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Exit Strategy */}
      <div className="space-y-2">
        <Label htmlFor="exitStrategy">Exit Strategy</Label>
        <Textarea
          id="exitStrategy"
          value={investmentTerms.exitStrategy}
          onChange={(e) => handleChange("exitStrategy", e.target.value)}
          placeholder="Describe your exit strategy..."
          rows={4}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <Label htmlFor="timeline">Investment Timeline</Label>
        <Textarea
          id="timeline"
          value={investmentTerms.timeline}
          onChange={(e) => handleChange("timeline", e.target.value)}
          placeholder="Describe your investment timeline..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default InvestmentTerms;
