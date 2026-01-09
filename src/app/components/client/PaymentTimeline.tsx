/**
 * PAYMENT TIMELINE COMPONENT
 * Visual 5-step timeline showing the new payment workflow
 * Used in the client portal to show progress through the tax filing process
 */

import { Check, CreditCard, Upload, Calculator, CheckCircle, Send, Lock } from 'lucide-react';
import { PaymentButton, PaymentStatusBadge } from '../payment/PaymentButton';

interface PaymentTimelineProps {
  currentStep: number; // 1-5
  initialPaymentPaid?: boolean;
  finalPaymentPaid?: boolean;
  totalPrice?: number;
  taxYear: number; // Add taxYear to create payment sessions
  onPaymentSuccess?: () => void; // Callback after successful payment
}

export function PaymentTimeline({ 
  currentStep, 
  initialPaymentPaid = false,
  finalPaymentPaid = false,
  totalPrice = 199, // Default price, will be calculated based on complexity
  taxYear,
  onPaymentSuccess
}: PaymentTimelineProps) {
  
  const steps = [
    {
      number: 1,
      title: 'Initial Payment',
      description: 'Pay $50 deposit to start',
      icon: CreditCard,
      paid: initialPaymentPaid,
      amount: 50
    },
    {
      number: 2,
      title: 'Upload Documents',
      description: 'Upload tax documents with OCR',
      icon: Upload,
      paid: null
    },
    {
      number: 3,
      title: 'Tax Calculation',
      description: 'We calculate your return',
      icon: Calculator,
      paid: null
    },
    {
      number: 4,
      title: 'Final Payment',
      description: `Pay remaining $${totalPrice - 50}`,
      icon: CheckCircle,
      paid: finalPaymentPaid,
      amount: totalPrice - 50
    },
    {
      number: 5,
      title: 'Filed with CRA',
      description: 'Submitted to CRA',
      icon: Send,
      paid: null
    }
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full py-6">
      {/* Mobile View - Vertical */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="relative">
              <div className="flex items-start gap-4">
                {/* Icon Circle */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600' 
                      : isCurrent 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <step.icon className={`w-6 h-6 ${
                        isCurrent ? 'text-white' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className={`absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${
                      isCurrent ? 'text-blue-900' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    {step.paid !== null && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        step.paid 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {step.paid ? '✓ Paid' : `$${step.amount} due`}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isCurrent || isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View - Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-green-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-5 gap-4">
            {steps.map((step) => {
              const status = getStepStatus(step.number);
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';

              return (
                <div key={step.number} className="flex flex-col items-center">
                  {/* Icon Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all mb-3 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600' 
                      : isCurrent 
                      ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-100' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <step.icon className={`w-6 h-6 ${
                        isCurrent ? 'text-white' : 'text-gray-400'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h4 className={`text-sm font-semibold mb-1 ${
                      isCurrent ? 'text-blue-900' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs ${
                      isCurrent || isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                    
                    {step.paid !== null && (
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded inline-block ${
                          step.paid 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {step.paid ? '✓ Paid' : `$${step.amount}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Payment Plan</p>
                <p className="text-xs text-gray-600">Pay in 2 installments</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Total Service Fee</p>
              <p className="text-lg font-bold text-gray-900">${totalPrice} CAD</p>
              <p className="text-xs text-gray-500">
                ${initialPaymentPaid ? '50 paid' : '50 deposit'} + ${totalPrice - 50} final
              </p>
            </div>
          </div>
        </div>

        {/* Payment Action Buttons */}
        <div className="mt-6 space-y-4">
          {/* Step 1: Initial Payment */}
          {currentStep === 1 && !initialPaymentPaid && (
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CreditCard className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Start Your Tax Filing
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Pay a $50 CAD deposit to begin. This payment allows you to upload your documents 
                    and we'll start working on your tax return immediately.
                  </p>
                  <PaymentButton
                    taxYear={taxYear}
                    paymentType="initial"
                    amount={50}
                    onSuccess={onPaymentSuccess}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Initial Payment - Paid Status */}
          {initialPaymentPaid && !finalPaymentPaid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">
                    Initial Payment Completed
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    Great! Your $50 deposit has been received. You can now upload your documents.
                  </p>
                  <PaymentStatusBadge paid={true} amount={50} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Payment */}
          {currentStep === 4 && initialPaymentPaid && !finalPaymentPaid && (
            <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Calculator className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Complete Your Payment
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your tax return is ready! Pay the final balance of ${totalPrice - 50} CAD 
                    and we'll submit it to the CRA immediately.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Initial deposit:</span>
                      <span className="font-medium text-green-700">$50.00 ✓</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Final balance:</span>
                      <span className="font-semibold text-gray-900">${(totalPrice - 50).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-xl text-gray-900">${totalPrice.toFixed(2)} CAD</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <PaymentButton
                      taxYear={taxYear}
                      paymentType="final"
                      amount={totalPrice - 50}
                      finalPrice={totalPrice - 50}
                      onSuccess={onPaymentSuccess}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Payments Complete */}
          {initialPaymentPaid && finalPaymentPaid && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Send className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">
                    🎉 All Payments Complete!
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    Thank you! Your tax return has been submitted to the CRA. You'll receive 
                    confirmation shortly.
                  </p>
                  <div className="flex gap-3">
                    <PaymentStatusBadge paid={true} amount={50} />
                    <PaymentStatusBadge paid={true} amount={totalPrice - 50} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}