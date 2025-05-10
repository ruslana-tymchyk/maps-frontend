import { MapContainer, TileLayer, GeoJSON, useMap} from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import geoJsonData from '../sources/countries.json';
import L from 'leaflet';  // for Leaflet objects like Point 
import { LatLngBoundsLiteral, LeafletMouseEvent } from 'leaflet';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { Layer } from 'leaflet';

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

export default function MapComponent(){


    const highlightSelected = (e: LeafletMouseEvent) => {

        type Country =
            | "New Zealand"
            | "Papua New Guinea"
            | "New Caledonia"
            | "Solomon Islands"
            | "France"
            | "Vanuatu"
            | "Marshall Islands";

        const popUpPositions: Record<Country, [number,number]> = {
          // "New Zealand" : [-50.88375763943448, 166.0768850469291],
          // "Papua New Guinea": [-5.946631388408483, 143.75052550448433],
          // "New Caledonia" : [-22.36150647365175, 166.1812173019432],
          // "Solomon Islands": [-11.64816832810912, lng: 160.26036543494405],
          // "France" : [48.01381248943335, 4.452891442451406] 
          // "Vanuatu": [-20.190838772294295, 169.8157726679621]
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
        const countryName = layer.feature.properties.name as Country;

        // Returns true if popup needs to be fixed for this country
        const toFixPopup = countryName in popUpPositions;

        const popUpContent = `<div>
            <strong>${countryName}</strong><br/>
              <p>I want to travel here</p>
        </div>`

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

      //   // Example: show a popup with feature info
      //   country.bindPopup(`<div>
      //       <strong>${country.feature.properties.name}</strong><br/>
      //         <p>I want to travel here</p>
      //   </div>`, {
      //     //Offset the popup to appear more to the left for problematic coutries
      //     offset: country.feature.properties.name === "New Zealand" || 
      //             country.feature.properties.name === "Papua New Guinea" || 
      //             country.feature.properties.name === "New Caledonia" ||
      //             country.feature.properties.name === "Solomon Islands"
      //     ? new L.Point(-50, 0)
      //     : new L.Point(0,0),
      //   autoPan: true,
      //   autoPanPadding: new L.Point(50,50)
      //   }
      //  ).openPopup();

      //   console.log(country._popup._latlng.lng)
        // change borders of selected country to grey
        layer.setStyle({
          weight: 3,
          color: '#008aa5',
          dashArray: '',
          fillColor: '#008aa5',
          fillOpacity: 0.3
        })
      
        layer.bringToFront();  
      
      }
      
      
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

      }
      
      // function zoomToFeature(e){
      //   map.fitBounds(e.target.getBounds())
      // }
      
      const onEachFeature = (feature : Feature, layer: Layer) => {
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
                onEachFeature={onEachFeature}>
            </GeoJSON>
        </MapContainer>
      );
}