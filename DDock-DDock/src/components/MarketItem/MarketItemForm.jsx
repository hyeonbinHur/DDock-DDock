import style from './MarketItem.module.css';
import { useEffect, useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom'; 

export default function MarketItemForm() {
    const { addDocument, response, isPending } = useFirestore('MarketItem');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = (event) => {
        event.preventDefault();
        addDocument({
            title,
            description,
        });
    };

    useEffect(() => {
        if (response.success === true && isPending === false) {
            setTitle('');
            setDescription('');
            // navigate('..');
        }
    }, [response, navigate, isPending]);

    return (
        <>
            <form className={style.form} onSubmit={handleSubmit}> 
                <p>
                    <label>
                        <span htmlFor="title">Title</span>
                        <input type="text" value={title} required onChange={(event)=>{setTitle(event.target.value)}}/>
                    </label>
                </p>
                <p>
                    <label>
                        <span>Description:</span>
                        <input type="text" value={description} required onChange={(event)=>{setDescription(event.target.value)}}/>
                    </label>
                </p>

                <button type="submit">Add Item</button>
            </form>
        </>
    );
}
