import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useCollection } from '../../hooks/useCollection';

export default function ProfilePage() {
    const { userId } = useParams();
    // const {document} = useCollection('User');
    const { document, error, loading } = useDocument('User', userId);
    console.log(document);
    console.log(document);
    return (
        <div>
            <label>Hlloe Profile</label>
            {document && <label>{document.displayName}</label>}
            <div>----M ITEM----</div>
            <div>----H ITEM----</div>
            <div>----J ITEM----</div>
            <div>----C ITEM----</div>
        </div>
    );
}
