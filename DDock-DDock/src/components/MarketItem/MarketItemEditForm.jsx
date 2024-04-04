// import style from './MarketItemForm.module.css';
// import { useState, useRef, useEffect } from 'react';
// import defaultImg from '../../assets/defaultImg.png';
// import leftArrow from '../../assets/left.png';
// import rightArrow from '../../assets/right.png';
// import deleteImg from '../../assets/close.png';
// import { projectStorage } from '../../firebase/config';

import { useEffect, useState } from "react"

// export default function MarketItemForm({ doAction, data }) {

//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [currentIndex, setCurrentIndex] = useState(0); //에로우 카운트임 일단
//     const [uploadImageCount, setUploadImageCount] = useState(0); //현재까지 업로드된 이미지들 수
//     const fileInputRef = useRef(); //이미지 누르면 안보이게 했던 input필드 눌리게
//     const [imageUploads, setImageUploads] = useState([]); //업로드된 이미지들
//     const [imagePreviews, setImagePreviews] = useState([]); //선택한 이미지 미리보기
//     const [imageToFirestore, setImageTofirestore] = useState([]);//firebase에 업로드할 이미지 링크를 저장

//     // const [uploadedUrls, setUploadedUrls] = useState([]);
//     // const [deleteUrls, setDeleteUrls] = useState([]);
//     // const [deleteIndex, setDeleteIndex] = useState([]);

//     const [storageBucket, setStorageBucket] = useState('');

//     useEffect(() => {
//         if(data?.title){
//             setTitle(data.title)
//         }
//         if(data?.description){
//             setDescription(data.description)
//         }
//         if(data?.bucket){
//             setStorageBucket(data.bucket)
//         }
//         if(data?.images){
//             setImagePreviews(data.images)
//         }
        
//     }, [data?.title, data?.description, data?.bucket, data?.images])
    

//     function resizeImageToMaxSize(
//         file,
//         maxWidth,
//         maxHeight,
//         maxFileSize,
//         callback
//     ) {
//         const img = new Image();
//         img.src = URL.createObjectURL(file);
//         img.onload = () => {
//             let canvas = document.createElement('canvas');
//             let width = img.width;
//             let height = img.height;

//             if (width > height) {
//                 if (width > maxWidth) {
//                     height *= maxWidth / width;
//                     width = maxWidth;
//                 }
//             } else {
//                 if (height > maxHeight) {
//                     width *= maxHeight / height;
//                     height = maxHeight;
//                 }
//             }

//             canvas.width = width;
//             canvas.height = height;
//             const ctx = canvas.getContext('2d');
//             ctx.drawImage(img, 0, 0, width, height);

//             let quality = 1; // 시작 품질
//             const attemptResize = () => {
//                 canvas.toBlob(
//                     (blob) => {
//                         if (blob.size > maxFileSize && quality > 0.1) {
//                             quality -= 0.1; // 품질 감소
//                             canvas.toDataURL('image/jpeg', quality);
//                             attemptResize(); // 재귀적으로 품질 조절
//                         } else {
//                             const resizedFile = new File([blob], file.name, {
//                                 type: 'image/jpeg',
//                                 lastModified: Date.now(),
//                             });
//                             callback(resizedFile); // 최종 파일 콜백 함수로 반환
//                         }
//                     },
//                     'image/jpeg',
//                     quality
//                 );
//             };

//             attemptResize();
//         };
//         img.onerror = (error) => {
//             console.error('Error in resizing image: ', error);
//         };
//     }

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         if (!imageUploads) return;

//         console.log("버튼 눌림")
//         const maxWidth = 850;
//         const maxHeight = 650;
//         const maxFileSize = 1000 * 1024;
    
//         try {
//             const uploadPromises = imageUploads.map((imageUpload) => {
//                 return new Promise((resolve, reject) => {
//                     resizeImageToMaxSize(
//                         imageUpload,
//                         maxWidth,
//                         maxHeight,
//                         maxFileSize,
//                         async (resizedFile) => {
//                             try {
//                                 const imageRef = projectStorage.ref(`/${title}_${uuid}/${imageUpload.name}`);
//                                 await imageRef.put(resizedFile);
//                                 const url = await imageRef.getDownloadURL();
//                                 resolve(url);
//                             } catch (error) {
//                                 reject(error);
//                             }
//                         }
//                     );
//                 });
//             });
    
//             const urls = await Promise.all(uploadPromises);

//             setImageTofirestore(urls)
           
//             doAction(); // 모든 이미지 업로드 후 doAction 호출
        
//         } catch (error) {
//             console.error("Error uploading images: ", error);
//         }
//     };

//     const currentIndexMinus = () => {
//         setCurrentIndex((prev) => prev - 1);
//     };

//     const currentIndexPlus = () => {
//         setCurrentIndex((prev) => prev + 1);
//     };

//     const handleImageClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleImageChange = (event) => {
//         const file = event.target.files[0];
//         console.log(file);
//         setImageUploads((prev) => [...prev, file]); // 프리뷰 되면 이미지 업로드

//         if (file && file.type.match('image.*')) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImagePreviews((prev) => [...prev, e.target.result]); // 이 결과를 `src`로 사용하여 이미지 미리보기를 보여줍니다.
//                 setUploadImageCount((prev) => prev + 1);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const deleteFromPreviewArray = () => {

//         const newArray = [
//             ...imagePreviews.slice(0, currentIndex),
//             ...imagePreviews.slice(currentIndex + 1),
//         ];
//         setImagePreviews(newArray); // 프리뷰 배열에서 삭제

//         const newUploadImages =[
//             ...imageUploads.slice(0,currentIndex),
//             ...imageUploads.slice(currentIndex+1)
//         ]
//         setImageUploads(newUploadImages) // 삭제되면 업로드 이미지 배열에서도 삭제
//         setUploadImageCount((prev) => prev - 1);

//     };



//     return (
//         <>
//             <form className={style.form} onSubmit={handleSubmit}>
//                 <input
//                     type="file"
//                     className={style.fileInput}
//                     ref={fileInputRef}
//                     onChange={handleImageChange}
//                 />

//                 <div className={style.imageContainer}>
//                     {currentIndex > 0 && (
//                         <img
//                             src={leftArrow}
//                             onClick={currentIndexMinus}
//                             className={style.left}
//                         />
//                     )}
//                     <div className={style.userImageContainer}>
//                         <img
//                             src={imagePreviews[currentIndex] || defaultImg}
//                             className={style.defaultImg}
//                             onClick={handleImageClick}
//                         />

//                         {imagePreviews[currentIndex] && (
//                             <img
//                                 src={deleteImg}
//                                 className={style.deleteImg}
//                                 onClick={deleteFromPreviewArray}
//                             />
//                         )}
//                     </div>

//                     {currentIndex < imagePreviews.length && currentIndex < 9 && (
//                         <img
//                             src={rightArrow}
//                             onClick={currentIndexPlus}
//                             className={style.right}
//                         />
//                     )}
//                 </div>

//                 <p>{imagePreviews.length}/10</p>

//                 <p>
//                     <label>
//                         <span htmlFor="title">Title</span>
//                         <input
//                             type="text"
//                             value={title}
//                             required
//                             onChange={(event) => {
//                                 setTitle(event.target.value);
//                             }}
//                         />
//                     </label>
//                 </p>
//                 <p>
//                     <label>
//                         <span>Description:</span>
//                         <input
//                             type="text"
//                             value={description}
//                             required
//                             onChange={(event) => {
//                                 setDescription(event.target.value);
//                             }}
//                         />
//                     </label>
//                 </p>
//                 <button type="submit">Save</button>
//             </form>
//         </>
//     );
// }


export default function MarketItemForm({ doAction, data }) {
    const [title, setTitle] = useState('');
    useEffect(() =>{
        if(data?.title){
            setTitle(data.title)
        }
    }, [data?.title])
    return(
        <form onSubmit={doAction}>
            <p>{data ? title : null}</p>
            <p>업데이트 나중에 다시</p>
        </form>
    )
}