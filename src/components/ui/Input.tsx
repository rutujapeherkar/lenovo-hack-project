import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  required = false,
  id,
  className = '',
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(errorText);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {required && <span className="required-star" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`form-control ${hasError ? 'has-error' : ''} ${className}`.trim()}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={
          [hasError ? errorId : null, helperText ? helpId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...props}
      />
      {helperText && !hasError && (
        <span id={helpId} className="form-help">
          {helperText}
        </span>
      )}
      {hasError && (
        <span id={errorId} className="form-error" role="alert">
          {errorText}
        </span>
      )}
    </div>
  );
};
