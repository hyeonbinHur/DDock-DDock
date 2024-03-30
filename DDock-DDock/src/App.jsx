import { Fragment } from 'react';
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

// import MarketList from './components/MarketItem/MarketItemList';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
            children: [
                { path: '', element: <HomePage /> },
                {
                    path: 'market',
                    element: <MarketRoot />,
                    children: [
                        { path: '', element: <MarketPage /> },
                        {
                            path: ':mitemId',
                            element: <MarketItemDetail />,
                            children: [
                                {
                                    path: 'mupdate',
                                    element: <MarketItemEdit />,
                                },
                            ],
                        },
                        { path: 'mupload', element: <MarketItemAdd /> },
                    ],
                },
                { path: '/job', element: <JobPage /> },
                { path: '/house', element: <HousePage /> },
                { path: '/community', element: <CommunityPage /> },
                { path: '/signup', element: <SignUpPage /> },
                { path: '/login', element: <LoginPage /> },
            ],
        },
    ]);

    return (
        <Fragment>
            <main>
                <RouterProvider router={router} />
            </main>
        </Fragment>
    );
}

export default App;
