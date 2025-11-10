import { useState } from 'react';

/**
 * Hook personalizado para validación de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @returns {Object} - Estado y funciones del formulario
 */
export function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validar un campo específico
   */
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Required
    if (rules.required && !value) {
      return rules.required.message || 'Este campo es requerido';
    }

    // Min length
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message || `Mínimo ${rules.minLength.value} caracteres`;
    }

    // Max length
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message || `Máximo ${rules.maxLength.value} caracteres`;
    }

    // Pattern
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message || 'Formato inválido';
    }

    // Email
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return rules.email.message || 'Email inválido';
      }
    }

    // Custom validation
    if (rules.custom && !rules.custom.validator(value, values)) {
      return rules.custom.message || 'Valor inválido';
    }

    return null;
  };

  /**
   * Validar todos los campos
   */
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Manejar cambio en un campo
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({ ...prev, [name]: fieldValue }));

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  /**
   * Manejar blur (cuando el campo pierde el foco)
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  /**
   * Manejar submit del formulario
   */
  const handleSubmit = async (onSubmit) => {
    return async (e) => {
      if (e) e.preventDefault();

      // Marcar todos los campos como tocados
      const allTouched = {};
      Object.keys(validationRules).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validar
      const isValid = validateAll();

      if (isValid && onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  };

  /**
   * Resetear formulario
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Actualizar valores manualmente
   */
  const setFieldValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Actualizar error manualmente
   */
  const setFieldError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validateAll
  };
}

/**
 * Componente de Input con validación
 */
export function ValidatedInput({ label, name, type = 'text', validation, placeholder, className = '', disabled = false }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {validation.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 border rounded-lg ${
          validation.errors[name] && validation.touched[name]
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : ''}`}
        value={validation.values[name] || ''}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
      />
      {validation.errors[name] && validation.touched[name] && (
        <p className="text-red-500 text-sm mt-1">{validation.errors[name]}</p>
      )}
    </div>
  );
}

export default useFormValidation;
