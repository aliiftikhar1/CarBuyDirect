'use client'
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Star } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      stars: '5',
      review: 'The team exceeded our expectations. Their attention to detail is phenomenal!',
      name: 'John Doe',
      position: 'Marketing Manager',
    },
    {
      stars: '4',
      review: 'Great experience overall! Communication was smooth and results were outstanding.',
      name: 'Jane Smith',
      position: 'Project Lead',
    },
    {
      stars: '5',
      review: 'Fantastic service! We noticed immediate improvements in our brand engagement.',
      name: 'Michael Johnson',
      position: 'CTO',
    },
    {
      stars: '3',
      review: 'The project had a few delays but the final result was worth it.',
      name: 'Emily Brown',
      position: 'Product Manager',
    },
    {
      stars: '4',
      review: 'Creative and professional. They brought our vision to life beautifully.',
      name: 'Chris Green',
      position: 'Creative Director',
    },
  ]);

  const reviewsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        reviewsRef.current,
        { x: 0 },
        {
          x: `-=${reviewsRef.current.scrollWidth / 2}`,
          duration: 40,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % (reviewsRef.current.scrollWidth / 2)),
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="text-yellow-400 w-5 h-5" />
    ));
  };

  return (
    <div className="flex flex-col justify-center items-center bg-black text-white px-8 py-16 w-full overflow-hidden">
      <h1 className="text-3xl md:text-5xl font-[200] text-center mb-4">Testimonials</h1>
      <p className="text-base text-center md:text-lg font-[200] mb-6">Hear what our clients have to say about our team and our services.</p>
      <div className="flex overflow-hidden relative h-[250px] md:w-[1000px] w-[500px]">
        <div className="absolute w-20 bg-gradient-to-r from-black to-transparent z-10 h-full"></div>
        <div className="absolute right-0 w-20 bg-gradient-to-l from-black to-transparent z-10 h-full"></div>

        <div ref={reviewsRef} className="flex space-x-4">
          {reviews.concat(reviews).map((review, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg flex flex-col justify-between p-5 text-lg w-[350px] md:w-[450px] h-[250px]"
            >
              <div className="flex items-center mb-2">
                {renderStars(parseInt(review.stars))}
              </div>
              <p className="mb-4 italic">"{review.review}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={`https://img.freepik.com/free-photo/cheerful-young-caucasian-businessman_171337-727.jpg`}
                  className="w-14 h-14 object-cover rounded-full"
                  alt="user-avatar"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{review.name}</p>
                  <p className="text-gray-400">{review.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
