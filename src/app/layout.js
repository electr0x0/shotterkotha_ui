import { Providers } from "./providers";
import Navbar from "@/components/Dashboard/Navbar";
import Sidebar from "@/components/Dashboard/Sidebar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Sticky Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <Navbar />
            </div>

            {/* Main content wrapper */}
            <div className="flex w-full mt-14">
              {/* Sidebar */}
              <aside className="hidden md:block fixed left-0 top-14 bottom-0 z-40">
                <Sidebar />
              </aside>

              {/* Main Content */}
              <main className="flex-1 overflow-auto w-full md:pl-[280px] transition-all duration-300 ease-in-out">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
