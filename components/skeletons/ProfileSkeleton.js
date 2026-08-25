export default function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 md:py-12 animate-pulse">
      
      {/* Profil Üst Bölümü (Bütünleşik Kart) */}
      <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden mb-12 relative">
        
        {/* Banner */}
        <div className="w-full h-32 sm:h-48 bg-muted/40"></div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar Skeleton */}
              <div className="-mt-16 sm:-mt-20 shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-card bg-muted/80 z-10 relative"></div>
              
              {/* Kullanıcı Adı ve İsim Skeleton */}
              <div className="flex flex-col items-center sm:items-start mb-1 w-full sm:w-auto">
                <div className="w-48 sm:w-64 h-8 sm:h-9 bg-muted/80 rounded-lg mb-2"></div>
                <div className="w-32 h-5 bg-muted/60 rounded-md"></div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 mt-4">
                  <div className="w-24 h-4 bg-muted/50 rounded-md"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-4 bg-muted/50 rounded-md"></div>
                    <div className="w-20 h-4 bg-muted/50 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aksiyon Butonları Skeleton */}
            <div className="flex flex-col gap-2 w-full sm:w-auto mb-2">
              <div className="w-full sm:w-36 h-10 bg-muted/60 rounded-lg self-center sm:self-auto mt-4 sm:mt-0"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
