
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  InvestmentCategory, 
  InvestmentType, 
  Location, 
  InvestmentSector 
} from "@/lib/types";

interface ProjectFormProps {
  step: 1 | 2 | 3;
}

export interface ProjectFormHandle {
  getFormData: () => any;
}

// Schema for step 1
const basicInfoSchema = z.object({
  title: z.string().min(5, {
    message: "Project title must be at least 5 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  category: z.string(),
  location: z.string(),
});

// Schema for step 2
const businessDetailsSchema = z.object({
  investmentType: z.string(),
  sector: z.string(),
  targetAmount: z.string().regex(/^\d+$/, {
    message: "Target amount must be a number.",
  }),
  minInvestment: z.string().regex(/^\d+$/, {
    message: "Minimum investment must be a number.",
  }),
  duration: z.number().min(1).max(120),
  expectedReturn: z.number().min(0).max(100),
});

// Schema for step 3
const documentSchema = z.object({
  businessPlan: z.any(),
  financialProjections: z.any(),
  additionalDocuments: z.any(),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

const ProjectForm = forwardRef<ProjectFormHandle, ProjectFormProps>(({ step }, ref) => {
  // File input refs
  const businessPlanInputRef = useRef<HTMLInputElement>(null);
  const financialProjectionsInputRef = useRef<HTMLInputElement>(null);
  const additionalDocumentsInputRef = useRef<HTMLInputElement>(null);

  // Form definitions for each step
  const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: "",
      companyName: "",
      description: "",
      category: "",
      location: "",
    },
  });

  const businessDetailsForm = useForm<z.infer<typeof businessDetailsSchema>>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      investmentType: "",
      sector: "",
      targetAmount: "",
      minInvestment: "",
      duration: 36,
      expectedReturn: 10,
    },
  });

  const documentForm = useForm({
    defaultValues: {
      businessPlan: null,
      financialProjections: null,
      additionalDocuments: null,
      termsAgreed: false,
    },
  });

  // Expose form data to parent
  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const basicData = basicInfoForm.getValues();
      const businessData = businessDetailsForm.getValues();
      const documentData = documentForm.getValues();

      // Validate current step
      if (step === 1) {
        const isValid = await basicInfoForm.trigger();
        if (!isValid) {
          return null;
        }
      } else if (step === 2) {
        const isValid = await businessDetailsForm.trigger();
        if (!isValid) {
          return null;
        }
      } else if (step === 3) {
        const isValid = await documentForm.trigger();
        if (!isValid) {
          return null;
        }
      }

      return {
        ...basicData,
        ...businessData,
        ...documentData,
      };
    },
  }));

  // Render appropriate form based on step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form {...basicInfoForm}>
            <form 
              className="space-y-4 sm:space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <FormField
                control={basicInfoForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Beirut Tech Hub Office Building" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your investment opportunity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={basicInfoForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company/Entity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lebanon Real Estate Ventures" {...field} />
                    </FormControl>
                    <FormDescription>
                      The legal name of your company or business entity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={basicInfoForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project, its goals, and why investors should be interested..." 
                        className="min-h-32"
                        value={field.value || ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        disabled={false}
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of your project (minimum 50 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={basicInfoForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="real_estate">Real Estate</SelectItem>
                          <SelectItem value="government_bonds">Government Bonds</SelectItem>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="personal_project">Personal Project</SelectItem>
                          <SelectItem value="sme">Small/Medium Enterprise</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="energy">Energy</SelectItem>
                          <SelectItem value="tourism">Tourism</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The main category that best describes your investment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={basicInfoForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Location</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beirut">Beirut</SelectItem>
                          <SelectItem value="mount_lebanon">Mount Lebanon</SelectItem>
                          <SelectItem value="north">North Lebanon</SelectItem>
                          <SelectItem value="south">South Lebanon</SelectItem>
                          <SelectItem value="bekaa">Bekaa</SelectItem>
                          <SelectItem value="nabatieh">Nabatieh</SelectItem>
                          <SelectItem value="baalbek_hermel">Baalbek-Hermel</SelectItem>
                          <SelectItem value="akkar">Akkar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The primary location of your project in Lebanon.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );
      case 2:
        return (
          <Form {...businessDetailsForm}>
            <form 
              className="space-y-4 sm:space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={businessDetailsForm.control}
                  name="investmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select investment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="equity">Equity</SelectItem>
                          <SelectItem value="debt">Debt</SelectItem>
                          <SelectItem value="crowdfunding">Crowdfunding</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of investment you are seeking.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={businessDetailsForm.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Sector</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="real_estate">Real Estate</SelectItem>
                          <SelectItem value="consumer">Consumer</SelectItem>
                          <SelectItem value="energy">Energy</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="tourism">Tourism</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The business sector of your project.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={businessDetailsForm.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Funding Amount (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="e.g., 500000"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The total amount of funding you are seeking in USD.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={businessDetailsForm.control}
                  name="minInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Investment (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="e.g., 5000"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The minimum investment amount per investor.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={businessDetailsForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Duration (Months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 36"
                          min={1}
                          max={120}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : Number(e.target.value);
                            if (value === '' || (value >= 1 && value <= 120)) {
                              field.onChange(value === '' ? undefined : value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        The expected duration of your project in months (1-120).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessDetailsForm.control}
                  name="expectedReturn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Return (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 10"
                          min={0}
                          max={100}
                          step={0.5}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : Number(e.target.value);
                            if (value === '' || (value >= 0 && value <= 100)) {
                              field.onChange(value === '' ? undefined : value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        The expected return on investment as a percentage (0-100).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );
      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Document Uploads</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Please upload the following documents to support your investment listing. 
                All documents will be reviewed by our team for verification purposes.
              </p>
              
              <div className="space-y-4">
                <FormField
                  control={documentForm.control}
                  name="businessPlan"
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-lebanese-navy transition-colors cursor-pointer"
                         onClick={() => businessPlanInputRef.current?.click()}>
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <input 
                        {...field}
                        ref={businessPlanInputRef}
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                      />
                      <div>
                        <span className="text-sm font-medium block">Business Plan</span>
                        {value ? (
                          <p className="text-xs text-lebanese-navy mt-1 truncate">{value.name}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">
                            Upload a detailed business plan (PDF, DOC, DOCX)
                          </p>
                        )}
                      </div>
                      <button 
                        type="button"
                        className="mt-2 text-sm text-lebanese-navy hover:underline font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          businessPlanInputRef.current?.click();
                        }}
                      >
                        {value ? 'Change file' : 'Select file'}
                      </button>
                    </div>
                  )}
                />
                
                <FormField
                  control={documentForm.control}
                  name="financialProjections"
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-lebanese-navy transition-colors cursor-pointer"
                         onClick={() => financialProjectionsInputRef.current?.click()}>
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <input 
                        {...field}
                        ref={financialProjectionsInputRef}
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.xls,.xlsx,.csv" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                      />
                      <div>
                        <span className="text-sm font-medium block">Financial Projections</span>
                        {value ? (
                          <p className="text-xs text-lebanese-navy mt-1 truncate">{value.name}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">
                            Upload financial projections (PDF, Excel)
                          </p>
                        )}
                      </div>
                      <button 
                        type="button"
                        className="mt-2 text-sm text-lebanese-navy hover:underline font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          financialProjectionsInputRef.current?.click();
                        }}
                      >
                        {value ? 'Change file' : 'Select file'}
                      </button>
                    </div>
                  )}
                />
                
                <FormField
                  control={documentForm.control}
                  name="additionalDocuments"
                  render={({ field: { onChange, value, ...field } }) => (
                    <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-lebanese-navy transition-colors cursor-pointer"
                         onClick={() => additionalDocumentsInputRef.current?.click()}>
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                      <input 
                        {...field}
                        ref={additionalDocumentsInputRef}
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg" 
                        multiple 
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            onChange(Array.from(files));
                          }
                        }}
                      />
                      <div>
                        <span className="text-sm font-medium block">Additional Documents (Optional)</span>
                        {value && Array.isArray(value) && value.length > 0 ? (
                          <p className="text-xs text-lebanese-navy mt-1">{value.length} file(s) selected</p>
                        ) : value && !Array.isArray(value) ? (
                          <p className="text-xs text-lebanese-navy mt-1 truncate">{value.name}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">
                            Company registration, licenses, team bios, etc.
                          </p>
                        )}
                      </div>
                      <button 
                        type="button"
                        className="mt-2 text-sm text-lebanese-navy hover:underline font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          additionalDocumentsInputRef.current?.click();
                        }}
                      >
                        {value ? 'Change files' : 'Select files'}
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
            
            <Form {...documentForm}>
              <form 
                className="space-y-4 sm:space-y-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <FormField
                  control={documentForm.control}
                  name="termsAgreed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium text-gray-700 cursor-pointer">
                          I agree to the Terms and Conditions
                        </FormLabel>
                        <FormDescription className="text-gray-500">
                          By checking this box, I confirm that all information provided is accurate and I accept the 
                          <a href="#" className="text-lebanese-navy hover:underline"> terms and conditions</a> of listing on LebVest.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            
            <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <h3 className="text-xs sm:text-sm font-medium text-yellow-800">Verification Notice</h3>
                  <p className="text-xs text-yellow-700 mt-1">
                    All submissions are subject to verification by our team. Projects are typically reviewed within 2 business days.
                    You will be notified by email once your project is approved and published on the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        {step === 1 && "Basic Information"}
        {step === 2 && "Business Details"}
        {step === 3 && "Documents & Submission"}
      </h2>
      {renderStepContent()}
    </div>
  );
});

ProjectForm.displayName = "ProjectForm";

export default ProjectForm;
