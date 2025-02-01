import React from "react";
import PitchListing from "@/components/pitch-listing";
import { currentUser } from "@clerk/nextjs";
import { fetchProfileAction, fetchPitchesAction } from "@/actions";

async function PitchingLibrary() {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);

  if (!profileInfo) {
    return <div>Loading...</div>;
  }

  // Pass the profile._id (not userId) to fetch pitches
  const pitchList = await fetchPitchesAction(profileInfo._id, profileInfo.role);
  
  console.log('Profile Info:', profileInfo); // Debug log
  console.log('Pitch List:', pitchList); // Debug log

  // Only create filter categories if there are pitches
  const filterCategory = pitchList.length > 0 
    ? ["industry", "stage", "location", "fundingRange", "investmentType"]
      .map((category) =>
        Array.from(new Set(pitchList.map((pitch) => pitch[category])))
      )
    : [];

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
