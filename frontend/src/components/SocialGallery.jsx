       

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
          src="//lightwidget.com/widgets/a42e1c414c2451d5ada0fb06ec3d86af.html"
          scrolling="no"
          
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
