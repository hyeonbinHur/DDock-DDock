import { AiOutlineClose } from 'react-icons/ai';
import { MdGpsFixed } from 'react-icons/md';
import {
    forwardRef,
    useRef,
    useImperativeHandle,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { createPortal } from 'react-dom';

import { MarkerF } from '@react-google-maps/api';

import { GoogleMap, useJsApiLoader, Circle } from '@react-google-maps/api';

import { useFirestore } from '../../hooks/useFirestore';
import { mapOptions } from '../../util/formDate';

const PlaceSettingModal = forwardRef(function PlaceSettingModal(
    { placeSettingFn, user },
    ref
) {
    //paceSettingFn은 원하는 위치 태그를 마켓에다가 포함시켜야하기때문임 해시태그를 마켓페이지에 보여줘야함, 범위를 보여주려고
    const modal = useRef(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAlPYVkjdM1yEkocPAkchtBqYYdw_y-QuY',
    });

    // -37.802210, 144.968553 // City of Melbounre Carlton // suburb: carlton, municiplity: city of melbourne
    //-37.819220, 144.949051 // dockland
    //-37.813388, 144.986925 // East Melbounre
    //-37.795001, 144.931653 // Kensington
    //-37.813430, 144.959031 //CBD
    //-37.796466, 144.945239 // North Melbourne
    //-37.778838, 144.946305 // parkvile
    // -37.837814, 144.929717 // port melbourne
    // -37.825397, 144.951657 //South Wharf
    // -37.840319, 144.997647 //South Yarra
    //-37.823733, 144.964144 // South Bank
    // -37.809176, 144.927688 //West Melbourne
    // eslint-disable-next-line no-unused-vars
    const testLat = -37.81922; // chagne all testLat, testLng to currentLat,currentLng
    const testLng = 144.949051;

    // eslint-disable-next-line no-unused-vars
    const [map, setMap] = useState(null);
    const [currentLat, setCurrentLat] = useState(0);
    const [currentLng, setCurrentLng] = useState(0);
    const [center, setCenter] = useState({ lat: testLat, lng: testLng });
    // const [selectedBound, setSelectedBound] = useState('dong');
    const [currentDong, setCurrentDong] = useState('');
    const { updateDocument } = useFirestore('User');
    const [zoomLevel, setZoomLevel] = useState(16);

    useEffect(() => {
        if (user && user.location) {
            if (user.location.dong !== '') {
                setCurrentDong(user.location.dong); // setCurrentGu 대신 setCurrentDong을 사용해야 합니다.
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.location, user]);

    const containerStyle = {
        width: '30rem',
        height: '20rem',
        borderRadius: '0.375rem',
    };

    useEffect(() => {
        console.log(center);
        setCenter({ lat: testLat, lng: testLng });
        setZoomLevel(15);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLat, currentLng]);

    const moveToCenter = () => {
        // currentLat, currentLng
        setCenter({ lat: testLat, lng: testLng });
        setZoomLevel(15);
    };

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    // eslint-disable-next-line no-unused-vars
    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    useImperativeHandle(ref, () => ({
        open: () => {
            modal.current.showModal();
        },
        close: () => {
            modal.current.close();
        },
    }));

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

        const lat = testLat; // 시드니의 위도
        const lon = testLng; // 시드니의 경도

        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
        )
            .then((response) => response.json())
            .then((data) => {
                const address = data.address;
                const dong = address.suburb;
                moveToCenter();
                setCurrentLat(lat);
                setCurrentLng(lon);
                setCurrentDong(dong);

                if (dong === 'Melbourne') {
                    setCurrentDong('Melbourne CBD');
                }
                console.log(`동 : ${dong}`);
            })
            .catch((error) => console.error('Error:', error));
    }

    function error() {
        console.log('Error occured');
    }

    const handleClose = async () => {
        const originalUser = user;
        const updatedUser = {
            ...originalUser,
            location: {
                lat: '',
                lng: '',
                dong: currentDong,
            },
        };

        await updateDocument(user.id, updatedUser, 'User');
        placeSettingFn(currentDong);

        modal.current.close();
    };

    return createPortal(
        <div>
            {isLoaded ? (
                <dialog ref={modal} className="rounded-lg">
                    <div className="px-5 pb-5 bg-sky-50">
                        <div className="py-2 flex justify-end">
                            <div
                                className="border rounded-md p-1 hover:bg-gray-100 hover:scale-105"
                                onClick={() => modal.current.close()}
                            >
                                <AiOutlineClose />
                            </div>
                        </div>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={zoomLevel}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={mapOptions}
                        >
                            <Circle
                                center={{
                                    lat: testLat,
                                    lng: testLng,
                                }}
                                radius={1000}
                                options={{
                                    strokeColor: '#9DE4FF', // 원의 선 색상
                                    strokeOpacity: 0.1, // 원의 선 투명도
                                    strokeWeight: 0.1, // 원의 선 두께
                                    fillColor: '#9DE4FF', // 원의 채움 색상
                                    fillOpacity: 0.5, // 원의 채움 투명도
                                }}
                            />
                            <MarkerF
                                position={{
                                    lat: testLat,
                                    lng: testLng,
                                }}
                            />
                        </GoogleMap>
                        <div className="flex space-x-3 items-center px-2 mt-3">
                            <div
                                className="flex items-center p-2 hover:scale-105 hover:bg-slate-200 rounded-md "
                                onClick={handleLocationClick}
                            >
                                <MdGpsFixed />
                            </div>
                            <span>My Current Place :</span>
                            <span className="font-bold"> {currentDong}</span>
                        </div>
                        <div className="flex mt-3 mx-3">
                            <div
                                onClick={() => handleClose()}
                                className="flex border-2 rounded-md p-2 hover:bg-green-100"
                            >
                                Update My Place
                            </div>
                        </div>
                    </div>
                </dialog>
            ) : (
                <p>Map is Loading...</p>
            )}
        </div>,
        document.getElementById('modal')
    );
});

export default PlaceSettingModal;
