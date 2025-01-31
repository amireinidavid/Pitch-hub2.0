import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    pitcherUserID: String,
    name: String,
    email: String,
    investorUserID: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "funded", "cancelled"],
      default: "pending",
    },
    investmentAmount: Number, // Add this field to store the investment amount
    pitchID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pitch",
      required: true,
    },
    pitchAppliedDate: String,
    feedback: String,
    meetingScheduled: {
      type: Boolean,
      default: false,
    },
    meetingDate: Date,
    notes: String,
    documents: [
      {
        title: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Method to schedule meetings
ApplicationSchema.methods.scheduleMeeting = async function (meetingDate) {
  this.meetingDate = meetingDate;
  this.meetingScheduled = true;
  this.status = "accepted";
  await this.save();
};

// Method to update status
ApplicationSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  await this.save();
};

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

export default Application;
