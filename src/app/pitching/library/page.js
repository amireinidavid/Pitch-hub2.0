import React from "react";
import PitchListing from "@/components/pitch-listing";
import { currentUser } from "@clerk/nextjs";
import { fetchProfileAction, fetchPitchesAction } from "@/actions";

async function PitchingLibrary() {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      console.log('No user found');
      return <div>Please log in to continue</div>;
    }

    const profileInfo = await fetchProfileAction(user.id);
    console.log('Profile Info:', profileInfo); // Debug log

    if (!profileInfo) {
      console.log('No profile found');
      return <div>Profile not found. Please complete your profile.</div>;
    }

    if (!profileInfo._id) {
      console.log('Profile missing _id');
      return <div>Invalid profile data. Please contact support.</div>;
    }

    // Pass the profile._id to fetch pitches
    const pitchList = await fetchPitchesAction(profileInfo._id, profileInfo.role);
    console.log('Pitch List:', pitchList); // Debug log

    // Only create filter categories if there are pitches
    const filterCategory = pitchList && pitchList.length > 0 
      ? ["industry", "stage", "location", "fundingRange", "investmentType"]
        .map((category) =>
          Array.from(new Set(pitchList.map((pitch) => pitch[category])))
        )
      : [];

    return (
      <div className="min-h-screen bg-background">
        <PitchListing
          user={JSON.parse(JSON.stringify(user))}
          filterCategory={filterCategory}
          profileInfo={profileInfo}
          pitchApplications={[]}
          pitchList={pitchList || []} // Ensure pitchList is never undefined
        />
      </div>
    );
  } catch (error) {
    console.error("Error in PitchingLibrary:", error);
    return <div>An error occurred. Please try again later.</div>;
  }
}

export default PitchingLibrary;
