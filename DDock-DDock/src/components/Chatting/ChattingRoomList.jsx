import style from './ChattingRoomList.module.css';
import { useEffect, useState } from 'react';
import ChattingRoomListItem from './ChattingRoomListItem';

export default function ChattingRoomList({user}) {
    const [chattingRoomList, setChattingRoomList] = useState([]);
    useEffect(() => {
        if (user) {
            setChattingRoomList(user.chatRoom);
        }
    }, [user]);

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
