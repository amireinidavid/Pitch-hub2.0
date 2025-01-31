"use client";

import React, { useEffect, useState } from "react";
import PostPitchPage from "../post-pitch";
import InvestorCard from "../investor-card";
import PitcherCard from "../pitcher-card";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { Label } from "@radix-ui/react-menubar";
import { filterMenuDataArray, formUrlQuery } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { FiGrid, FiList, FiFilter } from "react-icons/fi";

function PitchListing({
  user,
  filterCategory,
  profileInfo,
  pitchApplications,
  pitchList,
}) {
  const [filterParams, setFilterParams] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // grid or list view
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleFilter(getSectionID, getCurrentOption) {
    let cpyFilterParams = { ...filterParams };
    const indexOfCurrentSection =
      Object.keys(cpyFilterParams).indexOf(getSectionID);
    if (indexOfCurrentSection === -1) {
      cpyFilterParams = {
        ...cpyFilterParams,
        [getSectionID]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilterParams[getSectionID].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFilterParams[getSectionID].push(getCurrentOption);
      else cpyFilterParams[getSectionID].splice(indexOfCurrentOption, 1);
    }
    setFilterParams(cpyFilterParams);
    sessionStorage.setItem("filterParams", JSON.stringify(cpyFilterParams));
    console.log("Updated filterParams:", cpyFilterParams);
  }

  useEffect(() => {
    const savedFilterParams = sessionStorage.getItem("filterParams");
    if (savedFilterParams) {
      setFilterParams(JSON.parse(savedFilterParams));
      console.log(
        "Loaded filterParams from sessionStorage:",
        JSON.parse(savedFilterParams)
      );
    }
  }, []);

  useEffect(() => {
    if (filterParams && Object.keys(filterParams).length > 0) {
      let url = "";
      url = formUrlQuery({
        params: searchParams.toString(),
        dataToAdd: filterParams,
      });

      router.push(url, { scroll: false });
    }
  }, [filterParams, searchParams]);

  const filterMenus = filterMenuDataArray.map((item) => ({
    id: item.id,
    name: item.label,
    options: [...new Set(filterCategory.map((listItem) => listItem[item.id]))],
  }));

  const filteredPitchList = pitchList.filter((pitchItem) => {
    if (Object.keys(filterParams).length === 0) return true;
    return Object.keys(filterParams).every((filterKey) => {
      if (filterParams[filterKey].length === 0) return true;
      return filterParams[filterKey].includes(pitchItem[filterKey]);
    });
  });

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-6 pt-24">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-500 dark:text-blue-400">
              Pitch Library
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {profileInfo?.role === "investor"
                ? "Discover and invest in promising pitches"
                : "Manage and track your pitches"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <FiGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <FiList className="h-4 w-4" />
              </Button>
            </div>

            {profileInfo?.role === "investor" && (
              <Menubar>
                {filterMenus.map((filterMenu) => (
                  <MenubarMenu key={filterMenu.id}>
                    <MenubarTrigger className="flex items-center gap-2">
                      <FiFilter className="h-4 w-4" />
                      {filterMenu.name}
                    </MenubarTrigger>
                    <MenubarContent>
                      {filterMenu.options.map((option, optionIdx) => (
                        <MenubarItem
                          key={optionIdx}
                          className="flex items-center"
                          onClick={() => handleFilter(filterMenu.id, option)}
                        >
                          <div
                            className={`h-4 w-4 border rounded ${
                              filterParams[filterMenu.id]?.includes(option)
                                ? "bg-primary border-primary"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          <Label className="ml-3 cursor-pointer">
                            {option}
                          </Label>
                        </MenubarItem>
                      ))}
                    </MenubarContent>
                  </MenubarMenu>
                ))}
              </Menubar>
            )}
            {/* 
            {profileInfo?.role === "pitcher" && (
              <PostPitchPage
                profileInfo={profileInfo}
                user={user}
                pitchList={pitchList}
              />
            )} */}
          </div>
        </div>

        <div className="py-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Pitches</TabsTrigger>
              {profileInfo?.role === "pitcher" && (
                <>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </>
              )}
              {profileInfo?.role === "investor" && (
                <>
                  <TabsTrigger value="interested">Interested</TabsTrigger>
                  <TabsTrigger value="invested">Invested</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredPitchList && filteredPitchList.length > 0 ? (
                  filteredPitchList.map((pitchItem) =>
                    profileInfo?.role === "investor" ? (
                      <InvestorCard
                        key={pitchItem._id}
                        profileInfo={profileInfo}
                        pitchItem={pitchItem}
                        pitchApplications={pitchApplications}
                        viewMode={viewMode}
                      />
                    ) : (
                      <PitcherCard
                        key={pitchItem._id}
                        profileInfo={profileInfo}
                        pitchItem={pitchItem}
                        pitchApplications={pitchApplications}
                        viewMode={viewMode}
                      />
                    )
                  )
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">
                      No pitches found
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default PitchListing;
