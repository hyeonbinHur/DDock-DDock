import { useEffect, useState } from 'react';
import ChattingRoomListItem from '../components/Chatting/ChattingRoomListItem';
import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuth';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import MemoPopUp from './MemoPopup';

export default function Memo() {
    const [chatUser, setChatUser] = useState('');
    const { document } = useCollection('User');
    const [search, setSearch] = useState('');
    const { user } = useAuthContext();
    const { document: currentUser } = useDocument('User', user?.uid);
    const {createChattingRoom} = useFirestore('ChattingRoom')
    const [openChattingRoomList, setOpenChattingRoomList] = useState(false);


    const show = () => {
        document.map((user) => {
            console.log(user);
        });
    };
    useEffect(() => {
        if (document) {
            document.map((user) => {
                if (user.email.includes(search)) {
                    setChatUser(user);
                }
            });
        }
    }, [search, document]);

    const createChatRoom = async () => {
     
        console.log("create chatting room start")
        const roomID =  await createChattingRoom(currentUser,chatUser,'ChattingRoom')
        console.log(roomID);

    };

    const togglePopUp = () =>{
        setOpenChattingRoomList(!openChattingRoomList)
    }

    return (
        <>
            <label>search user</label>
            <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
            <p>{chatUser.displayName}</p>
            <button onClick={show}> show users </button>
            <button onClick={createChatRoom}>start chat with user</button>
            <div>

            </div>
            <ChattingRoomListItem />
            <button onClick={togglePopUp}>open chatting room list</button>
            {openChattingRoomList&& <MemoPopUp/>}
        </>
    );
}
