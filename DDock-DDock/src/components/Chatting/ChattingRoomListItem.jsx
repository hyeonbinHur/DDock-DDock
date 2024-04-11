import { useDocument } from '../../hooks/useDocument';
import { useDispatch } from 'react-redux';
import { open } from '../../store/chatRoomSlice';

export default function ChattingRoomListItem({ room }) {
    const { document: partner } = useDocument('User', room.partner);
    const dispatch = useDispatch();
    console.log(room.partner);
    return (
        <div>
            {partner && (
                <p
                    onClick={() =>
                        dispatch(
                            open({ roomId: room.roomId, partner: room.partner })
                        )
                    }
                >
                    {partner.displayName}
                </p>
            )}
        </div>
    );
}
