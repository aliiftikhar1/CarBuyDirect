"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <div className="py-16 px-4 ">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-black text-5xl font-bold text-center mb-12">FAQ</h1>
        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-black hover:text-black/90 text-xl font-normal">
                Is this free to use?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                Yes, this service is completely free to use. We believe in providing value to our users without any
                hidden costs or charges.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="text-black hover:text-black/90 text-xl font-normal">
                What makes CarBuyDirect Different?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                CarBuyDirect offers a unique combination of transparent pricing, extensive vehicle selection, and a
                streamlined buying process that sets us apart from traditional dealerships.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="text-black hover:text-black/90 text-xl font-normal">
                Can I trust the quality of cars?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                Absolutely. Every vehicle undergoes a rigorous inspection process, and we provide detailed vehicle
                history reports to ensure complete transparency about the condition of each car.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none">
              <AccordionTrigger className="text-black hover:text-black/90 text-xl font-normal">
                How long does 2Checkout store personal data?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                2Checkout stores personal data only for as long as necessary to fulfill the purposes for which it was
                collected, including legal, accounting, or reporting requirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

