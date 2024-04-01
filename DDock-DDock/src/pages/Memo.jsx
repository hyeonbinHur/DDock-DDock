import defaultImg from '../assets/default.png';
import style from './memo.module.css';
import { projectStorage } from '../firebase/config';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

export default function Memo() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

 
    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = projectStorage.ref(`images/${imageUpload.name + v4()}`);
        projectStorage.uploadBytes(imageRef, imageUpload).then((snapshot) => {
            projectStorage.ref(snapshot.ref.fullPath).getDownloadURL().then((url) => {
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
                    setImageUpload(event.target.files[0]);
                }}
            />
            <button onClick={uploadImage}>submit image</button>
            <img className={style.image} src={defaultImg} />

            {imageUrls.map((url) =>{
                return <img src={url} key={url}/>;
            })}
        </div>
    );
}
