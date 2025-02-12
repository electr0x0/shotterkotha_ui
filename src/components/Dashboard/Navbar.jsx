"use client"
import Searchbar from "./Searchbar"
import Notification from "./Notification"
import ProfileDropdown from "./ProfileDropdown"

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="h-14 px-4">
        <div className="h-full w-full flex items-center justify-between">
          {/* Logo and Name - Left Aligned */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">SK</span>
            </div>
            <span className="font-semibold text-lg whitespace-nowrap">ShotterKotha</span>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <Searchbar />
          </div>

          {/* Right Section: Notifications & Profile */}
          <div className="flex items-center gap-2">
            <Notification />
            <ProfileDropdown />
            
          </div>
        </div>
      </div>
    </div>
  )
}

