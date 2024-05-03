export function formatDate(timestamp) {
    return new Date(timestamp.seconds * 1000).toLocaleString('en-AU', {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

export function getSydneyTimeISO() {
    // 시드니 시간대 설정
    const timezone = 'Australia/Sydney';
    const date = new Date();

    const sydneyDate = new Intl.DateTimeFormat('en-AU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone,
    })
        .formatToParts(date)
        .reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});

    // ISO 형식 "YYYY-MM-DDTHH:MM:SS"으로 변환
    return `${sydneyDate.year}-${sydneyDate.month}-${sydneyDate.day}T${sydneyDate.hour}:${sydneyDate.minute}:${sydneyDate.second}`;
}

export function resizeImageToMaxSize(
    file,
    maxWidth,
    maxHeight,
    maxFileSize,
    callback
) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        let canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 1; // 시작 품질
        const attemptResize = () => {
            canvas.toBlob(
                (blob) => {
                    if (blob.size > maxFileSize && quality > 0.1) {
                        quality -= 0.1; // 품질 감소
                        canvas.toDataURL('image/jpeg', quality);
                        attemptResize(); // 재귀적으로 품질 조절
                    } else {
                        const resizedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        callback(resizedFile); // 최종 파일 콜백 함수로 반환
                    }
                },
                'image/jpeg',
                quality
            );
        };

        attemptResize();
    };
    img.onerror = (error) => {
        console.error('Error in resizing image: ', error);
    };
}

export function calculateTime(timestamp) {
    const now = new Date();
    const sydneyDate = getSydneyTimeISO(now);
    const nowSydney = new Date(sydneyDate);
    const itemCreatedAt = new Date(timestamp);
    const diff = nowSydney - itemCreatedAt;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffhours = Math.floor(diff / (1000 * 60 * 60));
    const diffminutes = Math.floor(diff / (1000 * 60));

    const hours = nowSydney.getHours().toString().padStart(2, '0');
    const minutes = nowSydney.getMinutes().toString().padStart(2, '0');

    const iHours = itemCreatedAt.getHours().toString().padStart(2, '0');
    const iMinutes = itemCreatedAt.getMinutes().toString().padStart(2, '0');

    let result = 0;
    let unit = '';

    if (days > 365) {
        result = days / 365;
        unit = 'years ago';
    } else if (days > 30) {
        result = days / 30;
        unit = 'months ago';
    } else {
        if (days == 0) {
            if (hours != iHours) {
                result = diffhours;

                unit = 'hours ago';
            } else {
                if (minutes == iMinutes) {
                    result = 1;
                    unit = 'mins ago';
                } else {
                    result = diffminutes;
                    unit = 'mins ago';
                }
            }
        } else {
            result = days;
            unit = 'days ago';
        }
    }

    return { result, unit };
}

export function formDate2(timestamp) {
    const time = new Date(timestamp);

    const year = time.getFullYear();
    const numMonth = (time.getMonth() + 1).toString().padStart(2, '0'); // 월은 0에서 시작하므로 1을 더하고, 두 자리수를 유지
    const day = time.getDate().toString().padStart(2, '0');

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const month = monthNames[numMonth - 1];

    return { year, month, day };
}

export const mapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        {
            featureType: 'administrative.land_parcel',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road.arterial',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road.local',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road.local',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }],
        },
    ],
};
