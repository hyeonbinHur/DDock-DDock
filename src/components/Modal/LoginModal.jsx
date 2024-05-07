import { AiOutlineClose } from 'react-icons/ai';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import pocketLogo from '../../assets/logo/logo.png';

const LoginModal = forwardRef(function LoginModal(props, ref) {
    const modal = useRef(null);

    useImperativeHandle(ref, () => ({
        open: () => {
            modal.current.showModal();
        },
        close: () => {
            modal.current.close();
        },
    }));

    return createPortal(
        <div className="w-full h-full">
            <dialog ref={modal} className="w-1/3 h-1/3 rounded-md">
                <div className="">
                    <div className="flex justify-end items-center p-2">
                        <div onClick={() => modal.current.close()}>
                            <AiOutlineClose className="size-5" />
                        </div>
                    </div>
                    <div className="w-full px-2 border"></div>
                    <div className="flex flex-col items-center justify-center pt-4 space-y-5">
                        <div className="flex flex-col items-center justify-center">
                            <img src={pocketLogo} className="w-1/3" />
                        </div>
                        <div className="font-bold text-2xl text-red-400">
                            Oops!
                        </div>
                        <div className="w-full">
                            You need to be signed in to
                            <span className="font-bold pl-2">like</span>
                        </div>
                        <div className="">
                            Go to{' '}
                            <span className=" text-blue-500">Sign in</span>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default LoginModal;
