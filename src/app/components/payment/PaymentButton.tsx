import { useState } from 'react';
import { Button } from '../ui/button';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { projectId } from '../../../../utils/supabase/info';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'sonner';

interface PaymentButtonProps {
  taxYear: number;
  paymentType: 'initial' | 'final';
  amount: number;
  finalPrice?: number; // For final payment
  disabled?: boolean;
  onSuccess?: () => void;
  className?: string;
}

export function PaymentButton({
  taxYear,
  paymentType,
  amount,
  finalPrice,
  disabled = false,
  onSuccess,
  className = ''
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Get access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        toast.error('Please log in to continue');
        setLoading(false);
        return;
      }

      // Get current URL for return
      const returnUrl = window.location.href;

      // Create Stripe Checkout Session
      const endpoint = paymentType === 'initial'
        ? '/make-server-c2a25be0/payments/create-initial-session'
        : '/make-server-c2a25be0/payments/create-final-session';

      const body = paymentType === 'initial'
        ? { taxYear, returnUrl }
        : { taxYear, finalAmount: finalPrice || amount, returnUrl };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment session creation failed');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(`Payment failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      size="lg"
      className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5 mr-2" />
          Pay ${amount.toFixed(2)} CAD
        </>
      )}
    </Button>
  );
}

interface PaymentStatusBadgeProps {
  paid: boolean;
  amount: number;
  paidOn?: string;
}

export function PaymentStatusBadge({ paid, amount, paidOn }: PaymentStatusBadgeProps) {
  if (!paid) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg">
        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-amber-800">
          Payment Pending: ${amount.toFixed(2)} CAD
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-300 rounded-lg">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <span className="text-sm font-medium text-green-800">
        Paid: ${amount.toFixed(2)} CAD
      </span>
      {paidOn && (
        <span className="text-xs text-green-600">
          on {new Date(paidOn).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}