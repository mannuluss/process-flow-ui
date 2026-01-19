import React, { useMemo } from 'react';
import { Flex, Form, Input, Typography } from 'antd';
import { SqlEditor } from '../../../../../../shared/components/SqlEditor';

const { Text } = Typography;

interface SqlCheckFieldsProps {
  fieldName: number;
}

export const SqlCheckFields: React.FC<SqlCheckFieldsProps> = ({
  fieldName,
}) => {
  const namePath = useMemo(() => [fieldName, 'params'], [fieldName]);
  const watchPath = useMemo(() => ['rules', fieldName, 'params'], [fieldName]);

  return (
    <Flex vertical gap={16}>
      <Form.Item name={[fieldName, 'params']} noStyle>
        <SqlEditor
          showTitle={false}
          namePath={namePath}
          watchPath={watchPath}
        />
      </Form.Item>
      <Form.Item
        name={[fieldName, 'params', 'errorMessage']}
        label={<Text style={{ fontSize: 11 }}>Mensaje de Error</Text>}
        style={{ marginBottom: 0 }}
      >
        <Input placeholder="Mensaje si la validación falla" />
      </Form.Item>
    </Flex>
  );
};
