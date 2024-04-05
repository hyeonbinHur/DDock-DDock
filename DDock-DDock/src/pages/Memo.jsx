import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Circle,
} from '@react-google-maps/api';
import React, { useEffect } from 'react';
import { useState } from 'react';

export default function Memo() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAlPYVkjdM1yEkocPAkchtBqYYdw_y-QuY',
    });

    const [location, setLocation] = useState(null);
    const [map, setMap] = React.useState(null);

    const [bound, setBound] = useState(1000);

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
                maximumAge: 300000,
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

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        console.log(
                            '정확한 주소:',
                            results[0].formatted_address
                        );
                        // 여기서 결과를 상태에 저장하거나 다른 작업을 수행할 수 있습니다.
                    } else {
                        console.log('결과를 찾을 수 없습니다.');
                    }
                } else {
                    console.log('Geocoder 실패: ' + status);
                }
            }
        );
    }

    function error() {
        console.log('Error occured');
    }

    const borederBound = () => {
        if (bound === 1000) {
            setBound(3000);
        } else if (bound === 3000) {
            setBound(5000);
        }
    };

    const narrowBound = () => {
        if (bound === 5000) {
            setBound(3000);
        } else if (bound === 3000) {
            setBound(1000);
        }
    };
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
                    <>
                        {' '}
                        <Marker
                            position={{
                                lat: currentLat,
                                lng: currentLng,
                            }}
                        />
                        <Circle
                            // 원의 중심 위치를 현재 위치로 설정
                            center={{
                                lat: currentLat,
                                lng: currentLng,
                            }}
                            // 원의 반경을 미터 단위로 설정 (여기서는 1000미터로 설정)
                            radius={bound}
                            // 원의 스타일 설정
                            options={{
                                strokeColor: '#00BFFF', // 원의 선 색상
                                strokeOpacity: 0.1, // 원의 선 투명도
                                strokeWeight: 0.1, // 원의 선 두께
                                fillColor: '#98DFFF', // 원의 채움 색상
                                fillOpacity: 0.35, // 원의 채움 투명도
                            }}
                        />
                    </>
                )}
            </GoogleMap>
            {bound < 4999 && <button onClick={borederBound}>+</button>}
            {bound > 1000 && <button onClick={narrowBound}>-</button>}

            <p>현재 범위 : {bound}</p>
            <button onClick={handleLocationClick}> Get current lat,lng</button>
        </div>
    ) : (
        <></>
    );
}
