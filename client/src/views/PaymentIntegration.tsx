import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ApiClient from '../api';
import '../css/PaymentIntegration.css';

interface Guide {
  id: number;
  name: string;
  photo: string;
  location: string;
  hire_cost?: number;
}

interface PaymentResult {
  transaction_id: string;
  amount: string | number;
  currency: string;
  days: number;
  card_brand?: string;
  card_last_four: string;
  paid_at: string;
}

const PaymentIntegration: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const user = ApiClient.getUser();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loadingGuide, setLoadingGuide] = useState(true);
  const [pageError, setPageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const [formData, setFormData] = useState({
    days: 1,
    nameOnCard: user?.name || '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchGuide = async () => {
      const numericGuideId = Number(guideId);

      if (!guideId || Number.isNaN(numericGuideId) || numericGuideId <= 0) {
        setGuide(null);
        setPageError('Invalid guide id.');
        setLoadingGuide(false);
        return;
      }

      setLoadingGuide(true);
      setPageError('');

      try {
        const api = new ApiClient();
        const response = await api.getTourGuide(numericGuideId);

        if (response?.status === 'success' && response?.data) {
          setGuide(response.data);
          return;
        }

        setGuide(null);
        setPageError(response?.message || 'Guide not found.');
      } catch (error) {
        console.error('Failed to load guide for payment:', error);
        setGuide(null);
        setPageError('Failed to load guide details.');
      } finally {
        setLoadingGuide(false);
      }
    };

    fetchGuide();
  }, [guideId]);

  const hireCostPerDay = Number(guide?.hire_cost || 0);
  const totalAmount = useMemo(
    () => (Number.isFinite(hireCostPerDay) ? hireCostPerDay * Math.max(1, formData.days) : 0),
    [hireCostPerDay, formData.days]
  );

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handleDaysChange = (value: string) => {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue)) {
      setFormData((prev) => ({ ...prev, days: 1 }));
      return;
    }

    const clampedDays = Math.max(1, Math.min(30, Math.floor(parsedValue)));
    setFormData((prev) => ({ ...prev, days: clampedDays }));
  };

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    const grouped = digits.replace(/(.{4})/g, '$1 ').trim();
    setFormData((prev) => ({ ...prev, cardNumber: grouped }));
  };

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setFormData((prev) => ({ ...prev, expiry: formatted }));
  };

  const handleCvvChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, cvv: digits }));
  };

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!guide) {
      setSubmitError('Guide details are missing.');
      return;
    }

    setSubmitError('');
    setPaymentResult(null);
    setSubmitting(true);

    try {
      const api = new ApiClient();
      const response = await api.createPayment({
        guide_id: guide.id,
        days: formData.days,
        name_on_card: formData.nameOnCard.trim(),
        card_number: formData.cardNumber.replace(/\D/g, ''),
        expiry: formData.expiry.trim(),
        cvv: formData.cvv.replace(/\D/g, ''),
      });

      if (response?.status === 'success' && response?.data) {
        setPaymentResult(response.data as PaymentResult);
        setFormData((prev) => ({
          ...prev,
          cardNumber: '',
          expiry: '',
          cvv: '',
        }));
        return;
      }

      setSubmitError(response?.message || 'Payment failed. Please try again.');
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined;
      const firstValidationError = validationErrors ? Object.values(validationErrors)[0]?.[0] : null;
      setSubmitError(
        firstValidationError ||
          error?.response?.data?.message ||
          'Payment failed due to a network or server issue.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGuide) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>Loading Payment Form...</h2>
          <p className="subtitle">Fetching guide details from database.</p>
        </div>
      </div>
    );
  }

  if (pageError || !guide) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>Payment Unavailable</h2>
          <p className="subtitle">{pageError || 'Guide not found.'}</p>
          <Link to="/tourguide" className="btn-pay back-link-btn">
            Back to Tour Guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>
          Complete <span>Payment</span>
        </h2>

        <p className="subtitle">
          User: <strong>{user?.name || 'Authenticated User'}</strong>
        </p>

        <div className="payment-details">
          <p>
            <strong>Guide:</strong> {guide.name}
          </p>
          <p>
            <strong>Location:</strong> {guide.location}
          </p>
          <p>
            <strong>Rate:</strong> {formatCurrency(hireCostPerDay)} / day
          </p>
          <p>
            <strong>Total:</strong> {formatCurrency(totalAmount)}
          </p>
        </div>

        {paymentResult ? (
          <div className="alert success">
            <p>
              <strong>Payment successful.</strong>
            </p>
            <p>Transaction: {paymentResult.transaction_id}</p>
            <p>
              Charged: {paymentResult.currency} {paymentResult.amount}
            </p>
            <p>
              Card: {paymentResult.card_brand || 'Card'} ending in {paymentResult.card_last_four}
            </p>
          </div>
        ) : null}

        {submitError ? <div className="alert error">{submitError}</div> : null}

        <form onSubmit={handlePayment}>
          <div className="form-group">
            <label>Number of Days</label>
            <input
              type="number"
              min={1}
              max={30}
              value={formData.days}
              onChange={(event) => handleDaysChange(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Name on Card</label>
            <input
              type="text"
              value={formData.nameOnCard}
              onChange={(event) => setFormData((prev) => ({ ...prev, nameOnCard: event.target.value }))}
              placeholder="Card holder name"
              required
            />
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={formData.cardNumber}
              onChange={(event) => handleCardNumberChange(event.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(event) => handleExpiryChange(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={formData.cvv}
                onChange={(event) => handleCvvChange(event.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-pay" disabled={submitting}>
            {submitting ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentIntegration;
