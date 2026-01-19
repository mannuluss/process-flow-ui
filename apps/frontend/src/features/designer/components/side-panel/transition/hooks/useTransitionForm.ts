import { useEffect, useCallback, useMemo, useRef } from 'react';
import { Form, MenuProps } from 'antd';
import { NodeHandler, Rule, RuleType } from '@process-flow/common';
import debounce from 'lodash.debounce';
import { DEBOUNCE_AUTOSAVE_MS } from 'src/core/const/form';

const getDefaultRule = (type: RuleType): Rule => {
  switch (type) {
    case RuleType.ROLE_CHECK:
      return { type, params: { allowedRoles: [] } };
    case RuleType.DOCUMENT_STATUS_CHECK:
      return { type, params: { documentId: '', requiredStatus: '' } };
    case RuleType.SQL_CHECK_CUSTOM:
      return { type, params: { sql: '', errorMessage: '' } };
    case RuleType.API_CHECK_CUSTOM:
      return {
        type,
        params: {
          endpoint: '',
          method: 'GET',
          expectedField: '',
          expectedValue: '',
        },
      };
    default:
      return {
        type: RuleType.ROLE_CHECK,
        params: { allowedRoles: [] },
      } as Rule;
  }
};

interface UseTransitionFormProps {
  handler: NodeHandler;
  onUpdate: (handler: NodeHandler) => void;
}

export const useTransitionForm = ({
  handler,
  onUpdate,
}: UseTransitionFormProps) => {
  const [form] = Form.useForm();
  const handlerRef = useRef(handler);

  // Keep ref updated
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Sync form values when handler changes
  useEffect(() => {
    form.setFieldsValue({
      trigger: handler.trigger || '',
      rules: handler.rules || [],
    });
  }, [handler, form]);

  // Debounced save function
  const debouncedSave = useMemo(
    () =>
      debounce((values: { trigger: string; rules: Rule[] }) => {
        onUpdate({
          ...handlerRef.current,
          trigger: values.trigger,
          rules: values.rules,
        });
      }, DEBOUNCE_AUTOSAVE_MS),
    [onUpdate]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Handle form value changes - auto save
  const handleValuesChange = useCallback(
    (_: any, allValues: { trigger: string; rules: Rule[] }) => {
      debouncedSave(allValues);
    },
    [debouncedSave]
  );

  // Flush pending saves (call before close)
  const flushSave = useCallback(() => {
    debouncedSave.flush();
  }, [debouncedSave]);

  // Add rule handler
  const handleAddRule = useCallback(
    (type: RuleType) => {
      const currentRules = form.getFieldValue('rules') || [];
      const newRule = getDefaultRule(type);
      const newRules = [...currentRules, newRule];
      form.setFieldsValue({ rules: newRules });
      // Trigger save immediately for rule additions
      debouncedSave({
        trigger: form.getFieldValue('trigger') || '',
        rules: newRules,
      });
    },
    [form, debouncedSave]
  );

  // Get rule at index
  const getRule = useCallback(
    (index: number): Rule => {
      return form.getFieldValue(['rules', index]) as Rule;
    },
    [form]
  );

  // Menu items for rule type dropdown
  const ruleTypeMenuItems: MenuProps['items'] = useMemo(
    () =>
      Object.values(RuleType).map(type => ({
        key: type,
        label: type,
        onClick: () => handleAddRule(type),
      })),
    [handleAddRule]
  );

  return {
    form,
    handleValuesChange,
    flushSave,
    handleAddRule,
    getRule,
    ruleTypeMenuItems,
  };
};
