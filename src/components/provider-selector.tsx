'use client';

import { forwardRef } from 'react';

interface ProviderSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  providers: { value: string; label: string }[];
}

const ProviderSelector = forwardRef<HTMLSelectElement, ProviderSelectorProps>(({ providers, ...props }, ref) => {
  return (
    <select
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      ref={ref}
      {...props}
    >
      {providers.map((provider) => (
        <option key={provider.value} value={provider.value}>
          {provider.label}
        </option>
      ))}
    </select>
  );
});
ProviderSelector.displayName = 'ProviderSelector';

export { ProviderSelector };