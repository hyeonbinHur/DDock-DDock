import style from './MarketItem.module.css';
import { useState } from 'react';

export default function MarketItemForm({ doAction, data}) {
    const [title, setTitle] = useState(data ? data.title: '');
    const [description, setDescription] = useState(data ? data.description :'');

    const handleSubmit = (event) => {
        event.preventDefault(); // 페이지 새로고침 방지
        doAction(title, description);
      
    };
    console.log(data)
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
                <button type="submit">Save</button>
            </form>
        </>
    );
}
