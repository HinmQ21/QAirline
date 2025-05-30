import { Link } from "react-router-dom";
import { MiniPage } from "@/components/misc/MiniPage";

export const Footer = () => (
  <MiniPage className="rounded-b-none mx-30">
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
          <p className="poppins-semibold text-lg">Contact Info</p>
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
          <p className="text-lg poppins-semibold">Opening Time</p>
          <p className="text-gray-600">Mon - Fri : 08.00 am - 20.00 pm</p>
          <p className="text-gray-600">Saturday : 09.00 am - 20.00 pm</p>
          <p className="text-gray-600">Sunday: We are Closed</p>
        </div>
      </div>
    </div>
  </MiniPage>
);