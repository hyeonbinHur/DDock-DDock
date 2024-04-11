import style from './PrivateChattingRoom.module.css'

export default function PrivateChattingRoom({partner}){
    return(
        <>
        <div className={style.container}>
            {partner}
        </div>
        </>
    )
}