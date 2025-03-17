'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const FAQContent = ({ activeTab, searchTerm, isSearching }) => {
  const faqData = {
    general: {
      text: "General questions about the auction on CarBuyDirect",
      questions: [
        { question: "What is CarBuyDirect?", answer: "CarBuyDirect is a car auction platform..." },
        {
          question: "How do I create an CarBuyDirect account?",
          answer: <>
            <span className="font-medium">Click here</span> to create an CarBuyDirect account. You will be asked to provide your name, email address, phone number, and create a username of your choice. Once you have signed up, you can search current auction listings, save, and follow your favorite auctions. You can also participate in the comments section of any auction. If you would like to bid on a vehicle, you will have to create a Registered Bidders account.
          </>,
        },
        { question: "Do I need an CarBuyDirect account?", answer: "Yes, to access our services..." },
        { question: "How do I register to bid?", answer: "You can register by..." },
      ],
    },
    selling: {
      text: "General questions about selling with CarBuyDirect",
      questions: [
        { question: "Why should I sell with CarBuyDirect?", answer: "Selling with CarBuyDirect offers..." },
        { question: "How much does it cost to sell with CarBuyDirect?", answer: "The cost to sell varies based on..." },
      ],
    },
    buying: {
      text: "General questions about buying on CarBuyDirect",
      questions: [
        { question: "How do I register to bid?", answer: "To register for bidding, you need..." },
        { question: "Are there any taxes involved?", answer: "Yes, taxes such as VAT may apply..." },
      ],
    },
  }

  const filterQuestions = (questions) => {
    if (!searchTerm) return questions;
    return questions.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const allQuestions = Object.values(faqData).flatMap(category => category.questions);
  const filteredQuestions = isSearching ? filterQuestions(allQuestions) : faqData[activeTab].questions;

  return (
    <div className="md:max-w-3xl mx-auto md:px-4 py-8">
      {isSearching ? (
        <h1 className="text-center mb-6 text-4xl font-light">
          <span className="text-neutral-900">Filtered Questions</span>
        </h1>
      ) : (
        <>
          <h1 className="text-center mb-2 text-4xl font-light">
            <span className="text-neutral-400">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
            <span className="ml-2 text-neutral-900">Questions</span>
          </h1>
          <p className="text-center text-neutral-600 mb-8">
            {faqData[activeTab].text}
          </p>
        </>
      )}
      {filteredQuestions.length === 0 ? (
        <p className="text-center text-neutral-600">No matching questions found.</p>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {filteredQuestions.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg px-4 py-2 data-[state=open]:bg-white"
            >
              <AccordionTrigger className={cn(
                "hover:no-underline text-left font-medium text-neutral-900",
                "data-[state=open]:text-neutral-900"
              )}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}

export default FAQContent

