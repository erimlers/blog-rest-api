import { headers } from "next/headers";

/**
 * Server tarafında User-Agent okuyarak isteğin mobilden mi
 * yoksa masaüstünden mi geldiğini tespit eder.
 * @returns {Promise<boolean>} Mobil cihaz ise true döner.
 */
export async function getIsMobile() {
  // Next.js 15+ sürümlerinde headers() asenkron çalışır
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  
  // Basit ve yüksek performanslı mobil regex'i.
  // Çoğu telefonu ve tableti başarıyla yakalar.
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  
  return isMobile;
}
