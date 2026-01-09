import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '../../../../utils/supabase/info';
import { supabase } from '../../utils/supabaseClient';
import { Button } from '../ui/button';

export function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'cancelled'>('pending');

  useEffect(() => {
    const payment = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (payment === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (payment === 'cancelled') {
      setStatus('cancelled');
      toast.error('Payment was cancelled');
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    setVerifying(true);

    try {
      // Get access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        toast.error('Authentication error');
        setVerifying(false);
        return;
      }

      // Verify payment with backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/payments/verify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }

      const { success, payment } = await response.json();

      if (success) {
        setStatus('success');
        toast.success('🎉 Payment successful! Your payment has been processed.');

        // Refresh the user session to get updated metadata
        await supabase.auth.refreshSession();

        // Wait a bit to show success message
        setTimeout(() => {
          // Remove query params and refresh
          window.location.replace(window.location.pathname);
        }, 2000);
      }

    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error(`Payment verification failed: ${error.message}`);
      setVerifying(false);
    }
  };

  if (status === 'pending' && !verifying) {
    return null;
  }

  if (verifying) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2 text-green-800">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold mb-2 text-red-800">Payment Cancelled</h2>
            <p className="text-gray-600 mb-4">Your payment was cancelled. You can try again anytime.</p>
            <Button
              onClick={() => {
                window.location.replace(window.location.pathname);
              }}
              className="mt-4"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}