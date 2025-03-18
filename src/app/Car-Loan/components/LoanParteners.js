export default function LoanPartners() {
    const partners = [
      {
        name: "Allianz",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR87Cwqqkc53KzAW2YiL4tKe-l0R_mZ5FG93A&s",
        alt: "Allianz Insurance logo",
      },
      {
        name: "RHB Insurance",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1dLk86rf_wLSyHR6JLYgeBtFQH2gnBo0VQg&s",
        alt: "RHB Insurance Berhad logo",
      },
      {
        name: "Takaful Malaysia",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR87Cwqqkc53KzAW2YiL4tKe-l0R_mZ5FG93A&s",
        alt: "Takaful Malaysia logo",
      },
      {
        name: "Insurance Partner",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1dLk86rf_wLSyHR6JLYgeBtFQH2gnBo0VQg&s",
        alt: "Insurance Partner logo",
      },
      {
        name: "CHUBB",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR87Cwqqkc53KzAW2YiL4tKe-l0R_mZ5FG93A&s",
        alt: "CHUBB Insurance logo",
      },
    ]
  
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Loan Partners</h2>
            <div className="w-12 h-1 bg-yellow-400 mx-auto"></div>
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {partners.map((partner) => (
              <div key={partner.name} className="w-full flex items-center justify-center p-4">
                {/* Using next/image would be preferred if we had actual image URLs */}
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.alt}
                  className="max-h-[60px] w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  