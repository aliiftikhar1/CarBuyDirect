import { Check } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CarLoanDocuments() {
  const categories = [
    {
      title: "Public Sector Employees",
      ageRange: "Ages 21 & Above",
      icon: "https://www.carsome.my/_nuxt/img/public-sector-employees.42dc718.svg",
      documents: ["Valid Malaysian Identification Card (IC)", "Driving License", "Latest 3 Months' Payslips"],
    },
    {
      title: "Private Sector Employees",
      ageRange: "Ages 21 & Above",
      icon: "https://www.carsome.my/_nuxt/img/private-sector-employees.62b7f14.svg",
      documents: [
        "Valid Malaysian Identification Card (IC)",
        "Driving License",
        "Passport or Employment Letter",
        "Latest 3 Months' Payslips",
        "EPF Statement",
      ],
      notes: {
        "Passport or Employment Letter": "(for applicants working less than 3 months)",
      },
    },
    {
      title: "Self Employed Individuals",
      ageRange: "Ages 21 & Above",
      icon: "https://www.carsome.my/_nuxt/img/self-employed-individuals.830e7f1.svg",
      documents: [
        "Valid Malaysian Identification Card (IC)",
        "Driving License",
        "Latest 6 Months' Payslips",
        "Copy of Company Registration (SSM)",
      ],
    },
    {
      title: "Graduate & Young Professionals Scheme",
      ageRange: "Ages 18 to 30",
      icon: "https://www.carsome.my/_nuxt/img/professionals-scheme.86e1145.svg",
      documents: [
        "Valid Malaysian Identification Card (IC)",
        "Driving License",
        "Latest 3 Months' Payslips",
        "Job Offer Letter",
        "Copy of Degree or Diploma Certificate",
      ],
      notes: {
        "Job Offer Letter": "(for applicants working less than 3 months)",
      },
    },
  ]

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-1 bg-yellow-400 mx-auto mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Documents Required for Car Loan Application</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Card key={index} className="bg-gray-50 border-none shadow-sm">
            <CardHeader className="flex flex-col items-center pt-8 pb-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={category.icon || "/placeholder.svg"}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.ageRange}</p>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-4">
                {category.documents.map((document, docIndex) => (
                  <li key={docIndex} className="flex items-start">
                    <div className="mr-2 mt-0.5 flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-gray-700">{document}</p>
                      {category.notes && category.notes[document] && (
                        <p className="text-sm text-gray-500 mt-1">{category.notes[document]}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

