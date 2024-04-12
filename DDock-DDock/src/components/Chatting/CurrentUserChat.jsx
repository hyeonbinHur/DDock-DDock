import { useEffect, useState } from 'react';
import style from './UserChat.module.css';

export default function CurrentUserChat({ content, date, showBasicInfo }) {
    const [datePart, timePart] = date.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);
    const [cssStyle, setCssSytle] = useState(style.current_chat_container);

    useEffect(() => {
        if(showBasicInfo === false){
            setCssSytle(style.current_chat_container_without_info)
        }else{
            setCssSytle(style.current_chat_container)
        }
    },[showBasicInfo])

    return (

        <div className={cssStyle}>
            {showBasicInfo && (
                <span className={style.current_timeContainer}>
                    {hour} : {minute}
                </span>
            )}
            <span className={style.current_chat_content}>{content}</span>
        </div>
    );
}
