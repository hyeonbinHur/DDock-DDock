import { FcAddImage } from 'react-icons/fc';
import { TiDeleteOutline } from 'react-icons/ti';
import { FcPrevious } from 'react-icons/fc';
import { FcNext } from 'react-icons/fc';
import { useRef, useState } from 'react';
import style from './ItemAddForm.module.css';
// import defaultImg from '../../assets/defaultImg.png';
import { v4 as uuidv4 } from 'uuid';
// import { resizeImageToMaxSize } from '../../util/formDate';
// import { projectFirestore } from '../../firebase/config';
import { projectStorage } from '../../firebase/config';
import ItemModal from '../Modal/ItemStatusModal';
import { useNavigate } from 'react-router-dom';
import ConditionForm from './ConditionForm';
import PlaceSettingModal from '../Modal/PlaceSettingModal';

export default function ItemAddForm({
    addDocumentToServer,
    response,
    Topic,
    condition,
    user,
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
    const placeModal = useRef();
    const [imageRefs, setImageRefs] = useState([]);
    const [location, setLocation] = useState(user.location.dong);
    console.log(location);
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
        if (location === '') {
            placeModal.current.open();
            return;
        }

        modal.current.open();
        setIsLoading(true);
        const uuid = uuidv4();

        let uploadPromises = imageUploads.map(async (imageUpload) => {
            try {
                const imageRef = projectStorage.ref(
                    `/${Topic}/${title}_${uuid}/${imageUpload.name}`
                );
                await imageRef.put(imageUpload); // 이미지 업로드를 기다립니다.
                setImageRefs((prev) => [...prev, imageRef]);
                const url = await imageRef.getDownloadURL();
                return { url: url, name: imageUpload.name }; // 업로드된 이미지의 URL을 반환합니다.
            } catch (error) {
                console.log(error);
                return null; // 에러가 발생한 경우 null을 반환합니다.
            }
        });

        let images = await Promise.all(uploadPromises);
        // const urls = await Promise.all(uploadPromises);
        console.log(images);
        await addDocumentToServer(
            title,
            conditions,
            description,
            images,
            `/${Topic}/${title}_${uuid}/`,
            imageRefs
        );
    };
    const changeLocation = (dong) => {
        setLocation(dong);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageUploads((prev) => [...prev, file]);
        const reader = new FileReader();

        reader.onload = (event) => {
            const newPreview = {
                url: event.target.result,
                name: null,
            };
            setImagePreviews((prev) => [...prev, newPreview]);
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
            <form
                onSubmit={handleSubmit}
                className="pt-32 flex flex-col items-center justify-between space-y-5 mb-10"
            >
                <div className="flex items-center lg:w-1/3 justify-center w-3/4">
                    {/* // <button
                        //     type="button"
                        //     onClick={}
                        // >
                        //     prev
                        // </button> */}
                    <div
                        type="button"
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className="size-14"
                    >
                        {currentIndex > 0 && (
                            <FcPrevious className="size-full" />
                        )}
                    </div>
                    <div className="w-full items-center justify-center flex">
                        {/* <div>
                            
                                <button
                                   
                                >
                                    delete
                                </button>
                            
                        </div> */}

                        <div className="lg:w-11/12 border rounded-lg border-stone-300 w-full h-96 transform flex items-center justify-center">
                            <div className="absolute size-10 hover:scale-90 top-[2%] right-[2%]">
                                {imagePreviews[currentIndex] && (
                                    <TiDeleteOutline
                                        className="size-full"
                                        type="button"
                                        onClick={() => deleteImage()}
                                    />
                                )}
                            </div>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className={style.fileInput}
                                ref={fileInputRef}
                            />

                            {imagePreviews[currentIndex] && (
                                <img
                                    className="w-full h-full"
                                    src={imagePreviews[currentIndex].url}
                                />
                            )}
                            {!imagePreviews[currentIndex] && (
                                <div className="flex items-center justify-center">
                                    <FcAddImage
                                        className="size-28 hover:scale-110"
                                        onClick={handleImageClick}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        type="button"
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        className="size-14"
                    >
                        {currentIndex < 10 && imagePreviews[currentIndex] && (
                            <FcNext className="size-full" />
                        )}
                    </div>
                </div>

                <div className="text-center font-bold">
                    {currentIndex + 1}/10{' '}
                </div>
                <div className="w-3/5 lg:w-1/4 lg:flex justify-between">
                    <div>
                        <span className="text-base italic text-gray-400 pr-3">
                            Place :
                        </span>
                        {location != '' ? (
                            location
                        ) : (
                            <span className="text-red-400">
                                Please set location
                            </span>
                        )}
                    </div>

                    <div
                        onClick={() => placeModal.current.open()}
                        className="border px-2 py-1 rounded-lg border-green-200 font-bold text-base hover:bg-green-500 hover:scale-90"
                    >
                        {location != '' ? 'Change' : 'Set Location'}
                    </div>
                </div>

                {/* <label className="border  p-2 rounded-lg border-black "> */}
                <label className="text-left w-3/5 lg:hidden text-base italic">
                    Title
                </label>
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="lg:w-1/4 w-3/5 placeholder:text-transparent lg:placeholder:text-slate-400 border border-black rounded-md p-2 focus:outline-none placeholder:italic placeholder:text-slate-400 shadow-sm focus:border focus:border-sky-500 focus-ring-1"
                />

                {condition && (
                    <div className="lg:w-1/4 w-3/5 space-y-2">
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
                            <div className="flex items-end justify-end">
                                <button
                                    type="button"
                                    className="border hover:scale-90 transition border-stone-300 rounded-lg hover:bg-stone-300 p-1 text-sm italic"
                                    onClick={addCondition}
                                >
                                    Add Conditions
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* </label> */}
                <label className="text-left w-3/5 lg:hidden text-base italic">
                    Description
                </label>
                <textarea
                    className="placeholder:text-transparent w-3/5 text-sm lg:w-1/4 lg:placeholder:text-slate-400 size-min border  h-36 p-2 rounded-lg border-black  focus:outline-none placeholder:italic placeholder:text-slate-400 shadow-sm focus:border focus:border-sky-500 focus-ring-1"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descriptions..."
                />

                <button className="border hover:bg-blue-200 p-2 hover:scale-90 transition rounded-lg ">
                    save
                </button>
            </form>
            <ItemModal
                ref={modal}
                response={response}
                loading={isLoading}
                navigate={navigate}
                from={Topic}
            />
            <PlaceSettingModal
                ref={placeModal}
                placeSettingFn={changeLocation}
                user={user}
            />
        </>
    );
}
