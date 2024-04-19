
import { useCollection } from "../hooks/useCollection";
export default function Memo() {
    const { document, } = useCollection('MarketItem', [
        'createdAt',
        'desc',
    ]);
    return (
        <>
            <div>
                <button onClick={console.log(document)}>Make me a toast</button>
            </div>
        </>
    );
}
