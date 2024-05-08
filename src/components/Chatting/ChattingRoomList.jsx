import { TbBrandWechat } from 'react-icons/tb';
import { GrClose } from 'react-icons/gr';

import ChattingRoomListItem from './ChattingRoomListItem';

export default function ChattingRoomList({ chatRoom, userId, closeChatRoom }) {
    return (
        <div className="lg:w-64 w-1/2 bg-white absolute border-2 shadow-md rounded-md p-2">
            <div
                onClick={() => closeChatRoom()}
                className="flex items-end justify-end px-2"
            >
                <div className="hover:bg-stone-200 p-1 rounded-md cursor-pointer">
                    <GrClose />
                </div>
            </div>

            <div className="w-full  border-stone-400 mt-1 border-separate border"></div>
            {document && chatRoom.length > 0 ? (
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
                )
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-base text-gray-400">
                    <TbBrandWechat className="size-10 font-light" />
                    <p>No chats yet?</p>
                    <p>Reach out with someone now!</p>
                </div>
            )}
        </div>
    );
}
