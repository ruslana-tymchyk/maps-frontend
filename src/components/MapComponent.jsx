import { MapContainer, TileLayer, GeoJSON} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import geojsonData from '../sources/countries.json'; 


export default function MapComponent(){

    const highlightSelected = (e) => {
        // selected country
        const country = e.target;

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
           center={[51.505, -0.09]} 
           zoom={3} 
           scrollWheelZoom={true} 
           style={{ height: '100%', width: '100%'}}
           maxBounds={[[-90, -360], [90, 360]]}
           maxBoundsViscosity={1}>
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png"
            maxZoom='13'
          />
          {/* 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png' */}
          {/* "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" */}
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