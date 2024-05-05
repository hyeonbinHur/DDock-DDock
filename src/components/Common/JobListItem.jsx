import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function JobListItem({ item, topic }) {
    const [isCondition, setIsCondition] = useState(false);

    useEffect(() => {
        if (topic == 'job') {
            setIsCondition(true);
        } else if (topic == 'house') {
            setIsCondition(true);
        } else {
            setIsCondition(false);
        }
    }, [topic]);

    return (
        <Link to={`/${topic}/${item.id}`} className="flex h-72">
            <div className="h-80 w-56">
                <img
                    className="h-full rounded-l-xl rounded-r-none w-56"
                    src={item.images[0].url}
                />
            </div>
            <div className=" ml-10 mt-3 w-120">
                <div className="mb-2">
                    <p className="font-bold line-clamp-1 w-2/3 ">
                        {item.title}
                    </p>
                </div>

                {isCondition && (
                    <div className="text-xs h-12 ">
                        {item.conditions.map((condition) => (
                            <p
                                key={condition.id}
                                className="line-clamp-1 w-2/3"
                            >
                                {condition.value}
                            </p>
                        ))}
                    </div>
                )}

                <div>
                    <p className="line-clamp-3 mb-2 mt-2 h-16 w-2/3 ">
                        {item.description}
                    </p>
                </div>
                {topic !== 'job' && (
                    <div className="w-full border-2 border-dotted mb-3"></div>
                )}

                <div className="font-light text-xs p-1">
                    <span>{item.location.si} 시 </span>
                    <span>{item.location.gu} 구 </span>
                    <span>{item.location.dong} 동 </span>
                </div>
            </div>
        </Link>
    );
}
