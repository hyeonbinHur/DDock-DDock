import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import style from './UserDropDown.module.css';
import { useDocument } from '../../hooks/useDocument';
import { useDispatch } from 'react-redux';

import { open } from '../../store/chatRoomSlice';


export default function UserDropDown({ writer }) {
    const { user } = useAuthContext();
    const { createChattingRoom } = useFirestore('ChattingRoom');
    const [isActive, setIsActive] = useState(false);
    const { document: currentUser } = useDocument('User', user?.uid);

    const dispatch = useDispatch();


    const startChatting = async () => {
        if(currentUser.id !== writer.id){
            const roomID =  await createChattingRoom(currentUser,writer,'ChattingRoom')
            dispatch(
                open({ roomId: roomID, partner: writer.id })
            )
            console.log(roomID)
        }
    };

    return (
        <>
            <div className={style.dropdown} onClick={()=>setIsActive(!isActive)}>
                <div className={style.dropdown_btn}>{writer.displayName}</div>
                {isActive && (
                    <div className={style.dropdown_content}>
                        <div className={style.dropdown_item}>정보보기</div>
                        <div onClick={startChatting} className={style.dropdown_item}>채팅하기</div>
                        <div className={style.dropdown_item}>신고하기</div>
                    </div>
                )}
            </div>
        </>
    );
}
