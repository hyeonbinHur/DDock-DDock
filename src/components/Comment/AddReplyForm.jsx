import { useState, useRef, useEffect } from 'react';

export default function AddReplyForm({ addReply }) {
    const [replyContent, setReplyContent] = useState('');
    const replyRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setReplyContent('');
        addReply(replyContent);
    };

    useEffect(() => {
        replyRef.current.style.height = 'auto';
        replyRef.current.style.height = replyRef.current.scrollHeight + 'px';
    }, [replyContent]);

    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <div>
                <textarea
                    className="w-full rounded-md outline-none active:outline-none focus:outline-none p-1 px-2 bg-stone-100"
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={1}
                    value={replyContent || ''}
                    placeholder="add reply..."
                    ref={replyRef}
                ></textarea>
            </div>
            <div className="flex items-end justify-end">
                <button className="rounded-md hover:scale-110 bg-gray-300 p-1">
                    submit
                </button>
            </div>
        </form>
    );
}
