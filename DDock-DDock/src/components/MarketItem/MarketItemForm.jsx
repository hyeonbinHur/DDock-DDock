import style from './MarketItem.module.css';
import { useEffect, useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

export default function MarketItemForm() {
    const { addDocument, response } = useFirestore('MarketItem');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        addDocument({
            title,
            description,
        });
    };

    useEffect(() => {
        if (response.success === true) {
            setTitle('');
            setDescription('');
        }
    }, [response]);

    return (
        <>
            <form className={style.form}>
                <p>
                    <label>
                        <span htmlFor="title">Title</span>
                        <input type="text" value={title} required onChange={(event)=>{setTitle(event.target.value)}}/>
                    </label>
                </p>
                <p>
                    <label>
                        <span>Descrption:</span>
                        <input type="text" value={description} required onChange={(event)=>{setDescription(event.target.value)}}/>

                    </label>
                </p>

                <button onClick={handleSubmit}>Add Item</button>
            </form>
        </>
    );
}
