import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { useState } from 'react';

const containerStyle = {
    width: '1200px',
    height: '550px',
};

const center = {
    lat: 10.7304752,
    lng: 106.7063022,
};

export default function Memo() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAlPYVkjdM1yEkocPAkchtBqYYdw_y-QuY',
    });
    const [location, setLocation] = useState(null);
    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    function handleLocationClick() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000,
            });
        } else {
            console.log('Geolocation not supported');
        }
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ latitude, longitude });
        console.log('latitude: ' + latitude);
        console.log('longitude: ' + longitude);
        console.log('accuracy : ' + position.coords.accuracy);
    }

    function error() {
        console.log('Error occured');
    }

    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                {/* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
            <button onClick={handleLocationClick}> Get current lat,lng</button>
        </div>
    ) : (
        <></>
    );
}
