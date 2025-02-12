"use client"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Searchbar from "./Searchbar"
import Notification from "./Notification"
import ProfileDropdown from "./ProfileDropdown"
import { Button } from "@/components/ui/button"
import { IconMenu2, IconUser, IconSettings, IconLogout, IconSun, IconMoon } from "@tabler/icons-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"

export default function Navbar({ onSearch }) {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    setIsAuthenticated(!!accessToken && !!refreshToken)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="h-14 px-4">
        <div className="h-full w-full flex items-center justify-between gap-4">
          {/* Mobile Menu - Only visible on small screens */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconMenu2 className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  {/* User Profile Section */}
                  <div className="px-2 py-6 flex items-center gap-2 border-b">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <IconUser className="w-5 h-5" />
                      </div>
                      {/* Online status indicator */}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">username</span>
                      <span className="text-sm text-muted-foreground">@username</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="px-2 space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2"
                      onClick={() => router.push('/profile')}
                    >
                      <IconUser className="h-4 w-4" />
                      Profile
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2"
                      onClick={() => router.push('/settings')}
                    >
                      <IconSettings className="h-4 w-4" />
                      Settings
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? (
                        <IconSun className="h-4 w-4" />
                      ) : (
                        <IconMoon className="h-4 w-4" />
                      )}
                      {theme === "dark" ? "Light" : "Dark"} mode
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-100/10"
                      onClick={() => {
                        // Add logout logic here
                      }}
                    >
                      <IconLogout className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo and Name - Left Aligned */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/feed')}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">SK</span>
            </div>
            <span className="font-semibold text-lg whitespace-nowrap">ShotterKotha</span>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-xl">
            <Searchbar onSearch={onSearch} />
          </div>

          {/* Right Section: Notifications & Profile */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Notification />
                <ProfileDropdown />
              </>
            ) : (
              <Button 
                onClick={() => router.push('/login')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

