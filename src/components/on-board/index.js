"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { createProfileAction } from "@/actions";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
// import confetti from "canvas-confetti";

// Form sections for better organization
const PITCHER_SECTIONS = [
  "basicInfo",
  "professionalDetails",
  "pitchDetails",
  "background",
  "preferences",
];

const INVESTOR_SECTIONS = [
  "basicInfo",
  "professionalDetails",
  "investmentInterests",
  "background",
  "preferences",
];

// Updated form schema to match Profile model exactly
const formSchema = z
  .object({
    basicInfo: z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      phoneNumber: z.string().optional(),
      profileImage: z.string().optional(),
      location: z.object({
        country: z.string().min(1, "Country is required"),
        city: z.string().min(1, "City is required"),
      }),
    }),
    professionalInfo: z.object({
      title: z.string().min(2, "Title is required"),
      company: z.string().min(2, "Company name is required"),
      yearsOfExperience: z.number().min(0),
      expertise: z
        .array(z.string())
        .min(1, "Select at least one area of expertise"),
      industry: z.array(z.string()).min(1, "Select at least one industry"),
    }),
    socialLinks: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
    }),
    bio: z.string().max(500, "Bio must not exceed 500 characters"),
    preferences: z.object({
      notificationSettings: z.object({
        newPitches: z.boolean().default(false),
        pitchUpdates: z.boolean().default(false),
        meetingReminders: z.boolean().default(false),
      }),
      communicationPreferences: z.object({
        email: z.boolean().default(false),
        inApp: z.boolean().default(false),
        phone: z.boolean().default(false),
      }),
    }),
    background: z.object({
      education: z.array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          year: z.number(),
        })
      ),
      workExperience: z.array(
        z.object({
          position: z.string(),
          company: z.string(),
          duration: z.string(),
          achievements: z.array(z.string()),
        })
      ),
      skills: z.array(z.string()),
      certifications: z.array(
        z.object({
          name: z.string(),
          issuer: z.string(),
          year: z.number(),
        })
      ),
    }),
  })
  .and(
    z.discriminatedUnion("role", [
      // Pitcher-specific validation
      z.object({
        role: z.literal("pitcher"),
        pitches: z.array(
          z.object({
            title: z.string().min(2, "Title is required"),
            shortDescription: z.string().max(200),
            fullDescription: z.string().max(2000),
            category: z.array(z.string()),
            stage: z.enum([
              "idea",
              "mvp",
              "early-stage",
              "growth",
              "expansion",
            ]),
            status: z
              .enum(["draft", "active", "under-review", "inactive"])
              .default("draft"),
            targetAudience: z.array(z.string()),
            uniqueSellingPoints: z.array(z.string()),
          })
        ),
      }),
      // Investor-specific validation
      z.object({
        role: z.literal("investor"),
        investmentPreferences: z.object({
          investmentRange: z.object({
            min: z.number(),
            max: z.number(),
          }),
          sectorsOfInterest: z.array(z.string()),
          stagePreference: z.array(z.string()),
        }),
      }),
    ])
  );

// Form Sections Components
const BasicInfoSection = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Basic Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="basicInfo.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basicInfo.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="john@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="basicInfo.location.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} placeholder="United States" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basicInfo.location.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} placeholder="New York" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <Label>Profile Image</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              // Handle file upload
            }}
          />
          <div className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop or click to upload
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProfessionalInfoSection = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Professional Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="professionalInfo.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="CEO" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="professionalInfo.company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Company Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="professionalInfo.expertise"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Areas of Expertise</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                multiple
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expertise" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERTISE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Bio</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Tell us about your professional journey..."
                className="h-32 resize-none"
              />
            </FormControl>
            <FormDescription>Maximum 500 characters</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Links</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="socialLinks.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="LinkedIn URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialLinks.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Twitter URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

const PitchDetailsSection = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Pitch Details</h2>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="pitches.0.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pitch Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your pitch title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pitches.0.shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Brief overview of your pitch..."
                  className="h-24"
                />
              </FormControl>
              <FormDescription>Maximum 200 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pitches.0.fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Detailed description of your pitch..."
                  className="h-48"
                />
              </FormControl>
              <FormDescription>Maximum 2000 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pitches.0.stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pitches.0.uniqueSellingPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unique Selling Points</FormLabel>
              <div className="space-y-2">
                {field.value?.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...field.value];
                        newPoints[index] = e.target.value;
                        field.onChange(newPoints);
                      }}
                      placeholder={`Selling point ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPoints = field.value.filter(
                          (_, i) => i !== index
                        );
                        field.onChange(newPoints);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    field.onChange([...(field.value || []), ""]);
                  }}
                >
                  Add Selling Point
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

const InvestmentInterestsSection = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold">Investment Interests</h2>

      <FormField
        control={form.control}
        name="investmentInterests.industriesOfInterest"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industries of Interest</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 gap-3">
                {INDUSTRY_OPTIONS.map((industry) => (
                  <motion.div
                    key={industry.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Badge
                      variant={
                        field.value?.includes(industry.value)
                          ? "default"
                          : "outline"
                      }
                      className="w-full cursor-pointer p-3 justify-center"
                      onClick={() => {
                        const newValue = field.value?.includes(industry.value)
                          ? field.value.filter((v) => v !== industry.value)
                          : [...(field.value || []), industry.value];
                        field.onChange(newValue);
                      }}
                    >
                      {industry.label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="investmentInterests.investmentStage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Stage Preferences</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {STAGE_OPTIONS.map((stage) => (
                  <motion.div
                    key={stage.value}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center space-x-2"
                  >
                    <Switch
                      checked={field.value?.includes(stage.value)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), stage.value]
                          : field.value?.filter((v) => v !== stage.value);
                        field.onChange(newValue);
                      }}
                    />
                    <Label>{stage.label}</Label>
                  </motion.div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="investmentInterests.pitchPreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pitch Preferences</FormLabel>
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between">
                <Label>Available for Pitches</Label>
                <Switch
                  checked={field.value?.availabilityForPitches}
                  onCheckedChange={(checked) => {
                    field.onChange({
                      ...field.value,
                      availabilityForPitches: checked,
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Format</Label>
                <div className="flex gap-2">
                  {PITCH_FORMAT_OPTIONS.map((format) => (
                    <motion.div
                      key={format.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant={
                          field.value?.preferredFormat?.includes(format.value)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          const newFormats =
                            field.value?.preferredFormat?.includes(format.value)
                              ? field.value.preferredFormat.filter(
                                  (f) => f !== format.value
                                )
                              : [
                                  ...(field.value?.preferredFormat || []),
                                  format.value,
                                ];
                          field.onChange({
                            ...field.value,
                            preferredFormat: newFormats,
                          });
                        }}
                      >
                        {format.label}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

const InvestorBackgroundSection = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold">Investment Background</h2>

      <FormField
        control={form.control}
        name="background.investmentExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Experience</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="background.successfulInvestments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Track Record</FormLabel>
            <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Successful Investments</Label>
                  <Input type="number" {...field} min={0} className="mt-2" />
                </div>
                <div>
                  <Label>Total Portfolio Companies</Label>
                  <Input
                    type="number"
                    {...form.register("background.totalPortfolio")}
                    min={0}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="background.mentorshipAreas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mentorship Areas</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 gap-3">
                {MENTORSHIP_AREAS.map((area) => (
                  <motion.div
                    key={area.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Badge
                      variant={
                        field.value?.includes(area.value)
                          ? "default"
                          : "outline"
                      }
                      className="w-full cursor-pointer p-3 justify-center"
                      onClick={() => {
                        const newValue = field.value?.includes(area.value)
                          ? field.value.filter((v) => v !== area.value)
                          : [...(field.value || []), area.value];
                        field.onChange(newValue);
                      }}
                    >
                      {area.label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

const BackgroundSection = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold">Background & Experience</h2>

      {/* Education */}
      <FormField
        control={form.control}
        name="background.education"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education</FormLabel>
            <div className="space-y-4">
              {field.value?.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`background.education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <Input
                            {...field}
                            placeholder="e.g., Bachelor of Science"
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`background.education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <Input {...field} placeholder="University name" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`background.education.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Graduation Year</FormLabel>
                          <Input
                            {...field}
                            type="number"
                            min="1900"
                            max="2099"
                          />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          const newEducation = [...field.value];
                          newEducation.splice(index, 1);
                          field.onChange(newEducation);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  field.onChange([
                    ...(field.value || []),
                    {
                      degree: "",
                      institution: "",
                      year: new Date().getFullYear(),
                    },
                  ]);
                }}
              >
                Add Education
              </Button>
            </div>
          </FormItem>
        )}
      />

      {/* Work Experience */}
      <FormField
        control={form.control}
        name="background.workExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Work Experience</FormLabel>
            <div className="space-y-4">
              {field.value?.map((work, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`background.workExperience.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <Input {...field} placeholder="Job title" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`background.workExperience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <Input {...field} placeholder="Company name" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`background.workExperience.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Input {...field} placeholder="e.g., 2018 - Present" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`background.workExperience.${index}.achievements`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Achievements</FormLabel>
                        <div className="space-y-2">
                          {field.value?.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex gap-2">
                              <Input
                                value={achievement}
                                onChange={(e) => {
                                  const newAchievements = [...field.value];
                                  newAchievements[achIndex] = e.target.value;
                                  field.onChange(newAchievements);
                                }}
                                placeholder="Describe achievement"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newAchievements = field.value.filter(
                                    (_, i) => i !== achIndex
                                  );
                                  field.onChange(newAchievements);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              field.onChange([...(field.value || []), ""]);
                            }}
                          >
                            Add Achievement
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const newWorkExperience = [...field.value];
                      newWorkExperience.splice(index, 1);
                      field.onChange(newWorkExperience);
                    }}
                  >
                    Remove Experience
                  </Button>
                </motion.div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  field.onChange([
                    ...(field.value || []),
                    {
                      position: "",
                      company: "",
                      duration: "",
                      achievements: [],
                    },
                  ]);
                }}
              >
                Add Work Experience
              </Button>
            </div>
          </FormItem>
        )}
      />

      {/* Certifications */}
      <FormField
        control={form.control}
        name="background.certifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certifications & Achievements</FormLabel>
            <div className="space-y-4">
              {field.value?.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4"
                >
                  <Input
                    value={cert}
                    onChange={(e) => {
                      const newCerts = [...field.value];
                      newCerts[index] = e.target.value;
                      field.onChange(newCerts);
                    }}
                    placeholder="Certification or achievement"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newCerts = field.value.filter(
                        (_, i) => i !== index
                      );
                      field.onChange(newCerts);
                    }}
                  >
                    Remove
                  </Button>
                </motion.div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  field.onChange([...(field.value || []), ""]);
                }}
              >
                Add Certification
              </Button>
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

// Enhanced Review Section
const ReviewSection = ({ form, currentTab }) => {
  const formValues = form.getValues();

  // Helper function to safely get nested values
  const safeGet = (obj, path, defaultValue = "Not specified") => {
    return path.split(".").reduce((acc, part) => {
      return acc && acc[part] ? acc[part] : defaultValue;
    }, obj);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold">Review Your Information</h2>

      <div className="space-y-6">
        {/* Basic Info Review */}
        <ReviewCard
          title="Basic Information"
          items={[
            { label: "Name", value: safeGet(formValues, "basicInfo.name") },
            { label: "Email", value: safeGet(formValues, "basicInfo.email") },
            {
              label: "Location",
              value: `${safeGet(
                formValues,
                "basicInfo.location.city"
              )}, ${safeGet(formValues, "basicInfo.location.country")}`,
            },
            {
              label: "Phone",
              value: safeGet(
                formValues,
                "basicInfo.phoneNumber",
                "Not provided"
              ),
            },
          ]}
        />

        {/* Professional Info Review */}
        <ReviewCard
          title="Professional Information"
          items={[
            {
              label: "Title",
              value: safeGet(formValues, "professionalInfo.title"),
            },
            {
              label: "Company",
              value: safeGet(formValues, "professionalInfo.company"),
            },
            {
              label: "Experience",
              value: safeGet(formValues, "professionalInfo.yearsOfExperience"),
            },
            {
              label: "Industry",
              value: Array.isArray(
                safeGet(formValues, "professionalInfo.industry", [])
              )
                ? safeGet(formValues, "professionalInfo.industry", []).join(
                    ", "
                  )
                : safeGet(
                    formValues,
                    "professionalInfo.industry",
                    "Not specified"
                  ),
            },
          ]}
        />

        {/* Role Specific Review */}
        {currentTab === "pitcher" ? (
          <ReviewCard
            title="Pitch Details"
            items={[
              {
                label: "Pitch Title",
                value: safeGet(formValues, "pitches.0.title"),
              },
              { label: "Stage", value: safeGet(formValues, "pitches.0.stage") },
              {
                label: "Target Audience",
                value: Array.isArray(
                  safeGet(formValues, "pitches.0.targetAudience", [])
                )
                  ? safeGet(formValues, "pitches.0.targetAudience", []).join(
                      ", "
                    )
                  : safeGet(
                      formValues,
                      "pitches.0.targetAudience",
                      "Not specified"
                    ),
              },
            ]}
          />
        ) : (
          <ReviewCard
            title="Investment Preferences"
            items={[
              {
                label: "Industries",
                value: Array.isArray(
                  safeGet(
                    formValues,
                    "investmentInterests.industriesOfInterest",
                    []
                  )
                )
                  ? safeGet(
                      formValues,
                      "investmentInterests.industriesOfInterest",
                      []
                    ).join(", ")
                  : "Not specified",
              },
              {
                label: "Stages",
                value: Array.isArray(
                  safeGet(formValues, "investmentInterests.investmentStage", [])
                )
                  ? safeGet(
                      formValues,
                      "investmentInterests.investmentStage",
                      []
                    ).join(", ")
                  : "Not specified",
              },
              {
                label: "Available for Pitches",
                value:
                  safeGet(
                    formValues,
                    "investmentInterests.pitchPreferences.availabilityForPitches"
                  ) === true
                    ? "Yes"
                    : "No",
              },
            ]}
          />
        )}
      </div>

      <motion.div
        className="flex justify-end space-x-4"
        variants={itemVariants}
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => form.trigger()}
          className="group"
        >
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Edit Information
          </motion.span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Review Card Component
const ReviewCard = ({ title, items }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow"
    >
      <h3 className="font-medium mb-4">{title}</h3>
      <dl className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.div key={index} variants={itemVariants} whileHover={{ x: 5 }}>
            <dt className="text-sm text-gray-500">{item.label}</dt>
            <dd className="mt-1 font-medium">{item.value}</dd>
          </motion.div>
        ))}
      </dl>
    </motion.div>
  );
};

// Success Animation Component
const SuccessAnimation = () => {
  useEffect(() => {
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 },
    // });
  }, []);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-8 rounded-lg text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360, 360],
          }}
          transition={{ duration: 1 }}
          className="inline-block"
        >
          <Check className="w-16 h-16 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold mt-4">Profile Created!</h2>
        <p className="text-gray-600 mt-2">Redirecting to dashboard...</p>
      </motion.div>
    </motion.div>
  );
};

// Form Validation Message Component
const FormValidationMessage = ({ message, type = "error" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-2 p-2 rounded ${
        type === "error"
          ? "bg-red-50 text-red-600"
          : "bg-green-50 text-green-600"
      }`}
    >
      {type === "error" ? (
        <AlertCircle className="w-4 h-4" />
      ) : (
        <Check className="w-4 h-4" />
      )}
      <span className="text-sm">{message}</span>
    </motion.div>
  );
};

// Loading Button Component
const LoadingButton = ({ children, loading, ...props }) => {
  return (
    <Button {...props} disabled={loading}>
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-4 h-4" />
        </motion.div>
      ) : (
        children
      )}
    </Button>
  );
};

// Constants for options
const EXPERTISE_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  // Add more options as needed
];

const STAGE_OPTIONS = [
  { value: "idea", label: "Idea Stage" },
  { value: "mvp", label: "MVP" },
  { value: "early-stage", label: "Early Stage" },
  { value: "growth", label: "Growth" },
  { value: "expansion", label: "Expansion" },
];

const INDUSTRY_OPTIONS = [
  { value: "tech", label: "Technology" },
  { value: "health", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "real_estate", label: "Real Estate" },
  { value: "energy", label: "Energy" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "agriculture", label: "Agriculture" },
];

const PITCH_FORMAT_OPTIONS = [
  { value: "in-person", label: "In Person" },
  { value: "virtual", label: "Virtual" },
  { value: "written", label: "Written" },
];

// Additional Constants
const EXPERIENCE_LEVELS = [
  { value: "1-3", label: "1-3 years" },
  { value: "4-7", label: "4-7 years" },
  { value: "8-12", label: "8-12 years" },
  { value: "13+", label: "13+ years" },
];

const MENTORSHIP_AREAS = [
  { value: "strategy", label: "Business Strategy" },
  { value: "marketing", label: "Marketing" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "sales", label: "Sales" },
];

// Navigation Component
const FormNavigation = ({ currentSection, totalSections, onNext, onPrev }) => {
  return (
    <motion.div
      className="flex justify-between items-center w-full gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={currentSection === 0}
        className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 
          ${
            currentSection === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </Button>

      {/* Progress Dots */}
      <div className="flex items-center gap-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
              index === currentSection
                ? "bg-primary scale-125"
                : index < currentSection
                ? "bg-primary/40"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            initial={false}
            animate={{
              scale: index === currentSection ? 1.2 : 1,
            }}
          />
        ))}
      </div>

      {/* Next Button */}
      <Button
        type="button"
        onClick={onNext}
        disabled={currentSection === totalSections - 1}
        className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 
          ${
            currentSection === totalSections - 1
              ? "opacity-50 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

// Add these animation variants
const tabContentVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function OnBoard() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("pitcher");
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const form = useForm({
    // Comment out the resolver temporarily for testing
    // resolver: zodResolver(formSchema),
    defaultValues: {
      basicInfo: {
        name: "",
        email: "",
        phoneNumber: "",
        location: {
          country: "",
          city: "",
        },
      },
      professionalInfo: {
        title: "",
        company: "",
        yearsOfExperience: 0,
        expertise: [],
        industry: [],
      },
      socialLinks: {
        linkedin: "",
        twitter: "",
        website: "",
      },
      bio: "",
      role: currentTab,
    },
  });

  // Add these debug logs
  useEffect(() => {
    // Log form state changes
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });

    // Log form errors
    console.log("Form errors:", form.formState.errors);

    return () => subscription.unsubscribe();
  }, [form, form.formState]);

  // Add debug log for form submission
  form.handleSubmit((data) => {
    console.log("Form submitted with data:", data);
  });

  const onSubmit = async (formData) => {
    console.log("Submit function called!"); // Debug log
    try {
      setIsSubmitting(true);
      console.log("Form Data Received:", formData);

      // Add validation check for required fields
      if (!formData.basicInfo?.name || !formData.basicInfo?.email) {
        throw new Error("Name and email are required");
      }

      // Create the formatted data object
      const formattedData = {
        userId: user?.id,
        role: currentTab,
        basicInfo: {
          name: formData.basicInfo.name,
          email: formData.basicInfo.email,
          phoneNumber: formData.basicInfo.phoneNumber || "",
          profileImage: formData.basicInfo.profileImage || "",
          location: {
            city: formData.basicInfo.location.city,
            country: formData.basicInfo.location.country,
          },
        },
        professionalInfo: {
          title: formData.professionalInfo.title,
          company: formData.professionalInfo.company,
          yearsOfExperience: Number(
            formData.professionalInfo.yearsOfExperience
          ),
          expertise: Array.isArray(formData.professionalInfo.expertise)
            ? formData.professionalInfo.expertise
            : [],
          industry: Array.isArray(formData.professionalInfo.industry)
            ? formData.professionalInfo.industry
            : [],
        },
        socialLinks: {
          linkedin: formData.socialLinks?.linkedin || "",
          twitter: formData.socialLinks?.twitter || "",
          website: formData.socialLinks?.website || "",
        },
        bio: formData.bio || "",
        background: {
          education: Array.isArray(formData.background?.education)
            ? formData.background.education.map((edu) => ({
                degree: edu.degree,
                institution: edu.institution,
                year: Number(edu.year),
              }))
            : [],
          workExperience: Array.isArray(formData.background?.workExperience)
            ? formData.background.workExperience.map((exp) => ({
                position: exp.position,
                company: exp.company,
                duration: exp.duration,
                achievements: Array.isArray(exp.achievements)
                  ? exp.achievements
                  : [],
              }))
            : [],
          skills: Array.isArray(formData.background?.skills)
            ? formData.background.skills
            : [],
          certifications: Array.isArray(formData.background?.certifications)
            ? formData.background.certifications.map((cert) => ({
                name: cert.name,
                issuer: cert.issuer,
                year: Number(cert.year),
              }))
            : [],
        },
        preferences: {
          notificationSettings: {
            newPitches: Boolean(
              formData.preferences?.notificationSettings?.newPitches
            ),
            pitchUpdates: Boolean(
              formData.preferences?.notificationSettings?.pitchUpdates
            ),
            meetingReminders: Boolean(
              formData.preferences?.notificationSettings?.meetingReminders
            ),
          },
          communicationPreferences: {
            email: Boolean(
              formData.preferences?.communicationPreferences?.email
            ),
            inApp: Boolean(
              formData.preferences?.communicationPreferences?.inApp
            ),
            phone: Boolean(
              formData.preferences?.communicationPreferences?.phone
            ),
          },
        },
      };

      // Add role-specific data
      if (currentTab === "pitcher") {
        formattedData.pitches = Array.isArray(formData.pitches)
          ? formData.pitches.map((pitch) => ({
              title: pitch.title,
              shortDescription: pitch.shortDescription,
              fullDescription: pitch.fullDescription,
              category: Array.isArray(pitch.category) ? pitch.category : [],
              stage: pitch.stage,
              status: pitch.status || "draft",
              targetAudience: Array.isArray(pitch.targetAudience)
                ? pitch.targetAudience
                : [],
              uniqueSellingPoints: Array.isArray(pitch.uniqueSellingPoints)
                ? pitch.uniqueSellingPoints
                : [],
            }))
          : [];
      } else {
        formattedData.investmentPreferences = {
          investmentRange: {
            min: Number(
              formData.investmentPreferences?.investmentRange?.min || 0
            ),
            max: Number(
              formData.investmentPreferences?.investmentRange?.max || 0
            ),
          },
          sectorsOfInterest: Array.isArray(
            formData.investmentPreferences?.sectorsOfInterest
          )
            ? formData.investmentPreferences.sectorsOfInterest
            : [],
          stagePreference: Array.isArray(
            formData.investmentPreferences?.stagePreference
          )
            ? formData.investmentPreferences.stagePreference
            : [],
          pitchesReviewed: [],
          totalPitchesReviewed: 0,
        };
      }

      const result = await createProfileAction(formattedData);
      if (result.success) {
        setShowSuccessAnimation(true);
        toast({
          title: "Success! 🎉",
          description: "Your profile has been created successfully.",
          variant: "success",
        });
  
        // Use the redirectTo from the result
        setTimeout(() => {
          router.push(result.redirectTo);
        }, 2000);
      } else {
        if (result.redirectTo) {
          // If profile exists, redirect to appropriate dashboard
          toast({
            title: "Profile Exists",
            description: "You already have a profile. Redirecting to dashboard...",
            variant: "info",
          });
          setTimeout(() => {
            router.push(result.redirectTo);
          }, 2000);
        } else {
          throw new Error(result.error || "Failed to create profile");
        }
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced tab change handler with direction
  const handleTabChange = (tab) => {
    const direction = tab === "pitcher" ? -1 : 1;
    setCurrentTab(tab);
    setCurrentSection(0);
    form.reset();
  };

  // Define sections based on role
  const PITCHER_SECTIONS = [
    "basicInfo",
    "professionalInfo",
    "pitchDetails",
    "background",
    "review",
  ];

  const INVESTOR_SECTIONS = [
    "basicInfo",
    "professionalInfo",
    "investmentInterests",
    "investorBackground",
    "review",
  ];

  const sections =
    currentTab === "pitcher" ? PITCHER_SECTIONS : INVESTOR_SECTIONS;

  // Render current section based on role and section index
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return <BasicInfoSection form={form} />;
      case 1:
        return <ProfessionalInfoSection form={form} />;
      case 2:
        return currentTab === "pitcher" ? (
          <PitchDetailsSection form={form} />
        ) : (
          <InvestmentInterestsSection form={form} />
        );
      case 3:
        return currentTab === "pitcher" ? (
          <BackgroundSection form={form} />
        ) : (
          <InvestorBackgroundSection form={form} />
        );
      case 4:
        return <ReviewSection form={form} currentTab={currentTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <motion.h1
              className="text-4xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Complete Your Profile
            </motion.h1>
            <motion.p
              className="text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Let's get you set up with a profile that stands out
            </motion.p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full space-y-2 mb-8">
            <Progress
              value={((currentSection + 1) / sections.length) * 100}
              className="h-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                Step {currentSection + 1} of {sections.length}
              </span>
              <span>{sections[currentSection]}</span>
            </div>
          </div>

          {/* Main Content */}
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger
                  value="pitcher"
                  className="data-[state=active]:bg-primary"
                >
                  Pitcher
                </TabsTrigger>
                <TabsTrigger
                  value="investor"
                  className="data-[state=active]:bg-primary"
                >
                  Investor
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Form submitted!"); // Debug log
                    form.handleSubmit(onSubmit)(e);
                  }}
                  className="space-y-8"
                >
                  <AnimatePresence mode="wait">
                    {renderCurrentSection()}
                  </AnimatePresence>

                  {/* Navigation and Submit Button Container */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <FormNavigation
                      currentSection={currentSection}
                      totalSections={sections.length}
                      onNext={() => setCurrentSection((curr) => curr + 1)}
                      onPrev={() => setCurrentSection((curr) => curr - 1)}
                    />

                    {/* Submit Button - Only show on last section */}
                    {currentSection === sections.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          type="submit"
                          className="group bg-primary hover:bg-primary/90 text-white px-6"
                          disabled={isSubmitting}
                          onClick={() => {
                            console.log("Submit button clicked!"); // Debug log
                          }}
                        >
                          <motion.span
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Creating Profile...</span>
                              </>
                            ) : (
                              <>
                                <span>Complete Registration</span>
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </motion.span>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </Tabs>

          {showSuccessAnimation && <SuccessAnimation />}
        </motion.div>
      </div>
    </div>
  );
}
