import defaultUserImg from '../../assets/user.png';
import style from './UserChat.module.css';
export default function PartnerUserChat({ content, avatar, displayName, date }) {
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
            </div>
        </div>
    );
}
