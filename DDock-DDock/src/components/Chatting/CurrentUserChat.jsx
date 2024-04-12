import style from './UserChat.module.css';

export default function CurrentUserChat({ content, date }) {
    const [datePart, timePart] = date.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);

    return (
        <div className={style.current_chat_container}>
             <span className={style.current_timeContainer}>
                {hour} : {minute}
            </span>
            <span className={style.current_chat_content}>{content}</span>
        </div>
    );
}
