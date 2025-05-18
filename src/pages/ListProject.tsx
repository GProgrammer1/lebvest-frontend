
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectForm from "@/components/ProjectForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const ListProject = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => (prev === 1 ? 2 : 3) as 1 | 2 | 3);
    } else {
      toast({
        title: "Project submitted for review",
        description: "Our team will review your submission and contact you within 2 business days.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-lebanese-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">List Your Project or Business</h1>
          <p className="text-xl">Connect with investors and get the funding you need to grow.</p>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress tracker */}
          <div className="flex justify-between mb-12">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-lebanese-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="mt-2 text-sm">Basic Info</span>
            </div>
            <div className="flex-1 h-0.5 self-center bg-gray-200 mx-4">
              <div className={`h-full ${step >= 2 ? 'bg-lebanese-green' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-lebanese-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="mt-2 text-sm">Business Details</span>
            </div>
            <div className="flex-1 h-0.5 self-center bg-gray-200 mx-4">
              <div className={`h-full ${step >= 3 ? 'bg-lebanese-green' : 'bg-gray-200'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-lebanese-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="mt-2 text-sm">Documents & Submit</span>
            </div>
          </div>
          
          {/* Form content */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <ProjectForm step={step} />
            
            <div className="mt-8 flex justify-end">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  className="mr-4"
                  onClick={() => setStep((prev) => (prev === 3 ? 2 : 1) as 1 | 2 | 3)}
                >
                  Back
                </Button>
              )}
              <Button 
                onClick={handleNextStep}
                className="bg-lebanese-navy hover:bg-opacity-90"
              >
                {step === 3 ? 'Submit Project' : 'Next Step'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-500 font-semibold">NK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Nabil Khoury</h4>
                  <p className="text-sm text-gray-500">Tech Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-600">
                "LebVest made it incredibly easy to present our startup to investors. We raised our seed round in just 3 weeks and are now expanding our operations."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-500 font-semibold">LM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Layla Mansour</h4>
                  <p className="text-sm text-gray-500">Real Estate Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The verification process on LebVest gave investors confidence in our project. We met our funding goal within a month and broke ground on our development."
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListProject;
