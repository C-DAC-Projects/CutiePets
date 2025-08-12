import { useEffect, useRef, useState } from "react";


export default function Slider() {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/slider3.jpg","/slider2.jpg", "/slider1.jpg"
  ];

  const totalSlides = slides.length;

  const goToSlide = (index) => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0].clientWidth;
      sliderRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

 
  useEffect(() => {
    goToSlide(currentSlide);
  }, [currentSlide]);

  
  useEffect(() => {
    const handleResize = () => goToSlide(currentSlide);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide]);

  return (
    <div className="flex items-center mt-10 md:ml-80">
      <button
        onClick={prevSlide}
        className="md:p-2 p-1 bg-black/30 md:mr-6 mr-2 rounded-full hover:bg-black/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="w-full max-w-3xl overflow-hidden relative">
        <div className="flex transition-transform duration-500 ease-in-out" ref={sliderRef}>
          {slides.map((src, i) => (
            <img key={i} src={src} className="w-full flex-shrink-0" alt={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>

      <button
        onClick={nextSlide}
        className="p-1 md:p-2 bg-black/30 md:ml-6 ml-2 rounded-full hover:bg-black/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
