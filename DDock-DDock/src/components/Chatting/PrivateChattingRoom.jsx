import style from './PrivateChattingRoom.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../store/chatRoomSlice';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';

export default function PrivateChattingRoom() {
    const dispatch = useDispatch();
    const openChatRoom = useSelector(
        (state) => state.openChatRoom.openChatRoom
    );
    const roomId = useSelector((state) => state.openChatRoom.roomId);
    const partnerId = useSelector((state) => state.openChatRoom.partnerId);
    const { addChat } = useFirestore('ChaattingRoom');

    const { document: partner } = useDocument('User', partnerId);
    const { document: chatRoom } = useDocument(
        'ChattingRoom',
        openChatRoom.roomId
    );

    return (
        <>
            <div className={style.container}>
                {partner && <div> {partner.displayName}</div>}

                <button onClick={addChat}> send </button>
            </div>
        </>
    );
}
