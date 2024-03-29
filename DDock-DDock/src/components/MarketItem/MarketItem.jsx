import style from './MarketItem.module.css';
import spinner from '../../assets/spinner.svg';
import { useFirestore } from '../../hooks/useFirestore';
export default function MarketItem({ document }) {
    const { loading } = useFirestore('MarketItem');

    return (
        <article className={style.event}>
            <h1>{document.title}</h1>
            <p>{document.description}</p>
            {loading === true && <img src={spinner} />}
            <menu>
                
            </menu>
        </article>
    );
}
