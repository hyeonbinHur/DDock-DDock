import { useEffect, useState } from 'react';

const MONTH = [
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

export default function ChatDate({ date }) {
    const [datePart, timePart] = date.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);
    const [wordMonth, setWordMonth] = useState();

    useEffect(() => {
        setWordMonth(MONTH[month - 1]);
    }, [month]);

    return (
        <div className="flex justify-center items-center font-semibold mb-2">
            <p>
                {day} - {wordMonth}
            </p>
        </div>
    );
}
