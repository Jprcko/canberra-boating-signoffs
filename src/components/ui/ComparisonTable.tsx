
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonRow {
  feature: string;
  yourService: {
    value: string;
    isPositive: boolean;
  };
  standardCourse: {
    value: string;
    isPositive: boolean;
  };
}

const ComparisonTable = () => {
  const comparisonData: ComparisonRow[] = [{
    feature: "Full-day on-water training",
    yourService: {
      value: "Yes",
      isPositive: true
    },
    standardCourse: {
      value: "No (classroom only)",
      isPositive: false
    }
  }, {
    feature: "All logbook trips completed in one day",
    yourService: {
      value: "Yes",
      isPositive: true
    },
    standardCourse: {
      value: "Not applicable",
      isPositive: false
    }
  }, {
    feature: "Relaxed, practical coaching",
    yourService: {
      value: "Yes",
      isPositive: true
    },
    standardCourse: {
      value: "Formal class",
      isPositive: false
    }
  }, {
    feature: "Real-World Boating Practice",
    yourService: {
      value: "On-water skills you actually use",
      isPositive: true
    },
    standardCourse: {
      value: "Limited practical experience",
      isPositive: false
    }
  }, {
    feature: "Instructor Attention",
    yourService: {
      value: "Small group coaching (12 people max)",
      isPositive: true
    },
    standardCourse: {
      value: "Group sessions 20+, less individual time",
      isPositive: false
    }
  }, {
    feature: "Includes licence knowledge test",
    yourService: {
      value: "No (undertake at Service NSW Queanbeyan, licence printed same day)",
      isPositive: false
    },
    standardCourse: {
      value: "Yes",
      isPositive: true
    }
  }, {
    feature: "Fun day on the water",
    yourService: {
      value: "Definitely",
      isPositive: true
    },
    standardCourse: {
      value: "Classroom-based",
      isPositive: false
    }
  }, {
    feature: "Price",
    yourService: {
      value: "Logbook supervision: $330\nUse of commercial vessel & fuel: $90\nCertificate, support & resources: $79\nTotal: $499",
      isPositive: true
    },
    standardCourse: {
      value: "$390–$470 (theory only)",
      isPositive: false
    }
  }];

  const renderCell = (data: {
    value: string;
    isPositive: boolean;
  }, isYourService: boolean) => {
    const icon = data.isPositive ? 
      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" /> : 
      <X className="h-4 w-4 md:h-5 md:w-5 text-red-500 flex-shrink-0" />;
    
    // Check if this is the Service NSW text
    const isServiceNSWText = data.value.includes("Service NSW Queanbeyan");
    
    // Check if this is the price breakdown text
    const isPriceBreakdown = data.value.includes("Logbook supervision:");
    
    return (
      <div className="flex items-start gap-2 w-full">
        {icon}
        {isPriceBreakdown ? (
          <div className={`text-sm md:text-base w-full ${isYourService && data.isPositive ? 'font-semibold text-water-blue' : ''}`}>
            {data.value.split('\n').map((line, index) => (
              <div key={index} className={`break-words ${line.startsWith('Total:') ? 'font-bold border-t pt-1 mt-1' : ''}`}>
                {line}
              </div>
            ))}
          </div>
        ) : (
          <span className={`text-sm md:text-base w-full break-words ${isYourService && data.isPositive ? 'font-semibold text-water-blue' : ''} ${isServiceNSWText ? 'text-water-blue font-bold' : ''}`}>
            {data.value}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full overflow-hidden">
      <Card className="w-full">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl md:text-2xl">Why Choose Our Service?</CardTitle>
          <p className="text-gray-600 text-sm md:text-base">See how we compare to traditional boat licence courses</p>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          {/* Mobile Cards View - Only visible on mobile */}
          <div className="block md:hidden space-y-4 p-4 w-full">
            {comparisonData.map((row, index) => (
              <Card key={index} className="border border-gray-200 w-full">
                <CardContent className="p-4 w-full">
                  <h3 className="font-semibold text-navy mb-3 text-sm break-words">{row.feature}</h3>
                  
                  <div className="space-y-3 w-full">
                    <div className="bg-blue-50 p-3 rounded-lg w-full">
                      <h4 className="font-medium text-water-blue mb-2 text-xs">Our Service</h4>
                      {renderCell(row.yourService, true)}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg w-full">
                      <h4 className="font-medium text-gray-600 mb-2 text-xs">Standard Course</h4>
                      {renderCell(row.standardCourse, false)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View - Only visible on desktop */}
          <div className="hidden md:block w-full overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-light">
                  <TableHead className="font-bold text-navy text-left">Feature</TableHead>
                  <TableHead className="font-bold text-water-blue text-left">Our Service</TableHead>
                  <TableHead className="font-bold text-gray-600 text-left">Standard Boat Licence Course</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-sky-light/30">
                    <TableCell className="font-medium text-left align-top py-4 break-words">{row.feature}</TableCell>
                    <TableCell className="text-left align-top py-4">
                      {renderCell(row.yourService, true)}
                    </TableCell>
                    <TableCell className="text-left align-top py-4">
                      {renderCell(row.standardCourse, false)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonTable;
