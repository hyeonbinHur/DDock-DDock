import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React, { useEffect } from 'react';
import { useState } from 'react';

export default function Memo() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAlPYVkjdM1yEkocPAkchtBqYYdw_y-QuY',
    });

    const [location, setLocation] = useState(null);
    const [map, setMap] = React.useState(null);

    const [currentLat, setCurrentLat] = useState(0);
    const [currentLng, setCurrentLng] = useState(0);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        setCenter({ lat: currentLat, lng: currentLng });
    }, [currentLat, currentLng]);

    const containerStyle = {
        width: '1200px',
        height: '550px',
    };

    // const center = {
    //     lat: currentLat,
    //     lng: currentLng,
    // };
    const onLoad = React.useCallback(function callback(map) {
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

        setCurrentLat(latitude);
        setCurrentLng(longitude);

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
                zoom={20}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                {location && (
                    <Marker
                        position={{
                            lat: currentLat,
                            lng: currentLng,
                        }}
                    />
                )}
            </GoogleMap>
            <button onClick={handleLocationClick}> Get current lat,lng</button>
        </div>
    ) : (
        <></>
    );
}
