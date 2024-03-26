import MarketItem from './MarketItem';
import style from './MarketItemList.module.css';
import { Link } from 'react-router-dom';
export default function MarketList() {
    return (
        <div>
            <Link to="/market/market-form">Add New Item</Link>

            <ul>
                <li className={style.list}>
                    <div>
                        <MarketItem />
                    </div>
                </li>
                <li className={style.list}>
                    <div>
                        <MarketItem />
                    </div>
                </li>

                <li className={style.list}>
                    <div>
                        <MarketItem />
                    </div>
                </li>
            </ul>
        </div>
    );
}
