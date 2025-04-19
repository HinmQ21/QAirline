import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useRef, useState } from "react";

const destinations = [
  { name: "Paris", image: "/home/paris.webp" },
  { name: "Tokyo", image: "/home/tokyo.jpg" },
  { name: "New York", image: "/home/newyork.jpg" },
  { name: "London", image: "/home/london.jpg" },
  { name: "Rome", image: "/home/rome.jpeg" },
  { name: "Hà Nội", image: "/home/hanoi.jpg" },
];

export const TopDestinations = () => {
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: 4,
      spacing: 16,
    },
    loop: true,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 3000)

    return () => clearInterval(interval)
  }, [instanceRef])

  return (
    <div className='flex flex-col content-center'>
      <p className='text-white text-center poppins-semibold text-3xl mb-5'>Top destinations</p>
      <div ref={sliderRef} className="keen-slider">
        {destinations.map((dest, i) => (
          <div key={i} className="keen-slider__slide rounded-xl overflow-hidden relative">
            <img src={dest.image} alt={dest.name} className='w-full h-100 object-cover' />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-lg p-2 text-center">
              {dest.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}