import { fetchPitchByIdAction } from "@/actions";
import PitchDetails from "@/components/pitch-details";
import { currentUser } from "@clerk/nextjs";
import { fetchProfileAction } from "@/actions";

async function PitchPage({ params }) {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);
  const pitch = await fetchPitchByIdAction(params.pitchId);
  return (
    <div className="min-h-screen bg-background py-8">
      <PitchDetails
        pitch={pitch}
        user={JSON.parse(JSON.stringify(user))}
        profileInfo={profileInfo}
      />
    </div>
  );
}

export default PitchPage;
