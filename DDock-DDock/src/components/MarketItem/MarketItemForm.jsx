import style from './MarketItem.module.css';
import { useEffect, useState, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import ItemModal from '../Modal/ItemStatusModal';


export default function MarketItemForm() {
    const { addDocument, response, loading } = useFirestore('MarketItem');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const modal = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        addDocument({
            title,
            description,
        });
    };
    function OPEN() {
         modal.current.open();
    }

    useEffect(() => {
        console.log("lodaing status from form "+loading);
        if (response.success === true && response.isPending === false) {
            setTitle('');
            setDescription('');
        }
    }, [response, response.isPending, loading]);

    return (
        <>
            <ItemModal ref={modal} response={response} loading={loading} navigate={navigate}  from={"market"}/>
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

                <button type="submit" onClick={OPEN}>
                    Add Item
                </button>
            </form>
        </>
    );
}
