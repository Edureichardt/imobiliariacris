'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import { useSwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Image from 'next/image';
import React from 'react';

const SlideComImagem = ({ src }: { src: string }) => {
  const swiperSlide = useSwiperSlide();

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      <Image
        src={src}
        alt="Banner"
        fill
        priority
        className={`object-cover transition-all duration-700 ease-in-out ${
          swiperSlide.isActive ? 'blur-0' : 'blur-sm'
        } rounded-lg`}
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
        <h2 className="text-white text-4xl md:text-5xl font-serif text-center px-4">
          A melhor escolha no lugar certo é aqui
        </h2>
      </div>
    </div>
  );
};

const BannerRotativo: React.FC = () => {
  const imagens = ['/banner1.jpg', '/banner2.jpg', '/banner3.jpg'];

  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <div className="relative w-full h-[400px] md:h-[500px] mb-12 particulas-borda rounded-lg overflow-visible">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          loop
          pagination={{ clickable: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="w-full h-full rounded-lg"
        >
          {imagens.map((src, index) => (
            <SwiperSlide key={index}>
              <SlideComImagem src={src} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={prevRef}
          aria-label="Slide anterior"
          className="absolute top-1/2 left-2 -translate-y-1/2 z-20 p-2 bg-green-600 bg-opacity-70 rounded-full hover:bg-green-700 transition text-white"
        >
          ‹
        </button>
        <button
          ref={nextRef}
          aria-label="Próximo slide"
          className="absolute top-1/2 right-2 -translate-y-1/2 z-20 p-2 bg-green-600 bg-opacity-70 rounded-full hover:bg-green-700 transition text-white"
        >
          ›
        </button>
      </div>

      {/* styled-jsx com a animação das partículas */}
      <style jsx>{`
        .particulas-borda {
          position: relative;
          border-radius: 12px;
          overflow: visible;
        }
        .particulas-borda::before {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: inherit;
          pointer-events: none;
          animation: brilhoParticulas 3s ease-in-out infinite;
          box-shadow:
            0 0 10px 4px rgba(34, 197, 94, 0.7),
            0 0 20px 8px rgba(34, 197, 94, 0.5),
            0 0 30px 12px rgba(34, 197, 94, 0.3);
        }
        @keyframes brilhoParticulas {
          0%,
          100% {
            box-shadow:
              0 0 0 0 rgba(34, 197, 94, 0.7),
              0 0 0 0 rgba(34, 197, 94, 0.5),
              0 0 0 0 rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow:
              0 0 10px 4px rgba(34, 197, 94, 0.7),
              0 0 20px 8px rgba(34, 197, 94, 0.5),
              0 0 30px 12px rgba(34, 197, 94, 0.3);
          }
        }
      `}</style>
    </>
  );
};

export default BannerRotativo;
