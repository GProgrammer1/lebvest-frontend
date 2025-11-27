
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Investment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InvestmentCardProps {
  investment: Investment;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(amount);
};

const getCategoryLabel = (category: string): string => {
  const labels: {[key: string]: string} = {
    real_estate: 'Real Estate',
    government_bonds: 'Government Bonds',
    startup: 'Startup',
    personal_project: 'Personal Project',
    sme: 'SME',
    agriculture: 'Agriculture',
    technology: 'Technology',
    education: 'Education',
    healthcare: 'Healthcare',
    energy: 'Energy',
    tourism: 'Tourism',
    retail: 'Retail'
  };
  
  return labels[category] || category;
};

const getRiskColor = (risk: string): string => {
  const colors: {[key: string]: string} = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };
  
  return colors[risk] || 'bg-gray-100 text-gray-800';
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment }) => {
  const progressPercentage = (investment.raisedAmount / investment.targetAmount) * 100;
  const placeholderImage = "https://via.placeholder.com/400x300/1e3a8a/ffffff?text=Investment+Opportunity";
  const imageUrl = investment.imageUrl && investment.imageUrl.trim() !== "" 
    ? investment.imageUrl 
    : placeholderImage;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = placeholderImage;
  };
  
  return (
    <Card className="overflow-hidden investment-card">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={imageUrl} 
          alt={investment.title} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-2 left-2">
          <Badge className="text-xs bg-lebanese-navy hover:bg-lebanese-navy">
            {getCategoryLabel(investment.category)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(investment.riskLevel)}`}>
            {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)} Risk
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">{investment.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{investment.companyName}</p>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-gray-600">Min. Investment</p>
            <p className="font-semibold">{formatCurrency(investment.minInvestment)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Expected Return</p>
            <p className="font-semibold text-lebanese-green">{investment.expectedReturn}%</p>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-1" />
        
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{formatCurrency(investment.raisedAmount)} raised</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-lebanese-red mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="capitalize">{investment.location.replace('_', ' ')}</span>
            </div>
          </div>
          
          <Link 
            to={`/investments/${investment.id}`}
            className="text-lebanese-navy hover:underline text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCard;
