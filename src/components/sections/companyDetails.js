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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  stage: z.string().min(1, "Company stage is required"),
  location: z.object({
    country: z.string().min(1, "Country is required"),
    city: z.string().optional(),
    region: z.string().optional(),
  }),
});

const stages = [
  { value: "idea", label: "Idea Stage" },
  { value: "prototype", label: "Prototype" },
  { value: "early_stage", label: "Early Stage" },
  { value: "growth", label: "Growth Stage" },
  { value: "scale", label: "Scale Up" },
];

const employeeRanges = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501+", label: "501+ employees" },
];

function CompanyDetails({ data, updateData }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: data.companyName || "",
      industry: data.industry || "",
      stage: data.stage || "",
      location: data.location || { country: "", city: "", region: "" },
    },
  });

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      updateData({
        companyDetails: {
          ...data.companyDetails,
          [parent]: {
            ...(data.companyDetails?.[parent] || {}),
            [child]: value,
          },
        },
      });
    } else {
      updateData({
        companyDetails: {
          ...(data.companyDetails || {}),
          [field]: value,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Company Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          Tell us more about your company's background and current status.
        </p>
      </div>

      <div className="space-y-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            value={data.companyDetails?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        {/* Founded Date */}
        <div className="space-y-2">
          <Label htmlFor="foundedDate">Founded Date</Label>
          <Input
            id="foundedDate"
            type="date"
            value={data.companyDetails?.foundedDate?.split("T")[0] || ""}
            onChange={(e) => handleChange("foundedDate", e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <Label>Company Location</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Country"
                value={data.companyDetails?.location?.country || ""}
                onChange={(e) =>
                  handleChange("location.country", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="City"
                value={data.companyDetails?.location?.city || ""}
                onChange={(e) => handleChange("location.city", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Region/State"
                value={data.companyDetails?.location?.region || ""}
                onChange={(e) =>
                  handleChange("location.region", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Company Stage */}
        <div className="space-y-2">
          <Label htmlFor="stage">Company Stage *</Label>
          <Select
            value={data.companyDetails?.stage || ""}
            onValueChange={(value) => handleChange("stage", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Select the current stage of your company's development
          </p>
        </div>

        {/* Employee Count */}
        <div className="space-y-2">
          <Label htmlFor="employeeCount">Number of Employees</Label>
          <Select
            value={data.companyDetails?.employeeCount || ""}
            onValueChange={(value) => handleChange("employeeCount", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee range" />
            </SelectTrigger>
            <SelectContent>
              {employeeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Registration Details - Optional */}
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">
            Company Registration Number (Optional)
          </Label>
          <Input
            id="registrationNumber"
            placeholder="Enter company registration number"
            value={data.companyDetails?.registrationNumber || ""}
            onChange={(e) => handleChange("registrationNumber", e.target.value)}
          />
        </div>

        {/* Tax Information - Optional */}
        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID (Optional)</Label>
          <Input
            id="taxId"
            placeholder="Enter tax identification number"
            value={data.companyDetails?.taxId || ""}
            onChange={(e) => handleChange("taxId", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;
