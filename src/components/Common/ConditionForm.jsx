import { useState } from "react";

export default function ConditionForm({ id, updateCondition, deleteCondition }) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        updateCondition(id, e.target.value);
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button type="button" onClick={() => deleteCondition(id)}> delete current condition</button>
        </div>
    );
}