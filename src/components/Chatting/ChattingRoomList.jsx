import style from './ChattingRoomList.module.css';
import ChattingRoomListItem from './ChattingRoomListItem';

export default function ChattingRoomList({ chatRoom, userId }) {

    return (
        <div className={style.popupContainer}>
            {document &&
                chatRoom.map(
                    (roomInfo) =>
                        roomInfo.started === true && (
                            <ChattingRoomListItem
                                room={roomInfo}
                                key={roomInfo.roomId}
                                userId={userId}
                            />
                            // <li key={roomInfo.roomId}> Hello</li>
                        )
                )}
        </div>
    );
}
