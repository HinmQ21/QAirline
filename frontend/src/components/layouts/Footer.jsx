import { css } from "@/css/styles";
import { Link } from "react-router-dom";

export const Footer = () => (
  <div className={`${css.minipage.xl} rounded-b-none ${css.minipagemx}`}>
    <div className="min-w-80 flex flex-col lg:flex-row justify-between items-center">
      <div className="ml-5 lg:ml-10 mt-5">
        <Link to="/" className="text-2xl special-gothic-expanded-one-regular">
          QAIRLINE
        </Link>
        <p className="text-sm text-gray-600">
          @2025 QAirline Copyright. All Rights Reserved.
        </p>
      </div>

      <div className="lg:w-fit flex flex-col md:flex-row gap-4 lg:gap-8 p-5 pl-0 lg:pr-10">
        <div>
          <p className="reddit-semibold text-lg">Liên hệ với chúng tôi</p>
          <a href="mailto:djnner@proton.me" target="_blank" className="text-gray-600 hover:underline block">
            djnner@proton.me
          </a>
          <a href="tel:0123456789" target="_blank" className="text-gray-600 hover:underline block">
            (+84) 123-456-789
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Đại+học+Công+nghệ+ĐHQGHN"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:underline block"
          >
            Đại học Công nghệ, ĐHQGHN
          </a>
        </div>

        <div>
          <p className="text-lg reddit-semibold">Giờ hành chính</p>
          <div className="grid grid-cols-2">
            <p className="text-gray-600">Thứ 2 - Thứ 6</p>
            <p className="text-gray-600">07.00 am - 22.00 pm</p>
            <p className="text-gray-600">Thứ 7</p>
            <p className="text-gray-600">08.00 am - 21.00 pm</p>
            <p className="text-gray-600">Chủ nhật</p>
            <p className="text-gray-600">09.00 am - 20.00 pm</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);