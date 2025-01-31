import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    pitchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pitch",
      required: true,
    },
    investorId: {
      type: String, // Clerk user ID
      required: true,
    },
    // Basic Investment Details
    amount: {
      type: Number,
      required: true,
    },
    investmentType: {
      type: String,
      enum: ["equity", "convertible", "safe", "debt"],
      required: true,
    },
    equity: {
      type: Number,
      required: function () {
        return this.investmentType === "equity";
      },
    },
    investmentStructure: {
      type: String,
      enum: ["direct", "spv"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["wire", "crypto", "escrow"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending", // Initial state when investor submits
        "pitcher_review", // Under review by pitcher
        "admin_review", // Under review by admin
        "payment_pending", // Waiting for payment
        "payment_processing", // Payment is being processed
        "completed", // Investment completed
        "rejected", // Investment rejected
        "cancelled", // Investment cancelled
      ],
      default: "pending",
    },
    paymentDetails: {
      stripeSessionId: String,
      paymentStatus: String,
      paymentDate: Date,
      transactionId: String,
    },

    // Investment Strategy
    investmentThesis: {
      type: String,
      required: true,
    },
    expectedHoldingPeriod: {
      type: String,
      enum: ["1-2", "3-5", "5-7", "7+"],
      required: true,
    },
    exitStrategy: {
      type: String,
      enum: ["ipo", "acquisition", "secondary", "buyback"],
      required: true,
    },
    valueAddProposal: String,

    // Risk Assessment
    riskTolerance: {
      type: String,
      enum: ["conservative", "moderate", "aggressive"],
      required: true,
    },
    keyRiskFactors: [
      {
        type: String,
      },
    ],
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
      operationalEfficiency: Boolean,
    },

    // Investor Profile
    investorProfile: {
      investmentExperience: {
        type: String,
        enum: ["novice", "intermediate", "experienced", "expert"],
        required: true,
      },
      sectorExpertise: String,
      accreditationStatus: {
        type: String,
        enum: ["accredited", "qualified", "institutional", "non-accredited"],
        required: true,
      },
      investmentGoals: String,
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
      required: true,
    },
    kycCompleted: {
      type: Boolean,
      default: false,
    },
    kycDocuments: [
      {
        type: String, // URLs to uploaded documents
      },
    ],
    accreditationVerified: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
investmentSchema.index({ pitchId: 1, status: 1 });
investmentSchema.index({ investorId: 1, status: 1 });

// Middleware to update the pitch's funding raised amount
investmentSchema.post("save", async function (doc) {
  if (doc.status === "completed") {
    const Pitch = mongoose.model("Pitch");
    await Pitch.findByIdAndUpdate(doc.pitchId, {
      $inc: { fundingRaised: doc.amount },
    });
  }
});

const Investment =
  mongoose.models.Investment || mongoose.model("Investment", investmentSchema);

export default Investment;
