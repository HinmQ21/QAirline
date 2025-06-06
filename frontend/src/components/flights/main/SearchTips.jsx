import React, { useState } from 'react';
import { Lightbulb, Calendar, DollarSign, Clock, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tips = [
  {
    icon: Calendar,
    title: "Best Time to Book",
    content: "Book flights 2-3 months in advance for domestic flights and 3-6 months for international flights to get the best deals.",
    color: "text-blue-600"
  },
  {
    icon: DollarSign,
    title: "Save Money",
    content: "Compare prices across different days. Weekday flights are often cheaper than weekend flights.",
    color: "text-green-600"
  },
  {
    icon: Clock,
    title: "Flexible Dates",
    content: "If your travel dates are flexible, try searching for flights a few days before or after your preferred date.",
    color: "text-purple-600"
  }
];

const quickTips = [
  "Clear your browser cookies before booking",
  "Consider nearby airports for better deals",
  "Book round trips separately sometimes cheaper",
  "Sign up for price alerts on your preferred routes"
];

export const SearchTips = ({ onClose, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <Card className={`border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Flight Search Tips</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Tip Carousel */}
        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-white shadow-sm`}>
              {React.createElement(tips[currentTip].icon, {
                className: `h-5 w-5 ${tips[currentTip].color}`
              })}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {tips[currentTip].title}
              </h4>
              <p className="text-sm text-gray-600">
                {tips[currentTip].content}
              </p>
            </div>
          </div>
          
          {/* Tip Navigation */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-1">
              {tips.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTip ? 'bg-yellow-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTip(index)}
                />
              ))}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevTip}
                className="h-6 w-6 p-0 text-gray-500"
              >
                ←
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTip}
                className="h-6 w-6 p-0 text-gray-500"
              >
                →
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <h4 className="font-medium text-gray-900 mb-3">Quick Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{tip}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                💡 Pro tip: Book Tuesday-Thursday for best prices
              </Badge>
              <Badge variant="outline" className="text-xs">
                🔄 Set up price alerts for your route
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 