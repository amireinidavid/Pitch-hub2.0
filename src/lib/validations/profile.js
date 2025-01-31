import * as z from "zod";

// Constants for validation
const STAGES = ["idea", "mvp", "early-stage", "growth", "expansion"];
const PITCH_FORMATS = ["in-person", "virtual", "written"];

// Basic Info Schema
const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional(),
  location: z.object({
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
  }),
});

// Professional Info Schema
const professionalInfoSchema = z.object({
  title: z.string().min(2, "Title is required"),
  company: z.string().min(2, "Company name is required"),
  yearsOfExperience: z.number().min(0),
  expertise: z
    .array(z.string())
    .min(1, "Select at least one area of expertise"),
  industry: z.array(z.string()).min(1, "Select at least one industry"),
});

// Social Links Schema
const socialLinksSchema = z.object({
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

// Pitch Schema
const pitchSchema = z.object({
  title: z.string().min(2, "Title is required"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(200, "Short description must not exceed 200 characters"),
  fullDescription: z
    .string()
    .min(50, "Full description must be at least 50 characters")
    .max(2000, "Full description must not exceed 2000 characters"),
  category: z.array(z.string()).min(1, "Select at least one category"),
  stage: z.enum(STAGES),
  targetAudience: z
    .array(z.string())
    .min(1, "Select at least one target audience"),
  uniqueSellingPoints: z
    .array(z.string())
    .min(1, "Add at least one unique selling point"),
});

// Background Schema
const backgroundSchema = z.object({
  education: z.array(
    z.object({
      degree: z.string().min(2, "Degree is required"),
      institution: z.string().min(2, "Institution is required"),
      year: z.number().min(1900).max(new Date().getFullYear()),
    })
  ),
  workExperience: z.array(
    z.object({
      position: z.string().min(2, "Position is required"),
      company: z.string().min(2, "Company is required"),
      duration: z.string().min(2, "Duration is required"),
      achievements: z.array(z.string()),
    })
  ),
  certifications: z.array(z.string()).optional(),
});

// Investment Interests Schema
const investmentInterestsSchema = z.object({
  industriesOfInterest: z
    .array(z.string())
    .min(1, "Select at least one industry"),
  investmentStage: z
    .array(z.enum(STAGES))
    .min(1, "Select at least one investment stage"),
  pitchPreferences: z.object({
    preferredFormat: z.array(z.enum(PITCH_FORMATS)),
    availabilityForPitches: z.boolean(),
  }),
  investmentRange: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
    })
    .refine((data) => data.max > data.min, {
      message: "Maximum investment must be greater than minimum",
    }),
});

// Investor Background Schema
const investorBackgroundSchema = z.object({
  investmentExperience: z.string().min(2, "Investment experience is required"),
  successfulInvestments: z.number().min(0),
  totalPortfolio: z.number().min(0),
  mentorshipAreas: z.array(z.string()),
});

// Main Profile Schema
export const profileSchema = z.discriminatedUnion("role", [
  // Pitcher Profile
  z.object({
    role: z.literal("pitcher"),
    basicInfo: basicInfoSchema,
    professionalInfo: professionalInfoSchema,
    socialLinks: socialLinksSchema,
    bio: z.string().max(500, "Bio must not exceed 500 characters"),
    pitches: z.array(pitchSchema).min(1, "Add at least one pitch"),
    background: backgroundSchema,
  }),

  // Investor Profile
  z.object({
    role: z.literal("investor"),
    basicInfo: basicInfoSchema,
    professionalInfo: professionalInfoSchema,
    socialLinks: socialLinksSchema,
    bio: z.string().max(500, "Bio must not exceed 500 characters"),
    investmentInterests: investmentInterestsSchema,
    background: investorBackgroundSchema,
  }),
]);

// Export constants for reuse
export const PROFILE_CONSTANTS = {
  STAGES,
  PITCH_FORMATS,
};
