"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  IconHome,
  IconMap2,
  IconAlertTriangle,
  IconChartBar,
  IconTrendingUp,
  IconUsers,
  IconBuildingCommunity,
  IconInfoCircle,
  IconPlus,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react"
import { ReportIncidentForm } from "@/components/Forms/ReportIncidentForm"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Modal, ModalBody, ModalContent, ModalTrigger } from "@/components/ui/modal"

const mainLinks = [
  {
    title: "Home",
    href: "/feed",
    icon: <IconHome className="w-4 h-4" />,
  },
  {
    title: "Crime Heat Map",
    href: "/heatmap",
    icon: <IconMap2 className="w-4 h-4" />,
  },
  {
    title: "Report Incident",
    href: "/report",
    icon: <IconAlertTriangle className="w-4 h-4" />,
  },
  {
    title: "Statistics",
    href: "/statistics",
    icon: <IconChartBar className="w-4 h-4" />,
  },
]

const communityLinks = [
  {
    title: "Popular Areas",
    href: "/areas",
    icon: <IconTrendingUp className="w-4 h-4" />,
  },
  {
    title: "Community Watch",
    href: "/community",
    icon: <IconUsers className="w-4 h-4" />,
  },
  {
    title: "Local Divisions",
    href: "/divisions",
    icon: <IconBuildingCommunity className="w-4 h-4" />,
  },
]

export default function Sidebar({ className }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.div 
      className={cn(
        "relative pb-12 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 scrollbar-hide",
        className
      )}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-3 h-6 w-6 rounded-full border shadow-md bg-background z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <IconChevronRight className="h-3 w-3" />
        ) : (
          <IconChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className="space-y-4 py-4 overflow-y-auto scrollbar-hide">
        <div className="px-3 py-2">
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={cn(isCollapsed ? "hidden" : "block")}
          >
            <Modal>
              <ModalTrigger asChild>
                <Button className="w-full justify-start gap-2" size="lg">
                  <IconPlus className="w-4 h-4" />
                  <span>Report New Incident</span>
                </Button>
              </ModalTrigger>
              <ModalBody>
                <ModalContent>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Report New Incident</h2>
                    <p className="text-muted-foreground">
                      Please provide detailed information about the incident
                    </p>
                  </div>
                  <ReportIncidentForm onClose={() => setOpen(false)} />
                </ModalContent>
              </ModalBody>
            </Modal>
            <Separator className="my-4" />
          </motion.div>
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full",
                    isCollapsed ? "justify-center px-2" : "justify-start gap-2"
                  )}
                  title={isCollapsed ? link.title : undefined}
                >
                  {link.icon}
                  {!isCollapsed && <span>{link.title}</span>}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={cn("px-3 py-2", isCollapsed ? "hidden" : "block")}
        >
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Community
          </h2>
          <div className="space-y-1">
            {communityLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  {link.icon}
                  {link.title}
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={cn("px-3 py-2", isCollapsed ? "hidden" : "block")}
        >
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Resources
          </h2>
          <ScrollArea className="h-[230px] px-1">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-3">
                <IconInfoCircle className="w-4 h-4" />
                <div className="flex flex-col items-start">
                  <span>Emergency Contacts</span>
                  <span className="text-xs text-muted-foreground">Quick access to important numbers</span>
                </div>
              </Button>
              {/* Add more resource items here */}
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </motion.div>
  )
} 