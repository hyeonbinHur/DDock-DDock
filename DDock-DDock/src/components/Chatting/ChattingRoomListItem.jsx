import { useDocument } from '../../hooks/useDocument';

export default function ChattingRoomListItem({room, doAction}){
    const {document: partner} = useDocument('User', room.partner)

    return (
        <div>
            {partner && <p onClick={() => doAction("Hello")}>{partner.displayName}</p>}
        </div>
    );
}