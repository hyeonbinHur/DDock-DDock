import style from './MarketItem.module.css';
export default function MarketItemForm() {
    return (
        <>
            <form className={style.form}>
                <p>
                    <label>
                        <span htmlFor="title">Title</span>
                        <input type="text" required />
                    </label>
                </p>
                <p>
                    <label>
                        <span>Descrption:</span>
                        <input type="text" required />
                    </label>
                </p>

                <button>Add Item</button>
            </form>
        </>
    );
}
