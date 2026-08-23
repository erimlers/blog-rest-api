"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../store/slices/postSlice";
import { useState, useEffect } from "react";

export default function FilterBar() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.posts);
  const tabs = [
    { id: "newest", label: "En Yeniler" },
    { id: "popular", label: "Popüler" },
    { id: "oldest", label: "En Eskiler" }
  ];

  return (
    <div className="flex items-center gap-6 border-b border-border/60 mb-6 transition-colors duration-500 ease-in-out">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => dispatch(setFilters({ sortBy: tab.id }))}
          className={`pb-3 text-sm font-medium transition-all duration-300 relative ${
            filters.sortBy === tab.id 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
          {filters.sortBy === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full layout-none"></div>
          )}
        </button>
      ))}
    </div>
  );
}
