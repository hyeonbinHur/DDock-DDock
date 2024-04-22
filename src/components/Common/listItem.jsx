import { Link } from 'react-router-dom';

export default function ListItem({ item, topic }) {
    return (
        <div className="border-2">
            <div className="border-4 ">
                <img className="w-full h-96 rounded-xl" src={item.images[0]} />
            </div>
            <div className='justify-start'>
                <h1>
                    <Link to={`/${topic}/${item.id}`}>
                        title : {item.title}
                    </Link>
                </h1>
                {item.conditions.map((condition) => (
                    <p key={condition.id}>{condition.value}</p>
                ))}
                <div>
                    <p>desc : {item.description}</p>
                </div>

                <div>
                    <span>{item.location.si} 시 </span>
                    <span>{item.location.gu} 구 </span>
                    <span>{item.location.dong} 동 </span>
                </div>
            </div>
        </div>
    );
}
