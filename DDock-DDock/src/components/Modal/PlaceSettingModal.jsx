import {
    forwardRef,
    useRef,
    useImperativeHandle,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { createPortal } from 'react-dom';

import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Circle,
} from '@react-google-maps/api';

import { useFirestore } from '../../hooks/useFirestore';

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
    const [hashtagSi, setHashtagSi] = useState('');
    const [hashtagGu, setHashtagGu] = useState('');
    const [hashtagDong, setHashtagDong] = useState('');

    const testLat = -37.815303; // chagne all testLat, testLng to currentLat,currentLng
    const testLng = 144.952798;

    const [location, setLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [zoomSeting, setZoomSeting] = useState(16);
    const [bound, setBound] = useState(1000);

    const [currentLat, setCurrentLat] = useState(0);
    const [currentLng, setCurrentLng] = useState(0);

    const [center, setCenter] = useState({ lat: testLat, lng: testLng });

    const [selectedBound, setSelectedBound] = useState('dong');

    const [currentSi, setCurrentSi] = useState('');
    const [currentGu, setCurrentGu] = useState('');
    const [currentDong, setCurrentDong] = useState('');
    const [boundString, setBoundString] = useState('');

    // const [currentSi, setCurrentSi] = useState(
    //     user?.location.si ? user?.location.si : ''
    // );
    // const [currentGu, setCurrentGu] = useState(
    //     user?.location.gu ? user?.location.gu : ''
    // );
    // const [currentDong, setCurrentDong] = useState(
    //     user?.locaion.dong ? user?.location.dong : ''
    // );
    // const [boundString, setBoundString] = useState(
    //     user?.location?.si !== ''
    //         ? user?.location.si + '시'
    //         : '' + user?.location.gu !== ''
    //         ? user?.location.gu + '구'
    //         : '' + user.location.dong !== ''
    //         ? user?.locaion.dong + '동'
    //         : ''
    // );

    const { updateDocument } = useFirestore('User');

    useEffect(() => {
        let si = '';
        let gu = '';
        let dong = '';

        if (user && user.location) {
            if (user.location.si !== '') {
                si = user.location.si;
                setCurrentSi(user.location.si);
                setBoundString(`${si} 시 `);
                if (user.location.gu !== '') {
                    gu = user.location.gu;
                    setBoundString(`${si} 시 ${gu} 구`);
                    setCurrentGu(user.location.gu);
                }
                if (user.location.dong !== '') {
                    dong = user.location.dong; // 여기서 si 대신 dong을 사용해야 합니다.
                    setBoundString(`${si} 시 ${gu} 구 ${dong} 동`);
                    setCurrentDong(user.location.dong); // setCurrentGu 대신 setCurrentDong을 사용해야 합니다.
                }
                setLocation({ testLat, testLng });
            }
        }
    }, [user?.location, user]);

    const containerStyle = {
        width: '1200px',
        height: '550px',
    };

    useEffect(() => {
        setCenter({ lat: testLat, lng: testLng });
    }, [currentLat, currentLng]);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

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

    const handleClose = async () => {
        const originalUser = user;
        let cnt = 0;
        const updatedUser = {
            ...originalUser,
            location: {
                lat: '',
                lng: '',
                si: currentSi,
                gu: currentGu,
                dong: currentDong,
            },
        };
        if (originalUser.location.si !== currentSi) {
            cnt = 1;
        } else if (originalUser.location.gu !== currentSi) {
            cnt = 1;
        } else if (originalUser.location.dong !== currentSi) {
            cnt = 1;
        }
        if (cnt === 1) {
            await updateDocument(user.id, updatedUser, 'User');
        }

        placeSettingFn(hashtagSi, hashtagGu, hashtagDong);
        modal.current.close();
    };

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
        const lon = testLng; // 시드니의 경도

        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
        )
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

                const si = address.municipality;
                const gu = address.city;
                const dong = address.suburb;

                setCurrentSi(si);
                setCurrentGu(gu);
                if (dong === 'Melbourne') {
                    setCurrentDong('Melbourne CBD');
                }

                setBoundString(`${si} 시 ${gu} 구 ${dong} 동`);

                console.log(
                    `Country: ${country}, State: ${state}, Administrative Area Level 2: ${administrative_area_level_2}, Region: ${region}, Suburb: ${suburb}`
                );
            })
            .catch((error) => console.error('Error:', error));
    }

    function error() {
        console.log('Error occured');
    }

    const checkBound = (event) => {
        setSelectedBound(event.target.value);

        if (event.target.value === 'dong') {
            setBound(1000);
            setZoomSeting(16);
            setCenter({ lat: testLat, lng: testLng });
            setHashtagSi(currentSi);
            setHashtagGu(currentGu);
            setHashtagDong(currentDong);
        } else if (event.target.value === 'gu') {
            setBound(3000);
            setZoomSeting(14);
            setCenter({ lat: testLat, lng: testLng });
            setHashtagSi(currentSi);
            setHashtagGu(currentGu);
            setHashtagDong('');
        } else if (event.target.value === 'si') {
            setBound(5000);
            setZoomSeting(13);
            setCenter({ lat: testLat, lng: testLng });
            setHashtagSi(currentSi);
            setHashtagGu('');
            setHashtagDong('');
        }
    };
    const hello = () => {
        console.log('test lat' + testLat);
        console.log('test lng' + testLng);
    };

    return createPortal(
        <div>
            {isLoaded ? (
                <dialog ref={modal}>
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

                    <p>현재 범위 : {bound}</p>
                    <div>
                        <button onClick={handleLocationClick}>
                            내 위치 찾기
                        </button>
                    </div>

                    {selectedBound === 'si' && (
                        <div>
                            <span>{currentSi} 시 </span>{' '}
                        </div>
                    )}

                    {selectedBound === 'gu' && (
                        <div>
                            <span>{currentSi} 시 </span>{' '}
                            <span>{currentGu} 구 </span>{' '}
                        </div>
                    )}

                    {selectedBound === 'dong' && (
                        <div>
                            <span>{currentSi} 시 </span>{' '}
                            <span>{currentGu} 구 </span>{' '}
                            <span>{currentDong} 동 </span>{' '}
                        </div>
                    )}
                    {selectedBound === '' && (
                        <div>
                            {' '}
                            <span>{currentSi} 시 </span>{' '}
                            <span>{currentGu} 구 </span>{' '}
                            <span>{currentDong} 동 </span>{' '}
                        </div>
                    )}

                    {boundString !== '' && (
                        <div>
                            <input
                                type="radio"
                                value="dong"
                                checked={selectedBound === 'dong'}
                                onChange={checkBound}
                            />
                            <label>동 까지 / </label>

                            <input
                                type="radio"
                                value="gu"
                                checked={selectedBound === 'gu'}
                                onChange={checkBound}
                            />
                            <label>구 까지 / </label>

                            <input
                                type="radio"
                                value="si"
                                checked={selectedBound === 'si'}
                                onChange={checkBound}
                            />
                            <label>시 까지 / </label>

                            <div>
                                <button onClick={handleClose}>
                                    위치 설정 완료
                                </button>
                            </div>
                        </div>
                    )}
                    <button onClick={hello}>Console user info</button>
                </dialog>
            ) : (
                <p>Map is Loading...</p>
            )}
        </div>,
        document.getElementById('modal')
    );
});

export default PlaceSettingModal;
