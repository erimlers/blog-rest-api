import { NextResponse } from 'next/server';

export function middleware(request) {
  // Sadece URL'in path (yol) kısmını alıyoruz
  const { pathname } = request.nextUrl;

  // Sadece `/posts` adresine tam eşleşme varsa çalışır
  if (pathname === '/posts') {
    // Kullanıcıyı anasayfaya (/) yönlendir.
    // 307 statüsü kullanarak tarayıcının bu yönlendirmeyi kalıcı olarak önbelleklemesini engelliyoruz.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Diğer tüm sayfalarda (örneğin /posts/123 veya /tags/js) müdahale etmeden geçişe izin ver
  return NextResponse.next();
}

// Performans Optimizasyonu (Matcher)
export const config = {
  matcher: [
    /*
     * Aşağıdaki yollar HARİÇ tüm isteklerde middleware'i çalıştır:
     * - api (API rotaları)
     * - _next/static (Statik dosyalar)
     * - _next/image (Resim optimizasyonu)
     * - favicon.ico, sitemap.xml, robots.txt (Metadata dosyaları)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
