export default function OnboardingRetry() {
    return (
      <div>
        <h1>Session Expired</h1>
        <p>Your Stripe session expired. Click below to restart.</p>
        <a href="/api/stripe/onboarding">Retry Onboarding</a>
      </div>
    );
  }
  