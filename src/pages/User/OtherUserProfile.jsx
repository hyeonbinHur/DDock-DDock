import { FcConferenceCall } from 'react-icons/fc';
import { FcHome } from 'react-icons/fc';
import { FcMoneyTransfer } from 'react-icons/fc';
import { AiOutlineShop } from 'react-icons/ai';
/* eslint-disable react/no-unescaped-entities */
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDocument } from '../../api/getDocument';
import { fetchUser } from '../../store/userSlice';

export default function OtherUserProfile() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userCollection.user);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const data = await getDocument('User', userId);
                    console.log(data);
                    dispatch(fetchUser({ user: data }));
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <div className="pt-36 space-y-5">
            {/* user personal Data */}
            <div className="grid grid-cols-2">
                <div className="flex justify-center lg:justify-end lg:pr-32">
                    <img
                        src={userData.Avatar}
                        className="circle shrink-0 rounded-full lg:w-64 lg:h-64 w-40 h-40"
                    />
                </div>
                <div className="flex flex-col justify-center space-y-7">
                    <div className="text-2xl font-bold">
                        {userData.displayName}
                    </div>
                    <div className="text-sm flex space-x-5">
                        <div>{userData.location.gu}</div>
                        <div>{userData.location.dong}</div>
                    </div>
                </div>
            </div>
            <div className="lg:px-28 lg:pt-12">
                <div className="border rounded-md bg-neutral-200 p-3 mx-8 lg:mx-96">
                    <div className="font-bold text-3xl mb-5">
                        {userData.displayName}'s Item
                    </div>
                    <div>
                        <div className="w-full items-center hover:bg-gray-100 rounded-md p-2 flex">
                            <AiOutlineShop />
                            <span>Market</span>
                        </div>
                        <div>
                            <FcMoneyTransfer />
                            <span> Job</span>
                        </div>
                        <div>
                            <FcHome />
                            <span>House</span>
                        </div>
                        <div>
                            <FcConferenceCall />
                            <span>Community</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
