import { MapContainer, TileLayer, GeoJSON, useMap} from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import geojsonData from '../sources/countries.json'; 

const SetMapConstraints = () => {
    const map = useMap();

    useEffect(() => {
      // Set strict bounds
      const bounds = [[-90, -180], [90, 180]];
      
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

export default function MapComponent(){


    const highlightSelected = (e) => {
        // selected country
        const country = e.target;

        // TODO: Make sure pop up shifts to the side if it crosses the bounds

        // Example: show a popup with feature info
        country.bindPopup(`<div>
            <strong>${country.feature.properties.name}</strong><br/>
              <p>I want to travel here</p>
        </div>`).openPopup();

      
        // change borders of selected country to grey
        country.setStyle({
          weight: 3,
          color: '#008aa5',
          dashArray: '',
          fillColor: '#008aa5',
          fillOpacity: 0.3
        })
      
        country.bringToFront();  
      
      }
      
      const resetHighlight = (e) => {
          // selected country
          const country = e.target;
      
          // change borders of selected country back to blue
          country.setStyle({
            weight: 2,
            color: '#00b4d8',
            dashArray: '1',
            fillOpacity: 0.1,
            fillColor: 'white'
          })

      }
      
      // function zoomToFeature(e){
      //   map.fitBounds(e.target.getBounds())
      // }
      
      const onEachFeature = (feature, layer) => {
        layer.on({
          mouseover:highlightSelected,
          mouseout: resetHighlight,
          // click: zoomToFeature
        })
      }


    return (
        <MapContainer 
           //attributes from map.options can be set here or in useEffect if need to be updated dynamically  
           center={[40, 30]} 
           zoom={2} 
           scrollWheelZoom={true} 
           style={{ height: '100%', width: '100%'}}
           noWrap={true}
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
                   data={geojsonData} 
                   style={{fillColor: 'white',
                          weight: 2,
                          opacity: 1,
                          color: '#00b4d8',
                          dashArray: '1',
                          fillOpacity: 0.1}}
                onEachFeature={onEachFeature}>
            </GeoJSON>
        </MapContainer>
      );
}