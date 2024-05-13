import { useFirestore } from '../../hooks/useFirestore';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';
import { getSydneyTimeISO } from '../../util/formDate';

import MarketItemEditForm from '../../components/MarketItem/MarketItemEditForm';

import { updateItemInCollection } from '../../store/jobCollectionSlice';

export default function JobItemEditPage() {
    const { jItemId } = useParams();

    const { updateDocument, response, loading } = useFirestore('JobItem');
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);

    useEffect(() => {
        if (jItemId) {
            const fetchData = async () => {
                try {
                    const data = await getDocument('JobItem', jItemId);
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
        price,
        period
    ) => {
        const createdAt = getSydneyTimeISO();
        const updatedItem = {
            title: title,
            description: description,
            conditions: conditions,
            comments: reduxItem.comments,
            price: price,
            period: period,
            images: images,
            bucket: reduxItem.bucket,
            location: reduxItem.location,
            createdAt: createdAt,
            userId: reduxItem.userId,
            type: 'J_Item',
            interests: reduxItem.interests,
            numOfComment: reduxItem.numOfComment,
        };

        dispatch(updateItemInCollection({ item: updatedItem, id: jItemId }));
        await updateDocument(jItemId, updatedItem, 'JobItem');
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
                        Topic={'Job'}
                        condition={true}
                    />
                </div>
            )}
        </>
    );
}
