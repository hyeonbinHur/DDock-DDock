import { Link } from "react-router-dom";

export default function ListItem({ item, topic }) {
    return (
        <div>
            <div>
                <img src={item.images[0]} />
            </div>
            <h1>
                <Link to={`/${topic}/${item.id}`}>{item.title}</Link>
            </h1>
            {item.conditions.map((condition) => (
                <p key={condition.id}>{condition.value}</p>
            ))}
            <div>
                <p>{item.description}</p>
            </div>
            <div>
                <span>{item.location.si} 시 </span>
                <span>{item.location.gu} 구 </span>
                <span>{item.location.dong} 동 </span>
            </div>
        </div>
    );
}
