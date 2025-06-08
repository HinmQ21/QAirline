import { css } from "@/css/styles";
import { Link } from "react-router-dom";
import 'keen-slider/keen-slider.min.css';
import { useEffect, useRef } from "react";
import { RiCompass3Line } from "react-icons/ri";
import { useKeenSlider } from 'keen-slider/react';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import destinationsMock from "../../data/top_destinations.json";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

const DestinationCard = ({ dest }) => (
  <div className="flex flex-col">
    <div className="group relative w-full h-64 sm:h-86 cursor-pointer">
      <img
        src={dest.image}
        alt={dest.name}
        className="w-full h-full object-cover
                 filter group-hover:blur-lg group-hover:brightness-80
                 transition-all duration-200"
      />
      <p className="absolute inset-0 flex items-center
                  px-10 shantell-sans-regular
                  text-white text-lg opacity-0 group-hover:opacity-100
                  transition-opacity duration-750">
        {dest.description}
      </p>
    </div>
    <div className="w-full flex flex-col items-start justify-between
                    bg-gray-300 pt-2 pb-3 px-4 select-text">
      <div className="flex items-center text-black gap-1.5">
        <RiCompass3Line />
        <div className="text-sm w-fit">{dest.location}</div>
      </div>
      <p className={`text-lg montserrat-semibold
                  text-transparent bg-clip-text
                  ${css.homepageGgGradient}`}>
        {dest.name}
      </p>
      <div className="w-full mt-1 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <p className="text-md reddit-medium text-gray-800">Giá chỉ từ:</p>
          <p className="text-red-500 montserrat-regular text-sm">{dest.minPrice}</p>
        </div>
        <button className="
          bg-pink-950 hover:bg-red-500 text-white
          transition-all duration-300
          py-2 px-4 rounded-2xl reddit-medium text-sm cursor-pointer
        ">
          Đặt ngay
        </button>
      </div>
    </div>
  </div>
)


export const TopDestinations = () => {
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 3, spacing: 12 },
    loop: true,
    drag: false,
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 2, spacing: 12 }
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 12 }
      }
    }
  })

  const intervalRef = useRef(null)

  useEffect(() => {
    startAutoSlide()
    return () => stopAutoSlide()
  }, [instanceRef])

  const startAutoSlide = () => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      instanceRef.current?.next()
    }, 3000)
  }

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  return (
    <div className='flex flex-col'>
      <div className='flex mb-10 justify-between items-end gap-x-5'>
        <div>
          <p className={css.headerText}>Địa điểm</p>
          <p className="text-gray-500 mt-2">
             Khám phá những điểm đến nổi tiếng nhất thế giới, tìm chuyến đi mơ ước và đặt vé máy bay dễ dàng cho hành trình tiếp theo của bạn!
          </p>
        </div>
        <Link to='/destinations' className="hidden md:flex h-fit min-w-max items-center text-red-600 hover:text-red-400">
          <p className="montserrat-semibold">Xem tất cả</p>
          <MdOutlineKeyboardArrowRight className="ml-2" size="1.3em" />
        </Link>
      </div>
      <div className="flex items-center relative">
        <RxDoubleArrowLeft onClick={
          () => { stopAutoSlide(); instanceRef.current?.prev(); startAutoSlide(); }
        } size="22" className="absolute left-[-2.2em] cursor-pointer animate-wiggle hover:animate-none" />
        <div
          ref={sliderRef} className="keen-slider"
          onMouseEnter={stopAutoSlide} onMouseLeave={startAutoSlide}
        >
          {destinationsMock.map((dest, i) => (
            <div key={i} className="keen-slider__slide not-visited:rounded-xl overflow-hidden relative">
              <DestinationCard dest={dest} />
            </div>
          ))}
        </div>
        <RxDoubleArrowRight onClick={
          () => { stopAutoSlide(); instanceRef.current?.next(); startAutoSlide(); }
        } size="22" className="absolute right-[-2.2em] cursor-pointer animate-wiggle hover:animate-none" />
      </div>
    </div>
  );
}