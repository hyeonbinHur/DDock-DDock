import { useFirestore } from '../../hooks/useFirestore';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';
import { getSydneyTimeISO } from '../../util/formDate';

import MarketItemEditForm from '../../components/MarketItem/MarketItemEditForm';
import ItemModal from '../../components/Modal/ItemStatusModal';

export default function HouseItemEditPage() {
    const { hItemId } = useParams();

    const { updateDocument, response, loading } = useFirestore('HouseItem');
    const modal = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);

    useEffect(() => {
        if (hItemId) {
            const fetchData = async () => {
                try {
                    const data = await getDocument('HouseItem', hItemId);
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
            type: 'H_Item',
            interests: reduxItem.interests,
            numOfComment: reduxItem.numOfComment,
        };

        console.log(updatedItem);
        await updateDocument(hItemId, updatedItem, 'HouseItem');
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
                        from={'House'}
                    />
                    <MarketItemEditForm
                        doAction={doEditDocument}
                        item={reduxItem}
                        response={response}
                        condition={true}
                    />
                </div>
            )}
        </>
    );
}
