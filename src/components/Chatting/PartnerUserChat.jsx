import defaultUserImg from '../../assets/user.png';
import { useEffect, useState } from 'react';
import { useDocument } from '../../hooks/useDocument';

export default function PartnerUserChat({
    avatar,
    displayName,
    roomId,
    chat,
    user,
}) {
    const [datePart, timePart] = chat.createdAt.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);

    const [read, setRead] = useState(false);

    const { document: chatRoom } = useDocument('ChattingRoom', roomId);
    const { document: currentUser } = useDocument('User', user.id);
    useEffect(() => {
        if (chatRoom && currentUser?.unread) {
            if (
                currentUser.unread.some((room) => room.roomId === chatRoom.id)
            ) {
                currentUser.unread.map((room) => {
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.unread]);

    return (
        <div
            className={`flex space-x-2 ml-2  ${
                chat.showBasicInfo ? `mt-5` : `mt-1`
            }`}
        >
            {chat.showBasicInfo && (
                <div>
                    <img src={avatar || defaultUserImg} className="w-10" />
                </div>
            )}

            <div className="w-[80%]">
                {chat.showBasicInfo && (
                    <div>
                        <span>{displayName}</span>
                    </div>
                )}
                <div className={` flex `}>
                    {chat.type === 'txt' && (
                        <div
                            className={`${
                                chat.showBasicInfo ? `` : `ml-12`
                            } bg-white p-1 border-2 rounded-md max-w-[80%] min-w-[6%]`}
                        >
                            <div className="break-words">{chat.content}</div>
                        </div>
                    )}
                    {chat.type === 'img' && (
                        <img
                            src={chat.content}
                            className={`${
                                chat.showBasicInfo ? `` : `lg:ml-12 ml-12`
                            } w-40 rounded-md`}
                        />
                    )}
                    <div className="flex items-end space-x-3">
                        {chat.showBasicInfo && (
                            <span className="text-sm ml-2">
                                {String(hour).padStart(2, '0')} :{' '}
                                {String(minute).padStart(2, '0')}
                            </span>
                        )}
                        {!read && (
                            <span className="text-sm text-orange-300 font-semibold">
                                1
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
