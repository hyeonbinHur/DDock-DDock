import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserItemCard({ item, topic }) {
    // image, title, description
    const [destination, setDestination] = useState('');

    useEffect(() => {
        if (item.type == 'C_Item') {
            setDestination('community');
        } else if (item.type == 'H_Item') {
            setDestination('house');
        } else if (item.type == 'M_Item') {
            setDestination('market');
        } else if (item.type == 'J_Item') {
            setDestination('job');
        }
    }, [item.type]);

    return (
        <Link to={`/${destination}/${item.id}`}>
            <div
                className={`${topic == 'community' && `hover:border-blue-200`}
            ${topic == 'market' && `hover:border-green-200`}
            ${topic == 'job' && `hover:border-yellow-200`}
            ${
                topic == 'house' && `hover:border-red-200`
            } border rounded-lg space-y-4 p-4 w-full h-full`}
            >
                <div className="w-full h-2/3 rounded-lg">
                    <img
                        className="w-full h-full rounded-lg"
                        src={item.images[0]}
                    />
                </div>
                <div className="h-1/3 space-y-3">
                    <div className="w-full line-clamp-1 font-bold">
                        {item.title}
                    </div>
                    <div className="w-full line-clamp-2">
                        {item.description}
                    </div>
                    <div className="flex font-light text-sm space-x-3">
                        <div>{item.location.si}</div>
                        <div>{item.location.gu}</div>
                        <div>{item.location.dong}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
