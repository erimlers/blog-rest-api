import { getIsMobile } from "@lib/utils/deviceDetection";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

// Akıllı Server Component
// Sadece ilgili cihazın tasarımını render eder, diğerini HTML'e hiç dahil etmez.
export default async function Navbar() {
  const isMobile = await getIsMobile();

  return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
}
