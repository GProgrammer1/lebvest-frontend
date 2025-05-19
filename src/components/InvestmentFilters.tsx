
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FilterOptions, InvestmentCategory, RiskLevel, InvestmentType, Location, InvestmentSector } from "@/lib/types";

interface InvestmentFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const InvestmentFilters: React.FC<InvestmentFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [returnRange, setReturnRange] = useState<[number]>([0]);
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([0, 100000]);

  const handleCategoryChange = (category: InvestmentCategory, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      category: checked ? category : undefined,
    }));
  };

  const handleRiskLevelChange = (riskLevel: RiskLevel, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      riskLevel: checked ? riskLevel : undefined,
    }));
  };

  const handleLocationChange = (location: Location, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      location: checked ? location : undefined,
    }));
  };

  const handleSectorChange = (sector: InvestmentSector, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      sector: checked ? sector : undefined,
    }));
  };

  const handleInvestmentTypeChange = (type: InvestmentType, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      investmentType: checked ? type : undefined,
    }));
  };

  const handleReturnChange = (value: number[]) => {
    setReturnRange([value[0]]);
    setFilters((prev) => ({
      ...prev,
      minReturn: value[0],
    }));
  };

  const handleInvestmentAmountChange = (value: number[]) => {
    setInvestmentRange([value[0], value[1]]);
    setFilters((prev) => ({
      ...prev,
      minAmount: value[0],
      maxAmount: value[1],
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setReturnRange([0]);
    setInvestmentRange([0, 100000]);
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4">Filter Investments</h3>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Investment Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['real_estate', 'government_bonds', 'startup', 'agriculture', 'technology', 'education', 'healthcare', 'energy', 'tourism', 'retail'].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={filters.category === category}
                    onCheckedChange={(checked) => handleCategoryChange(category as InvestmentCategory, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category}`} className="capitalize">
                    {category.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risk">
          <AccordionTrigger>Risk Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['low', 'medium', 'high'].map((risk) => (
                <div key={risk} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`risk-${risk}`} 
                    checked={filters.riskLevel === risk}
                    onCheckedChange={(checked) => handleRiskLevelChange(risk as RiskLevel, checked as boolean)}
                  />
                  <Label htmlFor={`risk-${risk}`} className="capitalize">
                    {risk}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="return">
          <AccordionTrigger>Minimum Return</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider 
                defaultValue={[0]} 
                value={returnRange} 
                onValueChange={handleReturnChange}
                max={50} 
                step={1} 
              />
              <div className="flex justify-between">
                <span>0%</span>
                <span className="font-medium">{returnRange[0]}%+</span>
                <span>50%</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['beirut', 'mount_lebanon', 'north', 'south', 'bekaa', 'nabatieh', 'baalbek_hermel', 'akkar'].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`location-${location}`} 
                    checked={filters.location === location}
                    onCheckedChange={(checked) => handleLocationChange(location as Location, checked as boolean)}
                  />
                  <Label htmlFor={`location-${location}`} className="capitalize">
                    {location.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sector">
          <AccordionTrigger>Sector</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['technology', 'healthcare', 'finance', 'real_estate', 'consumer', 'energy', 'industrial', 'agriculture', 'education', 'tourism', 'retail'].map((sector) => (
                <div key={sector} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`sector-${sector}`} 
                    checked={filters.sector === sector}
                    onCheckedChange={(checked) => handleSectorChange(sector as InvestmentSector, checked as boolean)}
                  />
                  <Label htmlFor={`sector-${sector}`} className="capitalize">
                    {sector.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="investmentType">
          <AccordionTrigger>Investment Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['equity', 'debt', 'crowdfunding'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={filters.investmentType === type}
                    onCheckedChange={(checked) => handleInvestmentTypeChange(type as InvestmentType, checked as boolean)}
                  />
                  <Label htmlFor={`type-${type}`} className="capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-4">
        <Button 
          onClick={handleApplyFilters} 
          className="w-full bg-lebanese-navy hover:bg-opacity-90"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={handleResetFilters} 
          variant="outline" 
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default InvestmentFilters;
