import { css } from '@/css/styles';
import { Star } from 'lucide-react';
import { CiLocationOn } from "react-icons/ci";
import { Card, CardContent } from '../ui/card';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const testimonials = [
  // Page 1
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Du lịch gia đình",
    image: "/testimonials/man-1.jpg",
    rating: 5,
    content: "Trải nghiệm đặt vé qua QAirline thật tuyệt vời! Giao diện dễ sử dụng, giá cả hợp lý và dịch vụ khách hàng rất chu đáo.",
    location: "Hà Nội"
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Du lịch công tác",
    image: "/testimonials/woman-1.jpg",
    rating: 5,
    content: "Là một người thường xuyên đi công tác, tôi rất hài lòng với dịch vụ của QAirline. Đặt vé nhanh chóng và luôn có nhiều lựa chọn phù hợp.",
    location: "TP. Hồ Chí Minh"
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Du lịch bụi",
    image: "/testimonials/man-2.jpg",
    rating: 4,
    content: "QAirline giúp tôi dễ dàng tìm được những chuyến bay giá tốt cho chuyến du lịch bụi của mình. Rất đáng để thử!",
    location: "Đà Nẵng"
  },
  // Page 2
  {
    id: 4,
    name: "Phạm Thị D",
    role: "Du lịch hưởng thụ",
    image: "/testimonials/woman-2.jpg",
    rating: 5,
    content: "Dịch vụ hạng thương gia của QAirline thật tuyệt vời! Từ check-in đến khi hạ cánh, mọi thứ đều hoàn hảo.",
    location: "Hải Phòng"
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    role: "Du lịch phượt",
    image: "/testimonials/man-3.jpg",
    rating: 5,
    content: "QAirline có nhiều chương trình khuyến mãi hấp dẫn cho những chuyến đi dài ngày. Tôi đã tiết kiệm được rất nhiều!",
    location: "Cần Thơ"
  },
  {
    id: 6,
    name: "Vũ Thị F",
    role: "Du lịch nghỉ dưỡng",
    image: "/testimonials/woman-3.jpg",
    rating: 5,
    content: "Đặt vé qua QAirline rất tiện lợi và an toàn. Tôi luôn yên tâm khi sử dụng dịch vụ của họ cho những chuyến đi nghỉ dưỡng.",
    location: "Nha Trang"
  }
];

const TESTIMONIALS_PER_PAGE = 3;

const TestimonialCard = ({ testimonial, isActive }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: isActive ? 1 : 0.7, y: 0, scale: isActive ? 1 : 0.95 }}
    transition={{ duration: 0.5 }}
    className={`relative ${isActive ? 'z-10' : 'z-0'}`}
  >
    <Card className={`overflow-hidden ${css.homepageGgGradient}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover rounded-full border-2 border-pink-500"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{testimonial.name}</h3>
                <p className="text-sm text-gray-300">{testimonial.role}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-gray-200 mb-3">{testimonial.content}</p>
            <div className="flex items-center text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <CiLocationOn />
                {testimonial.location}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const intervalRef = useRef(null);

  const totalPages = Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE);
  const currentTestimonials = testimonials.slice(
    currentPage * TESTIMONIALS_PER_PAGE,
    (currentPage + 1) * TESTIMONIALS_PER_PAGE
  );

  const startAutoSlide = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % TESTIMONIALS_PER_PAGE;
        if (nextIndex === 0) {
          setCurrentPage((page) => (page + 1) % totalPages);
        }
        return nextIndex;
      });
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const handlePageChange = (newPage) => {
    stopAutoSlide();
    setCurrentPage(newPage);
    setActiveIndex(0);
    startAutoSlide();
  };

  const handlePrevPage = () => {
    stopAutoSlide();
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setActiveIndex(0);
    startAutoSlide();
  };

  const handleNextPage = () => {
    stopAutoSlide();
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setActiveIndex(0);
    startAutoSlide();
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hãy lắng nghe những chia sẻ từ khách hàng đã sử dụng dịch vụ của QAirline
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                onMouseEnter={() => {
                  stopAutoSlide();
                  setActiveIndex(index);
                }}
                onMouseLeave={startAutoSlide}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </AnimatePresence>

          {/* Page Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrevPage}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <MdKeyboardArrowLeft size={30} color='DarkSlateGray' />
            </button>

            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPage ? 'bg-pink-500 w-4' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <MdKeyboardArrowRight size={30} color='DarkSlateGray' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
