import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="w-full bg-[url('/bg/kenny-eliason-orGJcWVI6js-unsplash.jpg')] bg-cover  md:h-[80vh] flex flex-col relative">
        <div className="absolute w-full h-full bg-black/50"></div>
      {/* Main CTA Content */}
      <div className="flex-1 z-10 flex flex-col items-center justify-center text-center px-4 py-16 md:py-32">
        <p className="text-white mb-4">Pull the Trigger!</p>
        <h2 className="text-4xl md:text-6xl  font-bold text-white max-w-3xl leading-tight mb-8">
          Get Started on Your Journey Today!
        </h2>
        <Button className="bg-white text-black hover:text-white transition-all duration-500 hover:bg-gray-600/80 rounded-full px-6 md:px-8 py-3 md:py-6 text-base md:text-lg">
          Sell Your Vehicle
        </Button>
      </div>

    </section>
  )
}

