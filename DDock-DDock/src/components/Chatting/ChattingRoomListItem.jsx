import style from './ChattingRoomListItem.module.css'

export default function ChattingRoomListItem(){
    return (
        <div className={style.itemContainer}>
            <p htmlFor=""> user 1</p>
            <p htmlFor=""> user 2</p>
            <p> time </p>
        </div>
    );
}