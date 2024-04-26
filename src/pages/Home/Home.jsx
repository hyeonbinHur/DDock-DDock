import homeImg from '../../assets/imgs/home.jpg';
export default function HomePage() {
    return (
        <div className="h-screen pt-36">
            <h1 className="text-center font-bold text-3xl"> Bring Neighborhoods Together</h1>
            <h2 className='text-center mt-5 font-light text-sm'>Join your local community near you on POCKET</h2>
            <div className="w-full h-2/3 pt-10 pb-10 relative">
              
                <img src={homeImg} className="w-3/4 h-full mx-auto rounded-2xl " />
                
            </div>
        </div>
    );
}
