import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, User } from 'lucide-react';

export default function UserListModal({ isOpen, onClose, title, users }) {
  const modalRef = useRef(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Arkaplan (Hafif Karartma) */}
      <div 
        className="absolute inset-0 bg-background/95"
        onClick={onClose}
      />
      
      {/* Modal İçeriği */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Başlık ve Kapat Butonu */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kullanıcı Listesi */}
        <div className="overflow-y-auto p-4 flex-1 custom-scrollbar">
          {users && users.length > 0 ? (
            <div className="flex flex-col gap-2">
              {users.map((user) => (
                <Link
                  href={`/profile/${user.username}`}
                  key={user._id}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="relative shrink-0">
                    {user.profileImage ? (
                      <img 
                        src={`${apiUrl}${user.profileImage}`} 
                        alt={user.username} 
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                        {(user.name?.charAt(0) || user.username?.charAt(0) || "U").toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {user.name} {user.lastname}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      @{user.username}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">Kimse bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
