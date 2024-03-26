import style from './MarketItem.module.css'

export default function MarketItem(){
    return(
        <article className={style.event}>
        <h1>Title</h1>
        <p>Description</p>
        <menu>
        </menu>
      </article>
    );

}