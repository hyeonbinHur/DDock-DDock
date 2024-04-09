import { useDocument } from '../../hooks/useDocument';

export default function ChattingRoomListItem({room}){
    const {document: partner} = useDocument('User', room.partner)

    return (
        <div>
            {partner && <p>{partner.displayName}</p>}
        </div>
    );
}