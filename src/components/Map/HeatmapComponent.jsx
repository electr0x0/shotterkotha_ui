"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IconInfoCircle } from "@tabler/icons-react"

// Dummy data for Bangladesh districts with crime data
const dummyData = [
  // Dhaka Division
  { lat: 23.8103, lng: 90.4125, weight: 100, name: "Dhaka", crimes: 850 },
  { lat: 24.0958, lng: 90.4125, weight: 75, name: "Gazipur", crimes: 650 },
  { lat: 23.6238, lng: 90.5000, weight: 85, name: "Narayanganj", crimes: 720 },
  
  // Chittagong Division
  { lat: 22.3569, lng: 91.7832, weight: 90, name: "Chittagong", crimes: 780 },
  { lat: 22.7010, lng: 90.3535, weight: 60, name: "Barisal", crimes: 450 },
  { lat: 22.8456, lng: 89.5403, weight: 70, name: "Khulna", crimes: 580 },
  
  // Sylhet Division
  { lat: 24.8949, lng: 91.8687, weight: 65, name: "Sylhet", crimes: 520 },
  { lat: 24.7471, lng: 90.4203, weight: 55, name: "Mymensingh", crimes: 420 },
  
  // Rajshahi Division
  { lat: 24.3745, lng: 88.6042, weight: 80, name: "Rajshahi", crimes: 680 },
  { lat: 25.7439, lng: 89.2752, weight: 45, name: "Rangpur", crimes: 380 },
  
  // Additional hotspots
  { lat: 23.7104, lng: 90.4074, weight: 95, name: "Dhaka Central", crimes: 820 },
  { lat: 23.7925, lng: 90.4078, weight: 88, name: "Uttara", crimes: 750 },
  { lat: 23.7511, lng: 90.3934, weight: 92, name: "Mirpur", crimes: 790 },
  { lat: 23.7461, lng: 90.3742, weight: 87, name: "Mohammadpur", crimes: 740 },
  { lat: 23.7511, lng: 90.4143, weight: 86, name: "Gulshan", crimes: 730 },
]

// Generate more data points around major cities
const generateDataPoints = () => {
  const points = [...dummyData]
  dummyData.forEach(city => {
    for (let i = 0; i < 10; i++) {
      points.push({
        lat: city.lat + (Math.random() - 0.5) * 0.5,
        lng: city.lng + (Math.random() - 0.5) * 0.5,
        weight: city.weight * (0.3 + Math.random() * 0.7),
        name: `${city.name} Area ${i + 1}`,
        crimes: Math.floor(city.crimes * (0.3 + Math.random() * 0.7))
      })
    }
  })
  return points
}

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setData(generateDataPoints())
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
      </Card>

      <Card className="p-4 h-[600px] relative z-0">
        <Map data={data} intensity={intensity} />
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