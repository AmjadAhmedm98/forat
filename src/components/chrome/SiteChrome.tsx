import { Header } from "./Header";
import { BreakingTicker } from "./BreakingTicker";
import { Footer } from "./Footer";
import { SearchProvider } from "@/components/search/SearchProvider";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <a
        href="#main"
        className="focusable sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[400] focus:rounded-lg focus:bg-cyan focus:px-4 focus:py-2 focus:text-[13px] focus:font-bold focus:text-midnight"
      >
        تخطَّ إلى المحتوى
      </a>
      <Header />
      <BreakingTicker />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <div className="zone-dark"><Footer /></div>
    </SearchProvider>
  );
}
