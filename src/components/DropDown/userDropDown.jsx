import { BsChatHeart } from 'react-icons/bs';
import { RiUserSearchLine } from 'react-icons/ri';
// import { FcDecision } from 'react-icons/fc';
// import { FaRegUser } from 'react-icons/fa';
// import { BiUser } from 'react-icons/bi';
// import { AiOutlineUser } from 'react-icons/ai';
// import { CgProfile } from 'react-icons/cg';
// // import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { useDocument } from '../../hooks/useDocument';
import { useDispatch } from 'react-redux';
import { open, set } from '../../store/chatRoomSlice';
import { Link } from 'react-router-dom';

export default function UserDropDown({ user1, user2, closeDropDown }) {
    // const { user } = useAuthContext();
    const { createChattingRoom } = useFirestore('ChattingRoom');
    const { document: user1Data } = useDocument('User', user1);
    const { document: user2Data } = useDocument('User', user2);

    const dispatch = useDispatch();

    const startChatting = async () => {
        if (!user2Data) {
            return;
        }
        let chatPartnerExist = false;
        let chatRoomID;
        if (user1Data && user2Data) {
            user1Data.chatRoom.map((room) => {
                if (room.partner == user2Data.id) {
                    chatPartnerExist = true;
                    chatRoomID = room.roomId;
                }
            });
            user2Data.chatRoom.map((room) => {
                if (room.partner == user1Data.id) {
                    chatPartnerExist = true;
                    chatRoomID = room.roomId;
                }
            });
            if (chatPartnerExist) {
                dispatch(open({ roomId: chatRoomID, partner: user2Data.id }));
                closeDropDown();
            } else {
                if (user1Data.id !== user2Data.id) {
                    dispatch(
                        open({ roomId: undefined, partner: user2Data.id })
                    );
                    const roomID = await createChattingRoom(
                        user1Data,
                        user2Data,
                        'ChattingRoom'
                    );
                    dispatch(set({ roomId: roomID }));
                }
            }
        }
    };

    return (
        <div className="border-2 shadow-md w-full space-y-3 p-3 bg-white  rounded-md">
            <Link to={`/profile/${user2}/visit`}>
                <div className="flex border p-2 space-x-4 font-bold rounded-md hover:bg-gray-300">
                    <div className="flex items-center ">
                        <RiUserSearchLine className="size-7" />
                    </div>
                    <div>Profile</div>
                </div>
            </Link>

            {/* <div >Chatting</div> */}
            <div
                onClick={startChatting}
                className="border flex space-x-4 p-2 font-bold rounded-md hover:bg-gray-300"
            >
                <div className="flex items-center">
                    <BsChatHeart className="size-7" />
                </div>
                <div>Chatting</div>
            </div>
        </div>
    );
}
