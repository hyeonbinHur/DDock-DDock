import style from './PrivateChattingRoom.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../store/chatRoomSlice';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';

export default function PrivateChattingRoom() {
    const dispatch = useDispatch();
    const openChatRoom = useSelector(
        (state) => state.openChatRoom.openChatRoom
    );
    const roomId = useSelector((state) => state.openChatRoom.roomId);
    const partnerId = useSelector((state) => state.openChatRoom.partnerId);
    const { updateChat } = useFirestore('ChaattingRoom');
    const { user } = useAuthContext();

    const { document: partner } = useDocument('User', partnerId);
    const { document: chatRoom } = useDocument(
        'ChattingRoom',
        openChatRoom.roomId
    );
    // use Arrayunion??
    return (
        <>
            <div className={style.container}>
                {user && (
                    <>
                        {partner && <div> {partner.displayName}</div>}

                        <button
                            onClick={() =>
                                updateChat(
                                    'Hello',
                                    user.uid,
                                    'ChattingRoom',
                                    roomId
                                )
                            }
                        >
                            {' '}
                            send{' '}
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
