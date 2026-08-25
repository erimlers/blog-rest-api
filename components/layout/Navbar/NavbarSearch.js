"use client";

import { Search, User, FileText, Loader2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../lib/api";
import ENDPOINTS from "../../../lib/endpoints";
import Link from "next/link";

export default function NavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const dropdownRef = useRef(null);

  // URL'deki 'q' parametresini ilk yüklemede yakala
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  // Dışarı tıklayınca menüyü kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Canlı arama
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // URL'deki ile aynıysa belki dropdown'u açmak istemeyebiliriz ama typing deneyimi için açalım
      if (searchTerm.trim() !== "") {
        setIsLoading(true);
        setIsDropdownOpen(true);
        try {
          const [usersRes, postsRes] = await Promise.all([
            api.get(ENDPOINTS.USERS.SEARCH, { params: { q: searchTerm } }),
            api.get(ENDPOINTS.POSTS.LIST, { params: { search: searchTerm, limit: 5 } })
          ]);
          
          setUsers(usersRes.data || []);
          setPosts(postsRes.data?.posts || []);
        } catch (error) {
          console.error("Arama hatası:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUsers([]);
        setPosts([]);
        setIsDropdownOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsDropdownOpen(false);
      if (searchTerm.trim() !== "") {
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      } else {
        router.push(`/posts`);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs group" ref={dropdownRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchTerm.trim() !== "") setIsDropdownOpen(true);
        }}
        placeholder="Ara..."
        className="block w-full pl-10 pr-8 py-2 bg-muted/50 border border-transparent rounded-full text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-300"
      />

      {searchTerm && (
        <button 
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Dropdown Menü */}
      {isDropdownOpen && (
        <div className="absolute top-full mt-2 w-full md:w-[350px] right-0 md:left-0 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {isLoading ? (
            <div className="p-8 flex justify-center items-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              
              {/* Kullanıcılar Alanı */}
              {users.length > 0 && (
                <div className="p-3 border-b border-border/50">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Kullanıcılar</h3>
                  <div className="flex flex-col gap-1">
                    {users.slice(0, 3).map(user => (
                      <Link 
                        href={`/profile/${user.username}`} 
                        key={user._id}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        {user.profileImage ? (
                          <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080"}${user.profileImage}`} alt={user.username} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {(user.name?.charAt(0) || user.username?.charAt(0) || '').toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground truncate">{user.name} {user.lastname}</span>
                          <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Yazılar Alanı */}
              {posts.length > 0 && (
                <div className="p-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Yazılar</h3>
                  <div className="flex flex-col gap-1">
                    {posts.map(post => (
                      <Link 
                        href={`/posts/${post._id}`} 
                        key={post._id}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium text-foreground truncate">{post.title}</span>
                          <span className="text-xs text-muted-foreground truncate line-clamp-1">
                            {post.content ? post.content.substring(0, 40).replace(/<[^>]+>/g, '') + '...' : ''}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bulunamadı */}
              {users.length === 0 && posts.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  "{searchTerm}" için sonuç bulunamadı.
                </div>
              )}

              {/* Tüm Sonuçlar Butonu */}
              {(users.length > 0 || posts.length > 0) && (
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                  }}
                  className="w-full p-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors border-t border-border/50 text-center"
                >
                  Tüm sonuçları gör ({searchTerm})
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
