"use client"
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { IconAlertTriangle } from '@tabler/icons-react'

export default function Map({ data, intensity }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const heatLayerRef = useRef(null)

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Custom map style with darker theme
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false, // We'll add it in a custom position
      }).setView([23.8103, 90.4125], 7)

      // Add a more modern map style
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19
      }).addTo(mapInstanceRef.current)

      // Add zoom control to the bottom right
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current)
    }

    // Update or create heatmap layer
    if (heatLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatLayerRef.current)
    }

    const points = data.map(point => [
      point.lat,
      point.lng,
      point.weight * intensity
    ])

    // Enhanced heatmap styling
    heatLayerRef.current = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 10,
      max: 1.0,
      gradient: {
        0.0: 'rgba(0, 255, 0, 0.5)',
        0.3: 'rgba(255, 255, 0, 0.7)',
        0.6: 'rgba(255, 165, 0, 0.8)',
        1.0: 'rgba(255, 0, 0, 0.9)'
      }
    }).addTo(mapInstanceRef.current)

    // Custom icon for crime markers
    const createCustomIcon = (crimeLevel) => {
      const color = crimeLevel > 700 ? '#ef4444' : 
                    crimeLevel > 500 ? '#f97316' : 
                    crimeLevel > 300 ? '#eab308' : '#22c55e'
      
      const svg = `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="${color}" fill-opacity="0.2"/>
          <circle cx="18" cy="18" r="8" fill="${color}"/>
          <circle cx="18" cy="18" r="4" fill="white"/>
        </svg>
      `

      return L.divIcon({
        html: svg,
        className: 'custom-crime-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    }

    // Add custom markers for major cities with enhanced popups
    data.filter(point => point.name.indexOf('Area') === -1).forEach(point => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createCustomIcon(point.crimes)
      })
      
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="text-lg font-bold mb-2">${point.name}</h3>
          <div class="space-y-1">
            <p class="text-sm">
              <span class="font-medium">Reported Crimes:</span> 
              <span class="text-red-500 font-bold">${point.crimes}</span>
            </p>
            <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full" style="width: ${(point.crimes/850)*100}%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Click to view detailed statistics
            </p>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 300,
        closeButton: false,
        offset: [0, -20]
      }).addTo(mapInstanceRef.current)
    })

    // Add custom CSS for the popup
    const style = document.createElement('style')
    style.textContent = `
      .custom-popup .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      }
      .custom-popup .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95);
      }
      .custom-crime-marker {
        filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) 
                drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
      }
    `
    document.head.appendChild(style)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      document.head.removeChild(style)
    }
  }, [data, intensity])

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden shadow-lg" />
  )
} 