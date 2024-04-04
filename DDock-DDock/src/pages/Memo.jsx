import defaultImg from '../assets/user.png';
import style from './memo.module.css';

import { projectStorage } from '../firebase/config';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리에서 v4 함수를 uuidv4라는 이름으로 가져옵니다.


export default function Memo() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    
    const uploadImage = () => {
        if (!imageUpload) return; // 파일이 선택되지 않았다면 아무 작업도 하지 않음
        const imageRef = projectStorage.ref(`images/${imageUpload.name}_${uuidv4()}`);
        imageRef.put(imageUpload).then(() => {
            imageRef.getDownloadURL().then((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        });
    };


    useEffect(() => {
        const imageListRef = projectStorage.ref('images/');
        imageListRef.listAll().then((response) => {
            response.items.forEach((item) => {
                item.getDownloadURL().then((url) => {
                    setImageUrls((prev) => [...prev, url]);
                });
            });
        });
    }, []);


    return (
        <div>
            <input
                type="file"
                onChange={(event) => {
                    setImageUpload(event.target.files[0]); // 이벤트 대상의 files 배열에서 첫 번째 파일을 선택
                }}
            />
            <button onClick={uploadImage}>submit image</button>
            <img className={style.image} src={defaultImg} alt="Default" />
            {imageUrls.map((url) => (
                <img src={url} alt="" key={url} />
            ))}
        </div>
    );
}
