import style from './MarketItemForm.module.css';
import { useState } from 'react';
import defaultImg from '../../assets/defaultImg.png';
import leftArrow from '../../assets/left.png';
import rightArrow from '../../assets/right.png';

export default function MarketItemForm({ doAction, data }) {
    const [title, setTitle] = useState(data ? data.title : '');
    const [description, setDescription] = useState(
        data ? data.description : ''
    );
    const handleSubmit = (event) => {
        event.preventDefault(); // 페이지 새로고침 방지
        doAction(title, description);
    };

    const [arrowCount, setArrowCount] = useState(0)

    const arrowCountMinus = () => {
        setArrowCount((prev) => prev-1)
    }
    const arrowCountPlus = () => {
        setArrowCount((prev) => prev+1)
    }

    return (
        <>
            <form className={style.form} onSubmit={handleSubmit}>
                <div className={style.imageContainer}>
                    
                    {arrowCount > 0 && <img src={leftArrow} onClick={arrowCountMinus} className={style.left}/>}
                    <div className={style.userImageContainer}>
                        <img src={defaultImg} className={style.defaultImg} />
                    </div>
                    {arrowCount < 10 && <img src={rightArrow} onClick={arrowCountPlus} className={style.right}/> }

                  
                </div>

                <p>0/10</p>
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
