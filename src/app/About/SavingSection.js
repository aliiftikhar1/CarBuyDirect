import { User2, Timer, Home } from "lucide-react"

export default function SavingsSection() {
  const steps = [
    {
      icon: User2,
      title: "Sign up",
      description: "Create your free Account in minutes",
    },
    {
      icon: Timer,
      title: "Browse",
      description: "Explore cars, services and more tailored to your needs",
    },
    {
      icon: Home,
      title: "Save",
      description: "Enjoy Wholesale prices and exclusive deals",
    },
  ]

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-tight">
          YOUR SAVING STARTS TODAY
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <step.icon className="w-8 h-8 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-semibold mb-1">{step.title}</h3>
              <p className="text-gray-300 text-sm max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

