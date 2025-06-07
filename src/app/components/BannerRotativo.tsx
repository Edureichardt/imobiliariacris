const BannerRotativo = ({ children }) => {
  const imagens = [
    '/banner1.jpg',
    '/banner2.jpg',
    '/banner3.jpg',
  ];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] mb-20">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {imagens.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={src}
                alt={`Banner ${i}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Conteúdo centralizado sobre o banner */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-7xl">{children}</div>
      </div>
    </div>
  );
};
