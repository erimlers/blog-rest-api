"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../store/slices/postSlice";
import { useState, useEffect } from "react";

export default function FilterBar() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.posts);
  
  // Arama inputu için local state (Her harf basışında API isteği gitmesini önlemek için - Debounce mantığı)
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Debounce: Kullanıcı yazmayı bıraktıktan 500ms sonra Redux'ı güncelle
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch, filters.search]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 px-4 sm:px-6 bg-background border-b border-border transition-colors duration-500 ease-in-out">
      
      {/* Arama Çubuğu */}
      <div className="relative w-full flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Yazılarda ara..."
          className="block w-full pl-10 pr-3 py-2.5 bg-muted border border-transparent rounded-full text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-300"
        />
      </div>

      {/* Sıralama Seçenekleri */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2 px-2 text-muted-foreground bg-muted transition-colors duration-500 ease-in-out py-2.5 rounded-full w-full sm:w-auto overflow-hidden">
          <SlidersHorizontal className="h-4 w-4 ml-2 flex-shrink-0" />
          <select
            value={filters.sortBy}
            onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer w-full pl-1 pr-4 appearance-none"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            <option value="newest">En Yeniler</option>
            <option value="popular">En Çok Beğenilenler</option>
            <option value="oldest">En Eskiler</option>
          </select>
        </div>
      </div>
      
    </div>
  );
}
