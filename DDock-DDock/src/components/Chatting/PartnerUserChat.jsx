import defaultUserImg from '../../assets/user.png';
import style from './UserChat.module.css';
export default function PartnerUserChat({
    content,
    avatar,
    displayName,
    date,
}) {
    const [datePart, timePart] = date.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);

    return (
        <div className={style.partner_chat_container}>
            <div className={style.partner_chat_info}>
                <img
                    className={style.partner_chat_avatar}
                    src={avatar || defaultUserImg}
                />
                <div>
                    <span className={style.partner_chat_displayName}>
                        {displayName}
                    </span>
                </div>
            </div>

            <div>
                
                <span className={style.partner_chat_content}>{content}</span>
                <span className={style.partner_timeContainer}>
                    {hour} : {minute}
                </span>
            </div>
        </div>
    );
}
