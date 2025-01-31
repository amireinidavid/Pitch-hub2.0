"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createInvestmentAction } from "@/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckSquare,
  DollarSign,
  Shield,
  Target,
  User,
} from "lucide-react";
import { TiBusinessCard } from "react-icons/ti";
import { FaSpinner } from "react-icons/fa";

export default function InvestmentModal({ pitch = {}, isOpen, onClose }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investmentData, setInvestmentData] = useState({
    // Basic Investment Details
    amount: "",
    investmentType: "equity",
    equity: "",
    investmentStructure: "direct",
    paymentMethod: "wire",
    status: "pending",

    // Investment Strategy
    investmentThesis: "",
    expectedHoldingPeriod: "",
    exitStrategy: "",
    valueAddProposal: "",

    // Risk Assessment
    riskTolerance: "moderate",
    keyRiskFactors: [],
    mitigationStrategies: "",

    // Due Diligence
    dueDiligence: {
      businessModel: false,
      financials: false,
      market: false,
      team: false,
      legal: false,
      technology: false,
      competition: false,
      intellectualProperty: false,
      regulatory: false,
      customerBase: false,
      growthStrategy: false,
      operationalEfficiency: false,
    },

    // Investor Profile
    investorProfile: {
      investmentExperience: "novice",
      sectorExpertise: "",
      accreditationStatus: "non-accredited",
      investmentGoals: "",
    },

    // Terms and Additional Info
    terms: "",
    additionalRequests: "",
    boardSeatInterest: false,
    strategicPartnership: false,

    // Compliance
    sourceOfFunds: "personal",
    kycCompleted: false,
    kycDocuments: [],
    accreditationVerified: false,

    // Additional fields from schema
    submittedAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
  });

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const steps = [
    {
      title: "Investment Details",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Strategy",
      icon: <Target className="w-4 h-4" />,
    },
    {
      title: "Risk Assessment",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      title: "Due Diligence",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      title: "Investor Profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      title: "Terms & Compliance",
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createInvestmentAction({
        pitchId: pitch._id,
        investorId: user?.id,
        ...investmentData,
      });

      if (result.success) {
        toast({
          title: "Success!",
          description: "Your investment offer has been submitted for review.",
          variant: "success",
        });
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Investment Amount ($)</Label>
                <Input
                  type="number"
                  required
                  min={pitch?.minimumInvestment || 0}
                  value={investmentData.amount}
                  onChange={(e) =>
                    setInvestmentData({
                      ...investmentData,
                      amount: e.target.value,
                    })
                  }
                />
                <p className="text-sm text-gray-500">
                  Minimum: ${(pitch?.minimumInvestment || 0).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Investment Type</Label>
                <Select
                  value={investmentData.investmentType}
                  onValueChange={(value) =>
                    setInvestmentData({
                      ...investmentData,
                      investmentType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="convertible">
                      Convertible Note
                    </SelectItem>
                    <SelectItem value="safe">SAFE</SelectItem>
                    <SelectItem value="debt">Debt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {investmentData.investmentType === "equity" && (
                <div className="space-y-2">
                  <Label>Equity Percentage (%)</Label>
                  <Input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={investmentData.equity}
                    onChange={(e) =>
                      setInvestmentData({
                        ...investmentData,
                        equity: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Investment Structure</Label>
              <RadioGroup
                value={investmentData.investmentStructure}
                onValueChange={(value) =>
                  setInvestmentData({
                    ...investmentData,
                    investmentStructure: value,
                  })
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="direct" id="direct" />
                  <Label htmlFor="direct">Direct Investment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spv" id="spv" />
                  <Label htmlFor="spv">Special Purpose Vehicle</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={investmentData.paymentMethod}
                onValueChange={(value) =>
                  setInvestmentData({
                    ...investmentData,
                    paymentMethod: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wire">Wire Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="escrow">Escrow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Investment Thesis</Label>
              <Textarea
                required
                placeholder="Describe your investment thesis and rationale..."
                value={investmentData.investmentThesis}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    investmentThesis: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Holding Period</Label>
                <Select
                  value={investmentData.expectedHoldingPeriod}
                  onValueChange={(value) =>
                    setInvestmentData({
                      ...investmentData,
                      expectedHoldingPeriod: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-7">5-7 years</SelectItem>
                    <SelectItem value="7+">7+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Exit Strategy</Label>
                <Select
                  value={investmentData.exitStrategy}
                  onValueChange={(value) =>
                    setInvestmentData({
                      ...investmentData,
                      exitStrategy: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ipo">IPO</SelectItem>
                    <SelectItem value="acquisition">
                      Strategic Acquisition
                    </SelectItem>
                    <SelectItem value="secondary">Secondary Sale</SelectItem>
                    <SelectItem value="buyback">Company Buyback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Value Add Proposal</Label>
              <Textarea
                placeholder="How can you add value beyond capital?"
                value={investmentData.valueAddProposal}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    valueAddProposal: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Risk Tolerance</Label>
              <RadioGroup
                value={investmentData.riskTolerance}
                onValueChange={(value) =>
                  setInvestmentData({
                    ...investmentData,
                    riskTolerance: value,
                  })
                }
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative">Conservative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aggressive" id="aggressive" />
                  <Label htmlFor="aggressive">Aggressive</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Key Risk Factors</Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Market Risk",
                  "Execution Risk",
                  "Team Risk",
                  "Competition Risk",
                  "Regulatory Risk",
                  "Financial Risk",
                  "Technology Risk",
                  "Economic Risk",
                ].map((risk) => (
                  <div key={risk} className="flex items-center space-x-2">
                    <Checkbox
                      checked={investmentData.keyRiskFactors.includes(risk)}
                      onCheckedChange={(checked) => {
                        setInvestmentData({
                          ...investmentData,
                          keyRiskFactors: checked
                            ? [...investmentData.keyRiskFactors, risk]
                            : investmentData.keyRiskFactors.filter(
                                (r) => r !== risk
                              ),
                        });
                      }}
                    />
                    <Label>{risk}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Risk Mitigation Strategies</Label>
              <Textarea
                placeholder="Describe your strategies to mitigate identified risks..."
                value={investmentData.mitigationStrategies}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    mitigationStrategies: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Label>Due Diligence Checklist</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(investmentData.dueDiligence).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => {
                        setInvestmentData({
                          ...investmentData,
                          dueDiligence: {
                            ...investmentData.dueDiligence,
                            [key]: checked,
                          },
                        });
                      }}
                    />
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Investment Experience</Label>
                <Select
                  value={investmentData.investorProfile.investmentExperience}
                  onValueChange={(value) =>
                    setInvestmentData({
                      ...investmentData,
                      investorProfile: {
                        ...investmentData.investorProfile,
                        investmentExperience: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novice">Novice</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="experienced">Experienced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Accreditation Status</Label>
                <Select
                  value={investmentData.investorProfile.accreditationStatus}
                  onValueChange={(value) =>
                    setInvestmentData({
                      ...investmentData,
                      investorProfile: {
                        ...investmentData.investorProfile,
                        accreditationStatus: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accredited">Accredited</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="institutional">Institutional</SelectItem>
                    <SelectItem value="non-accredited">
                      Non-Accredited
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sector Expertise</Label>
              <Input
                value={investmentData.investorProfile.sectorExpertise}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    investorProfile: {
                      ...investmentData.investorProfile,
                      sectorExpertise: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Investment Goals</Label>
              <Textarea
                value={investmentData.investorProfile.investmentGoals}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    investorProfile: {
                      ...investmentData.investorProfile,
                      investmentGoals: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Source of Funds</Label>
              <Select
                value={investmentData.sourceOfFunds}
                onValueChange={(value) =>
                  setInvestmentData({
                    ...investmentData,
                    sourceOfFunds: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Savings</SelectItem>
                  <SelectItem value="business">Business Revenue</SelectItem>
                  <SelectItem value="investment">Investment Returns</SelectItem>
                  <SelectItem value="inheritance">Inheritance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Terms & Requests</Label>
              <Textarea
                value={investmentData.additionalRequests}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    additionalRequests: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={investmentData.boardSeatInterest}
                  onCheckedChange={(checked) =>
                    setInvestmentData({
                      ...investmentData,
                      boardSeatInterest: checked,
                    })
                  }
                />
                <Label>Interested in Board Seat</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={investmentData.strategicPartnership}
                  onCheckedChange={(checked) =>
                    setInvestmentData({
                      ...investmentData,
                      strategicPartnership: checked,
                    })
                  }
                />
                <Label>Interested in Strategic Partnership</Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TiBusinessCard className="w-6 h-6 text-primary" />
            Investment Proposal
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Steps Progress */}
          <div className="mb-8">
            <Progress
              value={(step / steps.length) * 100}
              className="h-2 bg-secondary"
            />
            <div className="mt-4 grid grid-cols-6 gap-2">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col items-center ${
                    i + 1 === step ? "text-primary" : "text-muted-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1">
                    {s.icon}
                  </div>
                  <span className="text-xs text-center">{s.title}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={step}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {renderStep()}

              <Separator className="my-6" />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => step > 1 && setStep(step - 1)}
                  disabled={step === 1}
                  className="w-32"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                {step < steps.length ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="w-32"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-32"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Submitting
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
