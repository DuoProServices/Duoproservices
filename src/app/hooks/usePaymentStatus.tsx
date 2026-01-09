import { useState, useEffect } from 'react';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../utils/supabaseClient';

export interface PaymentStatus {
  initialPaid: boolean;
  initialAmount: number;
  finalPaid: boolean;
  finalAmount: number;
  totalPrice: number;
}

export function usePaymentStatus(taxYear: number) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/payments/${taxYear}/status`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const { payment } = await response.json();
        setPaymentStatus(payment);

      } catch (err: any) {
        console.error('Error fetching payment status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [taxYear]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    const fetchPaymentStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/payments/${taxYear}/status`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const { payment } = await response.json();
        setPaymentStatus(payment);

      } catch (err: any) {
        console.error('Error fetching payment status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  };

  return {
    paymentStatus,
    loading,
    error,
    refetch
  };
}