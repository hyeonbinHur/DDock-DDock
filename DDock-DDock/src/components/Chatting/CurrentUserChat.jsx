import style from './UserChat.module.css';


export default function CurrentUserChat({content, date}){
    return(
        <div className={style.current_chat_container}>
            <span className = {style.current_chat_content}>
                {content}
            </span>
        </div>
    ) ;
}