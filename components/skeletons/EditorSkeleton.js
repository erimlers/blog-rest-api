export default function EditorSkeleton() {
  return (
    <div className="min-h-screen bg-background py-8 md:py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Skeleton */}
        <div className="mb-10 pb-6 border-b border-border/40 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="w-48 h-8 bg-muted/80 rounded-lg mb-3"></div>
            <div className="w-64 h-4 bg-muted/60 rounded-md"></div>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* Üst Kısım: Başlık ve Görsel Yan Yana Skeleton */}
          <div className="flex flex-col-reverse md:flex-row gap-8">
             
             {/* Başlık ve Etiketler */}
             <div className="flex-1 space-y-8">
                <div className="space-y-2">
                  <div className="w-16 h-4 bg-muted/60 rounded-md"></div>
                  <div className="w-full h-12 bg-muted/40 rounded-lg"></div>
                </div>

                <div className="space-y-2">
                  <div className="w-24 h-4 bg-muted/60 rounded-md"></div>
                  <div className="w-full h-11 bg-muted/40 rounded-lg"></div>
                </div>
             </div>

             {/* Kapak Görseli Skeleton */}
             <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                <div className="w-24 h-4 bg-muted/60 rounded-md"></div>
                <div className="w-full aspect-[4/3] bg-muted/50 rounded-lg border border-border/40"></div>
             </div>
          </div>

          {/* İçerik Alanı (Markdown Editor) Skeleton */}
          <div className="space-y-2">
            <div className="w-16 h-4 bg-muted/60 rounded-md"></div>
            <div className="w-full h-[500px] bg-muted/30 rounded-lg border border-border/40"></div>
          </div>
          
          {/* Butonlar Skeleton */}
          <div className="flex justify-end gap-4 pt-6 border-t border-border/40">
            <div className="w-24 h-11 bg-muted/60 rounded-lg"></div>
            <div className="w-32 h-11 bg-muted/80 rounded-lg"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
