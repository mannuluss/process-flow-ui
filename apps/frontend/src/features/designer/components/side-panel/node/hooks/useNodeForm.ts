import { useEffect, useCallback, useMemo, useRef } from 'react';
import { Form } from 'antd';
import debounce from 'lodash.debounce';
import { AppNode } from 'src/app/customs/nodes/types';
import { DEFAULT_ICON } from '../../../../../../shared/components/IconPicker';
import { useCommand } from '@commands/context/CommandContext';
import { DEBOUNCE_AUTOSAVE_MS } from 'src/core/const/form';
import { DataSourceStatus } from 'src/shared/hooks/useDataSourceOptions';

interface UseNodeFormProps {
  payload: AppNode;
  isInitialNode: boolean;
}

interface NodeFormValues {
  label: string;
  code?: string;
  icon?: string;
}

interface UseNodeFormReturn {
  form: ReturnType<typeof Form.useForm>[0];
  handleValuesChange: (
    changedValues: unknown,
    allValues: NodeFormValues
  ) => void;
  handleStatusChange: (id: string, option?: DataSourceStatus) => void;
  flushSave: () => void;
}

export const useNodeForm = ({
  payload,
  isInitialNode,
}: UseNodeFormProps): UseNodeFormReturn => {
  const [form] = Form.useForm();
  const { commandManager, generateContextApp } = useCommand();

  const payloadData = payload.data as any;

  // Ref to keep payload updated in debounce closure
  const payloadRef = useRef(payload);
  useEffect(() => {
    payloadRef.current = payload;
  }, [payload]);

  // Sync form values when payload changes (only for regular nodes)
  useEffect(() => {
    if (!isInitialNode) {
      form.setFieldsValue({
        label: payloadData?.label || '',
        code: payloadData?.code || '',
        icon: payloadData?.icon || DEFAULT_ICON,
      });
    }
  }, [payload, form, isInitialNode, payloadData]);

  // Debounced save function
  const debouncedSave = useMemo(
    () =>
      debounce((values: NodeFormValues) => {
        const updatedNode: AppNode = {
          ...payloadRef.current,
          data: {
            ...payloadRef.current.data,
            label: values.label,
            code: values.code,
            icon: values.icon || DEFAULT_ICON,
          },
        };
        commandManager.executeCommand(
          'updateNode',
          generateContextApp('Node', updatedNode)
        );
      }, DEBOUNCE_AUTOSAVE_MS),
    [commandManager, generateContextApp]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Handle form value changes - auto save
  const handleValuesChange = useCallback(
    (_changedValues: unknown, allValues: NodeFormValues) => {
      debouncedSave(allValues);
    },
    [debouncedSave]
  );

  // Handle status select change - updates both code and label
  const handleStatusChange = useCallback(
    (id: string, option?: DataSourceStatus) => {
      const currentValues = form.getFieldsValue();
      const newValues: NodeFormValues = {
        ...currentValues,
        code: id,
        label: option?.label || id, // Use label from option, or id if custom
      };
      form.setFieldsValue(newValues);
      debouncedSave(newValues);
    },
    [form, debouncedSave]
  );

  // Flush pending saves (call before close)
  const flushSave = useCallback(() => {
    debouncedSave.flush();
  }, [debouncedSave]);

  return {
    form,
    handleValuesChange,
    handleStatusChange,
    flushSave,
  };
};
