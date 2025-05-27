
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
      value: "$499",
      isPositive: true
    },
    standardCourse: {
      value: "$390–$470",
      isPositive: false
    }
  }];

  const renderCell = (data: {
    value: string;
    isPositive: boolean;
  }, isYourService: boolean) => {
    const icon = data.isPositive ? 
      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" /> : 
      <X className="h-5 w-5 text-red-500 shrink-0" />;
    
    // Check if this is the Service NSW text
    const isServiceNSWText = data.value.includes("Service NSW Queanbeyan");
    
    return <div className="flex items-start gap-2">
        {icon}
        <span className={`${isYourService && data.isPositive ? 'font-semibold text-water-blue' : ''} ${isServiceNSWText ? 'text-water-blue font-bold' : ''}`}>
          {data.value}
        </span>
      </div>;
  };

  return <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Why Choose Our Service?</CardTitle>
        <p className="text-gray-600">See how we compare to traditional boat licence courses</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-light">
                <TableHead className="font-bold text-navy text-left">Feature</TableHead>
                <TableHead className="font-bold text-water-blue text-left">Our Service</TableHead>
                <TableHead className="font-bold text-gray-600 text-left">Standard Boat Licence Course</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, index) => <TableRow key={index} className="hover:bg-sky-light/30">
                  <TableCell className="font-medium text-left">{row.feature}</TableCell>
                  <TableCell className="text-left">
                    {renderCell(row.yourService, true)}
                  </TableCell>
                  <TableCell className="text-left">
                    {renderCell(row.standardCourse, false)}
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>;
};

export default ComparisonTable;
