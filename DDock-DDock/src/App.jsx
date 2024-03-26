import { Fragment } from 'react';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/Roots';
import HomePage from './pages/Home/Home';
import MarketPage from './pages/Market/Market';
import JobPage from './pages/Job/Job';
import HousePage from './pages/House/House';
import CommunityPage from './pages/Community/Community';

function App() {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
            children: [
                { path: '/', element: <HomePage /> },
                { path: '/market', element: <MarketPage /> },
                { path: '/job', element: <JobPage /> },
                { path: '/house', element: <HousePage /> },
                { path: '/community', element: <CommunityPage /> },
            ],
        },
    ]);

    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
}

export default App;
