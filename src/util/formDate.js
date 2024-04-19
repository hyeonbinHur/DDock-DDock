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
