// import { motion } from 'framer-motion'
// import { Instagram, Facebook, Heart } from 'lucide-react'

// const galleryItems = [
//   { id: 1, img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800', type: 'instagram', likes: '1.2k', link: 'https://instagram.com/rebal_rockey_' },
//   { id: 2, img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800', type: 'facebook', likes: '840', link: 'https://instagram.com/rebal_rockey_' },
//   { id: 3, img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800', type: 'instagram', likes: '2.5k', link: 'https://instagram.com/rebal_rockey_' },
//   { id: 4, img: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b671?q=80&w=800', type: 'instagram', likes: '1.5k', link: 'https://instagram.com/rebal_rockey_' },
//   { id: 5, img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800', type: 'facebook', likes: '920', link: 'https://instagram.com/rebal_rockey_' },
//   { id: 6, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800', type: 'instagram', likes: '3.1k', link: 'https://instagram.com/rebal_rockey_' },
// ]

// export default function SocialGallery() {
//   return (
//     <section className="py-24 bg-white relative overflow-hidden">
//       {/* Decorative background elements */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             <p className="text-primary-600 font-semibold uppercase tracking-widest text-sm mb-3">Our Social Life</p>
//             <h2 className="section-title">Join Our Community</h2>
//             <p className="section-subtitle">Follow us for real-time updates, success stories, and career tips from the experts.</p>
//           </motion.div>

//           <div className="flex justify-center gap-4 mt-8">
//             <a href="https://instagram.com/rebal_rockey_" target="_blank" rel="noreferrer"
//               className="flex items-center gap-2 px-6 py-2 rounded-full border border-primary-100 text-secondary-600 hover:bg-primary-50 transition-colors">
//               <Instagram size={18} className="text-pink-600" /> @rebal_rockey_
//             </a>
//             <a href="https://facebook.com" target="_blank" rel="noreferrer"
//               className="flex items-center gap-2 px-6 py-2 rounded-full border border-primary-100 text-secondary-600 hover:bg-primary-50 transition-colors">
//               <Facebook size={18} className="text-blue-600" /> Career Coffee
//             </a>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
//           {galleryItems.map((item, i) => (
//             <motion.a
//               key={item.id}
//               href={item.link}
//               target="_blank"
//               rel="noreferrer"
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               whileHover={{ y: -10 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-primary-50"
//             >
//               <img
//                 src={item.img}
//                 alt="Social Preview"
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//               />

//               {/* Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
//                 <div className="flex items-center justify-between text-white">
//                   <div className="flex items-center gap-2">
//                     {item.type === 'instagram' ? <Instagram size={20} /> : <Facebook size={20} />}
//                     <span className="text-sm font-semibold capitalize">{item.type}</span>
//                   </div>
//                   <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30">
//                     <Heart size={14} className="fill-white" />
//                     <span className="text-xs font-bold">{item.likes}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Glow Effect */}
//               <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
//             </motion.a>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <p className="text-secondary-400 text-sm">Use <b>#CareerCoffee</b> to get featured!</p>
//         </div>
//       </div>
//     </section>
//   )
// }

import { useEffect } from "react";

export default function InstagramFeed() {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="py-5 bg-white">

      {/* Heading */}
      <div className="text-center mb-10 px-4">
        <p className="text-sm uppercase tracking-widest text-pink-600 font-semibold">
          Follow Us
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Our Instagram
        </h2>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Stay updated with our latest posts, career tips, and student success stories.
        </p>

        <a
          href="https://instagram.com/career.coffee"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
        >
          Follow on Instagram
        </a>
      </div>

      {/* Instagram Feed */}
      <div className="max-w-7xl mx-auto px-4">

        <iframe
          src="//lightwidget.com/widgets/2c24ae4f06765827ad26742b77198a7e.html"
          scrolling="no"
          allowTransparency="true"
          className="lightwidget-widget w-full rounded-xl shadow-lg"
          style={{
            border: 0,
            overflow: "hidden",
            height: "420px"
          }}
          title="Instagram Feed"
        ></iframe>

      </div>

    </section>
  );
}