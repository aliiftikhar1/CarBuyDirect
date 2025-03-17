export default function FirstSection() {
    return (
      <section className="md:h-screen flex justify-center items-center mt-[80px] px-6 md:px-36 bg-white md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* About Content */}
          <div className="space-y-8 md:pr-20">
            <div className="space-y-4">
              <h2 className="text-4xl font-[100] text-gray-800">About <span className="text-yellow-600">Us</span></h2>
              <p className="mt-2 text-gray-600">
                Welcome to CarBuyDirect, the global premium car auction platform.
              </p>
              <p className="mt-2 text-gray-600">
                CarBuyDirect is owned and operated by Supercar Blondie (SB). It is the only digital auction platform that specializes in bringing you rare and collectible vehicles from all over the world. The CarBuyDirectteam has a wealth of expertise in both the in-house and digital auction space, and is based in Europe, America, and the Middle East.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-[100] text-gray-800">
              About <span className="text-yellow-600">Our Founder</span> and <span className="text-yellow-600">Owner</span>
                </h2>
              <p className="mt-2 text-gray-600">
                Supercar Blondie is the world's most followed automotive entertainment brand with over 115 million followers, generating over 2 billion monthly views worldwide. SB was founded in 2017 and has since built a strong global network of collectors, dealers, and car manufacturers. CarBuyDirect was founded to provide a space where buyers and sellers of premium vehicles around the world can connect.
              </p>
            </div>
          </div>
  
          {/* Video Section */}
          <div className="flex justify-center w-full h-full">
            <div className="bg-gray-200 w-full h-[35vh] md:h-full p-4 rounded-lg ">
              <iframe
                
                src="https://www.youtube.com/embed/l11HrVDPi00"
                title="CarBuyDirect - The Global Premium Car Auction Platform"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="rounded w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    );
  }
  