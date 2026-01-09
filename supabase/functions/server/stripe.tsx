import Stripe from 'npm:stripe';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is not set');
}

// Initialize Stripe
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      // @ts-ignore - Using latest Stripe API version
      apiVersion: '2023-10-16',
    })
  : null;

/**
 * Creates a Stripe Checkout Session for initial payment ($50 CAD)
 */
export async function createInitialPaymentSession(
  userId: string,
  userEmail: string,
  taxYear: number,
  returnUrl: string
): Promise<{ sessionId: string; url: string }> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Tax Filing ${taxYear} - Initial Deposit`,
            description: 'Initial deposit to start your tax filing process',
          },
          unit_amount: 5000, // $50.00 CAD in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${returnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?payment=cancelled`,
    client_reference_id: userId,
    metadata: {
      userId,
      taxYear: taxYear.toString(),
      paymentType: 'initial',
    },
    customer_email: userEmail,
  });

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

/**
 * Creates a Stripe Checkout Session for final payment (remaining balance)
 */
export async function createFinalPaymentSession(
  userId: string,
  userEmail: string,
  taxYear: number,
  finalAmount: number, // In CAD dollars (e.g., 149.00)
  returnUrl: string
): Promise<{ sessionId: string; url: string }> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  // Convert to cents
  const amountInCents = Math.round(finalAmount * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Tax Filing ${taxYear} - Final Payment`,
            description: `Final balance for your ${taxYear} tax return preparation`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${returnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?payment=cancelled`,
    client_reference_id: userId,
    metadata: {
      userId,
      taxYear: taxYear.toString(),
      paymentType: 'final',
    },
    customer_email: userEmail,
  });

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

/**
 * Retrieves a Stripe Checkout Session to verify payment
 */
export async function getCheckoutSession(sessionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

/**
 * Verifies if a payment was successful
 */
export async function verifyPayment(sessionId: string): Promise<{
  paid: boolean;
  amount: number;
  currency: string;
  paymentType: 'initial' | 'final';
  taxYear: number;
  userId: string;
}> {
  const session = await getCheckoutSession(sessionId);

  return {
    paid: session.payment_status === 'paid',
    amount: (session.amount_total || 0) / 100, // Convert cents to dollars
    currency: session.currency || 'cad',
    paymentType: session.metadata?.paymentType as 'initial' | 'final',
    taxYear: parseInt(session.metadata?.taxYear || '0'),
    userId: session.metadata?.userId || session.client_reference_id || '',
  };
}

/**
 * Creates a refund for a payment
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number // Optional: partial refund amount in CAD dollars
): Promise<{ refundId: string; status: string }> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const refundData: any = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundData.amount = Math.round(amount * 100); // Convert to cents
  }

  const refund = await stripe.refunds.create(refundData);

  return {
    refundId: refund.id,
    status: refund.status,
  };
}
