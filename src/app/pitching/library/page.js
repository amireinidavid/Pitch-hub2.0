import React from "react";
import PitchListing from "@/components/pitch-listing";
import { currentUser } from "@clerk/nextjs";
import { fetchProfileAction } from "@/actions";
import { fetchPitchesAction } from "@/actions";

async function PitchingLibrary() {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);

  // Fetch pitches and filter categories
  const pitchList = await fetchPitchesAction();
  const filterCategory = [
    "industry",
    "stage",
    "location",
    "fundingRange",
    "investmentType",
  ].map((category) =>
    Array.from(new Set(pitchList.map((pitch) => pitch[category])))
  );

  // Fetch pitch applications if needed
  const pitchApplications = []; // Add your pitch applications fetch logic here

  return (
    <div className="min-h-screen bg-background">
      <PitchListing
        user={JSON.parse(JSON.stringify(user))}
        filterCategory={filterCategory}
        profileInfo={profileInfo}
        pitchApplications={pitchApplications}
        pitchList={pitchList}
      />
    </div>
  );
}

export default PitchingLibrary;
