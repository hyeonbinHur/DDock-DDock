import { useState } from "react";

export default function AddReplyForm({addReply}) {

    const [replyContent, setReplyContent] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setReplyContent('');
        addReply(replyContent)
    }

    return (
        <form onSubmit={(event) =>handleSubmit(event) }>
            <p>one more comment here</p>
            <textarea
                onChange={(e) =>
                    setReplyContent(e.target.value)
                }
                value={replyContent || ''}
            ></textarea>

            <button>submit</button>
        </form>
    );
}
