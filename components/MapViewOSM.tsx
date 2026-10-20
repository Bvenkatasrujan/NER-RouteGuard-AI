import React from 'react';
import { View, StyleSheet, Platform, Text, ViewStyle } from 'react-native';
import WebView from 'react-native-webview';
import { IncidentReportDoc } from '../types/incident';
import { AIAnalysisDoc, RouteDoc } from '../types/routing';
import { geoJsonToLeaflet } from '../utils/geoJson';

interface MapViewOSMProps {
  route?: RouteDoc | null;
  origin?: { latitude: number; longitude: number };
  destination?: { latitude: number; longitude: number };
  incidents?: IncidentReportDoc[];
  aiAnalyses?: Record<string, AIAnalysisDoc>;
  height?: number;
  style?: ViewStyle;
  selectedHazardId?: string | null;
}

export const MapViewOSM: React.FC<MapViewOSMProps> = ({
  route,
  origin,
  destination,
  incidents = [],
  aiAnalyses = {},
  height = 340,
  style,
  selectedHazardId,
}) => {
  // Determine origin & destination lat/lng
  const startLat = origin?.latitude || route?.origin?.latitude || 26.1445;
  const startLng = origin?.longitude || route?.origin?.longitude || 91.7362;
  const destLat = destination?.latitude || route?.destination?.latitude || 27.5861;
  const destLng = destination?.longitude || route?.destination?.longitude || 91.8594;

  // Convert GeoJSON route geometry coordinates [longitude, latitude] to Leaflet [latitude, longitude]
  const rawGeoJsonCoords = route?.geometry?.coordinates || [
    [startLng, startLat],
    [92.1000, 26.8000],
    [92.4159, 27.2644],
    [destLng, destLat],
  ];
  const leafletPolyline = geoJsonToLeaflet(rawGeoJsonCoords);

  // Prepare Incident Hazards data array for Leaflet HTML JS script
  const hazardMarkersData = incidents.map((inc) => {
    const ai = aiAnalyses[inc.reportId] || aiAnalyses[inc.officerId];
    const hazardType = inc.hazardDescription?.toUpperCase().includes('LANDSLIDE')
      ? 'LANDSLIDE'
      : inc.hazardDescription?.toUpperCase().includes('FLOOD') || inc.weather === 'RAIN'
      ? 'FLOOD'
      : inc.weather === 'HEAVY_RAIN'
      ? 'HEAVY_RAIN'
      : inc.weather === 'STORM'
      ? 'STORM'
      : inc.weather === 'FOG'
      ? 'FOG'
      : inc.weather === 'SNOW'
      ? 'SNOW'
      : 'UNKNOWN';

    return {
      reportId: inc.reportId || 'REP_001',
      latitude: inc.latitude != null && !isNaN(Number(inc.latitude)) ? Number(inc.latitude) : 27.2644,
      longitude: inc.longitude != null && !isNaN(Number(inc.longitude)) ? Number(inc.longitude) : 92.4159,
      hazardType,
      weather: inc.weather || 'CLEAR',
      severity: inc.severity || 'MEDIUM',
      description: inc.hazardDescription || 'Reported hazard on corridor segment',
      riskScore: ai?.riskScore ?? (inc.severity === 'CRITICAL' ? 88 : 65),
      riskLevel: ai?.riskLevel || inc.severity || 'MEDIUM',
      affectedRoad: ai?.affectedRoad || 'NH-13 Bomdila Stretch',
      isSelected: selectedHazardId === inc.reportId,
    };
  });

  // Construct Leaflet HTML Bundle
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #0F172A; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .hazard-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 8px;
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          white-space: nowrap;
        }
        .severity-CRITICAL { background: #DC2626; }
        .severity-HIGH { background: #EA580C; }
        .severity-MEDIUM { background: #D97706; }
        .severity-LOW { background: #16A34A; }

        .pin-marker {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background: #2563EB;
          border: 3px solid #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          color: white;
          font-weight: bold;
          text-align: center;
          line-height: 18px;
          font-size: 11px;
        }
        .dest-pin { background: #16A34A; }

        .leaflet-popup-content-wrapper {
          background: #1E293B;
          color: #F8FAFC;
          border-radius: 10px;
          padding: 4px;
          border: 1px solid #334155;
        }
        .leaflet-popup-tip { background: #1E293B; }
        .popup-title { font-size: 13px; font-weight: 800; color: #F8FAFC; margin-bottom: 4px; }
        .popup-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; margin-bottom: 6px; }
        .popup-text { font-size: 11px; color: #94A3B8; margin-bottom: 2px; }
        .popup-highlight { font-weight: 700; color: #38BDF8; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${startLat}, ${startLng}], 9);

        // OpenStreetMap Standard Tiles
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var boundsGroup = [];

        // Route Polyline
        var routePolyline = ${JSON.stringify(leafletPolyline)};
        if (routePolyline && routePolyline.length > 0) {
          var polyline = L.polyline(routePolyline, {
            color: '#2563EB',
            weight: 6,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);
          boundsGroup.push(polyline);
        }

        // Start Marker
        var startIcon = L.divIcon({
          className: 'custom-pin',
          html: '<div class="pin-marker">A</div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        var startMarker = L.marker([${startLat}, ${startLng}], { icon: startIcon }).addTo(map).bindPopup('<div class="popup-title">ORIGIN LOCATION</div><div class="popup-text">Lat: ${startLat.toFixed(4)}, Lng: ${startLng.toFixed(4)}</div>');
        boundsGroup.push(startMarker);

        // Destination Marker
        var destIcon = L.divIcon({
          className: 'custom-pin',
          html: '<div class="pin-marker dest-pin">B</div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        var destMarker = L.marker([${destLat}, ${destLng}], { icon: destIcon }).addTo(map).bindPopup('<div class="popup-title">DESTINATION HUB</div><div class="popup-text">Lat: ${destLat.toFixed(4)}, Lng: ${destLng.toFixed(4)}</div>');
        boundsGroup.push(destMarker);

        // Hazard Markers Visual System
        var hazardSymbolMap = {
          'LANDSLIDE': '⛰️ LANDSLIDE',
          'FLOOD': '🌊 FLOOD',
          'HEAVY_RAIN': '🌧️ HEAVY RAIN',
          'STORM': '🌩️ STORM',
          'FOG': '🌫️ FOG',
          'SNOW': '❄️ SNOW',
          'UNKNOWN': '⚠️ HAZARD'
        };

        var hazards = ${JSON.stringify(hazardMarkersData)};
        hazards.forEach(function(h) {
          var iconSymbol = hazardSymbolMap[h.hazardType] || '⚠️ HAZARD';
          var labelText = iconSymbol + ' • ' + h.severity;

          var hazardIcon = L.divIcon({
            className: 'custom-hazard-icon',
            html: '<div class="hazard-marker severity-' + h.severity + '">' + labelText + '</div>',
            iconSize: [120, 26],
            iconAnchor: [60, 13]
          });

          var popupContent = 
            '<div class="popup-title">' + iconSymbol + '</div>' +
            '<div class="popup-badge severity-' + h.severity + '">' + h.severity + ' DANGER</div>' +
            '<div class="popup-text"><b>Weather:</b> ' + h.weather + '</div>' +
            '<div class="popup-text"><b>Description:</b> ' + h.description + '</div>' +
            '<div class="popup-text"><b>Risk Score:</b> <span class="popup-highlight">' + h.riskScore + ' / 100</span></div>' +
            '<div class="popup-text"><b>Risk Level:</b> ' + h.riskLevel + '</div>' +
            '<div class="popup-text"><b>Affected Road:</b> ' + h.affectedRoad + '</div>' +
            '<div class="popup-text"><b>Coordinates:</b> ' + h.latitude.toFixed(4) + ', ' + h.longitude.toFixed(4) + '</div>';

          var m = L.marker([h.latitude, h.longitude], { icon: hazardIcon }).addTo(map).bindPopup(popupContent);
          boundsGroup.push(m);

          if (h.isSelected) {
            m.openPopup();
          }
        });

        // Fit map bounds around all features
        if (boundsGroup.length > 0) {
          var group = new L.featureGroup(boundsGroup);
          map.fitBounds(group.getBounds().pad(0.18));
        }
      </script>
    </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height }, style]}>
        <iframe
          title="OpenStreetMap Leaflet"
          srcDoc={leafletHtml}
          style={{ width: '100%', height: '100%', border: 0, borderRadius: 12 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#0F172A',
    marginVertical: 8,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
