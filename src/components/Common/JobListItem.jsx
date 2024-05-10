import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateTime } from '../../util/formDate';

export default function JobListItem({ item, topic }) {
    const [isCondition, setIsCondition] = useState(false);

    const { result: timeDif, unit: timeString } = calculateTime(
        item?.createdAt
    );

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
        item.images.length > 0 && (
            <Link to={`/${topic}/${item.id}`} className="flex lg:h-72 h-40">
                <div className="lg:h-80 lg:w-56 ">
                    <img
                        className="h-full rounded-l-xl rounded-r-none w-56"
                        src={item.images[0].url}
                    />
                </div>

                <div className="ml-3 lg:ml-10 lg:mt-3 lg:w-120 w-full h-full lg:space-y-3 space-y-1">
                    <div className="mb-2 h-5 flex items-centerw-2/3">
                        <div className="font-bold line-clamp-2 lg:line-clamp-1 ">
                            {item.title}
                        </div>
                    </div>

                    <div className="flex space-x-5 ">
                        <div className="text-gray-500 text-xs">
                            {item.location.dong}
                        </div>
                        <div className="text-gray-500 text-xs">
                            {timeDif} {timeString}
                        </div>
                    </div>

                    {item.price && (
                        <div className="lg:pb-2 pb-1 font-bold">
                            {item.period && (
                                <span className="text-xs pr-3">
                                    {item.period}
                                </span>
                            )}
                            {item.price} <span className="text-xs pl-1">$</span>
                        </div>
                    )}

                    {isCondition && (
                        <div className="text-xs h-16 space-y-1 hidden lg:block">
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

                    <div className="lg:line-clamp-3 line-clamp-2 mb-5 lg:mt-2 lg:h-20 h-10 lg:w-2/3 w-full ">
                        <p>{item.description}</p>
                    </div>

                    <div className="w-full border-2 border-dotted "></div>
                </div>
            </Link>
        )
    );
}
