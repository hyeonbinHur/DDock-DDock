export default function ChatDate({date}){
    const [datePart, timePart] = date.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);
    return (
        <div>
            <p>{month} 월 {day} 일</p>
        </div>
    );
}