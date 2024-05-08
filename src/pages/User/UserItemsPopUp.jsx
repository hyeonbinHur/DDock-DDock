import { RiEmotionSadLine } from 'react-icons/ri';
import UserItemCard from './UserItemCard';

export default function UserItemsPopUp({ items, topic }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-9 ">
            {items.length != 0 ? (
                items.map((item) => (
                    <div key={item.id} className="h-100">
                        <UserItemCard item={item} topic={topic} />
                    </div>
                ))
            ) : (
                <div className="pl-7 font-bold text-sm flex text-gray-500 space-x-5">
                    No Posted Item Yet...
                    <RiEmotionSadLine className="size-5" />
                </div>
            )}
        </div>
    );
}
