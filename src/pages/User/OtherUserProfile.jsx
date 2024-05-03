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
import UserItemsPopUp from './UserItemsPopUp';

export default function OtherUserProfile() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userCollection.user);
    const [isLoading, setIsLoading] = useState(false);

    const [isMarketOpen, setIsMarketOpen] = useState(false);
    const [isJobOpen, setIsJobOpen] = useState(false);
    const [isHouseOpen, setIsHouseOpen] = useState(false);
    const [isCommunityOpen, setIsCommunityOpen] = useState(false);

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const data = await getDocument('User', userId);
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

    const openPopUp = (value) => {
        if (value == 'Market') {
            setIsMarketOpen((prev) => !prev);
            setIsJobOpen(false);
            setIsHouseOpen(false);
            setIsCommunityOpen(false);
        } else if (value == 'Job') {
            setIsMarketOpen(false);
            setIsJobOpen((prev) => !prev);
            setIsHouseOpen(false);
            setIsCommunityOpen(false);
        } else if (value == 'House') {
            setIsMarketOpen(false);
            setIsJobOpen(false);
            setIsHouseOpen((prev) => !prev);
            setIsCommunityOpen(false);
        } else if (value == 'Community') {
            setIsMarketOpen(false);
            setIsJobOpen(false);
            setIsHouseOpen(false);
            setIsCommunityOpen((prev) => !prev);
        }
    };

    return (
        <>
            {isLoading ? (
                <div></div>
            ) : (
                userData != null && (
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
                                    <div
                                        onClick={() => openPopUp('Market')}
                                        className="w-full text-xl space-x-3 items-center hover:bg-gray-100 rounded-md p-2 flex"
                                    >
                                        <AiOutlineShop />
                                        <span>Market</span>
                                    </div>
                                    {isMarketOpen && (
                                        <div className="p-3">
                                            <UserItemsPopUp
                                                items={userData.MItem}
                                                topic="market"
                                            />
                                        </div>
                                    )}
                                    <div
                                        onClick={() => openPopUp('Job')}
                                        className="w-full text-xl space-x-3 items-center hover:bg-gray-100 rounded-md p-2 flex"
                                    >
                                        <FcMoneyTransfer />
                                        <span> Job</span>
                                    </div>
                                    {isJobOpen && (
                                        <div className="p-3">
                                            <UserItemsPopUp
                                                items={userData.JItem}
                                                topic="job"
                                            />
                                        </div>
                                    )}

                                    <div
                                        onClick={() => openPopUp('House')}
                                        className="w-full text-xl space-x-3 items-center hover:bg-gray-100 rounded-md p-2 flex"
                                    >
                                        <FcHome />
                                        <span>House</span>
                                    </div>
                                    {isHouseOpen && (
                                        <div className="p-3">
                                            <UserItemsPopUp
                                                items={userData.HItem}
                                                topic="house"
                                            />
                                        </div>
                                    )}
                                    <div
                                        onClick={() => openPopUp('Community')}
                                        className="w-full text-xl space-x-3 items-center hover:bg-gray-100 rounded-md p-2 flex"
                                    >
                                        <FcConferenceCall />
                                        <span>Community</span>
                                    </div>

                                    {isCommunityOpen && (
                                        <div className="p-3">
                                            <UserItemsPopUp
                                                items={userData.CItem}
                                                topic="community"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    );
}
