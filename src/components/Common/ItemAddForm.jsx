import { useRef, useState } from 'react';
import style from './ItemAddForm.module.css';
import defaultImg from '../../assets/defaultImg.png';
import { v4 as uuidv4 } from 'uuid';
// import { resizeImageToMaxSize } from '../../util/formDate';
// import { projectFirestore } from '../../firebase/config';
import { projectStorage } from '../../firebase/config';
import ItemModal from '../Modal/ItemStatusModal';
import { useNavigate } from 'react-router-dom';
import ConditionForm from './ConditionForm';

export default function ItemAddForm({
    addDocumentToServer,
    response,
    Topic,
    condition,
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [conditions, setConditions] = useState([]);
    const [imageUploads, setImageUploads] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const modal = useRef();
    const navigate = useNavigate();

    const addCondition = () => {
        const newConditionId = conditions.length + 1;
        setConditions([...conditions, { id: newConditionId }]);
    };

    const updateCondition = (id, newValue) => {
        const updatedConditions = conditions.map((condition) => {
            if (condition.id === id) {
                return { ...condition, value: newValue };
            }
            return condition;
        });
        setConditions(updatedConditions);
    };

    const deleteCondition = (id) => {
        const updatedConditions = conditions.filter(
            (condition) => condition.id !== id
        );
        setConditions(updatedConditions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!imageUploads) return;
        modal.current.open();
        setIsLoading(true);
        const uuid = uuidv4();
        // const maxWidth = 850;
        // const maxHeight = 650;
        // const maxFileSize = 10000 * 1024;

        // // const uploadPromises = imageUploads.map((imageUpload) => {
        // //     return new Promise((resolve, reject) => {
        // //         resizeImageToMaxSize(
        // //             imageUpload,
        // //             maxWidth,
        // //             maxHeight,
        // //             maxFileSize,
        // //             async (resizedFile) => {
        // //                 try {
        // //                     const imageRef = projectStorage.ref(
        // //                         `/${Topic}/${title}_${uuid}/${imageUpload.name}`
        // //                     );
        // //                     await imageRef.put(resizedFile);
        // //                     const url = await imageRef.getDownloadURL();
        // //                     resolve(url);
        // //                 } catch (error) {
        // //                     reject(error);
        // //                 }
        // //             }
        // //         );
        // //     });
        // // });

        let uploadPromises = imageUploads.map(async (imageUpload) => {
            try {
                const imageRef = projectStorage.ref(`/${Topic}/${title}_${uuid}/${imageUpload.name}`);
                await imageRef.put(imageUpload); // 이미지 업로드를 기다립니다.
                return await imageRef.getDownloadURL(); // 업로드된 이미지의 URL을 반환합니다.
            } catch (error) {
                console.log(error);
                return null; // 에러가 발생한 경우 null을 반환합니다.
            }
        });
    
        let images = await Promise.all(uploadPromises);
        // const urls = await Promise.all(uploadPromises);
        await addDocumentToServer(
            title,
            conditions,
            description,
            images,
            `/${Topic}/${title}_${uuid}/`
        );
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageUploads((prev) => [...prev, file]);
        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreviews((prev) => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
    };
    const deleteImage = () => {
        const newArray = [
            ...imagePreviews.slice(0, currentIndex),
            ...imagePreviews.slice(currentIndex + 1),
        ];
        setImagePreviews(newArray);

        const newUploadImages = [
            ...imageUploads.slice(0, currentIndex),
            ...imageUploads.slice(currentIndex + 1),
        ];

        setImageUploads(newUploadImages);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        {imagePreviews[currentIndex] && (
                            <button type="button" onClick={() => deleteImage()}>
                                delete
                            </button>
                        )}
                    </div>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className={style.fileInput}
                        ref={fileInputRef}
                    />
                    {currentIndex > 0 && (
                        <button
                            type="button"
                            onClick={() => setCurrentIndex((prev) => prev - 1)}
                        >
                            prev
                        </button>
                    )}
                    {imagePreviews[currentIndex] && (
                        <img src={imagePreviews[currentIndex]} />
                    )}
                    {!imagePreviews[currentIndex] && (
                        <img src={defaultImg} onClick={handleImageClick} />
                    )}

                    {currentIndex < 10 && imagePreviews[currentIndex] && (
                        <button
                            type="button"
                            onClick={() => setCurrentIndex((prev) => prev + 1)}
                        >
                            next
                        </button>
                    )}
                    <div> {currentIndex + 1}/10 </div>
                </div>

                <div>
                    <label>Set Title</label>

                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Set Description</label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                {condition && (
                    <>
                        {conditions.map((condition) => (
                            <div key={condition.id}>
                                <ConditionForm
                                    id={condition.id}
                                    updateCondition={updateCondition}
                                    deleteCondition={deleteCondition}
                                />
                            </div>
                        ))}
                        {conditions.length < 3 && (
                            <button type="button" onClick={addCondition}>
                                Add Conditions
                            </button>
                        )}
                    </>
                )}

                <button onClick={() => console.log(conditions)}>save</button>
            </form>
            <ItemModal
                ref={modal}
                response={response}
                loading={isLoading}
                navigate={navigate}
                from={Topic}
            />
        </>
    );
}
