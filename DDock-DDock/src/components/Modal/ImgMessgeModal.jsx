import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { projectStorage } from '../../firebase/config';

const ImgMessageModal = forwardRef(function ImgMessageModal(
    { preview, uploadImg, myId, doAction, roomId, sendURL },
    ref
) {
    const modal = useRef(null);

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

    const sendImage = () => {
        if (!uploadImg) return;
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
                            modal.current.close();
                        });
                    })
                    .catch((error) => {
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
        <div>
            <dialog ref={modal}>
                <button onClick={() => handleClose()}> x </button>
                <div>
                    <img src={preview} />
                </div>
                <button onClick={sendImage}>보내기</button>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ImgMessageModal;
