import mongoose from "mongoose";

const pitchSchema = new mongoose.Schema(
  {
    // Basic Info
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tagline: String,
    description: {
      type: String,
      default: "Draft description",
    },
    industry: String,
    website: String,
    status: {
      type: String,
      enum: ["draft", "pending", "active", "rejected", "archived"],
      default: "draft",
    },

    // Company Details
    companyDetails: {
      name: String,
      foundedDate: Date,
      location: {
        country: String,
        city: String,
        region: String,
      },
      stage: {
        type: String,
        enum: ["idea", "prototype", "early_stage", "growth", "scale"],
        default: "idea",
      },
      employeeCount: Number,
    },

    // Executive Summary
    executiveSummary: {
      problem: String,
      solution: String,
      targetMarket: {
        size: String,
        segments: [String],
        demographics: mongoose.Schema.Types.Mixed,
      },
      competitiveAdvantage: String,
    },

    // Market Analysis
    marketAnalysis: {
      marketSize: String,
      marketGrowth: String,
      competitors: [
        {
          name: String,
          strengths: [String],
          weaknesses: [String],
          marketShare: Number,
        },
      ],
      marketStrategy: String,
    },

    // Business Model
    businessModel: {
      revenueStreams: [
        {
          source: String,
          description: String,
          percentage: Number,
        },
      ],
      costStructure: {
        fixed: [String],
        variable: [String],
        breakdown: mongoose.Schema.Types.Mixed,
      },
      partnerships: [
        {
          name: String,
          type: String,
          description: String,
        },
      ],
      channels: [String],
    },

    // Financial Info
    financials: {
      currentFinancials: {
        revenue: {
          type: String,
          default: "",
        },
        expenses: {
          type: String,
          default: "",
        },
        profits: {
          type: String,
          default: "",
        },
      },
      revenue: {
        current: {
          type: String,
          default: "",
        },
        projected: {
          type: String,
          default: "",
        },
      },
      expenses: {
        current: {
          type: String,
          default: "",
        },
        projected: {
          type: String,
          default: "",
        },
      },
      projections: [
        {
          year: String,
          revenue: String,
          expenses: String,
          profits: String,
        },
      ],
      financialProjections: [
        {
          year: String,
          revenue: String,
          expenses: String,
          profit: String,
          notes: String,
        },
      ],
      fundingHistory: [
        {
          date: String,
          amount: String,
          type: String,
          investors: String,
        },
      ],
      previousFunding: [
        {
          round: String,
          amount: String,
          date: String,
          investors: [String],
        },
      ],
      fundingGoal: {
        type: String,
        default: "",
      },
      fundingRaised: {
        type: String,
        default: "",
      },
      valuation: {
        type: String,
        default: "",
      },
    },

    // Team Info
    team: [
      {
        name: String,
        role: String,
        bio: String,
        image: String,
        linkedin: String,
        experience: [String],
      },
    ],
    advisors: [
      {
        name: String,
        expertise: String,
        bio: String,
        image: String,
        linkedin: String,
      },
    ],
    boardMembers: [
      {
        name: String,
        position: String,
        bio: String,
        image: String,
      },
    ],

    // Traction & Metrics
    traction: {
      metrics: [
        {
          name: String,
          value: mongoose.Schema.Types.Mixed,
          date: Date,
        },
      ],
      milestones: [
        {
          title: String,
          date: Date,
          description: String,
        },
      ],
      customers: [
        {
          name: String,
          logo: String,
          testimonial: String,
        },
      ],
    },
    metrics: {
      key: [
        {
          name: String,
          value: mongoose.Schema.Types.Mixed,
          trend: String,
        },
      ],
      growth: [
        {
          metric: String,
          timeframe: String,
          value: Number,
        },
      ],
    },

    // Media & Documents
    media: {
      pitchDeck: String,
      documents: [
        {
          title: String,
          type: String,
          url: String,
          uploadDate: Date,
        },
      ],
      images: [
        {
          url: String,
          caption: String,
        },
      ],
      videos: [
        {
          url: String,
          title: String,
        },
      ],
    },

    // Investment Terms
    investmentTerms: {
      instrumentType: String,
      minimumInvestment: {
        type: String,
        default: "",
      },
      maximumInvestment: {
        type: String,
        default: "",
      },
      pricePerShare: {
        type: String,
        default: "",
      },
      numberOfShares: {
        type: String,
        default: "",
      },
      equityOffered: {
        type: String,
        default: "",
      },
      investmentStructure: String,
      useOfFunds: [String],
      investorRights: [String],
      exitStrategy: String,
      timeline: String,
    },

    // Additional Info
    additionalInfo: {
      risks: [
        {
          category: String,
          description: String,
          mitigation: String,
        },
      ],
      intellectualProperty: [
        {
          type: String,
          status: String,
          description: String,
        },
      ],
      regulatoryInfo: String,
      socialImpact: String,
      sustainability: String,
    },

    // System fields
    tags: [String],
    categories: [String],
    reviewDetails: {
      status: String,
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
          },
          text: String,
          date: Date,
        },
      ],
    },
    statusTimestamps: {
      created: Date,
      lastUpdated: Date,
      submitted: Date,
      approved: Date,
      rejected: Date,
    },
    viewHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile",
        },
        timestamp: Date,
      },
    ],
    feedback: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile",
        },
        rating: Number,
        comment: String,
        date: Date,
      },
    ],



// Investment & Funding Details
investments: [{
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investment",
    required: true
  },
  investorId: {
    type: String, // Clerk user ID
    required: true
  },
  // Investment Details
  amount: {
    type: Number,
    required: true
  },
  investmentType: {
    type: String,
    enum: ["equity", "convertible", "safe", "debt"],
    required: true
  },
  investmentStructure: {
    type: String,
    enum: ["direct", "spv"],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["wire", "crypto", "escrow"],
    required: true
  },
  status: {
    type: String,
    enum: [
      "pending",
      "pitcher_review",
      "admin_review",
      "payment_pending",
      "payment_processing",
      "completed",
      "rejected",
      "cancelled"
    ],
    default: "pending"
  },
  paymentDetails: {
    stripeSessionId: String,
    paymentStatus: String,
    paymentDate: Date,
    transactionId: String
  },

  // Investment Strategy
  investmentThesis: {
    type: String,
    required: true
  },
  expectedHoldingPeriod: {
    type: String,
    enum: ["1-2", "3-5", "5-7", "7+"],
    required: true
  },
  exitStrategy: {
    type: String,
    enum: ["ipo", "acquisition", "secondary", "buyback"],
    required: true
  },
  valueAddProposal: String,

  // Risk Assessment
  riskTolerance: {
    type: String,
    enum: ["conservative", "moderate", "aggressive"],
    required: true
  },
  keyRiskFactors: [String],
  mitigationStrategies: String,

  // Due Diligence
  dueDiligence: {
    businessModel: Boolean,
    financials: Boolean,
    market: Boolean,
    team: Boolean,
    legal: Boolean,
    technology: Boolean,
    competition: Boolean,
    intellectualProperty: Boolean,
    regulatory: Boolean,
    customerBase: Boolean,
    growthStrategy: Boolean,
    operationalEfficiency: Boolean
  },

  // Investor Profile
  investorProfile: {
    investmentExperience: {
      type: String,
      enum: ["novice", "intermediate", "experienced", "expert"],
      required: true
    },
    sectorExpertise: String,
    accreditationStatus: {
      type: String,
      enum: ["accredited", "qualified", "institutional", "non-accredited"],
      required: true
    },
    investmentGoals: String
  },

  // Terms and Additional Info
  terms: String,
  additionalRequests: String,
  boardSeatInterest: Boolean,
  strategicPartnership: Boolean,

  // Compliance
  sourceOfFunds: {
    type: String,
    enum: ["personal", "business", "investment", "inheritance", "other"],
    required: true
  },
  kycCompleted: {
    type: Boolean,
    default: false
  },
  kycDocuments: [String],
  accreditationVerified: {
    type: Boolean,
    default: false
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,

  equity: {
    type: Number,
    required: function() {
      return this.parent().investmentType === "equity";
    },
    validate: {
      validator: function(value) {
        if (this.parent().investmentType === "equity") {
          return value != null && value > 0;
        }
        return true;
      },
      message: "Equity percentage is required for equity investments and must be greater than 0"
    }
  }
}],
fundingDetails: {
  totalFundingRaised: {
    type: Number,
    default: 0
  },
  numberOfInvestors: {
    type: Number,
    default: 0
  },
  fundingRounds: [{
    roundName: String,
    roundType: {
      type: String,
      enum: ["pre_seed", "seed", "series_a", "series_b", "series_c", "bridge", "growth"]
    },
    targetAmount: Number,
    amount: Number,
    preMoneyValuation: Number,
    postMoneyValuation: Number,
    date: Date,
    leadInvestor: String,
    investors: [{
      investorId: String,
      amount: Number,
      equity: Number
    }],
    terms: {
      sharePrice: Number,
      sharesIssued: Number,
      proRataRights: Boolean,
      votingRights: Boolean
    },
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      default: "ongoing"
    },
    documents: [{
      type: String,
      url: String,
      uploadedAt: Date
    }]
  }],
  currentRound: {
    startDate: Date,
    endDate: Date,
    roundType: {
      type: String,
      enum: ["pre_seed", "seed", "series_a", "series_b", "series_c", "bridge", "growth"]
    },
    targetAmount: Number,
    minimumTicket: Number,
    maximumTicket: Number,
    currentAmount: {
      type: Number,
      default: 0
    },
    preMoneyValuation: Number,
    sharePrice: Number,
    totalShares: Number,
    availableEquity: Number,
    investorPerks: [String],
    useOfFunds: [{
      category: String,
      amount: Number,
      description: String
    }],
    keyMilestones: [{
      title: String,
      description: String,
      targetDate: Date
    }]
  },
  metrics: {
    averageInvestmentSize: Number,
    largestInvestment: Number,
    smallestInvestment: Number,
    averageEquityPerInvestor: Number,
    totalEquityAllocated: Number,
    remainingEquity: Number
  }
}

  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
pitchSchema.index({ creator: 1, status: 1 });
pitchSchema.index({ "companyDetails.stage": 1 });
pitchSchema.index({ industry: 1 });
pitchSchema.index({ tags: 1 });
pitchSchema.index({ categories: 1 });

// Middleware to handle pre-save operations
pitchSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusTimestamps = {
      ...this.statusTimestamps,
      created: new Date(),
    };
  }
  this.statusTimestamps.lastUpdated = new Date();
  next();
});

const Pitch = mongoose.models.Pitch || mongoose.model("Pitch", pitchSchema);

export default Pitch;
