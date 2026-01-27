import React from 'react';
import { Card, Flex, Form, Input, Typography, theme } from 'antd';

const { Text } = Typography;

interface MappingConfigDataProps {
  showPath?: boolean;
}

export const MappingConfigData: React.FC<MappingConfigDataProps> = ({
  showPath,
}) => {
  const { token } = theme.useToken();

  return (
    <Card
      title="Mapeo de Campos"
      bordered
      style={{
        background: token.colorBgContainer,
        borderColor: token.colorBorder,
      }}
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Especifique qué campos de la respuesta deben usarse como ID y nombre de
        la fuente de datos.
      </Text>
      <Flex gap={24} wrap="wrap">
        <div style={{ flex: 1, minWidth: '300px' }}>
          <Form.Item
            name={['mappingConfig', 'valueField']}
            label="Campo de Valor (ID)"
            rules={[{ required: true, message: 'Requerido para selectores' }]}
            help="Nombre de la columna o propiedad que será el valor único."
          >
            <Input placeholder="Ej. id, role_name, code" />
          </Form.Item>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <Form.Item
            name={['mappingConfig', 'labelField']}
            label="Campo de Etiqueta (Label)"
            rules={[{ required: true, message: 'Requerido para selectores' }]}
            help="Nombre de la columna o propiedad que se mostrará al usuario."
          >
            <Input placeholder="Ej. name, description, title" />
          </Form.Item>
        </div>
      </Flex>
      {showPath && (
        <Form.Item
          name={['mappingConfig', 'responsePath']}
          label="Ruta de Respuesta (Opcional)"
          help="Si la respuesta es { data: [...] }, use 'data'. Si es un array directo, dejar vacío."
        >
          <Input placeholder="Ej. data" />
        </Form.Item>
      )}
    </Card>
  );
};
