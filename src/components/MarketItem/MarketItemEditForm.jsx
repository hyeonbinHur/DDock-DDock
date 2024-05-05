import { useState, useRef } from 'react';
// import { projectFirestore, projectStorage } from '../../firebase/config';
import ConditionForm from '../Common/ConditionForm';

import { FcAddImage } from 'react-icons/fc';
import { TiDeleteOutline } from 'react-icons/ti';
import { FcPrevious } from 'react-icons/fc';
import { FcNext } from 'react-icons/fc';

import { editImagesOnStorage } from '../../util/editImage';

export default function MarketItemForm({ doAction, item, condition }) {
    const [title, setTitle] = useState(item.title);
    const [description, setDescription] = useState(item.description);
    const [conditions, setConditions] = useState(item.conditions);

    const fileInputRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    const [imageUploads, setImageUploads] = useState([]); // store user's img file, change the file to src value, then push the src value to the previews
    const [editImagePreviews, setEditImagePreviews] = useState(item.images);
    const [deletedImages, setDeletedImages] = useState([]);

    // const [response, setResponse] = useState(null);

    useState(() => {
        if (item) {
            item.images.forEach(() => {
                const dummy = { nama: 'dummy' };
                setImageUploads((prev) => [...prev, dummy]);
            });
        }
    }, [item.images]);

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

        const finalimages = await editImagesOnStorage(
            editImagePreviews,
            item.bucket,
            deletedImages
        );

        await doAction(title, conditions, description, finalimages);

        // setResponse()
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageUploads((prev) => [...prev, file]);
        const reader = new FileReader();
        reader.onload = (event) => {
            const newPreview = {
                url: event.target.result,
                name: null,
                file: file,
            };
            console.log(newPreview);

            setEditImagePreviews((prev) => [...prev, newPreview]);
        };
        reader.readAsDataURL(file);
    };

    const deleteImage = () => {
        setDeletedImages((prev) => [...prev, editImagePreviews[currentIndex]]);

        const newArray = [
            ...editImagePreviews.slice(0, currentIndex),
            ...editImagePreviews.slice(currentIndex + 1),
        ];
        setEditImagePreviews(newArray);
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
                        <div className="lg:w-11/12 border rounded-lg border-stone-300 w-full h-96 transform flex items-center justify-center">
                            <div className="absolute size-10 hover:scale-90 top-[2%] right-[2%]">
                                {editImagePreviews[currentIndex] && (
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
                                ref={fileInputRef}
                                className="hidden"
                            />

                            {editImagePreviews[currentIndex] && (
                                <img
                                    className="w-full h-full"
                                    src={editImagePreviews[currentIndex].url}
                                />
                            )}
                            {!editImagePreviews[currentIndex] && (
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
                        {currentIndex < 10 &&
                            editImagePreviews[currentIndex] && (
                                <FcNext className="size-full" />
                            )}
                    </div>
                </div>

                <div className="text-center font-bold">
                    {currentIndex + 1}/10{' '}
                </div>

                {/* <label className="border  p-2 rounded-lg border-black "> */}
                <label className="text-left w-3/5 lg:hidden text-base italic">
                    Title
                </label>
                <button
                    type="button"
                    className="border bg-red-100"
                    onClick={() => console.log(editImagePreviews)}
                >
                    Check
                </button>
                <input
                    type="text"
                    value={title}
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
                                    oldCondition={condition.value}
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
                    value={description}
                />

                <button className="border hover:bg-blue-200 p-2 hover:scale-90 transition rounded-lg ">
                    save
                </button>
            </form>
        </>
    );
}
