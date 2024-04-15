import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ImgMessageModal = forwardRef(function ImgMessageModal({ preview, uploadImg, myId }, ref) {
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
        modal.current.close();
    }

    return createPortal(
        <div>
            <dialog ref={modal}> 
            <button onClick={() => handleClose()}> x </button>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ImgMessageModal;