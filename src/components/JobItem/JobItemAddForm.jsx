import { useState } from 'react';
import JobConditionForm from './JobConditionForm';

export default function JobItemAddForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [conditions, setConditions] = useState([]);

    const addCondition = () => {
        const newConditionId = conditions.length + 1;
        setConditions([...conditions, { id: newConditionId }]);
    };

    const updateCondition = (id, newValue) => {
        const updatedConditions = conditions.map((condition) => {
            if (condition.id === id) {
                return { ...condition, value: newValue };
            }
            return condition;
        });
        setConditions(updatedConditions);
    };
    const deleteCondition = (id) => {
        const updatedConditions = conditions.filter(condition => condition.id !== id);
        setConditions(updatedConditions);
    }
    const handleSubmit = () => {
        
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Set Title</label>

                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Set Description</label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
               
                {conditions.map((condition) => (
                    <div key={condition.id}>
                        <JobConditionForm
                            id={condition.id}
                            updateCondition={updateCondition}
                            deleteCondition = {deleteCondition}
                        />
                    </div>
                ))}
                 {conditions.length < 3 && (
                    <button type="button" onClick={addCondition}>
                        Add Conditions
                    </button>
                )}
            </form>
            <button onClick={() => console.log(conditions)}>
                consol conditions
            </button>
        </>
    );
}
