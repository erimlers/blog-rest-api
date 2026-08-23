"use client";

import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@store/slices/postSlice";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NavbarSearch() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { filters } = useSelector((state) => state.posts);
  
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
        
        // Eğer kullanıcı anasayfada (/) değilse ve arama yapıyorsa, anasayfaya yönlendir
        if (pathname !== "/" && searchTerm.trim() !== "") {
          router.push("/");
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch, filters.search, pathname, router]);

  return (
    <div className="relative w-full max-w-xs group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Yazılarda ara..."
        className="block w-full pl-10 pr-3 py-2 bg-muted/50 border border-transparent rounded-full text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-300"
      />
    </div>
  );
}
