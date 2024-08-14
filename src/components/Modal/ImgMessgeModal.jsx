import { CgClose } from 'react-icons/cg';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { projectStorage } from '../../firebase/config';
import spinner3 from '../../assets/logo/spinner3.svg';

const ImgMessageModal = forwardRef(function ImgMessageModal(
    { preview, uploadImg, doAction, roomId, sendURL },
    ref
) {
    const modal = useRef(null);
    const [loading, setLoading] = useState(false);
    const [sendingStart, isSendingStart] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            open: () => {
                modal.current.showModal();
            },
            close: () => {
                modal.current.close();
            },
        };
    });

    function handleClose() {
        doAction('close');
        modal.current.close();
    }
    // console.log("업로드 이미지")
    // console.log(uploadImg)

    useEffect(() => {
        if (sendingStart) {
            setLoading(true);
        }
    }, [sendingStart]);

    const sendImage = () => {
        if (!uploadImg) return;
        isSendingStart(true);

        const maxWidth = 1920;
        const maxHeight = 1080;
        const maxFileSize = 500 * 1024;

        resizeImageToMaxSize(
            uploadImg,
            maxWidth,
            maxHeight,
            maxFileSize,
            (resizedFile) => {
                const imageRef = projectStorage.ref(
                    `Chatting/${roomId}/${uploadImg.name}_${uuidv4()}`
                );
                imageRef
                    .put(resizedFile)
                    .then(() => {
                        imageRef.getDownloadURL().then(async (url) => {
                            // setImageUrl(url);
                            // const originalUser = user;
                            // const updatedUser = {
                            //     ...originalUser,
                            //     Avatar: url,
                            // };
                            // await updateDocument(userId, updatedUser, 'User');
                            await sendURL(url);
                            setLoading(false);
                            isSendingStart(false);
                            doAction('close');
                            modal.current.close();
                        });
                    })
                    .catch((error) => {
                        setLoading(false);
                        isSendingStart(false);
                        console.error('Error uploading image:', error);
                    });
            }
        );
    };

    function resizeImageToMaxSize(
        file,
        maxWidth,
        maxHeight,
        maxFileSize,
        callback
    ) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            let canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            let quality = 1;
            const attemptResize = () => {
                canvas.toBlob(
                    (blob) => {
                        if (blob.size > maxFileSize && quality > 0.1) {
                            quality -= 0.1;
                            canvas.toDataURL('image/jpeg', quality);
                            attemptResize();
                        } else {
                            const resizedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            callback(resizedFile); // 최종 파일 콜백 함수로 반환
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            attemptResize();
        };
        img.onerror = (error) => {
            console.error('Error in resizing image: ', error);
        };
    }

    return createPortal(
        <div className="">
            <dialog
                ref={modal}
                className="border-2 min-w-[30%] h-[57%] rounded-lg"
            >
                <div className="flex items-center justify-end pr-3">
                    <span
                        className="p-1 my-1 hover:bg-gray-200 rounded-md flex items-center"
                        onClick={() => handleClose()}
                    >
                        <button>
                            <CgClose />
                        </button>
                    </span>
                </div>
                <div className="flex justify-center">
                    {loading ? (
                        <img src={spinner3} className="h-96" />
                    ) : (
                        <img src={preview} className="h-96 rounded-md" />
                    )}
                </div>
                <div className="flex items-center justify-start py-1 px-2">
                    <span className="border px-2 py-1 rounded hover:bg-sky-200">
                        <button onClick={sendImage}>Send</button>
                    </span>
                </div>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ImgMessageModal;
