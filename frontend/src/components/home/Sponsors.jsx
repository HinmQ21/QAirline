import { css } from "@/css/styles";
import { useState, useRef, useEffect } from "react";
import { FaFacebook } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";


const sponsorTriples = [
  [
    { src: 'air-hk.png', alt: 'Air Hongkong' },
    { src: 'air-qatar.png', alt: 'Qatar Airway' },
    { src: 'boeing.png', alt: 'Boeing' }
  ],
  [
    { src: 'facebook.png', alt: 'Facebook' },
    { src: 'google.png', alt: 'Google' },
    { src: 'nike.png', alt: 'Nike' }
  ],
  [
    { src: 'openai.png', alt: 'OpenAI' },
    { src: 'perplexity.png', alt: 'Perplexity' },
    { src: 'visa.png', alt: 'VISA' }
  ],
];


export const Sponsors = () => {
  const [indexToShow, setIndexToShow] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndexToShow(prevIndex => (prevIndex + 1) % 3);
    }, 4000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return <div className="flex flex-col xl:flex-row justify-around items-center gap-7">
    <div className="flex flex-col xl:flex-row justify-center items-center gap-2 xl:gap-10">
      <h3 className="special-gothic-expanded-one-regular">
        TRUSTED BY :
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-8
                      border-2 py-3 px-7 border-pink-950 rounded-3xl">
        {
          sponsorTriples.map((triple, index) => (
            <div key={index} className="relative w-32 h-10">
              {
                triple.map((sponsor, idx) => (
                  <img key={idx} src={`/sponsors/${sponsor.src}`} alt={sponsor.alt}
                    className={`w-36 h-10 absolute ${indexToShow === idx
                      ? css.offstage.off
                      : css.offstage.on
                      }`}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
    <div className="flex flex-col justify-center">
      <p className="montserrat-medium text-center text-gray-900 text-lg">
        Follow us on:
      </p>
      <div className="flex gap-3 px-4 py-2 border-2 rounded-2xl border-pink-950">
        <FaFacebook size="22" color="blue" className="cursor-pointer" />
        <FaYoutube size="22" color="red" className="cursor-pointer" />
        <FaInstagram size="22" color="purple" className="cursor-pointer" />
        <FaTiktok size="22" color="black" className="cursor-pointer" />
        <FaXTwitter size="22" color="black" className="cursor-pointer" />
      </div>
    </div>
  </div>
};