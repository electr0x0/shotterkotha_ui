"use client"
import dynamic from "next/dynamic"

const HeatmapComponent = dynamic(
  () => import("@/components/Map/HeatmapComponent"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export default function HeatmapPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Crime Heatmap</h1>
        <p className="text-muted-foreground">
          Visualizing crime hotspots across Bangladesh
        </p>
      </div>
      <HeatmapComponent />
    </div>
  )
}