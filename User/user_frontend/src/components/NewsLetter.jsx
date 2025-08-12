export default function NewsLetter() {
    return (
       
        
        <div className=" border rounded ml-1 w-full backdrop-blur bg-white/10 md:border border-gray-300/20 mt-10 px-2 text-center text-white py-20 flex flex-col items-center justify-center">
            <p className="text-primary font-medium">Get updated</p>
            <h1 className="max-w-lg font-semibold text-4xl/[44px] mt-2">Subscribe to our newsletter & get the latest news</h1>
            <div className="flex items-center justify-center mt-10 border border-slate-600 focus-within:outline focus-within:outline-indigo-600 text-sm rounded-full h-14 max-w-md w-full">
                <input type="text" className="bg-transparent outline-none rounded-full px-4 h-full flex-1" placeholder="Enter your email address"/>
                <button className="bg-primary text-white rounded-full h-11 mr-1 px-8 flex items-center justify-center">
                    Subscribe now
                </button>
            </div>
        </div>
    );
};