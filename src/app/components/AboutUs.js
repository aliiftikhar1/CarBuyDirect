"use client"

import { motion } from "framer-motion"
import { Shield, BadgeCheck, Clock } from "lucide-react"

export default function AboutUsSection() {
  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "15K+", label: "Cars Sold" },
    { number: "98%", label: "Customer Satisfaction" },
  ]

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Bidding",
      description: "Safe and transparent auction process with verified sellers",
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: "Quality Assurance",
      description: "All vehicles undergo thorough inspection before listing",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service for all your needs",
    },
  ]

  return (
    <section className="pt-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Main About Content */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              CarBuyDirect is premier online car bidding platform, connecting buyers with the best deals
              through our innovative digital marketplace. We're transforming the traditional car buying experience into
              something simpler, faster, and more transparent.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 md:gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white md:border-2 hover:border-gray-600 transition-all duration-500"
              >
                <h3 className="text-4xl font-bold text-red-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Features Grid */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <div className="text-violet-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </motion.div> */}

          {/* Mission Statement */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-20 text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide Australians with the most transparent, efficient, and trustworthy platform for buying and
                selling vehicles. We're committed to revolutionizing the automotive marketplace through innovation and
                customer-centric services.
              </p>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  )
}

