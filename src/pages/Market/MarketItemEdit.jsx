import { useParams } from 'react-router-dom';
// import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import MarketItemEditForm from '../../components/MarketItem/MarketItemEditForm';
import { useEffect } from 'react';
import { readItem } from '../../store/ItemSlice';
import { getSydneyTimeISO } from '../../util/formDate';
import { useDispatch, useSelector } from 'react-redux';
import { getDocument } from '../../api/getDocument';
import { updateItemInCollection } from '../../store/marketCollectionSlice';

export default function MarketItemEdit() {
    const { mitemId } = useParams();
    // const { document, error } = useDocument('MarketItem', mitemId);
    const { updateDocument, response, loading } = useFirestore('MarketItem');

    // const modal = useRef();
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

    const doEditDocument = async (
        title,
        conditions,
        description,
        images,
        price
    ) => {
        // modal.current.open();
        const createdAt = getSydneyTimeISO();
        const updatedItem = {
            title: title,
            description: description,
            conditions: conditions,
            comments: reduxItem.comments,
            price: price,
            images: images,
            bucket: reduxItem.bucket,
            location: reduxItem.location,
            createdAt: createdAt,
            userId: reduxItem.userId,
            type: 'M_Item',
            interests: reduxItem.interests,
            numOfComment: reduxItem.numOfComment,
        };

        dispatch(updateItemInCollection({ item: updatedItem, id: mitemId }));

        await updateDocument(mitemId, updatedItem, 'MarketItem');
    };

    return (
        <>
            {reduxItem && (
                <div>
                    <MarketItemEditForm
                        doAction={doEditDocument}
                        item={reduxItem}
                        response={response}
                        loading={loading}
                        Topic={'Market'}
                    />
                </div>
            )}
        </>
    );
}
