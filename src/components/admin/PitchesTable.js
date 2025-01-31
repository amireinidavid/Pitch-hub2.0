"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function PitchesTable({ pitches }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPitches = pitches?.filter(pitch => 
    pitch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pitch.industry.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    const statusColors = {
      active: "success",
      pending: "warning",
      rejected: "destructive",
      draft: "secondary"
    };
    return statusColors[status] || "default";
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search pitches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-white/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Target Amount</TableHead>
              <TableHead>Current Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPitches.map((pitch) => (
              <TableRow key={pitch._id}>
                <TableCell className="font-medium">{pitch.title}</TableCell>
                <TableCell>{pitch.industry}</TableCell>
                <TableCell>
                  {formatCurrency(pitch.fundingDetails?.targetAmount)}
                </TableCell>
                <TableCell>
                  {formatCurrency(pitch.fundingDetails?.currentAmount)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(pitch.status)}>
                    {pitch.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(pitch.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => window.location.href = `/admin/pitches/${pitch._id}`}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.location.href = `/admin/pitches/${pitch._id}/edit`}
                      >
                        Edit Pitch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 