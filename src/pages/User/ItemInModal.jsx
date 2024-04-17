import { useDocument } from "../../hooks/useDocument";

export default function ItemInModal({ id }) {

    const {document: item} = useDocument('MarketItem',id)

    return (
        <div>
            <p>{item?.title}</p>
        </div>
    );
}
