"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Crosshair, Loader2 } from 'lucide-react';

interface LocationPickerMapProps {
  onSelectState: (state: string) => void;
  selectedState: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function LocationPickerMap({ onSelectState, selectedState }: LocationPickerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const marker = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Load Leaflet from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      if (!mapRef.current) return;
      
      // Initialize map (center of India by default)
      const L = window.L;
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([20.5937, 78.9629], 5);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(leafletMap.current);

      setIsMapLoaded(true);

      leafletMap.current.on('click', (e: any) => {
        updateMarker(e.latlng);
        reverseGeocode(e.latlng);
      });
    };
    document.head.appendChild(script);

    return () => {
      if (leafletMap.current) leafletMap.current.remove();
    };
  }, []);

  const updateMarker = (latlng: any) => {
    const L = window.L;
    if (marker.current) {
      marker.current.setLatLng(latlng);
    } else {
      marker.current = L.marker(latlng, {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div class="w-6 h-6 bg-[#00E599] rounded-full border-4 border-white shadow-lg animate-pulse"></div>`
        })
      }).addTo(leafletMap.current);
    }
    leafletMap.current.setView(latlng, 12);
  };

  const reverseGeocode = async (latlng: any) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=10`);
      const data = await res.json();
      const state = data.address?.state || data.address?.region || "Punjab"; // Fallback to a valid recommendation state
      setAddress(data.display_name);
      
      // Map OSM states to our supported states if needed
      const supportedStates = ["Punjab", "Maharashtra", "UP", "MP", "Haryana"];
      const matchedState = supportedStates.find(s => state.includes(s)) || "Punjab";
      onSelectState(matchedState);
    } catch (e) {
      console.error("Geocoding failed", e);
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation || !leafletMap.current) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        updateMarker(latlng);
        reverseGeocode(latlng);
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden group shadow-2xl">
      <div id="map" ref={mapRef} className="w-full h-full z-0" />
      
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-[1000]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-3xl pointer-events-auto shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00E599]/20 rounded-2xl flex items-center justify-center border border-[#00E599]/30">
              <MapPin className="w-5 h-5 text-[#00E599]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Location</p>
              <h4 className="text-sm font-bold text-white max-w-[200px] truncate">{address || (isLocating ? "Detecting..." : "Pick a location on map")}</h4>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={locateMe}
          className="bg-[#00E599] text-black p-4 rounded-3xl pointer-events-auto shadow-2xl shadow-[#00E599]/20 flex items-center gap-2 font-black uppercase text-xs tracking-widest"
        >
          {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
          Locate Me
        </motion.button>
      </div>

      {!isMapLoaded && (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-[1001]">
          <Loader2 className="w-10 h-10 text-[#00E599] animate-spin mb-4" />
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Initializing Satellite Map...</p>
        </div>
      )}

      {/* Map Hint */}
      <div className="absolute bottom-6 left-6 z-[1000]">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2 text-[10px] font-bold text-white/60">
          <Crosshair className="w-3.5 h-3.5" />
          Tap anywhere to refine coordinates
        </div>
      </div>
    </div>
  );
}
