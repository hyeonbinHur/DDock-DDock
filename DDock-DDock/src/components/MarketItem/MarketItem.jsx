import style from './MarketItem.module.css'

export default function MarketItem({document}){
    return(
        <article className={style.event}>
        <h1>{document.title}</h1>
        <p>{document.description}</p>
        <menu>
        </menu>
      </article>
    );

}