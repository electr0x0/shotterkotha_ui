"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IconInfoCircle, IconLoader2 } from "@tabler/icons-react"
import axiosInstance from "@/utils/axiosInstance"

const timeRanges = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y", label: "Last Year" },
]

const crimeTypes = [
  { value: "all", label: "All Crimes" },
  { value: "theft", label: "Theft" },
  { value: "assault", label: "Assault" },
  { value: "vandalism", label: "Vandalism" },
  { value: "fraud", label: "Fraud" },
]

// Dynamically import the map component
const Map = dynamic(
  () => import("./Map").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
)

export default function HeatmapComponent() {
  const [timeRange, setTimeRange] = useState("30d")
  const [crimeType, setCrimeType] = useState("all")
  const [intensity, setIntensity] = useState(0.7)
  const [data, setData] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axiosInstance.get('/reports/posts/heatmap/', {
          params: {
            time_range: timeRange,
            crime_type: crimeType
          }
        })
        setData(response.data.points)
        setMetadata(response.data.metadata)
      } catch (error) {
        console.error('Error fetching heatmap data:', error)
        setError('Failed to load heatmap data')
      } finally {
        setLoading(false)
      }
    }

    setMounted(true)
    fetchHeatmapData()
  }, [timeRange, crimeType])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <IconLoader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 relative z-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="z-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Crime Type</label>
            <Select value={crimeType} onValueChange={setCrimeType}>
              <SelectTrigger className="z-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {crimeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Heat Intensity</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="z-50">
                    <IconInfoCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="z-50">
                    Adjust the visibility of crime hotspots
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              value={[intensity * 100]}
              onValueChange={(value) => setIntensity(value[0] / 100)}
              max={100}
              step={1}
              className="z-40"
            />
          </div>
        </div>

        {metadata && (
          <div className="text-sm text-muted-foreground">
            Total crimes: {metadata.total_crimes} | Period: {new Date(metadata.date_from).toLocaleDateString()} - {new Date(metadata.date_to).toLocaleDateString()}
          </div>
        )}
      </Card>

      <Card className="p-4 h-[600px] relative z-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <IconLoader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-destructive">
            {error}
          </div>
        ) : (
          <Map data={data} intensity={intensity} />
        )}
      </Card>

      <Card className="p-4 relative z-10">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Low Crime Rate</span>
          <span>High Crime Rate</span>
        </div>
        <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mt-1" />
      </Card>
    </div>
  )
}