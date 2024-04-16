import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ImgMessageModal = forwardRef(function ImgMessageModal({ preview, uploadImg, myId, doAction }, ref) {
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
        doAction("close");
        modal.current.close();
    }
    console.log("프리뷰 ")
    console.log(preview)

    return createPortal(
        <div>
            <dialog ref={modal}> 
            <button onClick={() => handleClose()}> x </button>
            <div>
                <img src={preview}/>
            </div>
            <button>보내기</button>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ImgMessageModal;