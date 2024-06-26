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
            ${topic == 'market' && `hover:border-purple-200`}
            ${topic == 'job' && `hover:border-orange-200`}
            ${topic == 'house' && `hover:border-green-300`}
            ${
                topic == 'like' && `hover:border-red-400`
            }  border rounded-lg border-gray-400 space-y-4 p-4 w-full lg:h-full h-72`}
            >
                <div className="w-full h-2/3 rounded-lg">
                    <img
                        className="w-full h-full rounded-lg"
                        src={item.images[0].url}
                    />
                </div>

                <div className="h-1/3  lg:space-y-3">
                    <div className="w-full line-clamp-1 font-bold break-words h-1/3">
                        {item.title}
                    </div>
                    <div className="w-full line-clamp-2 h-1/3">
                        {item.description}
                    </div>
                    <div className="flex font-light text-sm break-words h-1/3">
                        <div>{item.location.gu}</div>
                        <div>{item.location.dong}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
