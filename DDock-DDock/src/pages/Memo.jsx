import { useEffect, useState } from 'react';
import ChattingRoomListItem from '../components/Chatting/ChattingRoomListItem';
import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuth';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';

export default function Memo() {
    const [chatUser, setChatUser] = useState('');
    const { document } = useCollection('User');
    const [search, setSearch] = useState('');
    const { user } = useAuthContext();
    const { document: currentUser } = useDocument('User', user?.uid);
    const {createChattingRoom} = useFirestore('ChattingRoom')


    const show = () => {
        document.map((user) => {
            console.log(user);
        });
    };
    useEffect(() => {
        if (document) {
            document.map((user) => {
                console.log(user.email);
                if (user.email.includes(search)) {
                    setChatUser(user);
                }
            });
        }
    }, [search, document]);

    const createChatRoom = async () => {
        console.log('current user : ' + currentUser.displayName);
        console.log('대화 상대 : ' + chatUser.displayName);
        console.log("create chatting room start")
        await createChattingRoom(currentUser,chatUser,'ChattingRoom')
    };

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

            <ChattingRoomListItem />
        </>
    );
}
