"use server";

import connectToDB from "@/database";
import Application from "@/models/application";
import Pitch from "@/models/pitch";
import Profile from "@/models/profile";
import { revalidatePath } from "next/cache";
const nodemailer = require("nodemailer");

const stripe = require("stripe")(
  "sk_test_51QXLAHB0xUjtzZ1Gl3psNzSDSZWZodQbCxJn6V4JUrj1soGbjasiH9jn0w41N9NyBt6IMcm5iP2nfMvIsI1B1yjS00aEwbPXJd"
);
// crate profile action
export async function createProfileAction(formData, pathToRevalidate) {
  await connectToDB();
  await Profile.create(formData);
  revalidatePath(pathToRevalidate);
}

export async function fetchProfileAction(id) {
  await connectToDB();
  const result = await Profile.findOne({ userId: id });

  return JSON.parse(JSON.stringify(result));
}

//create pitch action

export async function postNewJobAction(formData, pathToRevalidate) {
  await connectToDB();
  await Pitch.create(formData);
  revalidatePath(pathToRevalidate);
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

// Fetch investor engagement for a pitch
export async function fetchInvestorEngagement(pitchId) {
  await connectToDB();
  const applications = await Application.find({ pitchID: pitchId });
  return JSON.parse(JSON.stringify(applications));
}

// Fetch funding progress for a pitch
export async function fetchFundingProgress(pitchId) {
  await connectToDB();
  const pitch = await Pitch.findOne({ _id: pitchId });
  return JSON.parse(JSON.stringify(pitch));
}

// Fetch pitch performance metrics
export async function fetchPitchPerformance(pitchId) {
  await connectToDB();
  // Assuming you have a way to track views and engagement
  const performance = await Pitch.findOne({ _id: pitchId });
  return JSON.parse(JSON.stringify(performance));
}

// Use the existing actions to update profile and pitch applications...
