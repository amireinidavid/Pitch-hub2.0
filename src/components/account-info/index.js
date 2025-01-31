"use client";

import {
  InvestorOnboardFormControls,
  initialPitcherAccountFormData,
  initialPitcherFormData,
  pitcherOnboardFormControls,
} from "@/utils";
import { useEffect, useState } from "react";
import CommonForm from "../common-form";
import { updateProfileAction } from "@/actions";

function AccountInfo({ profileInfo }) {
  const [investorFormData, setInvestorFormData] = useState(
    initialPitcherAccountFormData
  );
  const [pitcherFormData, setPitcherFormData] = useState(
    initialPitcherFormData
  );

  useEffect(() => {
    if (profileInfo?.role === "pitcher" && profileInfo?.pitcherInfo) {
      setPitcherFormData(profileInfo?.pitcherInfo);
    }

    if (profileInfo?.role === "investor" && profileInfo?.investorInfo) {
      setInvestorFormData(profileInfo?.investorInfo);
    }
  }, [profileInfo]);

  console.log(profileInfo, "candidateFormData", profileInfo);

  async function handleUpdateAccount() {
    await updateProfileAction(
      profileInfo?.role === "investor"
        ? {
            _id: profileInfo?._id,
            userId: profileInfo?.userId,
            email: profileInfo?.email,
            role: profileInfo?.role,
            isPremiumUser: profileInfo?.isPremiumUser,
            memberShipType: profileInfo?.memberShipType,
            memberShipStartDate: profileInfo?.memberShipStartDate,
            memberShipEndDate: profileInfo?.memberShipEndDate,
            investorInfo: {
              ...investorFormData,
            },
          }
        : {
            _id: profileInfo?._id,
            userId: profileInfo?.userId,
            email: profileInfo?.email,
            role: profileInfo?.role,
            isPremiumUser: profileInfo?.isPremiumUser,
            memberShipType: profileInfo?.memberShipType,
            memberShipStartDate: profileInfo?.memberShipStartDate,
            memberShipEndDate: profileInfo?.memberShipEndDate,
            pitcherInfo: {
              ...pitcherFormData,
            },
          },
      "/account"
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline dark:border-white justify-between pb-6 border-b pt-24">
        <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
          Account Details
        </h1>
      </div>
      <div className="py-20 pb-24 pt-6">
        <div className="container mx-auto p-0 space-y-8">
          <CommonForm
            action={handleUpdateAccount}
            formControls={
              profileInfo?.role === "investor"
                ? InvestorOnboardFormControls
                : pitcherOnboardFormControls
            }
            formData={
              profileInfo?.role === "investor"
                ? investorFormData
                : pitcherFormData
            }
            setFormData={
              profileInfo?.role === "investor"
                ? setInvestorFormData
                : setPitcherFormData
            }
            buttonText="Update your Profile"
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;
