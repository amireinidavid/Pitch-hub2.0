import {
  fetchPitchApplicationsForInvestor,
  fetchJobsForInvestorAction,
} from "@/actions";
import InvestorActivity from "@/components/Investor-activity";
import { currentUser } from "@clerk/nextjs";

export default async function ActivityPage() {
  const user = await currentUser();
  const pitchList = await fetchJobsForInvestorAction();
  const pitchApplicants = await fetchPitchApplicationsForInvestor(user?.id);

  return (
    <InvestorActivity pitchList={pitchList} pitchApplicants={pitchApplicants} />
  );
}
