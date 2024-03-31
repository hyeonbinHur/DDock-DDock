import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';
const DisplayNameModal = forwardRef(function DisplayNameModal({user},ref) {
    const modal = useRef(null);
    const [displayName, setDisplayName] = useState('');
    useImperativeHandle(ref, () => ({
        open: () => {
            modal.current.showModal();
        },
        close: () => {
            modal.current.close();
        },
    }));

    // 여기서 async 키워드의 올바른 위치
    const handleClose = async () => {
        if (user && typeof user.updateProfile === 'function') {
            try {
                await user.updateProfile({ displayName });
                modal.current.close();
            } catch (error) {
                console.error("디스플레이 네임 업데이트 실패", error);
            }
        } else {
            console.log(user)
            console.error("user 객체가 유효하지 않습니다.");
        }
    }

    return createPortal(
        <div>
            <dialog ref={modal}>
                <span>닉네임을 설정해주세요</span>
                <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)} // 수정됨
                    placeholder="닉네임을 설정해 주세요!" // placeholder 속성 사용
                />
                <button onClick={handleClose}>디스플레이 네임 저장</button>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default DisplayNameModal;
