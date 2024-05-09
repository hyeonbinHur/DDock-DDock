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
            <Link to={`/${topic}/${item.id}`} className="flex h-72">
                <div className="h-80 w-56">
                    <img
                        className="h-full rounded-l-xl rounded-r-none w-56"
                        src={item.images[0].url}
                    />
                </div>

                <div className=" ml-10 mt-3 w-120 h-full space-y-5">
                    <div className="mb-2 h-7 flex items-center space-x-5 w-2/3">
                        <div className="font-bold line-clamp-1 ">
                            {item.title}
                        </div>
                        <div className="text-gray-500 text-xs">
                            {item.location.dong}
                        </div>
                        <div className="text-gray-500 text-xs">
                            {timeDif} {timeString}
                        </div>
                    </div>

                    {isCondition && (
                        <div className="text-xs h-20 space-y-2  ">
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
                        <p className="line-clamp-3 mb-5 mt-2 h-20 w-2/3 ">
                            {item.description}
                        </p>
                    </div>

                    <div className="w-full border-2 border-dotted "></div>
                </div>
            </Link>
        )
    );
}
