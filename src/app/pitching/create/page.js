import { currentUser } from "@clerk/nextjs";
import { fetchProfileAction } from "@/actions";
import PostPitch from "@/components/post-pitch";
import { redirect } from "next/navigation";

async function CreatePitchPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profileInfo = await fetchProfileAction(user?.id);
  if (!profileInfo) redirect("/onboard");

  // Serialize the user data we need
  const serializedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
  };

  // Serialize profile info (it's already serialized in the action, but let's be explicit)
  const serializedProfile = JSON.parse(JSON.stringify(profileInfo));

  return (
    <div>
      <PostPitch user={serializedUser} profileInfo={serializedProfile} />
    </div>
  );
}

export default CreatePitchPage;
