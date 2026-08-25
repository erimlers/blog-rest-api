export default function PostDetailSkeleton() {
  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      
      {/* Geri Dön Butonu Skeleton */}
      <div className="w-16 h-6 bg-muted rounded-md mb-8"></div>

      {/* Yazı Başlığı ve Yazar Bilgileri Skeleton */}
      <header className="mb-10">
        <div className="w-4/5 sm:w-3/4 h-10 sm:h-12 lg:h-14 bg-muted/80 rounded-xl mb-6"></div>
        
        <div className="flex flex-wrap items-center gap-6 border-y border-border py-4">
          
          {/* Yazar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted shrink-0"></div>
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 bg-muted/80 rounded-md"></div>
              <div className="w-24 h-3 bg-muted/60 rounded-md"></div>
            </div>
          </div>

          <div className="w-px h-8 bg-border hidden sm:block"></div>

          {/* Tarih */}
          <div className="w-24 h-5 bg-muted/60 rounded-md"></div>

          <div className="flex-1"></div>

          {/* Aksiyonlar */}
          <div className="flex items-center gap-4">
             <div className="w-16 h-9 bg-muted/60 rounded-full"></div>
             <div className="w-12 h-9 bg-muted/60 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Kapak Görseli Skeleton */}
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl bg-muted/60 mb-12 border border-border"></div>

      {/* Yazı İçeriği Skeleton */}
      <div className="space-y-6 mb-16">
        <div className="w-full h-4 bg-muted/60 rounded-md"></div>
        <div className="w-full h-4 bg-muted/60 rounded-md"></div>
        <div className="w-11/12 h-4 bg-muted/60 rounded-md"></div>
        <div className="w-full h-4 bg-muted/60 rounded-md"></div>
        <div className="w-5/6 h-4 bg-muted/60 rounded-md"></div>
        <br />
        <div className="w-full h-4 bg-muted/60 rounded-md"></div>
        <div className="w-10/12 h-4 bg-muted/60 rounded-md"></div>
        <div className="w-full h-4 bg-muted/60 rounded-md"></div>
      </div>

    </article>
  );
}
