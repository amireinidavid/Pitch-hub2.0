"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    quote: "Pitch Hub helped us secure our first major investment.",
    name: "Jane Doe",
    title: "Startup Founder",
    image:
      "https://media.gettyimages.com/id/1346252956/photo/small-business-owner.jpg?s=612x612&w=0&k=20&c=U20H6ASOJDgYIgK-l6HT4I5qBRo7ufyrqD_x9FWmsrw=",
  },
  {
    quote:
      "The platform is intuitive and connects you with the right investors.",
    name: "John Smith",
    title: "Entrepreneur",
    image:
      "https://media.gettyimages.com/id/1028771818/photo/startup-business-employees-working-at-the-office.jpg?s=612x612&w=0&k=20&c=7neVWfg07Hgefk3CvSbjXM-N8V9UYDPRbBMoFzCHgrQ=",
  },
  {
    quote:
      "The platform is intuitive and connects you with the right investors.",
    name: "John Smith",
    title: "Entrepreneur",
    image:
      "https://media.gettyimages.com/id/1569566040/photo/a-27-year-old-african-american-female-entrepreneur-owns-a-fresh-flower-shop-using-a-digital.jpg?s=612x612&w=0&k=20&c=6mNNyt1FFjCoRUK2EU8j9ZvSjg9rVtNci5bAErm0FvY=",
  },
  {
    quote:
      "The platform is intuitive and connects you with the right investors.",
    name: "John Smith",
    title: "Entrepreneur",
    image:
      "https://media.gettyimages.com/id/1317277259/photo/asian-male-florist-owner-of-small-business-flower-shop-using-digital-tablet-while-working-on.jpg?s=612x612&w=0&k=20&c=tWCAUMVV6YyBzKPgVgiHl50vTU3a675E3sOqvGhRuIw=",
  },
  // Add more testimonials here
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-900 text-white w-full min-h-screen">
      <div className="relative w-full">
        <h2 className="text-4xl font-bold mb-8 text-center">Testimonials</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2000 }}
          loop={true}
          className="relative w-screen h-[600px]"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="relative w-full">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center text-left bg-black bg-opacity-50 text-white">
                <h1 className="text-5xl ml-2 italic mb-4">
                  {testimonial.quote}
                </h1>
                <h3 className="text-2xl ml-2 font-bold">{testimonial.name}</h3>
                <h4 className="text-lg ml-2 text-gray-300">
                  {testimonial.title}
                </h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
