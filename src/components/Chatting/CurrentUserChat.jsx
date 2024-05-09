import { useEffect, useState } from 'react';
import { useDocument } from '../../hooks/useDocument';
export default function CurrentUserChat({ chat, partner, roomId }) {
    const [datePart, timePart] = chat.createdAt.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);

    const [read, setRead] = useState(false);

    const { document: chatRoom } = useDocument('ChattingRoom', roomId);
    const { document: partnerInfo } = useDocument('User', partner.id);
    const [messageLoading, setMessageLoading] = useState(true);

    useEffect(() => {
        if (chatRoom && partnerInfo?.unread) {
            if (
                partnerInfo.unread.some((room) => room.roomId === chatRoom.id)
            ) {
                partnerInfo.unread.map((room) => {
                    if (room.roomId === chatRoom.id) {
                        if (
                            room.chat.some(
                                (userUnreadChat) => userUnreadChat.id == chat.id
                            )
                        ) {
                            setRead(false);
                        } else {
                            setRead(true);
                        }
                    }
                });
            }

            if (chatRoom.chat.some((snapShot) => snapShot.id === chat.id)) {
                setMessageLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatRoom, partnerInfo?.unread]);

    return (
        <div>
            <div
                className={`${
                    chat.showBasicInfo ? `mt-4` : `mt-1`
                } flex justify-end pr-5`}
            >
                <div className="text-sm mr-2 flex space-x-2 items-end">
                    {messageLoading && <div> 0 </div>}
                    {!read && !messageLoading && (
                        <div className="text-orange-300 font-bold">1</div>
                    )}
                    {chat.showBasicInfo && (
                        <div>
                            {hour === 24 ? '00' : String(hour).padStart(2, '0')}{' '}
                            :{String(minute).padStart(2, '0')}
                        </div>
                    )}
                </div>
                {chat.type === 'txt' && (
                    <div className="bg-sky-200 border-2 rounded-md border-sky-300 text-lg min-w-9 flex justify-end px-2 max-w-80 ">
                        <div className="max-w-64 break-words ">
                            {chat.content}
                        </div>
                    </div>
                )}

                <div>
                    {chat.type === 'img' && (
                        <img
                            className="w-32 m-1 rounded-md"
                            src={chat.content}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
