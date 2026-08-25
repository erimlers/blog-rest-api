export default function SettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8 md:py-12 animate-pulse">
      
      {/* Üst Kısım Skeleton */}
      <div className="mb-10 pb-6 border-b border-border/40 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="w-32 h-8 bg-muted/80 rounded-lg mb-3"></div>
          <div className="w-64 h-4 bg-muted/60 rounded-md"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sol Menü (Tabs) Skeleton */}
        <div className="w-full md:w-64 flex flex-col gap-1 flex-shrink-0">
          <div className="w-full h-10 bg-muted/80 rounded-lg"></div>
          <div className="w-full h-10 bg-muted/40 rounded-lg"></div>
          <div className="w-full h-10 bg-muted/40 rounded-lg"></div>
        </div>

        {/* Sağ İçerik Alanı Skeleton */}
        <div className="flex-1 max-w-2xl">
          <div className="py-2">
            <div className="space-y-10">
              
              {/* Fotoğraf Yükleme Skeleton */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/40">
                <div className="w-24 h-24 rounded-full bg-muted/80 shrink-0"></div>
                <div className="flex flex-col gap-2 items-center sm:items-start w-full sm:w-auto">
                  <div className="w-32 h-5 bg-muted/80 rounded-md"></div>
                  <div className="w-48 h-4 bg-muted/50 rounded-md"></div>
                </div>
              </div>

              {/* Form Alanları Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-16 h-4 bg-muted/60 rounded-md"></div>
                  <div className="w-full h-11 bg-muted/40 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-muted/60 rounded-md"></div>
                  <div className="w-full h-11 bg-muted/40 rounded-lg"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-24 h-4 bg-muted/60 rounded-md"></div>
                <div className="w-full h-11 bg-muted/40 rounded-lg"></div>
              </div>

              {/* Kaydet Butonu Skeleton */}
              <div className="pt-8 border-t border-border/40 flex justify-end">
                <div className="w-40 h-10 bg-muted/80 rounded-lg"></div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
