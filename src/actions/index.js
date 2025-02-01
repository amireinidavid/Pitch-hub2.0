"use server";

import connectToDB from "@/database";
import Application from "@/models/application";
import Pitch from "@/models/pitch";
import Profile from "@/models/profile";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import Category from "@/models/category";
import { sendPitchStatusEmail } from "@/lib/emailService";
import Investment from "@/models/investment";
import { sendEmail, emailTemplates } from "@/lib/email";
import Notification from "@/models/notification";
// import InvestorInteraction from "@/models/investorInteraction";

const stripe = require("stripe")(
  "sk_test_51QXLAHB0xUjtzZ1Gl3psNzSDSZWZodQbCxJn6V4JUrj1soGbjasiH9jn0w41N9NyBt6IMcm5iP2nfMvIsI1B1yjS00aEwbPXJd"
);
// crate profile action
export async function createProfileAction(data) {
  try {
    await connectToDB();

    if (!data || !data.userId || !data.role) {
      throw new Error("Missing required fields: userId and role");
    }

    // Check if a profile already exists for this user
    const existingProfile = await Profile.findOne({ userId: data.userId });
    
    // If profile exists, return error to prevent duplicate profiles
    if (existingProfile) {
      return {
        success: false,
        error: "Profile already exists",
        redirectTo: existingProfile.role === "pitcher" 
          ? "/pitching/dashboard" 
          : "/investing/dashboard"
      };
    }

    // Validate and format the incoming data
    const profileData = {
      userId: data.userId,
      role: data.role,

      // Basic Info - with fallbacks
      name: data.basicInfo?.name || "",
      email: data.basicInfo?.email || "",
      phoneNumber: data.basicInfo?.phoneNumber || "",
      profileImage: data.basicInfo?.profileImage || "",
      location: {
        city: data.basicInfo?.location?.city || "",
        country: data.basicInfo?.location?.country || "",
      },

      // Professional Info - with fallbacks
      title: data.professionalInfo?.title || "",
      company: data.professionalInfo?.company || "",
      yearsOfExperience: Number(data.professionalInfo?.yearsOfExperience) || 0,
      expertise: Array.isArray(data.professionalInfo?.expertise)
        ? data.professionalInfo.expertise
        : [],
      industry: Array.isArray(data.professionalInfo?.industry)
        ? data.professionalInfo.industry
        : [],

      // Bio
      bio: data.bio || "",

      // Social Links - with fallbacks
      socialLinks: {
        linkedin: data.socialLinks?.linkedin || "",
        twitter: data.socialLinks?.twitter || "",
        website: data.socialLinks?.website || "",
      },

      // Background - with proper array handling
      background: {
        education: Array.isArray(data.background?.education)
          ? data.background.education.map((edu) => ({
              degree: edu.degree || "",
              institution: edu.institution || "",
              year: Number(edu.year) || new Date().getFullYear(),
            }))
          : [],
        workExperience: Array.isArray(data.background?.workExperience)
          ? data.background.workExperience.map((exp) => ({
              position: exp.position || "",
              company: exp.company || "",
              duration: exp.duration || "",
              achievements: Array.isArray(exp.achievements)
                ? exp.achievements
                : [],
            }))
          : [],
        skills: Array.isArray(data.background?.skills)
          ? data.background.skills
          : [],
        certifications: Array.isArray(data.background?.certifications)
          ? data.background.certifications.map((cert) => ({
              name: cert.name || "",
              issuer: cert.issuer || "",
              year: Number(cert.year) || new Date().getFullYear(),
            }))
          : [],
      },

      // Preferences - with fallbacks
      preferences: {
        notificationSettings: {
          newPitches: Boolean(
            data.preferences?.notificationSettings?.newPitches
          ),
          pitchUpdates: Boolean(
            data.preferences?.notificationSettings?.pitchUpdates
          ),
          meetingReminders: Boolean(
            data.preferences?.notificationSettings?.meetingReminders
          ),
        },
        communicationPreferences: {
          email: Boolean(data.preferences?.communicationPreferences?.email),
          inApp: Boolean(data.preferences?.communicationPreferences?.inApp),
          phone: Boolean(data.preferences?.communicationPreferences?.phone),
        },
      },
    };

    // Add role-specific fields
    if (data.role === "pitcher") {
      profileData.pitches = Array.isArray(data.pitches)
        ? data.pitches.map((pitch) => ({
            title: pitch.title || "",
            shortDescription: pitch.shortDescription || "",
            fullDescription: pitch.fullDescription || "",
            category: Array.isArray(pitch.category) ? pitch.category : [],
            stage: pitch.stage || "idea",
            status: pitch.status || "draft",
            targetAudience: Array.isArray(pitch.targetAudience)
              ? pitch.targetAudience
              : [],
            uniqueSellingPoints: Array.isArray(pitch.uniqueSellingPoints)
              ? pitch.uniqueSellingPoints
              : [],
          }))
        : [];
    } else if (data.role === "investor") {
      profileData.investmentPreferences = {
        investmentRange: {
          min: Number(data.investmentPreferences?.investmentRange?.min) || 0,
          max: Number(data.investmentPreferences?.investmentRange?.max) || 0,
        },
        sectorsOfInterest: Array.isArray(
          data.investmentPreferences?.sectorsOfInterest
        )
          ? data.investmentPreferences.sectorsOfInterest
          : [],
        stagePreference: Array.isArray(
          data.investmentPreferences?.stagePreference
        )
          ? data.investmentPreferences.stagePreference
          : [],
        pitchesReviewed: [],
        totalPitchesReviewed: 0,
      };
    }

    // Create the profile with proper error handling
    const profile = await Profile.create(profileData);

    if (!profile) {
      throw new Error("Failed to create profile");
    }

    // Revalidate the path and return success
    revalidatePath("/dashboard");
    return {
      success: true,
      profile: JSON.parse(JSON.stringify(profile)),
      redirectTo: data.role === "pitcher" 
        ? "/pitching/dashboard" 
        : "/investing/dashboard"
    };
  } catch (error) {
    console.error("Profile creation error:", error);
    return {
      success: false,
      error: error.message || "Failed to create profile",
      redirectTo: "/"
    };
  }
}
export async function fetchProfileAction(id) {
  try {
    await connectToDB();
    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      return null;
    }

    // Ensure the data is serializable
    return JSON.parse(JSON.stringify(profile));
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

//create pitch action

export async function postNewJobAction(formData, pathToRevalidate) {
  try {
    await connectToDB();

    // Ensure partnerships data is properly formatted
    const partnerships =
      formData.partnerships?.map((p) => ({
        name: p.name || "",
        type: p.type || "",
        description: p.description || "",
      })) || [];

    // Format the data before creating the pitch
    const pitchData = {
      ...formData,
      fundingGoal: Number(formData.fundingGoal),
      equity: Number(formData.equity),
      partnerships: partnerships,
    };

    const pitch = await Pitch.create(pitchData);
    revalidatePath(pathToRevalidate);
    return { success: true, pitch };
  } catch (error) {
    console.error("Create pitch error:", error);
    return {
      success: false,
      error: error.message || "Failed to create pitch",
    };
  }
}

//fetch pitch action
//pitcher
export async function fetchJobsForPitcherAction(id) {
  await connectToDB();
  const result = await Pitch.find({ pitcherId: id });
  return JSON.parse(JSON.stringify(result));
}

//investor
export async function fetchJobsForInvestorAction(filterParams = {}) {
  await connectToDB();
  let updatedParams = {};
  Object.keys(filterParams).forEach((filterKey) => {
    updatedParams[filterKey] = { $in: filterParams[filterKey].split(",") };
  });
  console.log(updatedParams, "updatedParams");
  const result = await Pitch.find(
    filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {}
  );

  return JSON.parse(JSON.stringify(result));
}

// Function to create a pitch application
// Function to create a pitch application
export async function createPitchApplicationAction(data, pathToRevalidate) {
  await connectToDB();
  await Application.create(data);
  revalidatePath(pathToRevalidate);
}

//fetch pitch applications - investor
export async function fetchPitchApplicationsForInvestor(investorID) {
  await connectToDB();
  const result = await Application.find({ investorUserID: investorID });

  return JSON.parse(JSON.stringify(result));
}

//fetch pitch applications - pitcher

export async function fetchPitchApplicationsForPitcher(pitcherID) {
  await connectToDB();
  const result = await Application.find({ pitcherUserID: pitcherID });

  return JSON.parse(JSON.stringify(result));
}

//update pitch application
export async function updatePitchApplicationAction(data, pathToRevalidate) {
  await connectToDB();
  const {
    pitcherUserID,
    name,
    email,
    investorUserID,
    status,
    pitchID,
    _id,
    pitchAppliedDate,
  } = data;
  await Application.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      pitcherUserID,
      name,
      email,
      investorUserID,
      status,
      pitchID,
      pitchAppliedDate,
    },
    { new: true }
  );
  revalidatePath(pathToRevalidate);
}

//get candidate detAils by investor ID
export async function getInvestorDetailsByIDAction(currentInvestorID) {
  await connectToDB();
  const result = await Profile.findOne({ userId: currentInvestorID });

  return JSON.parse(JSON.stringify(result));
}

// create filte categories
//create filter categories
export async function createFilterCategoryAction() {
  await connectToDB();
  const result = await Pitch.find({});

  return JSON.parse(JSON.stringify(result));
}

//update profile action
export async function updateProfileAction(data, pathToRevalidate) {
  await connectToDB();
  const {
    userId,
    role,
    email,
    isPremiumUser,
    memberShipType,
    memberShipStartDate,
    memberShipEndDate,
    pitcherInfo,
    investorInfo,
    _id,
  } = data;

  await Profile.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      userId,
      role,
      email,
      isPremiumUser,
      memberShipType,
      memberShipStartDate,
      memberShipEndDate,
      pitcherInfo,
      investorInfo,
    },
    { new: true }
  );

  revalidatePath(pathToRevalidate);
}

//create stripe price id based on tier selection
export async function createPriceIdAction(data) {
  const session = await stripe.prices.create({
    currency: "inr",
    unit_amount: data?.amount * 100,
    recurring: {
      interval: "year",
    },
    product_data: {
      name: "Premium Plan",
    },
  });

  return {
    success: true,
    id: session?.id,
  };
}

//create payment logic
export async function createStripePaymentAction(data) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: data?.lineItems,
    mode: "subscription",
    success_url: `${process.env.URL}/membership` + "?status=success",
    cancel_url: `${process.env.URL}/membership` + "?status=cancel",
  });

  return {
    success: true,
    id: session?.id,
  };
}

// Fetch pitches in review
export async function fetchPitchesInReview() {
  await connectToDB();
  const pitches = await Pitch.find({ status: "in review" });
  return JSON.parse(JSON.stringify(pitches));
}

// Fetch total pitchers
export async function fetchTotalPitchers() {
  await connectToDB();
  const pitchers = await Profile.find({ role: "pitcher" });
  return JSON.parse(JSON.stringify(pitchers));
}

// Fetch total investors
export async function fetchTotalInvestors() {
  await connectToDB();
  const investors = await Profile.find({ role: "investor" });
  return JSON.parse(JSON.stringify(investors));
}
// Pitch created by my ai buddy
export async function fetchPitchesAction(userId, role) {
  try {
    await connectToDB();

    // If user is a pitcher, only fetch their pitches
    if (role === 'pitcher') {
      const pitches = await Pitch.find({ creator: userId })
        .populate("creator")
        .sort({ createdAt: -1 })
        .lean();

      return JSON.parse(JSON.stringify(pitches));
    }

    // If user is an investor or admin, fetch all active pitches
    const pitches = await Pitch.find({ 
      status: { $in: ['active', 'pending'] } 
    })
      .populate("creator")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(pitches));
  } catch (error) {
    console.error("Error fetching pitches:", error);
    throw new Error("Failed to fetch pitches");
  }
}

export async function fetchPitchByIdAction(pitchId) {
  try {
    await connectToDB();

    const pitch = await Pitch.findById(pitchId).populate({
      path: "creator",
      select: "name email image userId",
      model: "Profile",
    });

    if (!pitch) {
      throw new Error("Pitch not found");
    }

    // Ensure the response is serializable
    return JSON.parse(JSON.stringify(pitch));
  } catch (error) {
    console.error("Error fetching pitch:", error);
    throw new Error(error.message || "Failed to fetch pitch");
  }
}

// Function to upload file to Cloudinary
async function uploadToCloudinary(file, fileType) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pitches/${fileType}s`,
          resource_type: fileType === "video" ? "video" : "auto",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file");
  }
}

// Create pitch with media uploads
export async function createPitchAction(formData) {
  try {
    await connectToDB();
    console.log("Received formData in createPitchAction:", formData);

    if (!formData.creator) {
      throw new Error("Creator ID is required");
    }

    // Create a properly structured pitch data object with all nested fields
    const pitchData = {
      // Basic Info
      creator: formData.creator,
      title: formData.title || "",
      tagline: formData.tagline || "",
      description: formData.description || "",
      industry: formData.industry || "",
      website: formData.website || "",
      status: formData.status || "draft",

      // Company Details
      companyDetails: {
        name: formData.companyDetails?.name || "",
        foundedDate: formData.companyDetails?.foundedDate || null,
        location: {
          country: formData.companyDetails?.location?.country || "",
          city: formData.companyDetails?.location?.city || "",
          region: formData.companyDetails?.location?.region || "",
        },
        stage: formData.companyDetails?.stage || "idea",
        employeeCount: Number(formData.companyDetails?.employeeCount) || 0,
      },

      // Executive Summary
      executiveSummary: {
        problem: formData.executiveSummary?.problem || "",
        solution: formData.executiveSummary?.solution || "",
        targetMarket: {
          size: formData.executiveSummary?.targetMarket?.size || "",
          segments: Array.isArray(
            formData.executiveSummary?.targetMarket?.segments
          )
            ? formData.executiveSummary.targetMarket.segments
            : [],
          demographics:
            formData.executiveSummary?.targetMarket?.demographics || {},
        },
        competitiveAdvantage:
          formData.executiveSummary?.competitiveAdvantage || "",
      },

      // Market Analysis
      marketAnalysis: {
        marketSize: formData.marketAnalysis?.marketSize || "",
        marketGrowth: formData.marketAnalysis?.marketGrowth || "",
        competitors: Array.isArray(formData.marketAnalysis?.competitors)
          ? formData.marketAnalysis.competitors.map((comp) => ({
              name: comp.name || "",
              strengths: Array.isArray(comp.strengths) ? comp.strengths : [],
              weaknesses: Array.isArray(comp.weaknesses) ? comp.weaknesses : [],
              marketShare: Number(comp.marketShare) || 0,
            }))
          : [],
        marketStrategy: formData.marketAnalysis?.marketStrategy || "",
      },

      // Business Model
      businessModel: {
        revenueStreams: Array.isArray(formData.businessModel?.revenueStreams)
          ? formData.businessModel.revenueStreams.map((stream) => ({
              source: stream.source || "",
              description: stream.description || "",
              percentage: Number(stream.percentage) || 0,
            }))
          : [],
        costStructure: {
          fixed: Array.isArray(formData.businessModel?.costStructure?.fixed)
            ? formData.businessModel.costStructure.fixed
            : [],
          variable: Array.isArray(
            formData.businessModel?.costStructure?.variable
          )
            ? formData.businessModel.costStructure.variable
            : [],
          breakdown: formData.businessModel?.costStructure?.breakdown || {},
        },
        partnerships: Array.isArray(formData.businessModel?.partnerships)
          ? formData.businessModel.partnerships.map((partner) => ({
              name: partner.name || "",
              type: partner.type || "",
              description: partner.description || "",
            }))
          : [],
      },

      // Financial Info
      financials: {
        fundingGoal: formData.financials?.fundingGoal || "",
        fundingRaised: formData.financials?.fundingRaised || "",
        valuation: formData.financials?.valuation || "",
        revenue: {
          current: formData.financials?.revenue?.current || "",
          projected: formData.financials?.revenue?.projected || "",
          history: Array.isArray(formData.financials?.revenue?.history)
            ? formData.financials.revenue.history.map((h) => ({
                year: h.year || "",
                amount: h.amount || "",
              }))
            : [],
        },
        expenses: {
          current: formData.financials?.expenses?.current || "",
          projected: formData.financials?.expenses?.projected || "",
          breakdown: formData.financials?.expenses?.breakdown || {},
        },
        financialProjections: Array.isArray(
          formData.financials?.financialProjections
        )
          ? formData.financials.financialProjections.map((proj) => ({
              year: proj.year || "",
              revenue: proj.revenue || "",
              expenses: proj.expenses || "",
              profit: proj.profit || "",
            }))
          : [],
        previousFunding: Array.isArray(formData.financials?.previousFunding)
          ? formData.financials.previousFunding.map((funding) => ({
              round: funding.round || "",
              amount: funding.amount || "",
              date: funding.date || "",
              investors: Array.isArray(funding.investors)
                ? funding.investors
                : [],
            }))
          : [],
      },
      // Investment Terms
      investmentTerms: {
        instrumentType: formData.investmentTerms?.instrumentType || "equity",
        minimumInvestment: formData.investmentTerms?.minimumInvestment || "",
        maximumInvestment: formData.investmentTerms?.maximumInvestment || "",
        pricePerShare: formData.investmentTerms?.pricePerShare || "",
        numberOfShares: formData.investmentTerms?.numberOfShares || "",
        equityOffered: formData.investmentTerms?.equityOffered || "",
        investmentStructure:
          formData.investmentTerms?.investmentStructure || "",
        useOfFunds: Array.isArray(formData.investmentTerms?.useOfFunds)
          ? formData.investmentTerms.useOfFunds
          : [],
        investorRights: Array.isArray(formData.investmentTerms?.investorRights)
          ? formData.investmentTerms.investorRights
          : [],
        exitStrategy: formData.investmentTerms?.exitStrategy || "",
        timeline: formData.investmentTerms?.timeline || "",
      },

      // Team Info
      team: Array.isArray(formData.team)
        ? formData.team.map((member) => ({
            name: member.name || "",
            role: member.role || "",
            bio: member.bio || "",
            image: member.image || "",
            linkedin: member.linkedin || "",
            experience: member.experience || "",
          }))
        : [],

      // Advisors
      advisors: Array.isArray(formData.advisors)
        ? formData.advisors.map((advisor) => ({
            name: advisor.name || "",
            role: advisor.role || "",
            bio: advisor.bio || "",
            image: advisor.image || "",
            linkedin: advisor.linkedin || "",
            experience: advisor.experience || "",
          }))
        : [],

      // Board Members
      boardMembers: Array.isArray(formData.boardMembers)
        ? formData.boardMembers.map((member) => ({
            name: member.name || "",
            role: member.role || "",
            bio: member.bio || "",
            image: member.image || "",
            linkedin: member.linkedin || "",
            experience: member.experience || "",
          }))
        : [],

      // Traction & Metrics
      traction: {
        metrics: Array.isArray(formData.traction?.metrics)
          ? formData.traction.metrics.map((metric) => ({
              name: metric.name || "",
              value: metric.value || "",
              date: metric.date || "",
            }))
          : [],
        milestones: Array.isArray(formData.traction?.milestones)
          ? formData.traction.milestones.map((milestone) => ({
              title: milestone.title || "",
              date: milestone.date || "",
              description: milestone.description || "",
            }))
          : [],
        customers: Array.isArray(formData.traction?.customers)
          ? formData.traction.customers
          : [],
      },

      // Media & Documents
      media: {
        pitchDeck: formData.media?.pitchDeck || "",
        documents: Array.isArray(formData.media?.documents)
          ? formData.media.documents
          : [],
        images: Array.isArray(formData.media?.images)
          ? formData.media.images
          : [],
        videos: Array.isArray(formData.media?.videos)
          ? formData.media.videos
          : [],
      },

      // Additional Info
      additionalInfo: {
        risks: Array.isArray(formData.additionalInfo?.risks)
          ? formData.additionalInfo.risks.map((risk) => ({
              type: risk.type || "",
              description: risk.description || "",
              mitigation: risk.mitigation || "",
            }))
          : [],
        intellectualProperty: Array.isArray(
          formData.additionalInfo?.intellectualProperty
        )
          ? formData.additionalInfo.intellectualProperty.map((ip) => ({
              type: ip.type || "",
              status: ip.status || "",
              description: ip.description || "",
            }))
          : [],
        regulatoryInfo: formData.additionalInfo?.regulatoryInfo || "",
        socialImpact: formData.additionalInfo?.socialImpact || "",
        sustainability: formData.additionalInfo?.sustainability || "",
      },

      // System fields
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      categories: Array.isArray(formData.categories) ? formData.categories : [],
      statusTimestamps: {
        created: new Date(),
        lastUpdated: new Date(),
        submitted: formData.status === "pending" ? new Date() : null,
      },
    };

    console.log("Structured pitchData before creation:", pitchData);

    const pitch = await Pitch.create(pitchData);
    console.log("Created pitch:", pitch);

    return {
      success: true,
      pitch: JSON.parse(JSON.stringify(pitch)),
    };
  } catch (error) {
    console.error("Create pitch error:", error);
    return {
      success: false,
      error: error.message,
      validationErrors: error.errors
        ? Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          }))
        : null,
    };
  }
}

// Update pitch with media uploads
export async function updatePitchAction(pitchId, formData) {
  try {
    await connectToDB();

    const existingPitch = await Pitch.findById(pitchId);
    if (!existingPitch) {
      throw new Error("Pitch not found");
    }

    // Handle media updates if present
    const mediaUrls = {
      pitchDeck: formData.media?.pitchDeck || existingPitch.media?.pitchDeck,
      video: formData.media?.video || existingPitch.media?.video,
      images: formData.media?.images || existingPitch.media?.images || [],
      slides: formData.media?.slides || existingPitch.media?.slides || [],
    };

    if (formData.media) {
      // Handle slides updates
      if (formData.media.slides) {
        mediaUrls.slides = await Promise.all(
          formData.media.slides.map(async (slide) => {
            if (slide.file instanceof File) {
              const slideResult = await uploadToCloudinary(slide.file, "image");
              return {
                url: slideResult.url,
                order: slide.order,
                title: slide.title,
                description: slide.description,
              };
            }
            return slide; // Keep existing slide data
          })
        );
        console.log("Updated slides:", mediaUrls.slides);
      }

      // Handle new pitch deck upload
      if (formData.media.pitchDeck instanceof File) {
        const deckResult = await uploadToCloudinary(
          formData.media.pitchDeck,
          "document"
        );
        mediaUrls.pitchDeck = deckResult.url;
        console.log("Updated pitch deck:", mediaUrls.pitchDeck);
      }

      // Handle new video upload
      if (formData.media.video instanceof File) {
        const videoResult = await uploadToCloudinary(
          formData.media.video,
          "video"
        );
        mediaUrls.video = videoResult.url;
        console.log("Updated video:", mediaUrls.video);
      }

      // Handle new image uploads
      if (formData.media.images) {
        mediaUrls.images = await Promise.all(
          formData.media.images.map(async (image) => {
            if (image.file instanceof File) {
              const imageResult = await uploadToCloudinary(image.file, "image");
              return {
                url: imageResult.url,
                caption: image.caption,
              };
            }
            return image; // Keep existing image data
          })
        );
        console.log("Updated images:", mediaUrls.images);
      }
    }

    // Combine form data with media URLs
    const pitchData = {
      ...formData,
      media: mediaUrls,
    };

    console.log("Final update data:", pitchData);

    const updatedPitch = await Pitch.findByIdAndUpdate(
      pitchId,
      { $set: pitchData },
      { new: true }
    );

    // Verify the update
    const verifyUpdate = await Pitch.findById(pitchId);
    console.log("Verified updated pitch data:", verifyUpdate);

    if (!verifyUpdate.media) {
      throw new Error("Media data not properly updated");
    }

    revalidatePath("/pitching/library");
    return {
      success: true,
      pitch: updatedPitch,
      mediaUrls: verifyUpdate.media,
    };
  } catch (error) {
    console.error("Update pitch error:", error);
    return {
      success: false,
      error: error.message || "Failed to update pitch",
    };
  }
}

// Add a verification function that includes slides
export async function verifyPitchMedia(pitchId) {
  try {
    await connectToDB();
    const pitch = await Pitch.findById(pitchId);

    if (!pitch) {
      return { success: false, error: "Pitch not found" };
    }

    return {
      success: true,
      mediaUrls: pitch.media,
      hasMedia: !!pitch.media,
      hasPitchDeck: !!pitch.media?.pitchDeck,
      hasVideo: !!pitch.media?.video,
      imageCount: pitch.media?.images?.length || 0,
      slideCount: pitch.media?.slides?.length || 0,
    };
  } catch (error) {
    console.error("Media verification error:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePitchAction(pitchId) {
  try {
    await connectToDB();

    const deletedPitch = await Pitch.findByIdAndDelete(pitchId);
    if (!deletedPitch) throw new Error("Pitch not found");

    return { success: true, message: "Pitch deleted successfully" };
  } catch (error) {
    console.error("Error deleting pitch:", error);
    throw new Error("Failed to delete pitch");
  }
}

export async function fetchDashboardData(userId) {
  try {
    await connectToDB();

    const profile = await Profile.findOne({ userId: userId });
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Get all pitches by the user
    const pitches = await Pitch.find({ creator: profile._id });
    console.log(pitches, "pitches");
    // Get all applications with meetings
    const pitchIds = pitches.map((pitch) => pitch._id.toString()); // Convert ObjectId to string
    const applications = await Application.find({
      pitchID: { $in: pitchIds },
    }).populate("investorID");

    // Format the data and ensure all ObjectIds are converted to strings
    const formattedData = {
      stats: {
        totalViews: pitches.reduce((sum, pitch) => sum + (pitch.views || 0), 0),
        activePitches: pitches.filter((pitch) => pitch.status === "pending")
          .length,
        interestedInvestors: applications.length,
        successRate: Math.round(
          (applications.filter(
            (app) => app.status === "accepted" || app.status === "funded"
          ).length /
            (applications.length || 1)) *
            100
        ),
      },
      pitches: pitches.map((pitch) => ({
        _id: pitch._id.toString(),
        title: pitch.title,
        tagline: pitch.tagline,
        status: pitch.status,
        views: pitch.metrics?.views,
        industry: pitch.industry,
        fundingGoal: pitch.funding,
        createdAt: pitch.createdAt.toISOString(),
        targetMarket: pitch.targetMarket,
        traction: pitch.traction,
        team: pitch.team,
        advisors: pitch.advisors,
        revenueStreams: pitch.revenueStreams,
        costStructure: pitch.costStructure,
        feedback: pitch.feedback,
        metrics: pitch.metrics,
        channels: pitch.channels,
        partnerships: pitch.partnerships,
        financials: pitch.financials,
        funding: pitch.funding,
        media: pitch.media,
        investmentTerms: pitch.investmentTerms,
      })),
      applications: applications.map((app) => ({
        _id: app._id.toString(), // Convert ObjectId to string
        pitchID: {
          _id: app.pitchID.toString(), // Convert ObjectId to string
          title: pitches.find(
            (p) => p._id.toString() === app.pitchID.toString()
          )?.title,
        },
        status: app.status,
        feedback: app.feedback,
        meetingDate: app.meetingDate ? app.meetingDate.toISOString() : null, // Convert Date to string
        createdAt: app.createdAt.toISOString(), // Convert Date to string
        investorID: {
          _id: app.investorID?._id.toString(), // Convert ObjectId to string
          name: app.investorID?.name || "Unknown Investor",
          company: app.investorID?.company,
        },
      })),
    };

    // Ensure the entire object is serializable
    return JSON.parse(JSON.stringify(formattedData));
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error(error.message);
  }
}

// Dashboard Actions by me
export async function getAdminDashboardData(dateRange) {
  try {
    await connectToDB();

    // Get pitch and investment statistics
    const pitchStats = await Pitch.aggregate([
      {
        $facet: {
          pitchStats: [
            {
              $group: {
                _id: null,
                totalPitches: { $sum: 1 },
                activePitches: {
                  $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
                },
                pendingPitches: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                },
                rejectedPitches: {
                  $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                }
              }
            }
          ],
          investmentStats: [
            {
              $group: {
                _id: null,
                totalInvestments: {
                  $sum: {
                    $cond: [
                      { $isArray: "$investments" },
                      { $size: "$investments" },
                      0
                    ]
                  }
                },
                totalFunding: {
                  $sum: {
                    $cond: [
                      { $isArray: "$investments" },
                      {
                        $reduce: {
                          input: "$investments",
                          initialValue: 0,
                          in: { $add: ["$$value", "$$this.amount"] }
                        }
                      },
                      0
                    ]
                  }
                },
                completedInvestments: {
                  $sum: {
                    $size: {
                      $filter: {
                        input: {
                          $cond: [
                            { $isArray: "$investments" },
                            "$investments",
                            []
                          ]
                        },
                        as: "inv",
                        cond: { $eq: ["$$inv.status", "completed"] }
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    // Get user statistics
    const userStats = await Profile.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          investors: {
            $sum: { $cond: [{ $eq: ["$role", "investor"] }, 1, 0] }
          },
          pitchers: {
            $sum: { $cond: [{ $eq: ["$role", "pitcher"] }, 1, 0] }
          }
        }
      }
    ]);

    // Get weekly data for charts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await Pitch.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          pitches: { $sum: 1 },
          investments: {
            $sum: {
              $cond: [
                { $isArray: "$investments" },
                { $size: "$investments" },
                0
              ]
            }
          },
          funding: {
            $sum: {
              $cond: [
                { $isArray: "$investments" },
                {
                  $reduce: {
                    input: "$investments",
                    initialValue: 0,
                    in: { $add: ["$$value", "$$this.amount"] }
                  }
                },
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Calculate conversion rate
    const totalInvestments = pitchStats[0]?.investmentStats[0]?.totalInvestments || 0;
    const completedInvestments = pitchStats[0]?.investmentStats[0]?.completedInvestments || 0;
    const conversionRate = totalInvestments > 0 
      ? Math.round((completedInvestments / totalInvestments) * 100) 
      : 0;

    // Get all pitches for the table
    const pitches = await Pitch.find()
      .select('title status industry fundingDetails createdAt')
      .sort('-createdAt')
      .lean();

    // Get all users for the table
    const users = await Profile.find()
      .select('name email role active createdAt')
      .sort('-createdAt')
      .lean();

    // Format the response
    return {
      success: true,
      stats: {
        totalPitches: pitchStats[0]?.pitchStats[0]?.totalPitches || 0,
        activePitches: pitchStats[0]?.pitchStats[0]?.activePitches || 0,
        pendingPitches: pitchStats[0]?.pitchStats[0]?.pendingPitches || 0,
        rejectedPitches: pitchStats[0]?.pitchStats[0]?.rejectedPitches || 0,
        totalInvestments,
        totalFunding: pitchStats[0]?.investmentStats[0]?.totalFunding || 0,
        totalUsers: userStats[0]?.totalUsers || 0,
        investors: userStats[0]?.investors || 0,
        pitchers: userStats[0]?.pitchers || 0,
        conversionRate
      },
      pitches,
      users,
      analytics: {
        weeklyData: weeklyData.map(day => ({
          date: day._id,
          pitches: day.pitches,
          investments: day.investments,
          funding: day.funding
        })),
        marketingData: [
          { name: 'Direct', value: 44.67 },
          { name: 'Social', value: 25.83 },
          { name: 'Referral', value: 15.43 },
          { name: 'Organic', value: 14.07 }
        ],
        trafficData: [
          { type: 'Paid', value: 75 },
          { type: 'Organic', value: 40 },
          { type: 'Direct', value: 44 }
        ],
        audienceData: [
          { type: 'Male', value: 18 },
          { type: 'Female', value: 82 }
        ]
      }
    };

  } catch (error) {
    console.error("Get admin dashboard data error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Pitch Management Actions
export async function updatePitchStatus(pitchId, status) {
  try {
    await connectToDB();
    const updatedPitch = await Pitch.findByIdAndUpdate(
      pitchId,
      { status },
      { new: true }
    );
    return { success: true, pitch: updatedPitch };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function togglePitchFeatured(pitchId) {
  try {
    await connectToDB();
    const pitch = await Pitch.findById(pitchId);
    pitch.featured = !pitch.featured;
    await pitch.save();
    return { success: true, pitch };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Category Management Actions
export async function addCategory(type, name) {
  try {
    await connectToDB();
    const category = await Category.create({ type, name });
    return { success: true, category };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function removeCategory(categoryId) {
  try {
    await connectToDB();
    await Category.findByIdAndDelete(categoryId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// User Management Actions
export async function fetchUsers() {
  try {
    await connectToDB();
    const users = await Profile.find({}).lean();
    return users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }));
  } catch (error) {
    console.error("Fetch users error:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function updateUserRole(userId, role) {
  try {
    await connectToDB();
    const user = await Profile.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).lean();
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function toggleUserStatus(userId) {
  try {
    await connectToDB();
    const user = await Profile.findById(userId);
    user.active = !user.active;
    await user.save();
    return { success: true, user: user.toObject() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function createUser(data) {
  try {
    await connectToDB();
    const user = await Profile.create({
      name: data.name,
      email: data.email,
      role: data.role,
      active: true,
    });

    // Send welcome email
    const emailContent = emailTemplates.welcome(user);
    await sendEmail({
      to: user.email,
      ...emailContent,
    });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Create user error:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(userId, data) {
  try {
    await connectToDB();
    const user = await Profile.findByIdAndUpdate(
      userId,
      {
        name: data.name,
        email: data.email,
        role: data.role,
      },
      { new: true }
    ).lean();

    // Send update notification
    const emailContent = emailTemplates.accountUpdate(user);
    await sendEmail({
      to: user.email,
      ...emailContent,
    });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Update user error:", error);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(userId) {
  try {
    await connectToDB();
    const user = await Profile.findByIdAndDelete(userId).lean();

    // Send deletion notification
    const emailContent = emailTemplates.accountDeletion(user);
    await sendEmail({
      to: user.email,
      ...emailContent,
    });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Delete user error:", error);
    throw new Error("Failed to delete user");
  }
}
// export async function fetchUsers() {
//   try {
//     await connectToDB();
//     const users = await Profile.find({}).sort({ createdAt: -1 }).lean();
//     return JSON.parse(JSON.stringify(users)); // Serialize the MongoDB objects
//   } catch (error) {
//     console.error("Fetch users error:", error);
//     throw new Error("Failed to fetch users");
//   }
// }

// export async function toggleUserStatus(userId) {
//   try {
//     await connectToDB();
//     const user = await Profile.findById(userId);
//     user.active = !user.active;
//     await user.save();

//     // Send status change notification
//     const emailContent = emailTemplates.statusChange(user);
//     await sendEmail({
//       to: user.email,
//       ...emailContent,
//     });

//     return JSON.parse(JSON.stringify(user));
//   } catch (error) {
//     console.error("Toggle status error:", error);
//     throw new Error("Failed to toggle user status");
//   }
// }

// export async function updateUserRole(userId, role) {
//   try {
//     await connectToDB();
//     const user = await Profile.findByIdAndUpdate(
//       userId,
//       { role },
//       { new: true }
//     ).lean();

//     // Send role change notification
//     const emailContent = emailTemplates.accountUpdate(user);
//     await sendEmail({
//       to: user.email,
//       ...emailContent,
//     });

//     return JSON.parse(JSON.stringify(user));
//   } catch (error) {
//     console.error("Update role error:", error);
//     throw new Error("Failed to update user role");
//   }
// }
// Admin Review Actions
export async function reviewPitchAction(pitchId, reviewData) {
  try {
    await connectToDB();

    const { status, feedback, reviewedBy } = reviewData;

    // Update pitch with review data
    const updatedPitch = await Pitch.findByIdAndUpdate(
      pitchId,
      {
        status,
        reviewDetails: {
          feedback,
          reviewedBy,
          reviewedAt: new Date(),
          history: {
            $push: {
              status,
              feedback,
              reviewedBy,
              timestamp: new Date(),
            },
          },
        },
      },
      { new: true }
    ).populate("creator");

    // Send email notification
    if (updatedPitch.creator.email) {
      // You'll need to implement your email service
      await sendPitchStatusEmail(
        updatedPitch.creator.email,
        status,
        feedback,
        updatedPitch.title
      );
    }

    revalidatePath("/admin/pitches");
    revalidatePath("/pitching/library");

    return {
      success: true,
      pitch: JSON.parse(JSON.stringify(updatedPitch)),
    };
  } catch (error) {
    console.error("Review pitch error:", error);
    return { success: false, error: error.message };
  }
}

// Fetch pending pitches for admin
export async function fetchPendingPitchesAction() {
  try {
    await connectToDB();

    const pitches = await Pitch.find({})
      .populate("creator")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      pitches: JSON.parse(JSON.stringify(pitches)),
    };
  } catch (error) {
    console.error("Fetch pending pitches error:", error);
    return { success: false, error: error.message };
  }
}

// Get pitch review history
export async function getPitchReviewHistoryAction(pitchId) {
  try {
    await connectToDB();

    const pitch = await Pitch.findById(pitchId)
      .select("reviewDetails status")
      .lean();

    return {
      success: true,
      history: pitch.reviewDetails?.history || [],
    };
  } catch (error) {
    console.error("Fetch review history error:", error);
    return { success: false, error: error.message };
  }
}

export async function checkPitchCompleteness(pitchId) {
  try {
    await connectToDB();
    const pitch = await Pitch.findById(pitchId);

    const sections = {
      basicInfo: {
        fields: ["title", "tagline", "description"],
        weight: 15,
      },
      companyDetails: {
        fields: ["companyName", "industry", "stage", "location"],
        weight: 15,
      },
      financials: {
        fields: [
          "funding.seeking",
          "funding.valuation",
          "funding.use_of_funds",
        ],
        weight: 20,
      },
      team: {
        fields: ["team"],
        weight: 15,
        arrayMinLength: 1,
      },
      media: {
        fields: ["media.pitchDeck", "media.video"],
        weight: 15,
      },
      market: {
        fields: ["targetMarket", "competitors"],
        weight: 10,
      },
      investmentTerms: {
        fields: ["investmentTerms.instrumentType", "investmentTerms.terms"],
        weight: 10,
      },
    };

    let completenessScore = 0;
    const sectionScores = {};

    for (const [section, config] of Object.entries(sections)) {
      let sectionScore = 0;
      const fieldsPresent = config.fields.filter((field) => {
        const value = field.split(".").reduce((obj, key) => obj?.[key], pitch);
        if (Array.isArray(value)) {
          return value.length >= (config.arrayMinLength || 0);
        }
        return value != null && value !== "";
      });

      sectionScore =
        (fieldsPresent.length / config.fields.length) * config.weight;
      completenessScore += sectionScore;
      sectionScores[section] = {
        score: sectionScore,
        maxScore: config.weight,
        completedFields: fieldsPresent,
        totalFields: config.fields.length,
      };
    }

    return {
      success: true,
      overallScore: Math.round(completenessScore),
      sectionScores,
      isComplete: completenessScore >= 80, // Consider 80% as complete
      recommendations: generateCompletionRecommendations(sectionScores),
    };
  } catch (error) {
    console.error("Completeness check error:", error);
    return { success: false, error: error.message };
  }
}

function generateCompletionRecommendations(sectionScores) {
  const recommendations = [];
  for (const [section, data] of Object.entries(sectionScores)) {
    if (data.score < data.maxScore) {
      recommendations.push({
        section,
        message: `Complete ${data.completedFields.length}/${data.totalFields} fields in ${section}`,
        priority: data.maxScore - data.score > 10 ? "high" : "medium",
      });
    }
  }
  return recommendations.sort((a, b) => (b.priority === "high" ? 1 : -1));
}

export async function batchReviewPitches(pitchIds, reviewData) {
  try {
    await connectToDB();

    const results = await Promise.all(
      pitchIds.map(async (pitchId) => {
        try {
          const { status, feedback, reviewedBy } = reviewData;

          const updatedPitch = await Pitch.findByIdAndUpdate(
            pitchId,
            {
              status,
              reviewDetails: {
                feedback,
                reviewedBy,
                reviewedAt: new Date(),
                $push: {
                  history: {
                    status,
                    feedback,
                    reviewedBy,
                    timestamp: new Date(),
                  },
                },
              },
            },
            { new: true }
          ).populate("creator");

          // Send email notification
          if (updatedPitch.creator.email) {
            await sendPitchStatusEmail(
              updatedPitch.creator.email,
              status,
              feedback,
              updatedPitch.title
            );
          }

          return {
            pitchId,
            success: true,
            pitch: updatedPitch,
          };
        } catch (error) {
          return {
            pitchId,
            success: false,
            error: error.message,
          };
        }
      })
    );

    revalidatePath("/admin/pitches");

    return {
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      },
    };
  } catch (error) {
    console.error("Batch review error:", error);
    return { success: false, error: error.message };
  }
}

export async function fetchPitchAnalyticsAction() {
  try {
    await connectToDB();

    const [
      basicStats,
      timelineData,
      conversionData,
      industryData,
      stageData,
      reviewScores,
    ] = await Promise.all([
      // Basic stats
      Promise.all([
        Pitch.countDocuments({}),
        Pitch.aggregate([
          { $group: { _id: null, totalFunding: { $sum: "$fundingRaised" } } },
        ]),
        Pitch.countDocuments({ status: "funded" }),
        Profile.countDocuments({ role: "investor" }),
      ]),

      // Timeline data (last 12 months)
      Pitch.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
            avgScore: { $avg: "$reviewDetails.criteria.overallScore" },
          },
        },
      ]),

      // Conversion funnel
      Pitch.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            avgViews: { $avg: "$metrics.views" },
            avgInterests: { $avg: "$metrics.interests" },
            avgMeetings: { $avg: "$metrics.meetings" },
          },
        },
      ]),

      // Industry distribution with success rates
      Pitch.aggregate([
        {
          $group: {
            _id: "$industry",
            total: { $sum: 1 },
            funded: { $sum: { $cond: [{ $eq: ["$status", "funded"] }, 1, 0] } },
            avgFunding: { $avg: "$fundingRaised" },
          },
        },
      ]),

      // Stage distribution with metrics
      Pitch.aggregate([
        {
          $group: {
            _id: "$stage",
            count: { $sum: 1 },
            avgValuation: { $avg: "$funding.valuation" },
            avgTimeToFund: {
              $avg: { $subtract: ["$statusTimestamps.funded", "$createdAt"],
            },
          },
        },
      }
      ]),

      // Review scores analysis
      Pitch.aggregate([
        {
          $group: {
            _id: null,
            avgBusinessModel: {
              $avg: "$reviewDetails.criteria.businessModel.score",
            },
            avgMarketPotential: {
              $avg: "$reviewDetails.criteria.marketPotential.score",
            },
            avgTeamCapability: {
              $avg: "$reviewDetails.criteria.teamCapability.score",
            },
            avgFinancialViability: {
              $avg: "$reviewDetails.criteria.financialViability.score",
            },
            avgCompetitiveAdvantage: {
              $avg: "$reviewDetails.criteria.competitiveAdvantage.score",
            },
          },
        },
      ]),
    ]);

    return {
      success: true,
      analytics: {
        overview: {
          totalPitches: basicStats[0],
          totalFunding: basicStats[1][0]?.totalFunding || 0,
          successfulFunding: basicStats[2],
          totalInvestors: basicStats[3],
        },
        timeline: timelineData,
        conversion: conversionData,
        industries: industryData,
        stages: stageData,
        reviewScores: reviewScores[0],
      },
    };
  } catch (error) {
    console.error("Analytics error:", error);
    return { success: false, error: error.message };
  }
}

export async function calculatePitchScore(pitchId, reviewData) {
  try {
    const weights = {
      businessModel: 0.25,
      marketPotential: 0.25,
      teamCapability: 0.2,
      financialViability: 0.15,
      competitiveAdvantage: 0.15,
    };

    const scores = {};
    let overallScore = 0;

    // Calculate weighted scores for each criteria
    for (const [criteria, weight] of Object.entries(weights)) {
      const score = reviewData[criteria]?.score || 0;
      scores[criteria] = {
        score,
        weightedScore: score * weight,
        feedback: reviewData[criteria]?.feedback || "",
      };
      overallScore += score * weight;
    }

    // Add bonus points for completeness and documentation
    const pitch = await Pitch.findById(pitchId);
    const completenessCheck = await checkPitchCompleteness(pitchId);

    if (completenessCheck.overallScore > 90) overallScore += 5;
    if (pitch.media?.pitchDeck) overallScore += 2;
    if (pitch.media?.video) overallScore += 2;
    if (pitch.financials?.currentRevenue > 0) overallScore += 1;

    return {
      success: true,
      scores,
      overallScore: Math.round(overallScore),
      recommendations: generateScoringRecommendations(scores),
    };
  } catch (error) {
    console.error("Score calculation error:", error);
    return { success: false, error: error.message };
  }
}

// Create investment
export async function createInvestmentAction(data) {
  try {
    await connectToDB();

    // Validate the pitch exists and is still accepting investments
    const pitch = await Pitch.findById(data.pitchId);
    if (!pitch) {
      return { success: false, error: "Pitch not found" };
    }

    // Validate funding round constraints
    const currentRound = pitch.fundingDetails.currentRound;
    if (data.amount < currentRound.minimumTicket || data.amount > currentRound.maximumTicket) {
      return { 
        success: false, 
        error: `Investment amount must be between ${currentRound.minimumTicket} and ${currentRound.maximumTicket}` 
      };
    }

    if (currentRound.currentAmount >= currentRound.targetAmount) {
      return { success: false, error: "Funding round is fully subscribed" };
    }

    // Create the investment record
    const investment = new Investment({
      pitchId: data.pitchId,
      investorId: data.investorId,
      amount: data.amount,
      investmentType: data.investmentType,
      investmentStructure: data.investmentStructure,
      paymentMethod: data.paymentMethod,
      status: "pending",
      
      // Investment Strategy
      investmentThesis: data.investmentThesis,
      expectedHoldingPeriod: data.expectedHoldingPeriod,
      exitStrategy: data.exitStrategy,
      valueAddProposal: data.valueAddProposal,

      // Risk Assessment
      riskTolerance: data.riskTolerance,
      keyRiskFactors: data.keyRiskFactors,
      mitigationStrategies: data.mitigationStrategies,

      // Due Diligence
      dueDiligence: data.dueDiligence,

      // Investor Profile
      investorProfile: data.investorProfile,

      // Terms and Additional Info
      terms: data.terms,
      additionalRequests: data.additionalRequests,
      boardSeatInterest: data.boardSeatInterest,
      strategicPartnership: data.strategicPartnership,

      // Compliance
      sourceOfFunds: data.sourceOfFunds,
      kycCompleted: data.kycCompleted,
      kycDocuments: data.kycDocuments,
      accreditationVerified: data.accreditationVerified,

      // Timestamps
      submittedAt: new Date(),
      updatedAt: new Date()
    });

    await investment.save();

    // Create investment record for pitch
    const investmentRecord = {
      investmentId: investment._id,
      investorId: data.investorId,
      amount: data.amount,
      investmentType: data.investmentType,
      investmentStructure: data.investmentStructure,
      paymentMethod: data.paymentMethod,
      status: "pending",
      
      // Copy all fields from the investment
      investmentThesis: data.investmentThesis,
      expectedHoldingPeriod: data.expectedHoldingPeriod,
      exitStrategy: data.exitStrategy,
      valueAddProposal: data.valueAddProposal,
      riskTolerance: data.riskTolerance,
      keyRiskFactors: data.keyRiskFactors,
      mitigationStrategies: data.mitigationStrategies,
      dueDiligence: data.dueDiligence,
      investorProfile: data.investorProfile,
      terms: data.terms,
      additionalRequests: data.additionalRequests,
      boardSeatInterest: data.boardSeatInterest,
      strategicPartnership: data.strategicPartnership,
      sourceOfFunds: data.sourceOfFunds,
      kycCompleted: data.kycCompleted,
      kycDocuments: data.kycDocuments,
      accreditationVerified: data.accreditationVerified,
      submittedAt: new Date(),
      updatedAt: new Date()
    };

    // Update pitch with new investment
    await Pitch.findByIdAndUpdate(data.pitchId, {
      $push: { investments: investmentRecord },
      $inc: {
        'fundingDetails.currentRound.currentAmount': data.amount,
        'fundingDetails.numberOfInvestors': 1
      },
      $set: {
        'fundingDetails.metrics': await calculateUpdatedMetrics(pitch, data.amount)
      }
    });

    // Send notifications
    await sendInvestmentNotifications(investment, pitch);

    return {
      success: true,
      investment: JSON.parse(JSON.stringify(investment))
    };

  } catch (error) {
    console.error("Create investment error:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to calculate updated metrics
async function calculateUpdatedMetrics(pitch, newAmount) {
  const investments = pitch.investments || [];
  const allAmounts = [...investments.map(inv => inv.amount), newAmount];
  
  const totalEquity = investments.reduce((sum, inv) => 
    sum + (inv.investmentType === "equity" ? (inv.equity || 0) : 0), 0);

  return {
    averageInvestmentSize: allAmounts.reduce((a, b) => a + b, 0) / allAmounts.length,
    largestInvestment: Math.max(...allAmounts),
    smallestInvestment: Math.min(...allAmounts),
    averageEquityPerInvestor: totalEquity / (investments.length + 1),
    totalEquityAllocated: totalEquity,
    remainingEquity: 100 - totalEquity // Assuming total equity is 100%
  };
}

// Add action to fetch investments for a pitch
export async function fetchPitchInvestmentsAction(pitchId) {
  try {
    await connectToDB();

    const investments = await Investment.find({ pitchId })
      .sort({ submittedAt: -1 })
      .lean();

    return {
      success: true,
      investments: JSON.parse(JSON.stringify(investments)),
    };
  } catch (error) {
    console.error("Fetch investments error:", error);
    return { success: false, error: error.message };
  }
}

export async function  fetchInvestorInvestments(){
try{} catch(error){
  
}
}

// Fetch investor's investments
export async function fetchInvestorPortfolioAction(investorId) {
  try {
    await connectToDB();

    const investments = await Investment.find({
      investorId,
      status: { $in: ["completed", "pending"] },
    })
      .populate({
        path: "pitchId",
        select:
          "title industry fundingGoal fundingRaised status metrics valuation",
      })
      .sort({ submittedAt: -1 })
      .lean();

    const portfolioMetrics = {
      totalInvested: 0,
      totalPending: 0,
      activeInvestments: 0,
      avgInvestmentSize: 0,
      sectorDistribution: {},
      returns: 0,
    };

    investments.forEach((inv) => {
      if (inv.status === "completed") {
        portfolioMetrics.totalInvested += inv.amount;
        portfolioMetrics.activeInvestments++;
        portfolioMetrics.sectorDistribution[inv.pitchId.industry] =
          (portfolioMetrics.sectorDistribution[inv.pitchId.industry] || 0) +
          inv.amount;
      } else if (inv.status === "pending") {
        portfolioMetrics.totalPending += inv.amount;
      }
    });

    portfolioMetrics.avgInvestmentSize =
      portfolioMetrics.activeInvestments > 0
        ? portfolioMetrics.totalInvested / portfolioMetrics.activeInvestments
        : 0;

    return {
      success: true,
      investments,
      metrics: portfolioMetrics,
    };
  } catch (error) {
    console.error("Fetch portfolio error:", error);
    return { success: false, error: error.message };
  }
}

// Fetch investment opportunities
export async function fetchInvestmentOpportunitiesAction(filters = {}) {
  try {
    await connectToDB();

    // Build query based on filters
    let query = {};

    if (filters.industry) {
      query.industry = filters.industry;
    }

    if (filters.stage) {
      query.stage = filters.stage;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { shortDescription: { $regex: filters.search, $options: "i" } },
      ];
    }

    const opportunities = await Pitch.find(query)
      .populate("creator", "name company profileImage")
      .lean();

    // Calculate stats from the opportunities
    const stats = {
      totalFunding: opportunities.reduce(
        (sum, pitch) => sum + (pitch.fundingGoal || 0),
        0
      ),
      avgEquity:
        opportunities.length > 0
          ? opportunities.reduce((sum, pitch) => sum + (pitch.equity || 0), 0) /
            opportunities.length
          : 0,
      avgValuation:
        opportunities.length > 0
          ? opportunities.reduce(
              (sum, pitch) => sum + (pitch.valuation || 0),
              0
            ) / opportunities.length
          : 0,
    };

    // Process the opportunities to ensure all fields have default values
    const processedOpportunities = opportunities.map((pitch) => ({
      _id: pitch._id.toString(),
      title: pitch.title || "",
      shortDescription: pitch.shortDescription || "",
      industry: pitch.industry || "Uncategorized",
      stage: pitch.stage || "Seed",
      fundingGoal: pitch.fundingGoal || 0,
      equity: pitch.equity || 0,
      raised: pitch.fundingRaised || 0,
      traction: pitch.traction || 0,
      coverImage: pitch.coverImage || "",
      creator: {
        name: pitch.creator?.name || "Anonymous",
        company: pitch.creator?.company || "",
        image: pitch.creator?.profileImage || "",
      },
    }));

    return {
      success: true,
      opportunities: processedOpportunities,
      stats,
    };
  } catch (error) {
    console.error("Fetch investment opportunities error:", error);
    return {
      success: false,
      error: error.message,
      opportunities: [],
      stats: {
        totalFunding: 0,
        avgEquity: 0,
        avgValuation: 0,
      },
    };
  }
}

// Update investment status
export async function updateInvestmentStatusAction(
  investmentId,
  status,
  notes
) {
  try {
    await connectToDB();

    const investment = await Investment.findById(investmentId);
    if (!investment) {
      return { success: false, error: "Investment not found" };
    }

    const updatedInvestment = await Investment.findByIdAndUpdate(
      investmentId,
      {
        status,
        ...(status === "completed" && { completedAt: new Date() }),
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            notes,
          },
        },
      },
      { new: true }
    ).populate("pitchId");

    // If investment is completed, update pitch metrics
    if (status === "completed") {
      await Pitch.findByIdAndUpdate(investment.pitchId, {
        $inc: { fundingRaised: investment.amount }
      });
    }

    // Send notifications based on status change
    await sendEmail({
      to: investment.investorId.email,
      subject: "Investment Completed Successfully",
      html: emailTemplates.investmentSuccess({
        pitchTitle: investment.pitchId.title,
        amount: investment.amount
      })
    });

    return { success: true, investment: updatedInvestment };
  } catch (error) {
    console.error("Update investment status error:", error);
    return { success: false, error: error.message };
  }
}

// Fetch investment analytics
export async function fetchInvestmentAnalyticsAction(investorId) {
  try {
    await connectToDB();

    const [portfolioMetrics, growthData, sectorReturns, roiData] =
      await Promise.all([
        // Portfolio Overview Metrics
        Investment.aggregate([
          { $match: { investorId, status: "completed" } },
          {
            $group: {
              _id: null,
              totalInvested: { $sum: "$amount" },
              totalDeals: { $sum: 1 },
              avgDealSize: { $avg: "$amount" },
              totalEquityHeld: { $sum: "$equityPercentage" },
            },
          },
        ]),

        // Investment Growth Over Time
        Investment.aggregate([
          { $match: { investorId } },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              investedAmount: { $sum: "$amount" },
              dealCount: { $sum: 1 },
              returns: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "completed"] },
                    "$currentValue",
                    "$amount",
                  ],
                },
              },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),

        // Returns by Sector
        Investment.aggregate([
          { $match: { investorId } },
          {
            $lookup: {
              from: "pitches",
              localField: "pitchId",
              foreignField: "_id",
              as: "pitch",
            },
          },
          { $unwind: "$pitch" },
          {
            $group: {
              _id: "$pitch.industry",
              totalInvested: { $sum: "$amount" },
              currentValue: { $sum: "$currentValue" },
              dealCount: { $sum: 1 },
              avgReturn: {
                $avg: {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ["$currentValue", "$amount"] },
                        "$amount",
                      ],
                    },
                    100,
                  ],
                },
              },
            },
          },
        ]),

        // ROI Timeline
        Investment.aggregate([
          { $match: { investorId, status: "completed" } },
          {
            $group: {
              _id: {
                month: { $month: "$exitDate" },
                year: { $year: "$exitDate" },
              },
              totalReturn: {
                $sum: { $subtract: ["$exitValue", "$amount"] },
              },
              dealCount: { $sum: 1 },
              avgROI: {
                $avg: {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ["$exitValue", "$amount"] },
                        "$amount",
                      ],
                    },
                    100,
                  ],
                },
              },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
      ]);

    const analytics = {
      totalInvested: portfolioMetrics[0]?.totalInvested || 0,
      activeInvestments: portfolioMetrics[0]?.totalDeals || 0,
      totalReturns: portfolioMetrics[0]?.returns || 0,
      portfolioDistribution: [
        { _id: "Technology", total: 25000 },
        { _id: "Healthcare", total: 15000 },
        // ... other sectors
      ],
      growthData: growthData.map((data) => ({
        date: `${data._id.year}-${data._id.month}`,
        invested: data.investedAmount,
        deals: data.dealCount,
        returns: data.returns,
        netGrowth: data.returns - data.investedAmount,
      })),
      sectorReturns: sectorReturns.map((sector) => ({
        industry: sector._id,
        invested: sector.totalInvested,
        currentValue: sector.currentValue,
        deals: sector.dealCount,
        returnRate: sector.avgReturn,
        performance:
          (sector.currentValue - sector.totalInvested) / sector.totalInvested,
      })),
      roiTimeline: roiData.map((roi) => ({
        date: `${roi._id.year}-${roi._id.month}`,
        totalReturn: roi.totalReturn,
        deals: roi.dealCount,
        averageROI: roi.avgROI,
      })),
    };

    return { success: true, analytics };
  } catch (error) {
    console.error("Fetch investment analytics error:", error);
    return { success: false, error: error.message };
  }
}

// Market Data Action with comprehensive data
export async function fetchMarketDataAction() {
  try {
    await connectToDB();

    const [trendData, sectorData, opportunityData] = await Promise.all([
      // Market Trends Analysis
      Pitch.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
              industry: "$industry",
            },
            avgValuation: { $avg: "$fundingGoal" },
            totalFunding: { $sum: "$fundingRaised" },
            dealCount: { $sum: 1 },
            avgEquity: { $avg: "$equity" },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
      ]),

      // Sector Analysis
      Pitch.aggregate([
        {
          $group: {
            _id: "$industry",
            totalDeals: { $sum: 1 },
            avgDealSize: { $avg: "$fundingGoal" },
            totalInvestment: { $sum: "$fundingRaised" },
            successRate: {
              $avg: { $cond: [{ $eq: ["$status", "funded"] }, 1, 0] },
            },
            avgTimeToFund: {
              $avg: {
                $subtract: ["$statusTimestamps.funded", "$createdAt"],
              },
            },
            growthRate: {
              $avg: "$metrics.monthlyGrowth",
            },
          },
        },
      ]),

      // Investment Opportunities Analysis
      Pitch.aggregate([
        { $match: { status: "active" } },
        {
          $group: {
            _id: "$stage",
            opportunities: { $sum: 1 },
            totalFundingNeeded: { $sum: "$fundingGoal" },
            avgEquityOffered: { $avg: "$equity" },
            industries: { $addToSet: "$industry" },
            avgValuation: { $avg: "$valuation" },
            riskProfile: {
              $avg: "$metrics.riskScore",
            },
          },
        },
      ]),
    ]);

    const marketData = {
      trends: trendData.map((trend) => ({
        date: `${trend._id.year}-${trend._id.month}`,
        industry: trend._id.industry,
        avgValuation: trend.avgValuation,
        totalFunding: trend.totalFunding,
        dealCount: trend.dealCount,
        avgEquity: trend.avgEquity,
      })),

      sectorAnalysis: sectorData.map((sector) => ({
        industry: sector._id,
        metrics: {
          totalDeals: sector.totalDeals,
          avgDealSize: sector.avgDealSize,
          totalInvestment: sector.totalInvestment,
          successRate: sector.successRate * 100,
          avgTimeToFund: sector.avgTimeToFund
            ? Math.round(sector.avgTimeToFund / (1000 * 60 * 60 * 24)) // Convert to days
            : null,
          growthRate: sector.growthRate,
        },
      })),

      opportunities: opportunityData.map((opp) => ({
        stage: opp._id,
        count: opp.opportunities,
        totalFunding: opp.totalFundingNeeded,
        avgEquity: opp.avgEquityOffered,
        industries: opp.industries,
        avgValuation: opp.avgValuation,
        riskProfile: opp.riskProfile,
      })),
    };

    return { success: true, marketData };
  } catch (error) {
    console.error("Fetch market data error:", error);
    return { success: false, error: error.message };
  }
}

// Update your existing analytics action to include more data

export async function fetchPitchDetailsAction(pitchId) {
  try {
    await connectToDB();

    const pitch = await Pitch.findById(pitchId)
      .populate("creator", "name company profileImage")
      .lean();

    if (!pitch) {
      return { success: false, error: "Pitch not found" };
    }

    // Process the traction data
    const processedTraction = pitch.traction
      ? typeof pitch.traction === "object"
        ? {
            metrics: pitch.traction.metrics || "",
            milestones: pitch.traction.milestones || "",
            customers: pitch.traction.customers || "",
          }
        : pitch.traction
      : "";

    const processedPitch = {
      ...pitch,
      _id: pitch._id.toString(),
      traction: processedTraction,
      fundingRaised: pitch.fundingRaised || 0,
      equity: pitch.equity || 0,
      metrics: {
        views: pitch.metrics?.views || 0,
        interests: pitch.metrics?.interests || 0,
        meetings: pitch.metrics?.meetings || 0,
      },
      creator: {
        name: pitch.creator?.name || "Anonymous",
        company: pitch.creator?.company || "",
        image: pitch.creator?.profileImage || "",
      },
      investments: pitch.investments || [],
      team: pitch.team || [],
      documents: pitch.documents || [],
      financials: pitch.financials || {},
      media: pitch.media || {},
    };

    return {
      success: true,
      pitch: JSON.parse(JSON.stringify(processedPitch)),
    };
  } catch (error) {
    console.error("Fetch pitch details error:", error);
    return { success: false, error: error.message };
  }
}

export async function fetchPitchInvestmentMetricsAction(pitchId) {
  try {
    await connectToDB();

    const [investments, metrics] = await Promise.all([
      Investment.find({
        pitchId,
        status: { $in: ["completed", "pending"] },
      })
        .populate("investorId", "name profileImage")
        .sort({ amount: -1 })
        .limit(5)
        .lean(),

      Investment.aggregate([
        { $match: { pitchId: new mongoose.Types.ObjectId(pitchId) } },
        {
          $group: {
            _id: "$status",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
            avgAmount: { $avg: "$amount" },
          },
        },
        {
          $group: {
            _id: null,
            statuses: {
              $push: {
                status: "$_id",
                totalAmount: "$totalAmount",
                count: "$count",
                avgAmount: "$avgAmount",
              },
            },
            totalInvestments: { $sum: "$count" },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    return {
      success: true,
      topInvestments: investments,
      metrics: metrics[0] || {
        statuses: [],
        totalInvestments: 0,
        totalAmount: 0,
      },
    };
  } catch (error) {
    console.error("Fetch investment metrics error:", error);
    return { success: false, error: error.message };
  }
}

// Create investment payment session
export async function createInvestmentPaymentSession(investmentId) {
  try {
    await connectToDB();
    
    const investment = await Investment.findById(investmentId)
      .populate('pitchId')
      .populate('investorId');
    
    if (!investment) {
      throw new Error("Investment not found");
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Investment in ${investment.pitchId.title}`,
              description: `${investment.investmentType} investment`,
            },
            unit_amount: investment.amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/investment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/investment/cancel`,
      metadata: {
        investmentId: investment._id.toString(),
        pitchId: investment.pitchId._id.toString(),
        investorId: investment.investorId._id.toString(),
      },
    });

    // Update investment with session ID
    await Investment.findByIdAndUpdate(investmentId, {
      'paymentDetails.stripeSessionId': session.id,
      status: 'payment_processing'
    });

    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error("Create payment session error:", error);
    return { success: false, error: error.message };
  }
}

// Handle successful payment webhook
export async function handleInvestmentPaymentWebhook(event) {
  try {
    const session = event.data.object;
    const investmentId = session.metadata.investmentId;

    await connectToDB();

    const investment = await Investment.findById(investmentId);
    if (!investment) {
      throw new Error("Investment not found");
    }

    // Update investment status
    investment.status = 'completed';
    investment.paymentDetails = {
      paymentStatus: 'completed',
      paymentDate: new Date(),
      transactionId: session.payment_intent
    };
    await investment.save();

    // Update pitch funding raised
    await Pitch.findByIdAndUpdate(investment.pitchId, {
      $inc: { fundingRaised: investment.amount }
    });

    // Send notifications
    await sendEmail({
      to: investment.investorId.email,
      subject: "Investment Completed Successfully",
      html: emailTemplates.investmentSuccess({
        pitchTitle: investment.pitchId.title,
        amount: investment.amount
      })
    });

    return { success: true };
  } catch (error) {
    console.error("Payment webhook error:", error);
    return { success: false, error: error.message };
  }
}

// Review investment by pitcher
export async function reviewInvestmentAction(investmentId, reviewData) {
  try {
    await connectToDB();

    const { status, feedback } = reviewData;
    const newStatus = status === 'approved' ? 'admin_review' : 'pitcher_rejected';

    // Update the investment within the pitch
    const updatedPitch = await Pitch.findOneAndUpdate(
      { 'investments._id': investmentId },
      { 
        $set: {
          'investments.$.status': newStatus,
          'investments.$.reviewedAt': new Date()
        },
        $push: {
          'investments.$.reviewNotes': {
            reviewer: 'pitcher',
            note: feedback,
            status: newStatus,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).lean();

    if (!updatedPitch) {
      throw new Error('Investment not found');
    }

    // Find the updated investment
    const updatedInvestment = updatedPitch.investments.find(
      inv => inv._id.toString() === investmentId
    );

    // Send notification email to investor if needed
    if (updatedInvestment?.investorProfile?.email) {
      await sendEmail({
        to: updatedInvestment.investorProfile.email,
        template: emailTemplates.INVESTMENT_REVIEW,
        data: {
          status: newStatus,
          notes: feedback,
          pitchTitle: updatedPitch.title
        }
      });
    }

    revalidatePath('/pitching/investments');
    revalidatePath(`/pitching/investments/${investmentId}`);

    return {
      success: true,
      investment: {
        ...updatedInvestment,
        pitchTitle: updatedPitch.title,
        pitchIndustry: updatedPitch.industry
      }
    };

  } catch (error) {
    console.error("Review investment error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Admin review of investment

export async function adminReviewInvestmentAction(pitchId, investmentId, { status, feedback }) {
  try {
    await connectToDB();

    // Update investment status within the pitch
    const pitch = await Pitch.findOneAndUpdate(
      { 
        _id: pitchId,
        'investments._id': investmentId 
      },
      { 
        $set: { 
          'investments.$.status': 'payment_pending',
          'investments.$.reviewNotes': feedback,
          'investments.$.reviewedAt': new Date()
        } 
      },
      { new: true }
    );

    const investment = pitch.investments.find(inv => inv._id.toString() === investmentId);

    if (!investment) {
      throw new Error('Investment not found');
    }

    // Create detailed notification
    await Notification.create({
      userId: investment.investorId, // Clerk user ID is now accepted as string
      title: 'Investment Approved - Payment Required',
      message: `
Dear Investor,

Your investment application for "${pitch.title}" has been approved! 

${feedback ? `Admin Feedback: ${feedback}

` : ''}
Next Steps:
1. Please proceed with the payment of $${investment.amount.toLocaleString()}
2. Use the payment method you selected (${investment.paymentMethod})
3. Once payment is confirmed, your investment will be finalized

Important Details:
- Investment Amount: $${investment.amount.toLocaleString()}
- Investment Type: ${investment.investmentType}
- Payment Method: ${investment.paymentMethod}

If you have any questions about the payment process, please don't hesitate to contact our support team.

Click below to proceed with payment.
      `,
      type: 'investment',
      link: `/dashboard/investments/${pitchId}/${investmentId}/payment`,
      priority: 'high'
    });

    return {
      success: true,
      message: 'Investment reviewed successfully'
    };

  } catch (error) {
    console.error("Review investment error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
// Investment notification function
async function sendInvestmentNotifications(investment, pitch) {
  try {
    // Get the pitcher and investor profiles
    const [pitcherProfile, investorProfile] = await Promise.all([
      Profile.findOne({ userId: pitch.creator }),
      Profile.findOne({ userId: investment.investorId })
    ]);

    // Prepare notification data
    const notificationData = {
      pitchTitle: pitch.title,
      amount: investment.amount,
      investmentType: investment.investmentType,
      investorName: investorProfile?.name || 'Anonymous Investor',
      pitcherName: pitcherProfile?.name || 'Pitch Owner'
    };

    // Send email notifications
    await Promise.all([
      // Notify pitcher about new investment
      sendEmail({
        to: pitcherProfile?.email,
        subject: "New Investment Request Received",
        html: emailTemplates.newInvestmentPitcher({
          ...notificationData,
          reviewLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/investments/${investment._id}`
        })
      }),

      // Confirm receipt to investor
      sendEmail({
        to: investorProfile?.email,
        subject: "Investment Request Submitted Successfully",
        html: emailTemplates.newInvestmentInvestor({
          ...notificationData,
          trackingLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/my-investments/${investment._id}`
        })
      }),

      // Notify admins
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Investment Request Requires Review",
        html: emailTemplates.newInvestmentAdmin({
          ...notificationData,
          adminReviewLink: `${process.env.NEXT_PUBLIC_APP_URL}/admin/investments/${investment._id}`
        })
      })
    ]);

    // Create in-app notifications
    await Promise.all([
      // Notification for pitcher
      createNotification({
        userId: pitch.creator,
        type: 'new_investment',
        title: 'New Investment Request',
        message: `${notificationData.investorName} has requested to invest ${investment.amount} in ${pitch.title}`,
        link: `/dashboard/investments/${investment._id}`,
        metadata: {
          investmentId: investment._id,
          pitchId: pitch._id,
          amount: investment.amount
        }
      }),

      // Notification for investor
      createNotification({
        userId: investment.investorId,
        type: 'investment_submitted',
        title: 'Investment Request Submitted',
        message: `Your investment request for ${pitch.title} has been submitted for review`,
        link: `/dashboard/my-investments/${investment._id}`,
        metadata: {
          investmentId: investment._id,
          pitchId: pitch._id,
          amount: investment.amount
        }
      }),

      // Notification for admins
      createNotification({
        userId: 'admin', // Assuming you have a way to identify admin users
        type: 'investment_review',
        title: 'New Investment Requires Review',
        message: `New investment request for ${pitch.title} requires admin review`,
        link: `/admin/investments/${investment._id}`,
        metadata: {
          investmentId: investment._id,
          pitchId: pitch._id,
          amount: investment.amount,
          investorId: investment.investorId
        }
      })
    ]);

    // Optional: Send push notifications if implemented
    if (process.env.ENABLE_PUSH_NOTIFICATIONS === 'true') {
      await Promise.all([
        sendPushNotification({
          userId: pitch.creator,
          title: 'New Investment Request',
          body: `${notificationData.investorName} wants to invest in ${pitch.title}`,
          data: {
            type: 'new_investment',
            investmentId: investment._id.toString()
          }
        }),
        sendPushNotification({
          userId: investment.investorId,
          title: 'Investment Request Submitted',
          body: `Your investment request for ${pitch.title} is under review`,
          data: {
            type: 'investment_submitted',
            investmentId: investment._id.toString()
          }
        })
      ]);
    }

    // Log the notification activity
    await logNotificationActivity({
      type: 'investment_notification',
      investment: investment._id,
      pitch: pitch._id,
      recipients: [pitch.creator, investment.investorId, 'admin'],
      status: 'sent',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error sending investment notifications:', error);
    // Don't throw the error - we don't want to fail the investment creation
    // just because notifications failed
    await logNotificationError({
      error: error.message,
      investment: investment._id,
      pitch: pitch._id,
      timestamp: new Date()
    });
  }
}

// Helper function to create notifications
async function createNotification(data) {
  try {
    const notification = new Notification({
      ...data,
      createdAt: new Date(),
      read: false
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Helper function to log notification activities
async function logNotificationActivity(data) {
  try {
    const log = new NotificationLog(data);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error logging notification activity:', error);
  }
}

// Helper function to log notification errors
async function logNotificationError(data) {
  try {
    const error = new NotificationError(data);
    await error.save();
    return error;
  } catch (err) {
    console.error('Error logging notification error:', err);
  }
}

// Fetch comprehensive pitcher dashboard data
export async function fetchPitcherDashboardDataAction(userId) {
  try {
    await connectToDB();

    const profile = await Profile.findOne({ userId: userId }).lean();
    
    if (!profile) {
      return { 
        success: false, 
        error: "Profile not found" 
      };
    }

    // Get all pitches by the user with lean() to get plain objects
    const pitches = await Pitch.find({ creator: profile._id }).lean();
    
    // Get all applications with meetings
    const pitchIds = pitches.map(pitch => pitch._id);
    const applications = await Investment.find({
      pitchID: { $in: pitchIds },
    })
    .populate("investorID")
    .lean();

    // Calculate statistics
    const stats = {
      totalPitches: pitches.length,
      activePitches: pitches.filter(pitch => pitch.status === "active").length,
      pendingPitches: pitches.filter(pitch => pitch.status === "pending").length,
      totalViews: pitches.reduce((sum, pitch) => sum + (pitch.views || 0), 0),
      interestedInvestors: applications.length,
      successRate: applications.length ? 
        Math.round((applications.filter(app => ["accepted", "funded"].includes(app.status)).length / applications.length) * 100) : 0
    };

    // Format recent activities safely
    const recentActivities = applications
      .map(app => {
        const relatedPitch = pitches.find(p => p._id.toString() === app.pitchID.toString());
        return {
          type: 'application',
          date: app.createdAt ? new Date(app.createdAt).toISOString() : null,
          title: 'New Application',
          description: `${app.investorID?.name || 'An investor'} applied to ${relatedPitch?.title || 'a pitch'}`,
        };
      })
      .filter(activity => activity.date) // Filter out activities with invalid dates
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Safely format pitches
    const formattedPitches = pitches.map(pitch => ({
      _id: pitch._id.toString(),
      title: pitch.title || '',
      tagline: pitch.tagline || '',
      status: pitch.status || '',
      views: pitch.metrics?.views || 0,
      industry: pitch.industry || '',
      createdAt: pitch.createdAt ? new Date(pitch.createdAt).toISOString() : null,
      targetMarket: pitch.targetMarket || '',
      traction: pitch.traction || '',
      team: pitch.team || [],
      businessModel: pitch.businessModel || '',
      boardMembers: pitch.boardMembers || [],
      companyDetails: pitch.companyDetails || {},
      advisors: pitch.advisors || [],
      revenueStreams: pitch.revenueStreams || [],
      costStructure: pitch.costStructure || {},
      feedback: pitch.feedback || [],
      metrics: pitch.metrics || {},
      channels: pitch.channels || [],
      partnerships: pitch.partnerships || [],
      financials: pitch.financials || {},
      funding: pitch.funding || {},
      investments: pitch.investments || [],
      media: pitch.media || [],
      investmentTerms: pitch.investmentTerms || {}
    }));

    // Safely format applications
    const formattedApplications = applications.map(app => ({
      _id: app._id.toString(),
      pitchID: {
        _id: app.pitchID.toString(),
        title: pitches.find(p => p._id.toString() === app.pitchID.toString())?.title || ''
      },
      status: app.status || '',
      feedback: app.feedback || '',
      meetingDate: app.meetingDate ? new Date(app.meetingDate).toISOString() : null,
      createdAt: app.createdAt ? new Date(app.createdAt).toISOString() : null,
      investorID: {
        _id: app.investorID?._id.toString() || '',
        name: app.investorID?.name || "Unknown Investor",
        company: app.investorID?.company || ''
      }
    }));

    const response = {
      success: true,
      stats,
      pitches: formattedPitches,
      activities: recentActivities,
      applications: formattedApplications,
      investmentTrends: {
        monthlyData: Array(12).fill(0),
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      investorDistribution: {
        distribution: [0, 0, 0, 0],
        labels: ['Angel Investors', 'VCs', 'Strategic', 'Others']
      }
    };

    // Return the safely formatted data
    return response;

  } catch (error) {
    console.error("Fetch pitcher dashboard error:", error);
    return { 
      success: false, 
      error: error.message,
      stats: {
        totalPitches: 0,
        activePitches: 0,
        pendingPitches: 0,
        totalViews: 0,
        interestedInvestors: 0,
        successRate: 0,
      },
      pitches: [],
      activities: [],
      applications: [],
      investmentTrends: {
        monthlyData: Array(12).fill(0),
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      investorDistribution: {
        distribution: [0, 0, 0, 0],
        labels: ['Angel Investors', 'VCs', 'Strategic', 'Others']
      }
    };
  }
}

// Fetch detailed investment data for a specific pitch
export async function fetchPitchInvestmentDetailsAction(pitchId) {
  try {
    await connectToDB();

    const pitch = await Pitch.findById(pitchId)
      .select('title fundingDetails investments currentRound')
      .lean();

    if (!pitch) {
      return { success: false, error: "Pitch not found" };
    }

    // Get all investments for this pitch
    const investments = await Investment.find({ pitchId })
      .populate('investorId', 'name email investorProfile')
      .sort({ submittedAt: -1 })
      .lean();

    // Calculate investment metrics for this pitch
    const metrics = {
      totalInvestors: investments.length,
      totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
      averageInvestment: investments.length > 0 
        ? investments.reduce((sum, inv) => sum + inv.amount, 0) / investments.length 
        : 0,
      remainingToGoal: pitch.fundingDetails.currentRound.targetAmount - 
        pitch.fundingDetails.currentRound.currentAmount,
      percentageRaised: (pitch.fundingDetails.currentRound.currentAmount / 
        pitch.fundingDetails.currentRound.targetAmount) * 100
    };

    // Group investments by status
    const investmentsByStatus = investments.reduce((acc, inv) => {
      acc[inv.status] = acc[inv.status] || [];
      acc[inv.status].push(inv);
      return acc;
    }, {});

    return {
      success: true,
      pitch: JSON.parse(JSON.stringify(pitch)),
      metrics,
      investments: investmentsByStatus
    };
  } catch (error) {
    console.error("Fetch pitch investment details error:", error);
    return { success: false, error: error.message };
  }
}

// Fetch investor activity for a specific pitch
export async function fetchPitchInvestorActivityAction(pitchId) {
  try {
    await connectToDB();

    const recentActivity = await Investment.find({ pitchId })
      .populate('investorId', 'name email investorProfile')
      .sort({ submittedAt: -1 })
      .limit(10)
      .lean();

    // Group by date for activity timeline
    const activityByDate = recentActivity.reduce((acc, activity) => {
      const date = new Date(activity.submittedAt).toISOString().split('T')[0];
      acc[date] = acc[date] || [];
      acc[date].push(activity);
      return acc;
    }, {});

    return {
      success: true,
      recentActivity: JSON.parse(JSON.stringify(activityByDate))
    };
  } catch (error) {
    console.error("Fetch pitch investor activity error:", error);
    return { success: false, error: error.message };
  }
}

// Fetch funding round details for a specific pitch
export async function fetchPitchFundingRoundDetailsAction(pitchId) {
  try {
    await connectToDB();

    const pitch = await Pitch.findById(pitchId)
      .select('fundingDetails currentRound')
      .lean();

    if (!pitch) {
      return { success: false, error: "Pitch not found" };
    }

    // Calculate round-specific metrics
    const currentRound = pitch.fundingDetails.currentRound;
    const roundMetrics = {
      roundProgress: (currentRound.currentAmount / currentRound.targetAmount) * 100,
      remainingDays: currentRound.endDate 
        ? Math.ceil((new Date(currentRound.endDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null,
      averageTicketSize: currentRound.currentAmount / 
        (pitch.fundingDetails.numberOfInvestors || 1),
      availableEquity: currentRound.availableEquity
    };

    // Get milestones progress
    const milestonesProgress = currentRound.keyMilestones.map(milestone => ({
      ...milestone,
      isCompleted: new Date(milestone.targetDate) < new Date(),
      daysRemaining: Math.ceil((new Date(milestone.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));

    return {
      success: true,
      currentRound: JSON.parse(JSON.stringify(currentRound)),
      roundMetrics,
      milestonesProgress,
      fundingHistory: pitch.fundingDetails.fundingRounds
    };
  } catch (error) {
    console.error("Fetch pitch funding round details error:", error);
    return { success: false, error: error.message };
  }
}

// Fetch investor engagement metrics for a specific pitch
export async function fetchPitchInvestorEngagementAction(pitchId) {
  try {
    await connectToDB();

    const investments = await Investment.find({ pitchId })
      .populate('investorId', 'investorProfile')
      .lean();

    // Analyze investor profiles
    const investorAnalytics = {
      byExperience: investments.reduce((acc, inv) => {
        const exp = inv.investorProfile?.investmentExperience || 'unknown';
        acc[exp] = (acc[exp] || 0) + 1;
        return acc;
      }, {}),
      byAccreditation: investments.reduce((acc, inv) => {
        const status = inv.investorProfile?.accreditationStatus || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),
      strategicValue: investments.filter(inv => 
        inv.strategicPartnership || inv.boardSeatInterest
      ).length
    };

    return {
      success: true,
      investorAnalytics: JSON.parse(JSON.stringify(investorAnalytics))
    };
  } catch (error) {
    console.error("Fetch pitch investor engagement error:", error);
    return { success: false, error: error.message };
  }
}

export async function calculateInvestmentTrends(pitches) {
  const monthlyData = Array(12).fill(0);
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  pitches.forEach(pitch => {
    pitch.investments?.forEach(investment => {
      const month = new Date(investment.createdAt).getMonth();
      monthlyData[month] += investment.amount || 0;
    });
  });

  return {
    monthlyData,
    labels,
    totalInvestments: pitches.reduce((sum, pitch) => 
      sum + (pitch.investments?.length || 0), 0
    ),
    averageAmount: monthlyData.reduce((a, b) => a + b, 0) / 12,
    growthRate: calculateGrowthRate(monthlyData)
  };
}

export async function calculateInvestorDistribution(pitches) {
  const investors = pitches.flatMap(pitch => pitch.investments || []);
  
  const distribution = {
    angelInvestors: investors.filter(i => i.type === 'angel').length,
    vcs: investors.filter(i => i.type === 'vc').length,
    international: Math.round(
      (investors.filter(i => i.isInternational).length / investors.length) * 100
    ),
    chartData: {
      labels: ['Angel Investors', 'VCs', 'Strategic', 'Others'],
      datasets: [{
        data: [
          investors.filter(i => i.type === 'angel').length,
          investors.filter(i => i.type === 'vc').length,
          investors.filter(i => i.type === 'strategic').length,
          investors.filter(i => i.type === 'other').length
        ],
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#F59E0B'
        ]
      }]
    },
    totalInvestors: investors.length,
    averageInvestmentSize: formatCurrency(
      investors.reduce((sum, inv) => sum + (inv.amount || 0), 0) / investors.length
    ),
    leadInvestors: investors.filter(i => i.isLead).length
  };

  return distribution;
}

export async function getMilestones(pitches) {
  const milestones = [];
  
  pitches.forEach(pitch => {
    const pitchMilestones = pitch.milestones?.map(m => ({
      id: m._id,
      title: m.title,
      description: m.description,
      dueDate: m.dueDate,
      status: m.status,
      completion: m.completion,
      subtasks: m.subtasks,
      pitchTitle: pitch.title
    })) || [];
    
    milestones.push(...pitchMilestones);
  });

  return milestones.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export async function getRecentActivities(pitches) {
  const activities = [];
  
  pitches.forEach(pitch => {
    // Add investment activities
    pitch.investments?.forEach(inv => {
      activities.push({
        id: inv._id,
        type: 'investment',
        userName: inv.investorName,
        userImage: inv.investorImage,
        description: `Invested in ${pitch.title}`,
        amount: formatCurrency(inv.amount),
        timestamp: inv.createdAt
      });
    });

    // Add milestone activities
    pitch.milestones?.forEach(m => {
      if (m.status === 'completed') {
        activities.push({
          id: m._id,
          type: 'milestone',
          userName: pitch.title,
          userImage: '/milestone-icon.png',
          description: `Completed milestone: ${m.title}`,
          timestamp: m.completedAt
        });
      }
    });

    // Add due diligence activities
    pitch.dueDiligence?.forEach(dd => {
      activities.push({
        id: dd._id,
        type: 'due_diligence',
        userName: dd.investorName,
        userImage: dd.investorImage,
        description: `Started due diligence for ${pitch.title}`,
        timestamp: dd.startDate
      });
    });
  });

  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
}

function calculateGrowthRate(data) {
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  if (previousMonth === 0) return 100;
  return Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
}

// Add this to your existing actions file
export async function getAllInvestmentsAction() {
  try {
    await connectToDB();

    // Get all pitches with their investments
    const pitches = await Pitch.find({
      'investments.0': { $exists: true } // Only get pitches with investments
    }).select('title investments fundingDetails industry').lean();

    // Format the investments data
    const formattedInvestments = pitches.flatMap(pitch => 
      pitch.investments.map(investment => ({
        ...investment,
        pitchTitle: pitch.title,
        pitchIndustry: pitch.industry,
        targetAmount: pitch.fundingDetails?.currentRound?.targetAmount,
        currentAmount: pitch.fundingDetails?.currentRound?.currentAmount
      }))
    );

    return {
      success: true,
      investments: formattedInvestments
    };

  } catch (error) {
    console.error("Fetch all investments error:", error);
    return { 
      success: false, 
      error: error.message,
      investments: []
    };
  }
}

// Add this action to fetch a single investment
export async function getInvestmentByIdAction(investmentId) {
  try {
    await connectToDB();
    
    // Find the pitch that contains this investment
    const pitch = await Pitch.findOne(
      { 'investments._id': investmentId }
    ).lean();

    if (!pitch) {
      throw new Error('Investment not found');
    }

    // Find the specific investment in the pitch's investments array
    const investment = pitch.investments.find(
      inv => inv._id.toString() === investmentId
    );

    if (!investment) {
      throw new Error('Investment not found');
    }

    // Return investment with additional pitch context
    return {
      success: true,
      investment: {
        ...investment,
        pitchTitle: pitch.title,
        pitchIndustry: pitch.industry,
        targetAmount: pitch.fundingDetails?.currentRound?.targetAmount,
        currentAmount: pitch.fundingDetails?.currentRound?.currentAmount
      }
    };

  } catch (error) {
    console.error("Fetch investment error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Add this action to update investment review
export async function updateInvestmentReviewAction(investmentId, reviewData) {
  try {
    await connectToDB();

    const { status, notes } = reviewData;

    const pitch = await Pitch.findOneAndUpdate(
      { 'investments._id': investmentId },
      { 
        '$set': {
          'investments.$.status': status,
          'investments.$.reviewNotes': notes,
          'investments.$.reviewedAt': new Date()
        }
      },
      { new: true }
    ).lean();

    if (!pitch) {
      throw new Error('Investment not found');
    }

    // Send notification email to investor
    const investment = pitch.investments.find(inv => inv._id.toString() === investmentId);
    if (investment?.investorProfile?.email) {
      await sendEmail({
        to: investment.investorProfile.email,
        template: emailTemplates.INVESTMENT_REVIEW,
        data: {
          status,
          notes,
          pitchTitle: pitch.title
        }
      });
    }

    revalidatePath('/pitching/investments');
    revalidatePath(`/pitching/investments/${investmentId}`);

    return {
      success: true,
      message: 'Review submitted successfully'
    };

  } catch (error) {
    console.error("Update investment review error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Add this new function to your actions file
export async function fetchPendingInvestments() {
  try {
    await connectToDB();
    
    // Find pitches that have investments with admin_review status
    const pitches = await Pitch.find({
      'investments.status': 'admin_review'
    }).select('title description investments fundingDetails').lean();

    // Extract and format pending investments from pitches
    const pendingInvestments = pitches.flatMap(pitch => 
      pitch.investments
        .filter(inv => inv.status === 'admin_review')
        .map(investment => ({
          _id: investment._id,
          status: investment.status,
          amount: investment.amount,
          submittedAt: investment.submittedAt,
          investmentType: investment.investmentType,
          investmentStructure: investment.investmentStructure,
          paymentMethod: investment.paymentMethod,
          investmentThesis: investment.investmentThesis,
          expectedHoldingPeriod: investment.expectedHoldingPeriod,
          exitStrategy: investment.exitStrategy,
          valueAddProposal: investment.valueAddProposal,
          riskTolerance: investment.riskTolerance,
          keyRiskFactors: investment.keyRiskFactors,
          mitigationStrategies: investment.mitigationStrategies,
          dueDiligence: investment.dueDiligence,
          terms: investment.terms,
          additionalRequests: investment.additionalRequests,
          boardSeatInterest: investment.boardSeatInterest,
          strategicPartnership: investment.strategicPartnership,
          sourceOfFunds: investment.sourceOfFunds,
          kycCompleted: investment.kycCompleted,
          kycDocuments: investment.kycDocuments,
          accreditationVerified: investment.accreditationVerified,
          investorId: {
            id: investment.investorId,
            // We'll get investor details from the investorProfile object
            name: investment.investorProfile?.name || 'Anonymous',
            email: investment.investorProfile?.email
          },
          pitchId: {
            _id: pitch._id,
            title: pitch.title,
            description: pitch.description,
            targetAmount: pitch.fundingDetails?.currentRound?.targetAmount,
            currentAmount: pitch.fundingDetails?.currentRound?.currentAmount
          }
        }))
    );

    return {
      success: true,
      investments: pendingInvestments
    };

  } catch (error) {
    console.error("Fetch pending investments error:", error);
    return {
      success: false,
      error: error.message,
      investments: []
    };
  }
}

// Add this new action to fetch notifications
export async function fetchUserNotificationsAction(userId, userRole) {
  try {
    await connectToDB();
    
    // Base query to find notifications for the user
    const baseQuery = { userId };

    // Add type filters based on user role
    if (userRole === 'investor') {
      // Investors should only see investment-related notifications
      baseQuery.type = {
        $in: [
          'investment_submitted',
          'investment_approved',
          'investment_rejected',
          'payment_pending',
          'payment_confirmed'
        ]
      };
    } else if (userRole === 'pitcher') {
      // Pitchers should see pitch and investment notifications for their pitches
      baseQuery.type = {
        $in: [
          'new_investment',
          'pitch_review',
          'pitch_approved',
          'pitch_rejected',
          'investment_completed'
        ]
      };
    } else if (userRole === 'admin') {
      // Admins see all types of notifications
      baseQuery.type = {
        $in: [
          'investment_review',
          'pitch_review',
          'new_pitch',
          'reported_content',
          'system_alert'
        ]
      };
    }

    const notifications = await Notification.find(baseQuery)
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      notifications: JSON.parse(JSON.stringify(notifications))
    };

  } catch (error) {
    console.error("Fetch notifications error:", error);
    return {
      success: false,
      error: error.message,
      notifications: []
    };
  }
}