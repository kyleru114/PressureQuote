interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="bg-white vintage-shadow">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center space-x-2 step-indicator ${
                index + 1 <= currentStep ? 'step-active' : ''
              }`}>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                  style={{
                    backgroundColor: index + 1 <= currentStep ? 'var(--nebraska-red)' : '#D1D5DB'
                  }}
                >
                  {index + 1}
                </div>
                <span 
                  className={`text-sm hidden sm:inline brand-text ${
                    index + 1 <= currentStep ? 'font-semibold' : ''
                  }`}
                  style={{
                    color: index + 1 <= currentStep ? 'var(--nebraska-black)' : '#9CA3AF'
                  }}
                >
                  {step}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div 
                  className="flex-1 h-0.5 mx-2"
                  style={{ backgroundColor: index + 1 < currentStep ? 'var(--nebraska-red)' : '#E5E7EB' }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="vintage-divider"></div>
    </div>
  );
}
