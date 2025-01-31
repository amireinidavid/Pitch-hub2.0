"use client";
import { useState, useEffect } from "react";
import { addCategory, removeCategory } from "@/actions";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const CATEGORY_TYPES = [
  { value: "industry", label: "Industry" },
  { value: "stage", label: "Stage" },
  { value: "investmentType", label: "Investment Type" },
  { value: "location", label: "Location" },
  { value: "market", label: "Market" },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ type: "", name: "" });
  const { toast } = useToast();

  async function handleAddCategory(e) {
    e.preventDefault();
    try {
      const result = await addCategory(newCategory.type, newCategory.name);
      if (result.success) {
        setCategories([...categories, result.category]);
        setNewCategory({ type: "", name: "" });
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive",
      });
    }
  }

  async function handleRemoveCategory(categoryId) {
    try {
      const result = await removeCategory(categoryId);
      if (result.success) {
        setCategories(categories.filter((cat) => cat._id !== categoryId));
        toast({
          title: "Success",
          description: "Category removed successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove category",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Category Management</h1>

      <form onSubmit={handleAddCategory} className="space-y-4">
        <div className="flex gap-4">
          <Select
            value={newCategory.type}
            onValueChange={(value) =>
              setNewCategory({ ...newCategory, type: value })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="flex-1"
          />

          <Button type="submit">Add Category</Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORY_TYPES.map((type) => (
          <div key={type.value} className="space-y-4">
            <h2 className="text-lg font-semibold">{type.label}</h2>
            <div className="space-y-2">
              {categories
                .filter((cat) => cat.type === type.value)
                .map((category) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <span>{category.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(category._id)}
                    >
                      Remove
                    </Button>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
