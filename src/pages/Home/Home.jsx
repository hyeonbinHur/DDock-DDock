/* eslint-disable react/no-unescaped-entities */
import homeImg from '../../assets/imgs/home.jpg';
import home_chatting from '../../assets/imgs/home_chatting.png';
import home_market from '../../assets/imgs/home_market.png';
import home_job from '../../assets/imgs/home_job.png';
// import home_house from '../../assets/imgs/home_house.png';
import home_commu from '../../assets/imgs/home_commu.png';
import home_commu_mobile from '../../assets/imgs/home_commu_mobile.png';

import home_market_mobile from '../../assets/imgs/market_home_mobile.png';
import { motion, useTransform, useScroll } from 'framer-motion';
import { useRef } from 'react';
import home_job_web from '../../assets/imgs/home_job_web.png';

import home_house_mobile from '../../assets/imgs/home_house_mobile.png';
import home_house from '../../assets/imgs/home_house.png';

import { Link } from 'react-router-dom';

export default function HomePage() {
    const marketRef = useRef(null);
    const chattingRef = useRef(null);
    const jobRef = useRef(null);
    const houseRef = useRef(null);
    const commuRef = useRef(null);

    const { scrollYProgress: marketScroll } = useScroll({
        target: marketRef,
        offset: ['start end', 'end 130%'],
    });

    const { scrollYProgress: chattingScroll } = useScroll({
        target: chattingRef,
        offset: ['start end', 'end 130%'],
    });

    const { scrollYProgress: jobScroll } = useScroll({
        target: jobRef,
        offset: ['start end', 'end 130%'],
    });

    const { scrollYProgress: houseScroll } = useScroll({
        target: houseRef,
        offset: ['start end', 'end 130%'],
    });

    const { scrollYProgress: commuScroll } = useScroll({
        target: commuRef,
        offset: ['start end', 'end 130%'],
    });

    const l2rContainer = useTransform(marketScroll, [0, 1], ['-100%', '0%']);
    const r2lContainer = useTransform(marketScroll, [0, 1], ['100%', '0%']);

    const l2rContainer_chatting = useTransform(
        chattingScroll,
        [0, 1],
        ['-100%', '0%']
    );
    const r2lContainer_chatting = useTransform(
        chattingScroll,
        [0, 1],
        ['100%', '0%']
    );

    const l2rContainer_job = useTransform(jobScroll, [0, 1], ['-100%', '0%']);
    const r2lContainer_job = useTransform(jobScroll, [0, 1], ['100%', '0%']);

    const l2rContainer_house = useTransform(
        houseScroll,
        [0, 1],
        ['-100%', '0%']
    );
    const r2lContainer_house = useTransform(
        houseScroll,
        [0, 1],
        ['100%', '0%']
    );

    const l2rContainer_commu = useTransform(
        commuScroll,
        [0, 1],
        ['-100%', '0%']
    );
    const r2lContainer_commu = useTransform(
        commuScroll,
        [0, 1],
        ['100%', '0%']
    );

    return (
        <div className="h pt-36 pb-20">
            <section className="lg:h-screen h-96">
                <h1 className="text-center font-bold text-3xl">
                    Bring Neighborhoods Together
                </h1>
                <h2 className="text-center mt-5 font-light text-sm">
                    Join your local community near you on POCKET
                </h2>
                <div className="w-full h-2/3 pt-10 pb-10 relative">
                    <img
                        src={homeImg}
                        className="w-3/4 lg:h-full h-96  mx-auto rounded-2xl "
                    />
                </div>
            </section>

            <motion.section
                className="h-[60rem] lg:h-[70rem] relative lg:flex lg:flex-row flex flex-col justify-center  my-12 lg:space-x-7"
                ref={marketRef}
            >
                <div className="absolute lg:top-[20%] top-[20%] lg:flex lg:flex-row flex flex-col justify-center lg:space-x-7">
                    <motion.p
                        className="lg:w-1/3 w-4/5 flex flex-col justify-center space-y-3 lg:h-[40rem] h-[12rem] pl-5 "
                        style={{ translateX: l2rContainer }}
                    >
                        <h1 className="text-3xl w-full font-bold ">
                            Sell Your Products!
                        </h1>

                        <p className="lg:w-2/3 w-full">
                            Sell what you don't need, buy what you do
                            economically second-hand, and enjoy economic
                            activities through communication with your
                            neighbors.
                        </p>
                        <Link
                            to={`/market`}
                            className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem] hover:scale-90 "
                        >
                            Try now!
                        </Link>
                    </motion.p>

                    <motion.div
                        style={{ translateX: r2lContainer }}
                        className="flex flex-col items-center justify-center"
                    >
                        <img
                            src={home_market}
                            className="lg:w-[60rem] h-[40rem] border-2 border-slate-500 rounded-xl hidden lg:block"
                        />

                        <img
                            src={home_market_mobile}
                            className="lg:w-[50rem] w-[28rem] h-[30rem] border-2 rounded-md mt-5  border-slate-500 lg:hidden"
                        />
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                className="h-[60rem] lg:h-[70rem] relative lg:flex lg:flex-row flex flex-col justify-center  my-12 lg:space-x-7"
                ref={chattingRef}
            >
                <div className="absolute lg:top-[20%] top-[15%] lg:left-[10%] lg:flex lg:flex-row flex flex-col justify-center lg:space-x-36">
                    <motion.div
                        style={{ translateX: l2rContainer_chatting }}
                        className="flex flex-col items-center justify-center"
                    >
                        <img
                            src={home_chatting}
                            className="lg:w-[30rem] lg:h-[40rem] h-[30rem] w-[20rem]  border-2 border-slate-500 rounded-xl "
                        />
                    </motion.div>

                    <motion.p
                        className="lg:w-1/3 w-4/5 flex flex-col justify-center space-y-3 lg:h-[40rem] h-[12rem] pl-5 pt-20 "
                        style={{ translateX: r2lContainer_chatting }}
                    >
                        <h1 className="text-3xl w-full font-bold ">
                            Connect and Plan Together!
                        </h1>

                        <p className="lg:w-2/3 w-full">
                            Start conversations, make new friends, and plan
                            activities together. Chat with others to iron out
                            the details and enjoy enriching community
                            engagement.
                        </p>
                    </motion.p>
                </div>
            </motion.section>

            <motion.section
                className="h-[60rem] lg:h-[70rem] relative lg:flex lg:flex-row flex flex-col justify-center  my-12 lg:space-x-7"
                ref={jobRef}
            >
                <div className="absolute lg:top-[20%] top-[20%] lg:flex lg:flex-row flex flex-col justify-center lg:space-x-7">
                    <motion.p
                        className="lg:w-1/3 w-4/5 flex flex-col justify-center space-y-3 lg:h-[40rem] h-[12rem] pl-5 "
                        style={{ translateX: l2rContainer_job }}
                    >
                        <h1 className="text-3xl w-full font-bold ">
                            Find workspaces and coworkers.
                        </h1>

                        <p className="lg:w-2/3 w-full">
                            Are you searching for a job that's close to home?
                            Curious about who meets your criteria? Discover your
                            perfect match and explore local employment
                            opportunities easily with Pocket.
                        </p>
                        <Link
                            to={`/job`}
                            className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem] hover:scale-90 "
                        >
                            Try now!
                        </Link>
                    </motion.p>

                    <motion.div
                        style={{ translateX: r2lContainer_job }}
                        className="flex flex-col items-center justify-center"
                    >
                        <img
                            src={home_job_web}
                            className="lg:w-[60rem] h-[40rem] border-2 border-slate-500 rounded-xl hidden lg:block"
                        />

                        <img
                            src={home_job}
                            className="lg:w-[50rem] w-[28rem] h-[30rem] border-2 rounded-md mt-20  border-slate-500 lg:hidden"
                        />
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                className="h-[60rem] lg:h-[70rem] relative lg:flex lg:flex-row flex flex-col-reverse justify-center  my-12 lg:space-x-7"
                ref={houseRef}
            >
                <div className="absolute lg:top-[20%] top-[20%] lg:flex lg:flex-row flex flex-col-reverse justify-center lg:space-x-7">
                    <motion.div
                        style={{ translateX: l2rContainer_house }}
                        className="flex flex-col items-center justify-center"
                    >
                        <img
                            src={home_house}
                            className="lg:w-[60rem] h-[40rem] border-2 border-slate-500 rounded-xl hidden lg:block"
                        />

                        <img
                            src={home_house_mobile}
                            className="lg:w-[50rem] w-[28rem] h-[30rem] border-2 rounded-md mt-20  border-slate-500 lg:hidden"
                        />
                    </motion.div>
                    <motion.p
                        className="lg:w-1/3 w-4/5 flex flex-col justify-center space-y-3 lg:h-[40rem] h-[12rem] pl-5 mt-10 "
                        style={{ translateX: r2lContainer_house }}
                    >
                        <h1 className="text-3xl w-full font-bold ">
                            Find Your Perfect Roommate!
                        </h1>

                        <p className="lg:w-2/3 w-full">
                            Looking for someone to share your space with?
                            Whether you're seeking a quiet study partner or a
                            social butterfly to explore the city with, find your
                            ideal roommate here.
                        </p>
                        <Link
                            to={`/house`}
                            className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem] hover:scale-90 "
                        >
                            Try now!
                        </Link>
                    </motion.p>
                </div>
            </motion.section>

            <motion.section
                className="h-[60rem] lg:h-[70rem] relative lg:flex lg:flex-row flex flex-col justify-center  my-12 lg:space-x-7"
                ref={commuRef}
            >
                <div className="absolute lg:top-[20%] top-[20%] lg:flex lg:flex-row flex flex-col justify-center lg:space-x-7">
                    <motion.p
                        className="lg:w-1/3 w-4/5 flex flex-col justify-center space-y-3 lg:h-[40rem] h-[12rem] pl-5 mt-10 "
                        style={{ translateX: l2rContainer_commu }}
                    >
                        <h1 className="text-3xl w-full font-bold ">
                            Find frieds near you
                        </h1>

                        <p className="lg:w-2/3 w-full">
                            Is there any special news in our city? Are there any
                            people who want to hang out with me? Lets find your
                            friends and share your news
                        </p>
                        <Link
                            to={`/community`}
                            className="px-2 py-1 font-sans flex items-center justify-center rounded-md bg-purple-500 text-white border border-purple-500 w-[6rem] hover:scale-90 "
                        >
                            Try now!
                        </Link>
                    </motion.p>

                    <motion.div
                        style={{ translateX: r2lContainer_commu }}
                        className="flex flex-col items-center justify-center"
                    >
                        <img
                            src={home_commu}
                            className="lg:w-[60rem] h-[40rem] border-2 border-slate-500 rounded-xl hidden lg:block"
                        />

                        <img
                            src={home_commu_mobile}
                            className="lg:w-[50rem] w-[28rem] h-[30rem] border-2 rounded-md mt-10  border-slate-500 lg:hidden"
                        />
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}
