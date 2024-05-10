/* eslint-disable react/no-unescaped-entities */
import homeImg from '../../assets/imgs/home.jpg';
import home_chatting from '../../assets/imgs/home_chatting.png';
import home_market from '../../assets/imgs/home_market.png';
import home_job from '../../assets/imgs/home_job.png';
// import home_house from '../../assets/imgs/home_house.png';
import home_commu from '../../assets/imgs/home_commu.png';

import home_market_mobile from '../../assets/imgs/market_home_mobile.png';

export default function HomePage() {
    return (
        <div className="h-screen pt-36 ">
            <section className="h-screen">
                <h1 className="text-center font-bold text-3xl">
                    Bring Neighborhoods Together
                </h1>
                <h2 className="text-center mt-5 font-light text-sm">
                    Join your local community near you on POCKET
                </h2>
                <div className="w-full h-2/3 pt-10 pb-10 relative">
                    <img
                        src={homeImg}
                        className="w-3/4 h-full mx-auto rounded-2xl "
                    />
                </div>
            </section>

            <section className="h-screen lg:flex px-10 justify-center lg:space-x-7">
                <div className="lg:w-1/3 w-full flex flex-col justify-center space-y-3 lg:h-[40rem] h-[12rem] pl-5">
                    <h1 className="text-3xl w-full font-bold ">
                        Sell Your Products!
                    </h1>

                    <p className="lg:w-2/3 w-full">
                        Sell what you don't need, buy what you do economically
                        second-hand, and enjoy economic activities through
                        communication with your neighbors.
                    </p>
                    <div className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem]">
                        Try now!
                    </div>
                </div>

                <img
                    src={home_market}
                    className="w-[60rem] h-[40rem] border-2 border-slate-500 rounded-xl hidden lg:block"
                />

                <img
                    src={home_market_mobile}
                    className="w-[50rem] h-[30rem] border-2 rounded-md mt-2 border-slate-500 lg:hidden"
                />
            </section>

            <section className="h-screen">
                <h1 className="text-3xl w-full font-bold">
                    Connect and Plan Together!
                </h1>
                <p>
                    Start conversations, make new friends, and plan activities
                    together. Chat with others to iron out the details and enjoy
                    enriching community engagement.
                </p>
                <div className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem]">
                    Try now!
                </div>
                <img
                    src={home_chatting}
                    className="w-[30rem] h-[40rem] border-2 border-slate-500 rounded-xl"
                />
            </section>
            <section className="h-screen">
                <h1 className="text-3xl w-full font-bold">
                    Find workspaces and coworkers.
                </h1>
                <p>
                    Are you searching for a job that's close to home? Curious
                    about who meets your criteria? Discover your perfect match
                    and explore local employment opportunities easily with
                    Pocket.
                </p>
                <div className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem]">
                    Try now!
                </div>

                <img
                    src={home_job}
                    className="w-[30rem] h-[45rem] border-2 border-slate-500 rounded-xl"
                />
            </section>

            <section className="h-screen">
                <h1 className="text-3xl w-full font-bold">
                    Find frieds near you
                </h1>
                <p>
                    Is there any special news in our city? Are there any people
                    who want to hang out with me? Lets find your friends and
                    share your news
                </p>
                <div className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem]">
                    Try now!
                </div>

                <img
                    src={home_commu}
                    className="w-[60rem] h-[40rem] border-2 border-slate-500 rounded-xl"
                />
            </section>
        </div>
    );
}
