import { forwardRef, useRef, useImperativeHandle } from 'react';
import ItemInModal from './ItemInModal';
import { createPortal } from 'react-dom';

const InterestsItemModal = forwardRef(function InterestsItemModal(
    { itemIds, displayName },
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

    const handleClose = async () => {
        modal.current.close();
    };
    const hello = () => {
        console.log(itemIds);
    };

    return createPortal(
        <div>
            <dialog ref={modal}>
                <button onClick={hello}>console</button>
                <button onClick={handleClose}>X</button>
                <p>{displayName} 의 관심상품 </p>

                {itemIds.map((id) => (
                    <li key={id}>
                        <ItemInModal id={id} />
                    </li>
                ))}
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default InterestsItemModal;
