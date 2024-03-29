import style from './MarketItem.module.css';
import { useState } from 'react';

export default function MarketItemForm({ doAction }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // 페이지 새로고침 방지
        doAction(title, description);
        // 여기서 필드를 초기화하고 싶지 않다면 초기화 코드를 제거합니다.
    };
    return (
        <>
            <form className={style.form} onSubmit={handleSubmit}>
                <p>
                    <label>
                        <span htmlFor="title">Title</span>
                        <input
                            type="text"
                            value={title}
                            required
                            onChange={(event) => {
                                setTitle(event.target.value);
                            }}
                        />
                    </label>
                </p>
                <p>
                    <label>
                        <span>Description:</span>
                        <input
                            type="text"
                            value={description}
                            required
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </label>
                </p>
                <button type="submit">Add Item</button>
            </form>
        </>
    );
}
