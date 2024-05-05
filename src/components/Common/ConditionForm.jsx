import { TiDeleteOutline } from 'react-icons/ti';
import { useState } from 'react';

export default function ConditionForm({
    id,
    updateCondition,
    deleteCondition,
    oldCondition,
}) {
    const [inputValue, setInputValue] = useState(
        oldCondition ? oldCondition : ''
    );

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        updateCondition(id, e.target.value);
    };

    return (
        <div className="w-full h-full flex justify-between p-1 space-x-2">
            <input
                className="w-full focus:outline-sky-500 p-2 border border-stone-400 rounded-lg"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
            />
            <div className="hover:scale-90 cursor-pointer transition">
                <TiDeleteOutline
                    type="button"
                    className="size-9"
                    onClick={() => deleteCondition(id)}
                />
            </div>
        </div>
    );
}
