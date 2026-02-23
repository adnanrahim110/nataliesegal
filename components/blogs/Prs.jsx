"use client";

import { PRESS_RELEASES } from "@/constants";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "../ui/SectionTitle";

const Prs = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-primary-50 h-full w-full" />
      <div className="container">
        <div className="space-y-4 mb-16">
          <SectionTitle
            as="h1"
            size="hero"
            align="left"
            fullWidth
            underlineWidth="w-20 md:w-28"
            accentClassName="bg-gradient-to-r from-primary-500 to-primary-300"
          >
            Press Releases
          </SectionTitle>
        </div>
        <div className="relative w-full">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={3000}
            slidesPerView="auto"
            spaceBetween={30}
            loop
            className="overflow-clip! *:ease-linear!"
          >
            {PRESS_RELEASES.map((pr, idx) => (
              <SwiperSlide key={idx} className="w-auto!">
                <a
                  href={pr.link}
                  className="flex items-center justify-center bg-primary-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`/imgs/prs/${pr.img}`}
                    alt={pr.title}
                    className="w-auto h-8 rounded-md mix-blend-multiply"
                  />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-0 -left-1 h-full w-16 z-[2] bg-linear-to-r from-primary-50 via-primary-50 to-transparent pointer-events-none" />
          <div className="absolute top-0 -right-1 h-full w-16 z-[2] bg-linear-to-l from-primary-50 via-primary-50 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default Prs;
