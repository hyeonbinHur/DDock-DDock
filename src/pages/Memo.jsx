import { useState } from 'react';
import { getCollection } from '../api/getCollection';
import { updateDoc } from '../api/updateDocument';

export default function Memo() {
    const [isOpen, setIsOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [id, setId] = useState('');
    const [newtitle, setTitle] = useState('');

    const showCollection = async () => {
        const response = await getCollection('Test');
        setDocuments(response);
        setIsOpen(true);
    };

    const updateItem = async () => {
        const item = {
            title: newtitle,
        };
        await updateDoc('Test', id, item);
    };
    return (
        <>
            <div className="flex flex-col items-center justify-center space-y-10">
                <button
                    onClick={() => showCollection()}
                    className="mt-40 p-2 border flex rounded-md font-bold hover:scale-90 hover:bg-black hover:text-white"
                >
                    show collection
                </button>
                <div
                    onClick={() => updateItem()}
                    className="p-2 border flex rounded-md font-bold hover:scale-90"
                >
                    update document
                </div>

                <label>Id</label>
                <input
                    className="border p-2"
                    value={id}
                    onChange={(e) => setId(e.currentTarget.value)}
                />
                <label>Title</label>
                <input
                    className="border p-2"
                    value={newtitle}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                {isOpen && documents.length > 0 && (
                    <ul>
                        {documents.map((doc) => (
                            <li key={doc.id}>{doc.id}</li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
