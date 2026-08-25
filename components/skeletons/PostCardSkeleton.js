export default function PostCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-border animate-pulse">
      
      {/* Sol İçerik */}
      <div className="flex flex-col flex-1 min-w-0 pr-0 sm:pr-6 order-2 sm:order-1 mt-4 sm:mt-0">
        
        {/* Yazar Bilgisi */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-muted/60 shrink-0"></div>
          <div className="w-24 sm:w-32 h-4 bg-muted/60 rounded-md"></div>
          <div className="w-2 h-2 rounded-full bg-muted/40 mx-1"></div>
          <div className="w-16 sm:w-20 h-3 bg-muted/40 rounded-md"></div>
        </div>

        {/* Başlık ve Özet */}
        <div className="flex-1 space-y-3 mb-4">
          <div className="w-3/4 sm:w-4/5 h-6 sm:h-7 bg-muted/70 rounded-lg"></div>
          <div className="w-1/2 h-6 sm:h-7 bg-muted/70 rounded-lg"></div>
          
          <div className="space-y-2 mt-4">
             <div className="w-full h-4 bg-muted/40 rounded-md"></div>
             <div className="w-5/6 h-4 bg-muted/40 rounded-md"></div>
          </div>
        </div>

        {/* Alt Kısım: Etiketler ve Etkileşimler */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="w-16 h-6 bg-muted/50 rounded-full"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-5 bg-muted/50 rounded-md"></div>
            <div className="w-10 h-5 bg-muted/50 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Sağ İçerik: Görsel (Thumbnail) */}
      <div className="w-full sm:w-[200px] lg:w-[240px] h-[160px] shrink-0 mb-4 sm:mb-0 order-1 sm:order-2 rounded-xl bg-muted/60"></div>
    </div>
  );
}
