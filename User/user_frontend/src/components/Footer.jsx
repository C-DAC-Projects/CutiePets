import { assets } from "../assets/assets";

export default function Footer() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-white">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                <div className="md:max-w-96">
                   <img width="157" height="40" viewBox="0 0 157 40" fill="none" src={assets.Logo} alt="" />
                    <p className="mt-6 text-sm">
                        CutiePets is your one-stop destination for pet lovers. Buy and sell pets safely, explore a wide range of pet accessories, and order premium pet foods for dogs, cats, birds, and more. Enjoy fast doorstep delivery within 1 hour, ensuring your furry, feathery, or scaly friends are always happy and cared for.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-white">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Pets</a></li>
                            <li><a href="#">Care</a></li>
                            <li><a href="#">Food</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-white">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91-7583663606</p>
                            <p>cutiepets@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                Copyright 2025 © <a href="">CutiePets</a>. All Right Reserved.
            </p>
        </footer>
    );
};
