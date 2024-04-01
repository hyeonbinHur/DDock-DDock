import defaultImg from '../assets/default.png';
import style from './memo.module.css';
import { projectStorage } from '../firebase/config';
import { useState } from 'react';
import {ref} from 'firebase/storage'


export default function Memo() {

    const [imageUpload,setImageUpload] = useState(null);
    const imageListRef = ref (projectStorage, "images/");

    const uploadImage = () =>{

        if(imageUpload === null) return;

        const imageRef = ref(projectStorage, `images/${imageUpload.name}`)
    }

    return (<div>
        <input type="file"
        onChange={(event) => {
            setImageUpload(event.target.value)
        }}/>
        <button onClick={uploadImage}>submit image</button>
        <img className={style.image} src={defaultImg} />
    </div>);
}
