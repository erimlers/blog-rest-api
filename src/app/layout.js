import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@store/provider";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import { ThemeProvider } from "@components/theme-provider";
import FloatingCreateButton from "@components/ui/FloatingCreateButton";

// Ana font (Okunabilirlik için Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Kod blokları ve spesifik başlıklar için (Developer hissiyatı - JetBrains Mono)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "Blog",
  description: "Modern, teknik odaklı blog platformu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ReduxProvider>
            <Navbar />
            
            {/* Sayfa içeriği ortalanır, header ve footer arasına yayılır */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            
            <FloatingCreateButton />
            <Footer />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

