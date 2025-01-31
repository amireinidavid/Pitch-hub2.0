"use client";

import { Fragment } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  getInvestorDetailsByIDAction,
  updatePitchApplicationAction,
} from "@/actions";

function InvestorsList({
  pitchApplications,
  currentInvestorDetails,
  setCurrentInvestorDetails,
  showCurrentInvestorDetailsModal,
  setShowCurrentInvestorDetailsModal,
}) {
  async function handleFetchInvestorDetails(getCurrentInvestorId) {
    const data = await getInvestorDetailsByIDAction(getCurrentInvestorId);

    if (data) {
      setCurrentInvestorDetails(data);
      setShowCurrentInvestorDetailsModal(true);
    }
    console.log(data, "data");
  }

  console.log(currentInvestorDetails);

  async function handleUpdatePitchStatus(getCurrentStatus) {
    let cpyPitchApplicants = [...pitchApplications];
    const indexOfCurrentPitchApplicant = cpyPitchApplicants.findIndex(
      (item) => item.investorUserID === currentInvestorDetails?.userId
    );
    const pitchApplicantsToUpdate = {
      ...cpyPitchApplicants[indexOfCurrentPitchApplicant],
      status:
        cpyPitchApplicants[indexOfCurrentPitchApplicant].status.concat(
          getCurrentStatus
        ),
    };

    console.log(pitchApplicantsToUpdate, "pitchApplicantsToUpdate");
    await updatePitchApplicationAction(pitchApplicantsToUpdate, "/pitching");
  }

  console.log(pitchApplications);

  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3">
        {pitchApplications && pitchApplications.length > 0
          ? pitchApplications.map((pitchApplicatantsItem) => (
              <div
                key={pitchApplicatantsItem.investorUserID}
                className="bg-white shadow-lg w-full max-w-sm rounded-lg overflow-hidden mx-auto mt-4 transition-all transform hover:scale-105"
              >
                <div className="px-4 py-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-800">
                    {pitchApplicatantsItem?.name}
                  </h3>
                  <Button
                    onClick={() =>
                      handleFetchInvestorDetails(
                        pitchApplicatantsItem?.investorUserID
                      )
                    }
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 flex h-11 items-center justify-center px-5 rounded-lg"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))
          : null}
      </div>
      <Dialog
        open={showCurrentInvestorDetailsModal}
        onOpenChange={() => {
          setCurrentInvestorDetails(null);
          setShowCurrentInvestorDetailsModal(false);
        }}
      >
        <DialogContent className="bg-gray-800 text-white rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-4">
              Investor Name: {currentInvestorDetails?.investorInfo?.name}
            </h1>
            <p className="text-xl font-medium mb-2">
              Investor Email: {currentInvestorDetails?.email}
            </p>
            <p className="text-lg font-normal mb-2">
              Investor Company Name:
              {currentInvestorDetails?.investorInfo.companyName}
            </p>
            <p className="text-lg mb-2">
              Company Role: {currentInvestorDetails?.investorInfo.companyRole}
            </p>
            <p className="text-lg mb-2">
              Networth: {currentInvestorDetails?.investorInfo.networth}
            </p>
          </div>
          <div className="flex gap-3 justify-center mt-6">
            <Button
              onClick={() => handleUpdatePitchStatus("Invested")}
              className="bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 flex h-11 items-center justify-center px-5 rounded-lg disabled:opacity-50"
              disabled={
                pitchApplications
                  .find(
                    (item) =>
                      item.investorUserID === currentInvestorDetails?.userId
                  )
                  ?.status.includes("Invested") ||
                pitchApplications
                  .find(
                    (item) =>
                      item.investorUserID === currentInvestorDetails?.userId
                  )
                  ?.status.includes("rejected")
                  ? true
                  : false
              }
            >
              {pitchApplications
                .find(
                  (item) =>
                    item.investorUserID === currentInvestorDetails?.userId
                )
                ?.status.includes("Invested")
                ? "Invested"
                : "Invest"}
            </Button>
            <Button
              onClick={() => handleUpdatePitchStatus("rejected")}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 flex h-11 items-center justify-center px-5 rounded-lg disabled:opacity-50"
              disabled={
                pitchApplications
                  .find(
                    (item) =>
                      item.investorUserID === currentInvestorDetails?.userId
                  )
                  ?.status.includes("selected") ||
                pitchApplications
                  .find(
                    (item) =>
                      item.investorUserID === currentInvestorDetails?.userId
                  )
                  ?.status.includes("rejected")
                  ? true
                  : false
              }
            >
              {pitchApplications
                .find(
                  (item) =>
                    item.investorUserID === currentInvestorDetails?.userId
                )
                ?.status.includes("rejected")
                ? "Rejected"
                : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default InvestorsList;
