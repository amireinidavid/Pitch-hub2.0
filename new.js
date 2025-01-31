import mongoose from "mongoose";

// Base schema for common fields
const baseProfileSchema = {
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: String,
  profileImage: String,
  role: {
    type: String,
    enum: ["pitcher", "investor"],
    required: true,
  },
  // Professional Details
  professionalInfo: {
    title: String,
    company: String,
    yearsOfExperience: Number,
    expertise: [String],
    industry: [String],
  },
  location: {
    country: String,
    city: String,
  },
  bio: {
    type: String,
    maxLength: 500,
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String,
  },
  // Account Status
  status: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: Date,
  },
};

// Investor Profile Schema
const investorProfileSchema = new mongoose.Schema(
  {
    ...baseProfileSchema,
    // Investment Interests
    investmentInterests: {
      industriesOfInterest: [String],
      investmentStage: [
        {
          type: String,
          enum: ["idea", "mvp", "early-stage", "growth", "expansion"],
        },
      ],
      pitchPreferences: {
        preferredPitchFormat: [
          {
            type: String,
            enum: ["in-person", "virtual", "written"],
          },
        ],
        availabilityForPitches: Boolean,
      },
    },
    // Professional Background
    background: {
      currentRole: String,
      investmentExperience: String,
      successfulInvestments: Number,
      mentorshipAreas: [String],
    },
    // Pitch Interactions
    pitchInteractions: {
      pitchesReviewed: [
        {
          pitchId: String,
          date: Date,
          status: {
            type: String,
            enum: [
              "interested",
              "not-interested",
              "pending",
              "scheduled",
              "completed",
            ],
          },
          feedback: String,
          meetingScheduled: Date,
        },
      ],
      totalPitchesReviewed: {
        type: Number,
        default: 0,
      },
    },
    // Preferences
    preferences: {
      notificationSettings: {
        newPitches: Boolean,
        pitchUpdates: Boolean,
        meetingReminders: Boolean,
      },
      communicationPreferences: {
        email: Boolean,
        inApp: Boolean,
        phone: Boolean,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pitcher Profile Schema
const pitcherProfileSchema = new mongoose.Schema(
  {
    ...baseProfileSchema,
    // Pitch Details
    pitches: [
      {
        title: String,
        shortDescription: {
          type: String,
          maxLength: 200,
        },
        fullDescription: {
          type: String,
          maxLength: 2000,
        },
        category: [String],
        stage: {
          type: String,
          enum: ["idea", "mvp", "early-stage", "growth", "expansion"],
        },
        pitchDeck: {
          url: String,
          uploadDate: Date,
        },
        status: {
          type: String,
          enum: ["draft", "active", "under-review", "inactive"],
          default: "draft",
        },
        targetAudience: [String],
        uniqueSellingPoints: [String],
        competitiveAdvantage: String,
      },
    ],
    // Pitch History
    pitchHistory: {
      totalPitches: {
        type: Number,
        default: 0,
      },
      pitchMeetings: [
        {
          investorId: String,
          date: Date,
          format: {
            type: String,
            enum: ["in-person", "virtual", "written"],
          },
          status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
          },
          feedback: String,
          nextSteps: String,
        },
      ],
    },
    // Professional Background
    background: {
      education: [
        {
          degree: String,
          institution: String,
          year: Number,
        },
      ],
      workExperience: [
        {
          position: String,
          company: String,
          duration: String,
          achievements: [String],
        },
      ],
      skills: [String],
      certifications: [
        {
          name: String,
          issuer: String,
          year: Number,
        },
      ],
    },
    // Preferences
    preferences: {
      pitchAvailability: {
        timeSlots: [
          {
            day: String,
            times: [String],
          },
        ],
        preferredFormat: [
          {
            type: String,
            enum: ["in-person", "virtual", "written"],
          },
        ],
      },
      notificationSettings: {
        investorInterest: Boolean,
        meetingReminders: Boolean,
        feedbackReceived: Boolean,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create models
const InvestorProfile =
  mongoose.models.InvestorProfile ||
  mongoose.model("InvestorProfile", investorProfileSchema);
const PitcherProfile =
  mongoose.models.PitcherProfile ||
  mongoose.model("PitcherProfile", pitcherProfileSchema);

export { InvestorProfile, PitcherProfile };
