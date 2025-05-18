
import React from "react";
import { Investment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InvestmentDetailProps {
  investment: Investment;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const capitalize = (str: string): string => {
  return str.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const InvestmentDetail: React.FC<InvestmentDetailProps> = ({ investment }) => {
  const progressPercentage = (investment.raisedAmount / investment.targetAmount) * 100;
  
  const getRiskColor = (risk: string): string => {
    const colors: {[key: string]: string} = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{investment.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{investment.companyName}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="capitalize">
                {capitalize(investment.category)}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {capitalize(investment.sector)}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {capitalize(investment.location)}
              </Badge>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.riskLevel)}`}>
                {capitalize(investment.riskLevel)} Risk
              </span>
            </div>
          </div>
          
          {/* Main image */}
          <div className="rounded-lg overflow-hidden mb-8">
            <img 
              src={investment.imageUrl} 
              alt={investment.title} 
              className="w-full h-80 object-cover"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">About This Investment</h3>
                <p className="text-gray-700">{investment.description}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {investment.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-lebanese-green mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">AI Investment Analysis</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Profit Prediction</p>
                        <p className="text-2xl font-bold text-lebanese-green">{investment.aiPrediction.profitPrediction}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold mr-2">{investment.aiPrediction.confidenceScore}</p>
                          <span className="text-sm text-gray-500">/100</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Expected Return</p>
                        <p className="text-2xl font-bold text-lebanese-navy">{investment.expectedReturn}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm text-gray-500 mb-2">Risk Assessment</p>
                      <p className="text-gray-700">{investment.aiPrediction.riskAssessment}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="financials" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Financial History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {investment.financials.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.revenue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.expenses)}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(item.profit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Investment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm text-gray-500">Investment Type</dt>
                          <dd className="text-lg font-medium capitalize">{investment.investmentType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Funding Stage</dt>
                          <dd className="text-lg font-medium">{investment.fundingStage}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Duration</dt>
                          <dd className="text-lg font-medium">{investment.duration} months</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm text-gray-500">Minimum Investment</dt>
                          <dd className="text-lg font-medium">{formatCurrency(investment.minInvestment)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Expected Return</dt>
                          <dd className="text-lg font-medium text-lebanese-green">{investment.expectedReturn}%</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Risk Level</dt>
                          <dd className="text-lg font-medium capitalize">{investment.riskLevel}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {investment.team.map((member, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                              {member.imageUrl ? (
                                <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-2xl text-gray-500">{member.name.charAt(0)}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold">{member.name}</h4>
                            <p className="text-sm text-lebanese-navy mb-2">{member.role}</p>
                            <p className="text-sm text-gray-600">{member.bio}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Available Documents</h3>
                <div className="space-y-4">
                  {investment.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-gray-500 uppercase">{doc.type}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="updates" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Project Updates</h3>
                <div className="space-y-6">
                  {investment.updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-lebanese-navy pl-4 py-1">
                      <p className="text-sm text-gray-500 mb-1">{formatDate(update.date)}</p>
                      <h4 className="font-semibold text-lg mb-2">{update.title}</h4>
                      <p className="text-gray-700">{update.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Funding Progress</h3>
                    <Progress value={progressPercentage} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(investment.raisedAmount)} raised</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Target: {formatCurrency(investment.targetAmount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Deadline</p>
                    <p className="font-semibold">{formatDate(investment.deadline)}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold mb-2">Investment Amount</h4>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Minimum</span>
                      <span className="font-medium">{formatCurrency(investment.minInvestment)}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        {formatCurrency(investment.minInvestment)}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        {formatCurrency(investment.minInvestment * 5)}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        {formatCurrency(investment.minInvestment * 10)}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </Button>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <input
                          type="text"
                          placeholder="Custom amount"
                          className="w-full pl-8 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-lebanese-navy hover:bg-opacity-90">
                    Invest Now
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Add to Watchlist
                  </Button>
                  
                  <Alert className="bg-gray-50 border-gray-200">
                    <AlertDescription className="text-sm text-gray-600">
                      This investment opportunity has been verified by LebVest according to Lebanese regulations and our platform standards.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetail;
