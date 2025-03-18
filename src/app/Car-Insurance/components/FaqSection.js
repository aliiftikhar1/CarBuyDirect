import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQSection() {
  const faqs = [
    {
      question: "What is CARSOME Capital's motor insurance?",
      answer:
        "CARSOME Capital's motor insurance is a comprehensive coverage plan that protects your vehicle against various risks. We partner with leading insurance providers to offer competitive rates and excellent coverage options tailored to your needs.",
    },
    {
      question: "Why should I renew motor insurance at CARSOME x PolicyStreet?",
      answer:
        "Renewing your motor insurance with CARSOME x PolicyStreet offers several benefits including competitive rates, streamlined process, instant quotes from multiple insurers, and dedicated customer support. We also provide flexible payment options and additional coverage customization.",
    },
    {
      question: "How do I renew my insurance and road tax with CARSOME x PolicyStreet?",
      answer:
        "The renewal process is simple: Enter your vehicle details on our platform, compare quotes from various insurers, select your preferred coverage, and complete the payment. Road tax renewal can be added during the insurance purchase process for a convenient one-stop solution.",
    },
    {
      question: "Which insurers are available for an instant quote?",
      answer:
        "We partner with major insurance providers including Allianz, RHB Insurance, Takaful Malaysia, and CHUBB. Our platform provides instant quotes from these trusted insurers, allowing you to compare coverage options and prices easily.",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <div className="w-12 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

