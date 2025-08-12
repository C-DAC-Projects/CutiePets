import pet1 from '../assets/pet1.jpg'


export default function Pets() {
    return (

        <div className='mt-5 ml-4'>
        <p className='text-2xl md:text-3xl font-medium '>Pets</p>
        <div className="mt-3 relative flex items-center justify-center text-sm text-white/80 rounded-lg shadow-sm max-w-70">
            <div className="absolute top-2 flex items-center justify-around backdrop-blur-sm w-full max-w-72 rounded bg-white/10 border border-white/20 py-2">
                <p className="text-center text-black font-medium"> Labrador</p>
            </div>
                <button type="button" className=" absolute bottom-2 flex items-center justify-around backdrop-blur bg-white/40 rounded-full px-6 py-1.5 cursor-pointer text-black">Buy - ₹14000</button>
            <img className="rounded-md" src={pet1} alt="" />
        </div>
        </div>
    );
};