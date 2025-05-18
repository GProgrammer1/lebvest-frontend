
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is LebVest?",
      answer: "LebVest is a platform that connects Lebanese businesses with investors to revitalize the economy and create growth opportunities. We facilitate investments across various sectors including technology, real estate, and small businesses."
    },
    {
      question: "How do I start investing?",
      answer: "To start investing, first create an account on LebVest. Once registered, you can browse through available investment opportunities, review their details, and choose projects that align with your investment goals. After selecting a project, follow the instructions to complete your investment."
    },
    {
      question: "Is there a minimum investment amount?",
      answer: "Yes, each investment opportunity has its own minimum investment amount. This information is clearly displayed on the investment details page. Some opportunities start from as low as $100, while others may require higher minimum investments."
    },
    {
      question: "How are projects vetted before they appear on LebVest?",
      answer: "All projects undergo a thorough vetting process before being listed on our platform. This includes verification of business registration, financial records review, background checks on key personnel, and assessment of the business plan and growth potential. Only projects that meet our strict criteria are approved for listing."
    },
    {
      question: "What returns can I expect on investments?",
      answer: "Returns vary significantly depending on the type of investment, risk profile, and sector. Each investment opportunity includes projected returns based on the business plan, but it's important to understand that all investments carry risk, and actual returns may differ from projections."
    },
    {
      question: "How do I list my project on LebVest?",
      answer: "To list your project, click on the 'List Your Project' button on our website. You'll need to complete an application form with details about your business, funding requirements, and financial projections. Our team will review your application and may request additional information before approving your listing."
    },
    {
      question: "What are the fees for using LebVest?",
      answer: "Investors typically pay no platform fees to invest. Project owners pay a listing fee and a success fee that's a percentage of the total funds raised. Detailed fee information is provided during the listing process."
    },
    {
      question: "How do I get my investment returns?",
      answer: "The method and timing of returns depend on the investment type. For equity investments, returns may come through dividends or exit events. For debt investments, returns typically come through regular interest payments and principal repayment at maturity. The specific terms for each investment are detailed in the investment documentation."
    },
    {
      question: "Is my personal and financial information secure?",
      answer: "Yes, we take security seriously. LebVest uses advanced encryption and security protocols to protect your personal and financial information. We comply with international data protection standards and regulations."
    },
    {
      question: "Can international investors use LebVest?",
      answer: "Yes, international investors can use LebVest to invest in Lebanese opportunities. However, certain restrictions may apply based on your country of residence and its regulations on foreign investments. We recommend consulting with a financial advisor in your jurisdiction."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Frequently Asked Questions | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <HelpCircle className="h-6 w-6 text-lebanese-navy" />
            <h1 className="text-3xl font-bold text-lebanese-navy">Frequently Asked Questions</h1>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-md">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Still have questions? Contact us at <span className="text-lebanese-navy font-semibold">support@lebvest.com</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
