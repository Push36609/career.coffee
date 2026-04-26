import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Instagram as InstagramIcon } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import post1 from '../assets/instagram/Post -1.png';
import post2 from '../assets/instagram/Post-2.png';
import post3 from '../assets/instagram/Post-3.png';
import post4 from '../assets/instagram/Post-4.png';
import post5 from '../assets/instagram/Post-5.png';
import post6 from '../assets/instagram/Post-6.png';
import post7 from '../assets/instagram/Post-7.png';
import post8 from '../assets/instagram/Post-8.png';
import post9 from '../assets/instagram/Post-9.png';
import post10 from '../assets/instagram/Post-10.png';
import post11 from '../assets/instagram/Post-11.png';

const Instagram = () => {
  const posts = [
    { id: 1, image: post1 },
    { id: 2, image: post2 },
    { id: 3, image: post3 },
    { id: 4, image: post4 },
    { id: 5, image: post5 },
    { id: 6, image: post6 },
    { id: 7, image: post7 },
    { id: 8, image: post8 },
    { id: 9, image: post9 },
    { id: 10, image: post10 },
    { id: 11, image: post11 },
  ];

  return (
    <section className="py-10 bg-background">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-widest text-pink-600 font-semibold">
            Follow Us
          </p>
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <InstagramIcon size={16} />
            <span>@career.coffee</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-secondary-900 mb-4">
            Our Instagram
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto text-lg">
            Stay updated with our latest posts, career tips, and student success stories.
          </p>
        </motion.div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoHeight={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <motion.a
                  href="https://instagram.com/career.coffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -10 }}
                  className="block relative group overflow-hidden rounded-2xl shadow-xl bg-gray-200"
                >
                  <img
                    src={post.image}
                    alt={`Career Coffee Instagram Post ${post.id}`}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2 border border-white/30">
                        <InstagramIcon size={20} className="text-white" />
                      </div>
                      <span className="text-white font-medium text-sm tracking-wide">VIEW ON INSTAGRAM</span>
                    </div>
                  </div>
                </motion.a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-5">
          <a
            href="https://instagram.com/career.coffee"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            Follow Us <InstagramIcon size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Instagram;
