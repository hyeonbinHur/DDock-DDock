import UserItemCard from './UserItemCard';

export default function UserItemsPopUp({ items, topic }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-9 ">
            {items.length != 0 ? (
                items.map((item) => (
                    <div key={item.id} className="min-h-96">
                        <UserItemCard item={item} topic={topic} />
                    </div>
                ))
            ) : (
                <div className="pl-7 font-bold text-sm ">
                    You do not have any items
                </div>
            )}
        </div>
    );
}
