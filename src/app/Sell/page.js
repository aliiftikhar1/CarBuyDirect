import FAQSection from "./FaqSection";
import CarInquiryForm from "./FirstSection";
import ImageSection from "./Section";
import WhyCarBuyDirect from "./WhyCarBuyDirect";

export default function SellingPage(){
    return(
        <div>
            <CarInquiryForm/>
            <ImageSection/>
            <WhyCarBuyDirect/>
            <FAQSection/>
        </div>
    )
}