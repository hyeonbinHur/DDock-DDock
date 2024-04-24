import { Link } from 'react-router-dom';

export default function ListItem({ item, topic }) {
    return (
        <div className="pb-2 pt-10">
            <div>
                <img
                    className="w-full h-80 rounded-2xl mb-3"
                    src={item.images[0]}
                />
            </div>
            <div className="text-left  ">
                <div className="font-bold mb-3 text-xl overflow-hidden h-14">
                    <Link
                        className="line-clamp-2 block"
                        to={`/${topic}/${item.id}`}
                    >
                        {item.title}
                    </Link>
                </div>

                <div>
                    {item.conditions.map((condition) => (
                        <p key={condition.id}>{condition.value}</p>
                    ))}
                </div>

                <div className="mb-3 h-20 overflow-hidden ">
                    <p className="line-clamp-4">{item.description}</p>
                </div>
                <div className='w-full border-2 border-dotted mb-3'></div>

                <div className="font-light text-xs">
                    <span>{item.location.si} 시 </span>
                    <span>{item.location.gu} 구 </span>
                    <span>{item.location.dong} 동 </span>
                </div>
            </div>
        </div>
    );
}
