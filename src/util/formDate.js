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
      timeZone: timezone
    }).formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
  
    // ISO 형식 "YYYY-MM-DDTHH:MM:SS"으로 변환
    return `${sydneyDate.year}-${sydneyDate.month}-${sydneyDate.day}T${sydneyDate.hour}:${sydneyDate.minute}:${sydneyDate.second}`;
  }

  export 
  function resizeImageToMaxSize(
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
