import style from './ChattingRoomList.module.css';
import { useEffect, useState } from 'react';
import ChattingRoomListItem from './ChattingRoomListItem';
import { useDocument } from '../../hooks/useDocument';

export default function ChattingRoomList({user}) {
    const [chattingRoomList, setChattingRoomList] = useState([]);
    const {document: currentUser} = useDocument('User',user?.uid)
    useEffect(() => {
        if (currentUser) {
            setChattingRoomList(currentUser.chatRoom);
        }
    }, [currentUser]);

    return (
        <div className={style.popupContainer}>
            {chattingRoomList.map((roomInfo) => {
                return (
                    <ChattingRoomListItem
                        room={roomInfo}
                        key={roomInfo.roomId}
                    />
                );
            })}
        </div>
    );
}
