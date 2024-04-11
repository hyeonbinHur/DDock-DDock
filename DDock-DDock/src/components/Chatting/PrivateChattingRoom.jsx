import style from './PrivateChattingRoom.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {close} from '../../store/chatRoomSlice'
import { useDocument } from '../../hooks/useDocument'

export default function PrivateChattingRoom(){

    const dispatch = useDispatch()
    const openChatRoom = useSelector(state => state.openChatRoom.openChatRoom);
    const roomId = useSelector(state => state.openChatRoom.roomId);
    const partnerId = useSelector(state => state.openChatRoom.partnerId);
    
    const {document: partner} = useDocument('User',partnerId)
    const {document: chatRoom} = useDocument('ChattingRoom',openChatRoom.roomId)

    return(
        <>
        <div className={style.container}>
            {partner.displayName}
        </div>
        </>
    )
}