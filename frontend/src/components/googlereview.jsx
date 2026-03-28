import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import "swiper/css"
import "swiper/css/autoplay"

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([])

  // useEffect(() => {
  //   fetch("http://localhost:5000/api/google/reviews")
  //     .then((res) => res.json())
  //     .then((data) => setReviews(data))
  //     .catch((err) => console.error(err))
  // }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-10">
          Google Reviews
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col justify-between">

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <h4 className="font-semibold">
                    {review.author_name}
                  </h4>
                </div>

                <div className="text-yellow-500 mb-3">
                  {"⭐".repeat(review.rating)}
                </div>

                <p className="text-gray-600 text-sm">
                  {review.text}
                </p>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  )
}