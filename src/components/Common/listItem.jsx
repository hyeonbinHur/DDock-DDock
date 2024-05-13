import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateTime } from '../../util/formDate';

export default function ListItem({ item, topic }) {
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
    {
        item.title;
    }
    return (
        item.images.length > 0 && (
            <div
                className={`${
                    isCondition ? `h-[27rem]` : `h-[23rem]`
                } relative w-full  rounded-t-2xl`}
            >
                <Link to={`/${topic}/${item.id}`}>
                    <div>
                        <div>{item.id}</div>
                        <img
                            className="w-full h-52 rounded-t-2xl"
                            src={item.images[0].url}
                        />
                    </div>
                    <div className="text-left p-2 w-full ">
                        <div className="mt-3 h-6 font-bold">
                            <div className="line-clamp-1">{item.title}</div>
                        </div>

                        {item.price && (
                            <div className="pb-2 font-bold">
                                {item.period && (
                                    <span className="text-xs pr-3">
                                        {item.period}
                                    </span>
                                )}
                                <span className="text-xs">$</span> {item.price}
                            </div>
                        )}

                        {isCondition && (
                            <div className="h-16 space-y-1">
                                {item.conditions.map((condition) => (
                                    <li
                                        key={condition.id}
                                        className="text-xs line-clamp-1 font-semibold"
                                    >
                                        {condition.value}
                                    </li>
                                ))}
                            </div>
                        )}

                        <div className="mb-1 h-12 overflow-hidden ">
                            <p className="line-clamp-2">{item.description}</p>
                        </div>
                    </div>
                </Link>

                <div className="absolute bottom-0 w-full">
                    <div className="w-full border-dotted mb-1 border"></div>

                    <div className="font-light text-xs p-1 flex justify-between">
                        <span>{item.location.dong} </span>

                        <div>
                            {timeDif} {timeString}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
