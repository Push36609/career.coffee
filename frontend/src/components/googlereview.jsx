export default function GoogleReviews() {
  return (
    <section className="py-5 bg-gray-50">
      <div className="max-w-8xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-10">
          Google Reviews
        </h2>

        <div className="relative w-full h-[350px]">

          <iframe
            src="https://widget.tagembed.com/322456?website=1"
            title="Google Reviews"
            className="w-full h-full border-none"
          ></iframe>

          {/* White box covering watermark */}
         <div className="absolute bottom-0 right-0 bg-gray-50 w-[180px] h-[50px] md:w-[220px] md:h-[60px]"></div>

        </div>

      </div>
    </section>
  );
}