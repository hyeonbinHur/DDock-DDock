import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React from 'react'
const containerStyle = {
    width: '1200px',
    height: '550px'
  };
  
  const center = {
    lat: -3.745,
    lng: -38.523
  };
  
  
export default function Memo() {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAlPYVkjdM1yEkocPAkchtBqYYdw_y-QuY"
      })
    
      const [map, setMap] = React.useState(null)
    
      const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
    
        setMap(map)
      }, [])
    
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])
    
    
    return (
        isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                streetViewControl:false,
                mapTypeControl: false,
                fullscreenControl: false,

              }}
            >
              { /* Child components, such as markers, info windows, etc. */ }
              <></>
            </GoogleMap>
        ) : <></>
    );
}
