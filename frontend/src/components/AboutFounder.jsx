import React from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Star, UserCheck, Briefcase } from "lucide-react";
import founderImg from "../../public/gallery/founder.png";

const AboutFounder = () => {
  return (
    <section className="py-10 border-b bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-1 items-start">

          {/* LEFT SECTION: Profile Image & Basic Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <motion.img
                src={founderImg}
                alt="Dr. Nishant Jaiswaal"
                className="relative w-72 h-80 lg:w-80 lg:h-96 object-cover rounded-2xl shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white p-3 rounded-xl shadow-lg">
                < Award size={24} />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-display font-bold text-secondary-900">Dr. Nishant Jaiswaal</h2>
              <p className="text-primary-600 font-semibold text-lg mt-1">Founder - Career Coffee</p>
              <p className="text-secondary-500 text-sm italic">(The Unfiltered Career Discussion)</p>

              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4">
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-sm text-secondary-700 font-medium">
                  <Briefcase size={16} /> Career Counselor
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-sm text-secondary-700 font-medium">
                  <Star size={16} /> Confidence Coach
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-sm text-secondary-700 font-medium">
                  <UserCheck size={16} /> Professor of Practice
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SECTION: Detailed Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-10"
          >
            {/* Profile Summary */}
            <div className="bg-primary-50/30 p-8 rounded-3xl border border-primary-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-2xl font-display font-bold text-secondary-900">Profile Summary</h3>
              </div>
              <p className="text-secondary-600 leading-relaxed text-lg">
                Dr. Nishant Jaiswaal is a dynamic career counselor, inspirational speaker, and leadership trainer with over a decade of diverse experience in the corporate and education sectors. He is the Founder of <span className="font-bold text-primary-700">Career Coffee – The Unfiltered Career Discussion</span>, an initiative dedicated to bringing clarity, direction, and purpose to career conversations for youth across India.
              </p>
              <p className="text-secondary-600 leading-relaxed text-lg mt-4">
                Currently, he serves as a Consultant Resource Person for Pan-India Career Counseling sessions conducted by <span className="font-semibold text-secondary-900">Physics Wallah</span>. Over the past 10 years, Dr. Jaiswaal has mentored and guided over <span className="font-bold text-secondary-900 uppercase">fifty-thousand students</span>, earning acclaim for his engaging, relatable, and energizing workshop style.
              </p>
            </div>

            {/* Awards & Recognition */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                  <Award className="text-primary-600" /> Key Recognitions
                </h4>
                <ul className="space-y-3">
                  {[
                    "National Icon Awardee by Govt. of India",
                    "International Eminence Excellence Awardee",
                    "National Member of World Culture & Environment Protection Commission",
                    "Young Entrepreneur & Leader Awardee"
                  ].map((award, i) => (
                    <li key={i} className="flex items-start gap-3 text-secondary-600 text-sm font-medium">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></div>
                      {award}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                  <BookOpen className="text-primary-600" /> Qualifications
                </h4>
                <div className="space-y-3">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="font-bold text-secondary-900">Honorary Doctorate</p>
                    <p className="text-secondary-500 text-sm">Career Counseling</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="font-bold text-secondary-900">B.Sc. (Hons.) & M.A. Psychology</p>
                    <p className="text-secondary-500 text-sm">University of Delhi</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <p className="font-bold text-secondary-900">IAAP & APCDA Certified</p>
                    <p className="text-secondary-500 text-sm">Career Counselor & NLP Practitioner</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-secondary-500 italic text-sm border-l-4 border-primary-200 pl-4 py-2">
              "His sessions are celebrated for sparking curiosity, building confidence, and inspiring action among students and professionals alike."
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutFounder;
