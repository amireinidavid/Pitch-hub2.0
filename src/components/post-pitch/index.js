"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ArrowRight, Check, MousePointer2 } from "lucide-react";
import Image from "next/image";
import { createPitchAction, updatePitchAction } from "@/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import BasicInfo from "@/components/sections/basicInfo";
import CompanyDetails from "@/components/sections/companyDetails";
import ExecutiveSummary from "@/components/sections/executiveSummary";
import MarketAnalysis from "@/components/sections/marketAnalysis";
import BusinessModel from "@/components/sections/businessModel";
import FinancialInfo from "@/components/sections/financialInfo";
import TractionMetrics from "@/components/sections/TractionMetrics";
import TeamInfo from "@/components/sections/teamInfo";
import MediaDocs from "@/components/sections/mediaDocs";
import InvestmentTerms from "@/components/sections/investmentTerms";
const sections = [
  { id: "basic-info", title: "Basic Info" },
  { id: "company-details", title: "Company Details" },
  { id: "executive-summary", title: "Executive Summary" },
  { id: "market-analysis", title: "Market Analysis" },
  { id: "business-model", title: "Business Model" },
  { id: "financial-info", title: "Financial Info" },
  { id: "team-info", title: "Team" },
  { id: "traction-metrics", title: "Traction & Metrics" },
  { id: "media-docs", title: "Media & Documents" },
  { id: "investment-terms", title: "Investment Terms" },
];

function PostPitch({ user, profileInfo }) {
  const { scrollY } = useScroll();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Parallax effect for background elements
  const backgroundY = useTransform(scrollY, [0, 500], [0, -150]);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Interactive animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const [currentSection, setCurrentSection] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    creator: profileInfo?._id,
    tagline: "",
    status: "draft",
  });
  console.log(formData, "formdata");
  const { toast } = useToast();
  const router = useRouter();

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const updateFormData = (sectionData) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        ...sectionData,
      };

      // Special handling for investment terms
      if (sectionData.investmentTerms) {
        newData.investmentTerms = {
          ...prev.investmentTerms,
          ...sectionData.investmentTerms,
          minimumInvestment: sectionData.investmentTerms?.minimumInvestment || prev.investmentTerms?.minimumInvestment || "",
          maximumInvestment: sectionData.investmentTerms?.maximumInvestment || prev.investmentTerms?.maximumInvestment || "",
          pricePerShare: sectionData.investmentTerms?.pricePerShare || prev.investmentTerms?.pricePerShare || "",
          numberOfShares: sectionData.investmentTerms?.numberOfShares || prev.investmentTerms?.numberOfShares || "",
          equityOffered: sectionData.investmentTerms?.equityOffered || prev.investmentTerms?.equityOffered || "",
          investmentStructure: sectionData.investmentTerms?.investmentStructure || prev.investmentTerms?.investmentStructure || "",
          useOfFunds: Array.isArray(sectionData.investmentTerms?.useOfFunds)
            ? sectionData.investmentTerms.useOfFunds
            : prev.investmentTerms?.useOfFunds || [],
          investorRights: Array.isArray(sectionData.investmentTerms?.investorRights)
            ? sectionData.investmentTerms.investorRights
            : prev.investmentTerms?.investorRights || [],
          exitStrategy: sectionData.investmentTerms?.exitStrategy || prev.investmentTerms?.exitStrategy || "",
          timeline: sectionData.investmentTerms?.timeline || prev.investmentTerms?.timeline || "",
        };
      }

      // Special handling for financials
      if (sectionData.financials) {
        newData.financials = {
          ...prev.financials,
          ...sectionData.financials,
          currentFinancials: {
            ...prev.financials?.currentFinancials,
            ...sectionData.financials?.currentFinancials,
            revenue: sectionData.financials?.currentFinancials?.revenue || "",
            expenses: sectionData.financials?.currentFinancials?.expenses || "",
            profits: sectionData.financials?.currentFinancials?.profits || "",
          },
          projections: Array.isArray(sectionData.financials?.projections)
            ? sectionData.financials.projections.map((proj) => ({
                year: proj.year || String(new Date().getFullYear()),
                revenue: proj.revenue || "",
                expenses: proj.expenses || "",
                profits: proj.profits || "",
              }))
            : prev.financials?.projections || [],
          fundingHistory: Array.isArray(sectionData.financials?.fundingHistory)
            ? sectionData.financials.fundingHistory.map((funding) => ({
                date: funding.date || "",
                amount: funding.amount || "",
                type: funding.type || "",
                investors: funding.investors || "",
              }))
            : prev.financials?.fundingHistory || [],
        };
      }

      // Log the updated financial data
      console.log(
        "Updated Financial Data:",
        formData.financials?.previousFunding
      );
      return newData;
    });
  };

  const handleSubmit = async (status = "draft") => {
    try {
      setIsSubmitting(true);

      // Log the current form data to debug
      console.log("Current Form Data:", formData);

      const finalData = {
        // Basic Info
        creator: profileInfo._id,
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        website: formData.website,
        status: status === "active" ? "pending" : "draft",

        // Company Details
        companyDetails: {
          name: formData.companyDetails?.name,
          foundedDate: formData.companyDetails?.foundedDate,
          location: {
            country: formData.companyDetails?.location?.country,
            city: formData.companyDetails?.location?.city,
            region: formData.companyDetails?.location?.region,
          },
          stage: formData.companyDetails?.stage || "idea",
          employeeCount: Number(formData.companyDetails?.employeeCount) || 0,
        },

        // Executive Summary
        executiveSummary: {
          problem: formData.executiveSummary?.problem || "",
          solution: formData.executiveSummary?.solution || "",
          targetMarket: {
            size: formData.executiveSummary?.targetMarket?.size || "",
            segments: Array.isArray(
              formData.executiveSummary?.targetMarket?.segments
            )
              ? formData.executiveSummary.targetMarket.segments
              : [],
            demographics:
              formData.executiveSummary?.targetMarket?.demographics || {},
          },
          competitiveAdvantage:
            formData.executiveSummary?.competitiveAdvantage || "",
        },

        // Market Analysis
        marketAnalysis: {
          marketSize: formData.marketAnalysis?.marketSize || "",
          marketGrowth: formData.marketAnalysis?.marketGrowth || "",
          competitors: Array.isArray(formData.marketAnalysis?.competitors)
            ? formData.marketAnalysis.competitors.map((comp) => ({
                name: comp.name || "",
                strengths: Array.isArray(comp.strengths) ? comp.strengths : [],
                weaknesses: Array.isArray(comp.weaknesses)
                  ? comp.weaknesses
                  : [],
                marketShare: Number(comp.marketShare) || 0,
              }))
            : [],
          marketStrategy: formData.marketAnalysis?.marketStrategy || "",
        },

        // Business Model
        businessModel: {
          revenueStreams: Array.isArray(formData.businessModel?.revenueStreams)
            ? formData.businessModel.revenueStreams.map((stream) => ({
                source: stream.source || "",
                description: stream.description || "",
                percentage: Number(stream.percentage) || 0,
              }))
            : [],
          costStructure: {
            fixed: Array.isArray(formData.businessModel?.costStructure?.fixed)
              ? formData.businessModel.costStructure.fixed
              : [],
            variable: Array.isArray(
              formData.businessModel?.costStructure?.variable
            )
              ? formData.businessModel.costStructure.variable
              : [],
            breakdown: formData.businessModel?.costStructure?.breakdown || {},
          },
          partnerships: Array.isArray(formData.businessModel?.partnerships)
            ? formData.businessModel.partnerships.map((partner) => ({
                name: partner.name || "",
                type: partner.type || "",
                description: partner.description || "",
              }))
            : [],
        },

        // Financial Info
        financials: {
          currentFinancials: {
            revenue: formData.financials?.currentFinancials?.revenue || "",
            expenses: formData.financials?.currentFinancials?.expenses || "",
            profits: formData.financials?.currentFinancials?.profits || "",
          },
          revenue: {
            current: formData.financials?.revenue?.current || "",
            projected: formData.financials?.revenue?.projected || "",
          },
          expenses: {
            current: formData.financials?.expenses?.current || "",
            projected: formData.financials?.expenses?.projected || "",
          },
          projections: formData.financials?.projections || [],
          financialProjections:
            formData.financials?.financialProjections?.map((proj) => ({
              year: proj.year || "",
              revenue: proj.revenue || "",
              expenses: proj.expenses || "",
              profit: proj.profit || "",
              notes: proj.notes || "",
            })) || [],
          fundingHistory: formData.financials?.fundingHistory || [],
          previousFunding:
            formData.financials?.previousFunding?.map((funding) => ({
              round: funding.round || "",
              amount: funding.amount || "",
              date: funding.date || "",
              investors: Array.isArray(funding.investors)
                ? funding.investors
                : [],
            })) || [],
          fundingGoal: formData.financials?.fundingGoal || "",
          fundingRaised: formData.financials?.fundingRaised || "",
          valuation: formData.financials?.valuation || "",
        },

        // Investment Terms
        investmentTerms: {
          instrumentType: formData.investmentTerms?.instrumentType || "",
          minimumInvestment: formData.investmentTerms?.minimumInvestment || "",
          maximumInvestment: formData.investmentTerms?.maximumInvestment || "",
          pricePerShare: formData.investmentTerms?.pricePerShare || "",
          numberOfShares: formData.investmentTerms?.numberOfShares || "",
          equityOffered: formData.investmentTerms?.equityOffered || "",
          investmentStructure:
            formData.investmentTerms?.investmentStructure || "",
          useOfFunds: Array.isArray(formData.investmentTerms?.useOfFunds)
            ? formData.investmentTerms.useOfFunds
            : [],
          investorRights: Array.isArray(
            formData.investmentTerms?.investorRights
          )
            ? formData.investmentTerms.investorRights
            : [],
          exitStrategy: formData.investmentTerms?.exitStrategy || "",
          timeline: formData.investmentTerms?.timeline || "",
        },

        // Team Info
        team: Array.isArray(formData.team)
          ? formData.team.map((member) => ({
              name: member.name || "",
              role: member.role || "",
              bio: member.bio || "",
              image: member.image || "",
              linkedin: member.linkedin || "",
              experience: member.experience || "",
            }))
          : [],

        // Advisors
        advisors: Array.isArray(formData.advisors)
          ? formData.advisors.map((advisor) => ({
              name: advisor.name || "",
              role: advisor.role || "",
              bio: advisor.bio || "",
              image: advisor.image || "",
              linkedin: advisor.linkedin || "",
              experience: advisor.experience || "",
            }))
          : [],

        // Board Members
        boardMembers: Array.isArray(formData.boardMembers)
          ? formData.boardMembers.map((member) => ({
              name: member.name || "",
              role: member.role || "",
              bio: member.bio || "",
              image: member.image || "",
              linkedin: member.linkedin || "",
              experience: member.experience || "",
            }))
          : [],

        // Traction & Metrics
        traction: {
          metrics: Array.isArray(formData.traction?.metrics)
            ? formData.traction.metrics.map((metric) => ({
                name: metric.name || "",
                value: metric.value || "",
                date: metric.date || "",
              }))
            : [],
          milestones: Array.isArray(formData.traction?.milestones)
            ? formData.traction.milestones.map((milestone) => ({
                title: milestone.title || "",
                date: milestone.date || "",
                description: milestone.description || "",
              }))
            : [],
          customers: Array.isArray(formData.traction?.customers)
            ? formData.traction.customers
            : [],
        },

        // Media & Documents
        media: {
          pitchDeck: formData.media?.pitchDeck || "",
          documents: Array.isArray(formData.media?.documents)
            ? formData.media.documents
            : [],
          images: Array.isArray(formData.media?.images)
            ? formData.media.images
            : [],
          videos: Array.isArray(formData.media?.videos)
            ? formData.media.videos
            : [],
        },

        // Additional Info
        additionalInfo: {
          risks: Array.isArray(formData.additionalInfo?.risks)
            ? formData.additionalInfo.risks.map((risk) => ({
                type: risk.type || "",
                description: risk.description || "",
                mitigation: risk.mitigation || "",
              }))
            : [],
          intellectualProperty: Array.isArray(
            formData.additionalInfo?.intellectualProperty
          )
            ? formData.additionalInfo.intellectualProperty.map((ip) => ({
                type: ip.type || "",
                status: ip.status || "",
                description: ip.description || "",
              }))
            : [],
          regulatoryInfo: formData.additionalInfo?.regulatoryInfo || "",
          socialImpact: formData.additionalInfo?.socialImpact || "",
          sustainability: formData.additionalInfo?.sustainability || "",
        },

        // System fields
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        categories: Array.isArray(formData.categories)
          ? formData.categories
          : [],
      };

      // Log the final data before submission
      console.log("Final Data:", finalData);

      const result = formData._id
        ? await updatePitchAction(formData._id, finalData)
        : await createPitchAction(finalData);

      if (result.success) {
        toast({
          title: "Success!",
          description:
            status === "active"
              ? "Pitch submitted for review successfully"
              : "Pitch saved as draft successfully",
        });
        setOpen(false);
        router.push("/pitching/library");
      } else {
        throw new Error(result.error || "Failed to save pitch");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        style={{ y: backgroundY, opacity: backgroundOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </motion.div>

      {/* Hero Section with Enhanced Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative py-20 px-4 text-center"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>

        <div className="relative">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Create Your Perfect Pitch
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your vision into a compelling story that captivates
            investors and brings your dreams to life
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute -top-4 right-1/4 w-24 h-24 text-primary/20"
        >
          <MousePointer2 className="w-full h-full animate-bounce" />
        </motion.div>
      </motion.div>

      {/* Interactive Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12"
      >
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: "presentation.svg",
              title: "Professional Templates",
              description:
                "Start with our expertly designed templates to create a standout pitch deck",
              delay: 0.1,
            },
            {
              icon: "chart.svg",
              title: "Rich Analytics",
              description:
                "Showcase your growth with beautiful charts and metrics",
              delay: 0.2,
            },
            {
              icon: "target.svg",
              title: "Investor Ready",
              description:
                "Meet investor expectations with our proven pitch structure",
              delay: 0.3,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="group relative p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: hoveredFeature === index ? 1.1 : 1,
                  rotate: hoveredFeature === index ? 5 : 0,
                }}
                className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              >
                <Image
                  src={`/icons/${feature.icon}`}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className="text-primary"
                />
              </motion.div>
              <div className="relative">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Steps Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: "Choose Your Template", icon: "lightbulb.svg" },
              { step: 2, title: "Add Your Content", icon: "users.svg" },
              { step: 3, title: "Review & Polish", icon: "target.svg" },
              { step: 4, title: "Share with Investors", icon: "dollar.svg" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <Image
                    src={`/icons/${step.icon}`}
                    alt={`Step ${step.step}`}
                    width={20}
                    height={20}
                  />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    Step {step.step}: {step.title}
                  </h3>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-card rounded-xl p-8 border"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of successful founders who have secured funding with
            our platform
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 px-8 py-6 text-lg">
                <Plus className="h-5 w-5" />
                Create Your Pitch
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Pitch</DialogTitle>
                <DialogDescription>
                  Fill out the following sections to create your pitch
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-6 mt-6">
                <div className="w-1/4">
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <motion.button
                        key={section.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          currentSection === section.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleSectionChange(section.id)}
                      >
                        {section.title}
                      </motion.button>
                    ))}
                  </nav>
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {currentSection === "basic-info" && (
                        <BasicInfo
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "company-details" && (
                        <CompanyDetails
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "executive-summary" && (
                        <ExecutiveSummary
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "market-analysis" && (
                        <MarketAnalysis
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "business-model" && (
                        <BusinessModel
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "financial-info" && (
                        <FinancialInfo
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "team-info" && (
                        <TeamInfo data={formData} updateData={updateFormData} />
                      )}
                      {currentSection === "traction-metrics" && (
                        <TractionMetrics
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "media-docs" && (
                        <MediaDocs
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                      {currentSection === "investment-terms" && (
                        <InvestmentTerms
                          data={formData}
                          updateData={updateFormData}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <motion.div
                    className="flex justify-between mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleSubmit("draft")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save as Draft"}
                    </Button>
                    <Button
                      onClick={() => handleSubmit("active")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Pitch"}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-primary" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Add this to your global CSS or tailwind config
const styles = {
  "@keyframes blob": {
    "0%": {
      transform: "translate(0px, 0px) scale(1)",
    },
    "33%": {
      transform: "translate(30px, -50px) scale(1.1)",
    },
    "66%": {
      transform: "translate(-20px, 20px) scale(0.9)",
    },
    "100%": {
      transform: "translate(0px, 0px) scale(1)",
    },
  },
};

export default PostPitch;
