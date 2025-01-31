import React from "react";
import MembershipCard from "../card";
import { tiers } from "@/utils";
import { currentUser } from "@clerk/nextjs";
import { fetchProfileAction } from "@/actions";
import { redirect } from "next/navigation";

async function Membership() {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);
  if (!profileInfo) redirect("/onboard");

  return <MembershipCard profileInfo={profileInfo} />;
}

export default Membership;
