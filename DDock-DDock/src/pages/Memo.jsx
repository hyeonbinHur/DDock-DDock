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
    const [zoomSeting, setZoomSeting] = useState(16);
    const [bound, setBound] = useState(1000);
    const [currentLat, setCurrentLat] = useState(0);
    const [currentLng, setCurrentLng] = useState(0);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });

    const testLat = -37.811609; // chagne all testLat, testLng to currentLat,currentLng
    const testLng = 144.977227;
    

    useEffect(() => {
        setCenter({ lat: testLat, lng: 144.952798 });
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

        // const geocoder = new window.google.maps.Geocoder();
        // geocoder.geocode({ location: { lat:testLat,  lng:testLng}}, (results, status) => {
        //     if (status === 'OK' && results[0]) {
        //         let dong = null;
        //         let gu = null;

        //         // address_components 배열을 순회하며 나라와 동네 정보 추출
        //         results[0].address_components.forEach((component) => {

        //             if (component.types.includes('locality')) {
        //                 dong = component.long_name;
        //             }
        //             if (component.types.includes('administrative_area_level_2')) {
        //                 gu = component.long_name;
        //             }
        //             // 동네 정보가 locality에 없는 경우 다른 타입을 확인할 수 있음

        //         });

        //         console.log(`동: ${dong} , 구: ${gu}`);
        //         console.log(results[0].address_components)
        //     } else {
        //         console.log('Geocoder 결과를 찾을 수 없거나 실패했습니다:', status);
        //     }
        // });

        const lat = testLat; // 시드니의 위도
        const lon = testLng // 시드니의 경도

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // data에서 필요한 정보 추출
                const address = data.address;
                const country = address.country;
                const state = address.state;
                // 'administrative_area_level_2'는 OpenStreetMap 데이터에 따라 다르게 표현될 수 있으며, 주로 'county' 등으로 나타납니다.
                const administrative_area_level_2 =
                    address.county || address['state_district'];
                const region = address.region;
                const suburb = address.suburb;

                console.log(
                    `Country: ${country}, State: ${state}, Administrative Area Level 2: ${administrative_area_level_2}, Region: ${region}, Suburb: ${suburb}`
                );
            })
            .catch((error) => console.error('Error:', error));
    }

    function error() {
        console.log('Error occured');
    }

    const borederBound = () => {
        console.log(bound);
        if (bound === 1000) {
            setBound(3000);
            setZoomSeting(14);
        }
        if (bound === 3000) {
            setBound(5000);
            setZoomSeting(13);
        }
    };

    const narrowBound = () => {
        if (bound === 5000) {
            setBound(3000);
            setZoomSeting(14);
        }
        if (bound === 3000) {
            setBound(1000);
            setZoomSeting(16);
        }
    };
    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoomSeting}
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
                                lat: testLat,
                                lng: testLng,
                            }}
                        />
                        <Circle
                            // 원의 중심 위치를 현재 위치로 설정
                            center={{
                                lat: testLat,
                                lng: testLng,
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
