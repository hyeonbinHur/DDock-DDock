import { Fragment, useRef, useEffect } from 'react';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/Roots';
import HomePage from './pages/Home/Home';
import MarketPage from './pages/Market/Market';
import JobPage from './pages/Job/Job';
import HousePage from './pages/House/House';
import CommunityPage from './pages/Community/Community';
import MarketRoot from './pages/Market/MarketRoot';
import SignUpPage from './pages/Auth/Sigunup';
import LoginPage from './pages/Auth/Login';
import MarketItemEdit from './pages/Market/MarketItemEdit';
import MarketItemAdd from './pages/Market/MarketItemAdd';
import MarketItemDetail from './pages/Market/MarketItemDetail';
import { useAuthContext } from './hooks/useAuth';
import DisplayNameModal from './components/Modal/DisplayNameModal';
import ProfilePage from './pages/User/Profile';
import Memo from '../src/pages/Memo';
import ErrorPage from './pages/error/ErrorPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AddJobPage from './pages/Job/AddJobPage';
import JobRoot from './pages/Job/JobRoot';
import JobItemDetailPage from './pages/Job/JobItemDetailPage';
import JobItemEditPage from './pages/Job/JobItemEditPage';

const queryClient = new QueryClient();

// import MarketList from './components/MarketItem/MarketItemList';

function App() {
    const { user } = useAuthContext();
    const modal = useRef();
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
            errorElement: <ErrorPage />,
            children: [
                { path: '', element: <HomePage /> },
                {
                    path: 'market',
                    element: <MarketRoot />,
                    children: [
                        { path: '', element: <MarketPage /> },
                        {
                            path: ':mitemId',
                            children: [
                                { index: true, element: <MarketItemDetail /> },
                                {
                                    path: 'mupdate',
                                    element: <MarketItemEdit />,
                                },
                            ],
                        },
                        { path: 'mupload', element: <MarketItemAdd /> },
                    ],
                },
                {
                    path: 'job',
                    element: <JobRoot />,
                    children: [
                        {
                            path: '',
                            element: <JobPage />,
                        },
                        { path: ':jItemId', element: <JobItemDetailPage /> },
                        { path: ':jItemId/edit', element: <JobItemEditPage /> },
                        { path: 'add', element: <AddJobPage /> },
                    ],
                },
                { path: '/house', element: <HousePage /> },
                { path: '/community', element: <CommunityPage /> },
                { path: '/signup', element: <SignUpPage /> },
                { path: '/login', element: <LoginPage /> },
                { path: '/profile/:userId', element: <ProfilePage /> },
                { path: '/csstest', element: <Memo /> },
                { path: '/chatting', element: <Memo /> },
            ],
        },
    ]);

    useEffect(() => {
        if (user && !user.displayName) {
            console.log(user);
            modal.current.open();
        }
    }, [user]);

    return (
        <Fragment>
            <QueryClientProvider client={queryClient}>
                <main>
                    <RouterProvider router={router} />
                </main>
                <DisplayNameModal user={user} ref={modal} />
            </QueryClientProvider>
        </Fragment>
    );
}

export default App;