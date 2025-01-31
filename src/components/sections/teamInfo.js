"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function TeamInfo({ data, updateData }) {
  // Generic handler for team members, advisors, and board members
  const handleTeamSection = (
    section,
    action,
    index = null,
    field = null,
    value = null
  ) => {
    const currentArray = data[section] || [];
    let newArray;

    switch (action) {
      case "add":
        newArray = [
          ...currentArray,
          {
            name: "",
            role: "",
            bio: "",
            image: "",
            linkedin: "",
            experience: "",
            education: "",
            achievements: "",
          },
        ];
        break;
      case "update":
        newArray = [...currentArray];
        newArray[index] = {
          ...newArray[index],
          [field]: value,
        };
        break;
      case "remove":
        newArray = currentArray.filter((_, i) => i !== index);
        break;
      default:
        return;
    }

    updateData({ [section]: newArray });
  };

  const renderTeamMemberForm = (member, index, section) => (
    <div key={index} className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={member.name || ""}
                onChange={(e) =>
                  handleTeamSection(
                    section,
                    "update",
                    index,
                    "name",
                    e.target.value
                  )
                }
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role/Position *</Label>
              <Input
                value={member.role || ""}
                onChange={(e) =>
                  handleTeamSection(
                    section,
                    "update",
                    index,
                    "role",
                    e.target.value
                  )
                }
                placeholder="e.g., CEO, CTO, Advisor"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label>Biography</Label>
            <Textarea
              value={member.bio || ""}
              onChange={(e) =>
                handleTeamSection(
                  section,
                  "update",
                  index,
                  "bio",
                  e.target.value
                )
              }
              placeholder="Brief professional biography"
              rows={3}
            />
          </div>

          {/* Links and Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>LinkedIn Profile</Label>
              <Input
                value={member.linkedin || ""}
                onChange={(e) =>
                  handleTeamSection(
                    section,
                    "update",
                    index,
                    "linkedin",
                    e.target.value
                  )
                }
                placeholder="LinkedIn URL"
                type="url"
              />
            </div>
            <div className="space-y-2">
              <Label>Profile Image URL</Label>
              <Input
                value={member.image || ""}
                onChange={(e) =>
                  handleTeamSection(
                    section,
                    "update",
                    index,
                    "image",
                    e.target.value
                  )
                }
                placeholder="Image URL"
                type="url"
              />
            </div>
          </div>

          {/* Experience and Education */}
          <div className="space-y-2">
            <Label>Professional Experience</Label>
            <Input
              value={member.experience || ""}
              onChange={(e) =>
                handleTeamSection(
                  section,
                  "update",
                  index,
                  "experience",
                  e.target.value
                )
              }
              placeholder="Previous roles and companies (comma-separated)"
            />
            <p className="text-xs text-gray-500">
              Enter experience details separated by commas
            </p>
          </div>

          <div className="space-y-2">
            <Label>Education</Label>
            <Input
              value={member.education || ""}
              onChange={(e) =>
                handleTeamSection(
                  section,
                  "update",
                  index,
                  "education",
                  e.target.value
                )
              }
              placeholder="Educational background"
            />
          </div>

          <div className="space-y-2">
            <Label>Key Achievements</Label>
            <Input
              value={member.achievements || ""}
              onChange={(e) =>
                handleTeamSection(
                  section,
                  "update",
                  index,
                  "achievements",
                  e.target.value
                )
              }
              placeholder="Notable achievements (comma-separated)"
            />
            <p className="text-xs text-gray-500">
              Enter achievements separated by commas
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleTeamSection(section, "remove", index)}
          className="ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Team Information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Provide information about your team members, advisors, and board
          members.
        </p>
      </div>

      {/* Core Team Members */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Core Team Members</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleTeamSection("team", "add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
        {(data.team || []).map((member, index) =>
          renderTeamMemberForm(member, index, "team")
        )}
      </div>

      {/* Advisors */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Advisors</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleTeamSection("advisors", "add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Advisor
          </Button>
        </div>
        {(data.advisors || []).map((advisor, index) =>
          renderTeamMemberForm(advisor, index, "advisors")
        )}
      </div>

      {/* Board Members */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Board Members</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleTeamSection("boardMembers", "add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Board Member
          </Button>
        </div>
        {(data.boardMembers || []).map((member, index) =>
          renderTeamMemberForm(member, index, "boardMembers")
        )}
      </div>
    </div>
  );
}
