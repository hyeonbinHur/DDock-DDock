import style from './ChattingRoomList.module.css';
import { useEffect, useState } from 'react';
import ChattingRoomListItem from './ChattingRoomListItem';
import PrivateChattingRoom from './PrivateChattingRoom';

export default function ChattingRoomList({user}) {
    const [chattingRoomList, setChattingRoomList] = useState([]);
    const [isActiveChatRoom, setIsActiveChatRoom] = useState(false);


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
            {isActiveChatRoom && <PrivateChattingRoom partner={"Hello"} />}
        </div>
    );
}
