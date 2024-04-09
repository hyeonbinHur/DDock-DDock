import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import style from './UserDropDown.module.css';

export default function UserDropDown({ writer }) {
    const { user } = useAuthContext();
    const { createChattingRoom } = useFirestore('ChattingRoom');
    const [isActive, setIsActive] = useState(false);

    const startChatting = async () => {
        // const roomID =  await createChattingRoom(user,writer,'ChattingRoom')
        console.log('start chatting');
    };
    return (
        <>
            <div className={style.dropdown} onClick={()=>setIsActive(!isActive)}>
                <div className={style.dropdown_btn}>{writer.displayName}</div>
                {isActive && (
                    <div className={style.dropdown_content}>
                        <div className={style.dropdown_item}>정보보기</div>
                        <div className={style.dropdown_item}>채팅하기</div>
                        <div className={style.dropdown_item}>신고하기</div>
                    </div>
                )}
            </div>
        </>
    );
}
