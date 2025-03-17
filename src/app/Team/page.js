import Image from "next/image"


export default function TeamSection() {
  const teamMembers = [
    {
      name: "Alex Hirschi",
      title: "Co-Founder",
      location: "Dubai, United Arab Emirates",
      image: "https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM=",
    },
    {
      name: "Rogelio Choy",
      title: "CEO",
      location: "San Francisco, USA",
      image: "https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM=",
    },
    {
      name: "Steven Gregg",
      title: "Managing Director",
      location: "Scottsdale, USA",
      image: "https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM=",
    },
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto mt-4">
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-[200] mb-6">
          The <span className="text-[#b19b61]">Team</span>
        </h2>
        <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-700 leading-relaxed">
          Our enthusiastic team of industry professionals is always ready to assist you, whether you need guidance on
          the auction process or require assistance with any aspect of your account.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3  gap-12 md:gap-8 lg:gap-12 mt-12">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-52 h-52 md:w-64 md:h-64 mb-6 rounded-full overflow-hidden bg-gray-100">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                fill
                className="object-cover"
                priority={index < 3}
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
            <p className="text-gray-500 mb-2">{member.title}</p>
            <p className="text-gray-700">{member.location}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

