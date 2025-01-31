import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Category type is required"],
      enum: ["industry", "stage", "investmentType", "location", "market"],
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    pitchCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug before saving
CategorySchema.pre("save", function (next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  next();
});

// Virtual for full path (type + name)
CategorySchema.virtual("fullPath").get(function () {
  return `${this.type}/${this.slug}`;
});

// Ensure indexes for faster queries
CategorySchema.index({ type: 1, name: 1 }, { unique: true });
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
