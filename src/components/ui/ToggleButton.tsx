import React from 'react';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: ToggleOption[];
  name: string;
  className?: string;
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  value,
  onChange,
  options,
  name,
  className = ''
}) => {
  return (
    <div className={`toggle-group flex gap-2 flex-wrap ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="toggle-btn cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="hidden"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

interface ToggleCheckboxGroupProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: ToggleOption[];
  name: string;
  className?: string;
}

export const ToggleCheckboxGroup: React.FC<ToggleCheckboxGroupProps> = ({
  values,
  onChange,
  options,
  name,
  className = ''
}) => {
  const handleChange = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter(v => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <div className={`toggle-group flex gap-2 flex-wrap ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="toggle-btn cursor-pointer">
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={() => handleChange(option.value)}
            className="hidden"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};
