
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Anchor, LifeBuoy } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/seo/SEO";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const glossaryTerms = [
    { term: "Starboard", definition: "The right side of a boat when facing forward" },
    { term: "Port", definition: "The left side of a boat when facing forward" },
    { term: "Bow", definition: "The front of a boat" },
    { term: "Stern", definition: "The back of a boat" },
    { term: "Navigation Light", definition: "Lights required to be displayed on vessels" },
    { term: "Right of Way", definition: "Priority given to certain vessels in traffic situations" },
  ];

  const filteredTerms = glossaryTerms.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const knotTyingSteps = [
    { name: "Bowline", description: "Creates a fixed loop at the end of a rope" },
    { name: "Cleat Hitch", description: "Secures a rope to a cleat" },
    { name: "Clove Hitch", description: "Quick hitch for securing to a post" },
    { name: "Figure Eight", description: "Stopper knot to prevent rope from running through" },
  ];

  return (
    <Layout>
      <SEO title="Boating Resources | ACT Boats & Licensing" description="Essential boating guides, glossary and reference materials." canonicalPath="/resources" />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">Resources</h1>
            <p className="text-gray-600">
              Essential guides, glossary and reference materials for your boating journey
            </p>
          </div>

          <div className="space-y-8">
            {/* Download Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Anchor className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy">Navigation Mark Poster</h3>
                    <p className="text-gray-600 text-sm">Reference guide for all navigation marks</p>
                  </div>
                </div>
                <Button className="w-full bg-water-blue hover:bg-water-blue/90 text-white rounded-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </Card>

              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                    <LifeBuoy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy">Safety Gear Checklist</h3>
                    <p className="text-gray-600 text-sm">Essential safety equipment for your boat</p>
                  </div>
                </div>
                <Button className="w-full bg-water-blue hover:bg-water-blue/90 text-white rounded-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </Card>
            </div>

            {/* Glossary Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-navy mb-4">Boating Glossary</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredTerms.map((item, index) => (
                  <div key={index} className="p-6 border-b border-gray-100 last:border-b-0">
                    <h4 className="font-semibold text-navy mb-1">{item.term}</h4>
                    <p className="text-gray-600 text-sm">{item.definition}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Knot Tying Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-navy">Essential Knot Tying</h3>
                <p className="text-gray-600 text-sm">Learn the fundamental knots every boater should know</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {knotTyingSteps.map((knot, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">{knot.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{knot.description}</p>
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Knot Animation</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
