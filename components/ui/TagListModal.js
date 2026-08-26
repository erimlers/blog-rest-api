import { useEffect, useRef, useState } from 'react';
import { X, Hash, Search } from 'lucide-react';

export default function TagListModal({ isOpen, onClose, tags, onSelect, selectedTag }) {
  const modalRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setSearchTerm("");
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTags = tags.filter(tag => tag._id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Tüm Etiketler
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Etiket ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4 flex-1 custom-scrollbar">
          {filteredTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => {
                    onSelect(tag._id);
                    onClose();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedTag === tag._id 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-muted text-foreground border-transparent hover:border-border hover:bg-muted/80"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 opacity-70" />
                  {tag._id}
                  <span className="text-xs opacity-60 ml-1">({tag.count})</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Hash className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium text-sm">Etiket bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
