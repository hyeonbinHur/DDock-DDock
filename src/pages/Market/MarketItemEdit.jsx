import { useNavigate, useParams } from 'react-router-dom';
// import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import ItemModal from '../../components/Modal/ItemStatusModal';
import MarketItemEditForm from '../../components/MarketItem/MarketItemEditForm';
import { useEffect, useRef } from 'react';
import { readItem } from '../../store/ItemSlice';
import { getSydneyTimeISO } from '../../util/formDate';
import { useDispatch, useSelector } from 'react-redux';
import { getDocument } from '../../api/getDocument';

export default function MarketItemEdit() {
    const { mitemId } = useParams();
    // const { document, error } = useDocument('MarketItem', mitemId);
    const { updateDocument, response, loading } = useFirestore('MarketItem');

    const modal = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);

    useEffect(() => {
        if (mitemId) {
            const fetchData = async () => {
                try {
                    const data = await getDocument('MarketItem', mitemId);
                    dispatch(readItem({ item: data }));
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // if (error) {
    //     return <div className="error">{error}</div>;
    // }
    // if (!document) {
    //     return <div className="loading">Loading...</div>;
    // }

    const doEditDocument = async (title, conditions, description, images) => {
        console.log('Hello edit');
        modal.current.open();
        const createdAt = getSydneyTimeISO();
        const updatedItem = {
            title: title,
            description: description,
            conditions: conditions,
            comments: reduxItem.comments,
            images: images,
            bucket: reduxItem.bucket,
            location: reduxItem.location,
            createdAt: createdAt,
            userId: reduxItem.userId,
            type: 'M_Item',
            interests: reduxItem.interests,
            numOfComment: reduxItem.numOfComment,
        };

        console.log(updatedItem);
        await updateDocument(mitemId, updatedItem, 'MarketItem');
    };

    return (
        <>
            {reduxItem && (
                <div>
                    <ItemModal
                        ref={modal}
                        response={response}
                        loading={loading}
                        navigate={navigate}
                        from={'market'}
                    />
                    <MarketItemEditForm
                        doAction={doEditDocument}
                        item={reduxItem}
                        response={response}
                    />
                </div>
            )}
        </>
    );
}
