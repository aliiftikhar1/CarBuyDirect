import LoanCalculator from "./components/CarLoanCalculator";
import LoanFAQSection from "./components/FaqSection";
import LoanPreApproval from "./components/Loan-Pre-Approval";
import CarLoanDocuments from "./components/LoanDocumentRequirement";
import LoanPartners from "./components/LoanParteners";
import LoanSteps from "./components/LoanSteps";

export default function CarLoan(){
    return(
        <>
        <LoanCalculator/>
        <LoanPreApproval/>
        <LoanSteps/>
        <CarLoanDocuments/>
        <LoanPartners/>
        <LoanFAQSection/>
        </>
    )
}