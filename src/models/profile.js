import mongoose from "mongoose";

// Base Schema for common fields
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["pitcher", "investor"],
      required: true,
    },
    // Basic Info
    name: String,
    email: String,
    phoneNumber: String,
    profileImage: String,
    location: {
      city: String,
      country: String,
    },
    // Professional Info
    title: String,
    company: String,
    yearsOfExperience: Number,
    expertise: [String],
    industry: [String],
    bio: String,

    // Social Links
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
    },

    // Pitcher-specific fields
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
        status: {
          type: String,
          enum: ["draft", "active", "under-review", "inactive"],
          default: "draft",
        },
        targetAudience: [String],
        uniqueSellingPoints: [String],
      },
    ],
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

    // Investor-specific fields
    investmentPreferences: {
      investmentRange: {
        min: Number,
        max: Number,
      },
      sectorsOfInterest: [String],
      stagePreference: [String],
      pitchesReviewed: [
        {
          pitchId: String,
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
    // Common Preferences
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

// Create and export a single Profile model
const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
