"use client";

import InvestorsList from "../candidate-list";
import { Drawer, DrawerContent } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";

function PitchAplicants({
  showInvestorsDrawer,
  setShowInvestorsDrawer,
  showCurrentInvestorDetailsModal,
  setShowCurrentInvestorDetailsModal,
  currentInvestorDetails,
  setCurrentInvestorDetails,
  pitchItem,
  pitchApplications,
}) {
  return (
    <Drawer open={showInvestorsDrawer} onOpenChange={setShowInvestorsDrawer}>
      <DrawerContent className="max-h-[50vh]">
        <ScrollArea className="h-auto overflow-y-auto">
          <InvestorsList
            currentInvestorDetails={currentInvestorDetails}
            setCurrentInvestorDetails={setCurrentInvestorDetails}
            pitchApplications={pitchApplications}
            showCurrentInvestorDetailsModal={showCurrentInvestorDetailsModal}
            setShowCurrentInvestorDetailsModal={
              setShowCurrentInvestorDetailsModal
            }
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

export default PitchAplicants;
