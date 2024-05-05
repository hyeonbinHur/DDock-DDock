import { useFirestore } from '../../hooks/useFirestore';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';

import MarketItemEditForm from '../../components/MarketItem/MarketItemEditForm';
import ItemModal from '../../components/Modal/ItemStatusModal';

import { getSydneyTimeISO } from '../../util/formDate';

export default function JobItemEditPage() {
    const { jItemId } = useParams();

    const { updateDocument, response, loading } = useFirestore('JobItem');
    const modal = useRef();
    const navigate = useNavigate();
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

    const doEditDocument = async (title, conditions, description, images) => {
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
            type: 'J_Item',
            interests: reduxItem.interests,
            numOfComment: reduxItem.numOfComment,
        };

        console.log(updatedItem);
        await updateDocument(jItemId, updatedItem, 'JobItem');
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
                        from={'Job'}
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
