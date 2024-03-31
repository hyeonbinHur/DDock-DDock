import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';

export default function ProfileEditPage(){
    const { userId } = useParams();
    const { document, error, loading } = useDocument('User', userId);
    return(
        <form>
            <input defaultValue={document.displayName}></input>
            <button>변경사항 저장</button>
        </form>
    )
}