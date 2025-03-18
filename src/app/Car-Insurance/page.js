import FAQSection from "./components/FaqSection";
import CarInsuranceForm from "./components/HeroSection";
import InsurancePartners from "./components/InsuranceParteners";
import InsuranceSteps from "./components/InsuranceSteps";

export default function CarInsurance(){
    return(
        <>
        <CarInsuranceForm/>
        <InsurancePartners/>
        <InsuranceSteps/>
        <FAQSection/>
        </>
    )
}