import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';

import { FcPrevious } from 'react-icons/fc';
import { FcNext } from 'react-icons/fc';

const ConfrimModal = forwardRef(function ConfrimModal(
    {
        title,
        condition,
        description,
        previews,
        location,
        postItemFn,
        loading,
        response,
        from,
    },
    ref
) {
    const modal = useRef(null);

    useImperativeHandle(ref, () => ({
        open: () => {
            modal.current.showModal();
        },
        close: () => {
            modal.current.close();
        },
    }));

    const closeModal = async () => {
        modal.current.close();
    };

    const confrimPostItem = async () => {
        await postItemFn();
    };

    return createPortal(
        <div>
            <dialog ref={modal}></dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ConfrimModal;
