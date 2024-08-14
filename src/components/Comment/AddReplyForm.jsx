import { useState, useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AddReplyForm({ addReply }) {
    const [replyContent, setReplyContent] = useState('');
    const replyRef = useRef(null);
    const user = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setReplyContent('');
        addReply(replyContent);
    };

    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <div>
                <textarea
                    className="w-full rounded-md outline-none active:outline-none focus:outline-none p-1 px-2 bg-stone-100"
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={1}
                    value={replyContent}
                    placeholder="add reply..."
                    ref={replyRef}
                ></textarea>
            </div>

            {replyContent != '' && (
                <div className="flex items-end justify-end space-x-2">
                    <button className="rounded-md hover:scale-110 bg-gray-300 p-1">
                        submit
                    </button>
                    <div
                        className="border rounded-lg p-1 hover:scale-105 bg-gray-50 cursor-pointer"
                        onClick={() => setReplyContent('')}
                    >
                        cancel
                    </div>
                </div>
            )}
        </form>
    );
}
