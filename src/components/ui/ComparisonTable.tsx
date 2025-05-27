
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
  const comparisonData: ComparisonRow[] = [
    {
      feature: "Full-day on-water training",
      yourService: { value: "Yes", isPositive: true },
      standardCourse: { value: "No (classroom only)", isPositive: false }
    },
    {
      feature: "All logbook trips completed in one day",
      yourService: { value: "Yes", isPositive: true },
      standardCourse: { value: "Not applicable", isPositive: false }
    },
    {
      feature: "Relaxed, practical coaching",
      yourService: { value: "Yes", isPositive: true },
      standardCourse: { value: "Formal class", isPositive: false }
    },
    {
      feature: "Includes licence knowledge test",
      yourService: { value: "No (book separately)", isPositive: false },
      standardCourse: { value: "Yes", isPositive: true }
    },
    {
      feature: "Fun day on the water",
      yourService: { value: "Definitely", isPositive: true },
      standardCourse: { value: "Classroom-based", isPositive: false }
    },
    {
      feature: "Price",
      yourService: { value: "$499", isPositive: true },
      standardCourse: { value: "$390–$470", isPositive: false }
    }
  ];

  const renderCell = (data: { value: string; isPositive: boolean }, isYourService: boolean) => {
    const icon = data.isPositive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    );

    return (
      <div className="flex items-center gap-2">
        {icon}
        <span className={`${isYourService && data.isPositive ? 'font-semibold text-water-blue' : ''}`}>
          {data.value}
        </span>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Why Choose Our Service?</CardTitle>
        <p className="text-gray-600">See how we compare to traditional boat licence courses</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-light">
                <TableHead className="font-bold text-navy">Feature</TableHead>
                <TableHead className="font-bold text-water-blue text-center">Your Service</TableHead>
                <TableHead className="font-bold text-gray-600 text-center">Standard Boat Licence Course</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, index) => (
                <TableRow key={index} className="hover:bg-sky-light/30">
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell className="text-center">
                    {renderCell(row.yourService, true)}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderCell(row.standardCourse, false)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
