"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createInvestmentPaymentSession } from "@/actions";
import { useToast } from "@/components/ui/use-toast";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function InvestmentStatus({ investment }) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const result = await createInvestmentPaymentSession(investment._id);
      
      if (result.success) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({
          sessionId: result.sessionId
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatusContent = () => {
    switch (investment.status) {
      case 'pending':
        return (
          <div className="text-amber-600">
            Your investment is pending review by the pitcher
          </div>
        );
      
      case 'pitcher_review':
        return (
          <div className="text-amber-600">
            Under review by the pitcher
          </div>
        );

      case 'admin_review':
        return (
          <div className="text-amber-600">
            Under review by admin
          </div>
        );

      case 'payment_pending':
        return (
          <div className="space-y-4">
            <div className="text-green-600">
              Your investment has been approved! Please proceed with payment.
            </div>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Make Payment"}
            </Button>
          </div>
        );

      case 'payment_processing':
        return (
          <div className="text-amber-600">
            Payment is being processed
          </div>
        );

      case 'completed':
        return (
          <div className="text-green-600">
            Investment completed successfully!
          </div>
        );

      case 'rejected':
        return (
          <div className="text-red-600">
            Investment was not approved
            {investment.reviewNotes?.length > 0 && (
              <p className="mt-2 text-sm">
                Reason: {investment.reviewNotes[investment.reviewNotes.length - 1].note}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">Investment Status</h3>
        <Badge>{investment.status.replace('_', ' ')}</Badge>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Amount</p>
            <p className="text-slate-600">${investment.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">Type</p>
            <p className="text-slate-600">{investment.investmentType}</p>
          </div>
        </div>

        <div className="mt-4">
          {renderStatusContent()}
        </div>
      </div>
    </Card>
  );
} 