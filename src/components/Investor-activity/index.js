"use client";

import { Bitcoin } from "lucide-react";
import CommonCard from "../common-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

function InvestorActivity({ pitchList, pitchApplicants }) {
  console.log(pitchList);

  const uniqueStatusArray = [
    ...new Set(
      pitchApplicants
        .map((pitchApplicantsItem) => pitchApplicantsItem.status)
        .flat(1)
    ),
  ];

  console.log(uniqueStatusArray);

  return (
    <div className="mx-auto max-w-7xl">
      <Tabs defaultValue="Invested" className="w-full">
        <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-24">
          <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
            Your Activity
          </h1>
          <TabsList>
            {uniqueStatusArray.map((status) => (
              <TabsTrigger value={status}>{status}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="pb-24 pt-6">
          <div className="container mx-auto p-0 space-y-8">
            <div className="flex flex-col gap-4">
              {uniqueStatusArray.map((status) => (
                <TabsContent value={status}>
                  {pitchList
                    .filter(
                      (pitchItem) =>
                        pitchApplicants
                          .filter(
                            (jobApplication) =>
                              jobApplication.status.indexOf(status) > -1
                          )
                          .findIndex(
                            (filteredItemByStatus) =>
                              pitchItem._id === filteredItemByStatus.pitchID
                          ) > -1
                    )
                    .map((finalFilteredItem) => (
                      <CommonCard
                        icon={<Bitcoin />}
                        title={finalFilteredItem?.businessName}
                        pitch={finalFilteredItem?.pitch}
                      />
                    ))}
                </TabsContent>
              ))}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default InvestorActivity;
