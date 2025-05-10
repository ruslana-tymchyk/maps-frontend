import { MapContainer, TileLayer, GeoJSON, useMap} from 'react-leaflet';
import { useEffect, useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import geoJsonData from '../sources/countries.json';
import L from 'leaflet';  // for Leaflet objects like Point 
import { LatLngBoundsLiteral, LeafletMouseEvent } from 'leaflet';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { Layer } from 'leaflet';

import {EntryType} from '../types/entry';

// Using 'as' does not actually perform type checking - this is like telling TS that I deffo know the type. Be careful and try to change this later.
const typedGeoJsonData = geoJsonData as FeatureCollection<Geometry, GeoJsonProperties>;

// const typeGeoJsonData: FeatureCollection<Geometry, GeoJsonProperties> = geoJsonData;

const SetMapConstraints = () => {
    const map = useMap();

    useEffect(() => {
      // Set strict bounds
      const bounds: LatLngBoundsLiteral = [[-90, -180], [90, 180]];
      
      // Ensure the map stays within bounds and prevent wrapping
      map.setMaxBounds(bounds)
      
      // Handler to force map back within bounds if it gets dragged outside
      const enforceMapBounds = () => {
        if (map) {
          // panInsideBounds checks if the map's current view extends outside the specified bounds
          map.panInsideBounds(bounds, { animate: false });
        }
      };
      //Performing event based checking for bounds escape, as continous checking will affect performance
      // Apply event listeners for various user interactions
      map.on('drag', enforceMapBounds);
      map.on('dragend', enforceMapBounds);
      map.on('moveend', enforceMapBounds);
      map.on('zoom', enforceMapBounds);
      
      return () => {
        // Clean up event listeners when component unmounts
        map.off('drag', enforceMapBounds);
        map.off('dragend', enforceMapBounds);
        map.off('moveend', enforceMapBounds);
        map.off('zoom', enforceMapBounds);
      };
    }, [map]);
    
    return null;
  };

interface MapComponentProps {
    responseData: any;
    showEntries: boolean;
  }

export default function MapComponent({ responseData, showEntries }: MapComponentProps ){
    
    const parsedResponseData = JSON.parse(responseData)
    const [geoJsonKey, setGeoJsonKey] = useState<number>(0);

     // Effect to update GeoJSON when showEntries or responseData changes
    useEffect(() => {
      // Increment the key to force GeoJSON component to re-render
      setGeoJsonKey(prevKey => prevKey + 1);
    }, [showEntries, responseData]);


// Create memoized event handlers to capture the latest showEntries and responseData values
    const eventHandlers = useMemo(() => {
      const highlightSelected = (e: LeafletMouseEvent) => {

        const popUpPositions: Record<string, [number,number]> = {
          "New Zealand" : [-5.88375763943448, 133.0768850469291],
          "Papua New Guinea": [-5.946631388408483, 133.75052550448433],
          "New Caledonia" : [-17.36150647365175, 129.1812173019432],
          "Solomon Islands": [-11.64816832810912, 140.26036543494405],
          "France" : [48.01381248943335, 4.452891442451406],
          "Vanuatu": [-20.190838772294295, 130.8157726679621],
          "Marshall Islands": [-20.190838772294295, 130.8157726679621]
        }

        // selected country
        const layer = e.target;
        // const countryName = layer.feature.properties.name as Country;
        const countryName: string = String(layer.feature.properties.name);

        // Returns true if popup needs to be fixed for this country
        const toFixPopup = countryName in popUpPositions;

        // Create different popup content based on showEntries and responseData
        let popUpContent = `<div class='w-24'>
              <strong>${countryName}</strong><br/>
              <p>Ask for book recommendations in a 
                  Chat to display entries.</p>
            </div>`;
        
        if (showEntries && parsedResponseData) {
          // Try to find country data in responseData
           const countryData = parsedResponseData?.countries?.find(
            (entry:EntryType) => entry.country_id === countryName
           );
                              
          if (countryData) {
            // Create rich popup content using the responseData
              popUpContent = `
                <div class="bg-white rounded-xl p-4 w-72 space-y-2 text-sm text-gray-700">
                  <h2 class="text-lg font-semibold text-gray-900">${countryName}</h2>
                  <div class="border-t border-gray-200 pt-2 space-y-1">
                    <div><span class="font-medium">Author:</span> ${countryData.author}</div>
                    <div><span class="font-medium">Title:</span> ${countryData.title}</div>
                    <div><span class="font-medium">Year:</span> ${countryData.year}</div>
                    <div><span class="font-medium">Rating:</span> ${countryData.rating}</div>
                    <div>
                      <a href="${countryData.goodreads_url}" target="_blank" class="text-blue-600 hover:underline">
                        View on Goodreads
                      </a>
                    </div>
                  </div>
                </div>
              `;
          } else {
            // Fallback content when country exists in responseData but has no specific data
            popUpContent = `<div>
              <strong>${countryName}</strong><br/>
              <p>No data available for this country</p>
            </div>`;
          }
        } 

        const popupOptions = {
          autoPan: true, 
          autoPanPadding: new L.Point(50,50)
        };

        if (toFixPopup){
          layer.bindPopup(popUpContent, popupOptions).openPopup(popUpPositions[countryName])
        }
        else {
          layer.bindPopup(popUpContent, popupOptions).openPopup()
        }

        // change borders of selected country to grey
        layer.setStyle({
          weight: 3,
          color: '#008aa5',
          dashArray: '',
          fillColor: '#008aa5',
          fillOpacity: 0.3
        })
      
        layer.bringToFront();  
      };
      
      const resetHighlight = (e: LeafletMouseEvent) => {
          // selected country
          const layer = e.target;
      
          // change borders of selected country back to blue
          layer.setStyle({
            weight: 2,
            color: '#00b4d8',
            dashArray: '1',
            fillOpacity: 0.1,
            fillColor: 'white'
          })
      };
      
      return {
        highlightSelected,
        resetHighlight
      };
    }, [showEntries, responseData]); // Re-create handlers when these values change

  // Create a memoized onEachFeature function that uses the latest eventHandlers
      const onEachFeature = useMemo(() => {
        return (feature: Feature, layer: Layer) => {
          layer.on({
            mouseover: eventHandlers.highlightSelected,
            mouseout: eventHandlers.resetHighlight,
          });
        };
      }, [eventHandlers]);


    return (
        <MapContainer 
           //attributes from map.options can be set here or in useEffect if need to be updated dynamically  
           center={[40, 30]} 
           zoom={2} 
           scrollWheelZoom={true} 
           style={{ height: '100%', width: '100%'}}
           minZoom={2}
           maxZoom={8}
           bounceAtZoomLimits={false}
           maxBoundsViscosity={1}>

          <SetMapConstraints/> 

          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png"
            minZoom={2}
            maxZoom={8}
            noWrap={true}
          />

          <GeoJSON attribution="&copy; geo-countries from Github.com" 
                   data={typedGeoJsonData} 
                   style={{fillColor: 'white',
                          weight: 2,
                          opacity: 1,
                          color: '#00b4d8',
                          dashArray: '1',
                          fillOpacity: 0.1}}
                onEachFeature={onEachFeature}
                key = {geoJsonKey}>
            </GeoJSON>
        </MapContainer>
      );
}

// TODO: 
// When showEnties changes - reinitialise GeoJSON such that it uses the latest response data & there shows counties
// Does showEntries have to be passed down?