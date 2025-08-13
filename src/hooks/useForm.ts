/**
 * 表单处理 Hook
 * 统一处理表单状态、验证、提交等逻辑
 */
import { useCallback, useState } from 'react';

// 表单配置接口
export interface FormConfig<T> {
  initialValues: T;
  validate?: (values: T) => Record<string, string>;
  onSubmit: (values: T) => Promise<{ success: boolean; error?: string }>;
}

// 表单状态接口
export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitCount: number;
}

/**
 * 通用表单 Hook
 */
export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const { initialValues, validate, onSubmit } = config;

  // 表单状态
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    submitCount: 0,
  });

  /**
   * 更新字段值
   */
  const setValue = useCallback((name: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: '' }, // 清除该字段的错误
    }));
  }, []);

  /**
   * 设置字段为已触摸
   */
  const setTouched = useCallback((name: keyof T, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched },
    }));
  }, []);

  /**
   * 设置字段错误
   */
  const setError = useCallback((name: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  }, []);

  /**
   * 设置多个错误
   */
  const setErrors = useCallback((errors: Record<string, string>) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errors },
    }));
  }, []);

  /**
   * 验证表单
   */
  const validateForm = useCallback(() => {
    if (!validate) return {};

    const errors = validate(state.values);
    setState(prev => ({ ...prev, errors }));
    return errors;
  }, [validate, state.values]);

  /**
   * 验证单个字段
   */
  const validateField = useCallback(
    (name: keyof T) => {
      if (!validate) return '';

      const allErrors = validate(state.values);
      const fieldError = allErrors[name as string] || '';

      setError(name, fieldError);
      return fieldError;
    },
    [validate, state.values, setError]
  );

  /**
   * 重置表单
   */
  const reset = useCallback(
    (newValues?: Partial<T>) => {
      setState({
        values: { ...initialValues, ...newValues },
        errors: {},
        touched: {},
        isSubmitting: false,
        submitCount: 0,
      });
    },
    [initialValues]
  );

  /**
   * 提交表单
   */
  const submit = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      submitCount: prev.submitCount + 1,
    }));

    try {
      // 验证表单
      const errors = validateForm();

      if (Object.keys(errors).length > 0) {
        setState(prev => ({ ...prev, isSubmitting: false }));
        return { success: false, error: '请检查表单输入' };
      }

      // 提交表单
      const result = await onSubmit(state.values);

      setState(prev => ({ ...prev, isSubmitting: false }));

      if (result.success) {
        // 提交成功后重置表单（可选）
        // reset();
      }

      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isSubmitting: false }));
      const errorMessage = error instanceof Error ? error.message : '提交失败';
      return { success: false, error: errorMessage };
    }
  }, [validateForm, onSubmit, state.values]);

  /**
   * 获取字段属性（用于绑定表单组件）
   */
  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: state.values[name],
      onChange: (e: any) => {
        const value = e?.target?.value ?? e;
        setValue(name, value);
      },
      onBlur: () => {
        setTouched(name, true);
        validateField(name);
      },
      status: state.errors[name as string] ? 'error' : undefined,
    }),
    [state.values, state.errors, setValue, setTouched, validateField]
  );

  /**
   * 检查表单是否有效
   */
  const isValid = Object.keys(state.errors).length === 0;

  /**
   * 检查表单是否为脏数据
   */
  const isDirty = JSON.stringify(state.values) !== JSON.stringify(initialValues);

  return {
    // 状态
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    isValid,
    isDirty,

    // 方法
    setValue,
    setTouched,
    setError,
    setErrors,
    validateForm,
    validateField,
    reset,
    submit,
    getFieldProps,
  };
}
