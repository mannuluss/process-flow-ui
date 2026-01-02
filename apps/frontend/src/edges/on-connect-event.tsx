import commandManager from '@commands/manager/command.manager';
import { sendMessage, subscribeMenssage } from '@core/services/message.service';
import { EventFlowTypes } from '@core/types/message';
import { Button, Form, message, Modal, Select } from 'antd';
import { addEdge, Connection, useReactFlow } from '@xyflow/react';
import { Formik } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { useAppSelector } from '../store/store';

const defaultOptions = [
  {
    id: 1,
    nombre: 'Por validar',
  },
  {
    id: 2,
    nombre: 'Validar',
  },
  {
    id: 3,
    nombre: 'Rechazar',
  },
];

export const OnConnectEdge = forwardRef((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [action, setAction] = useState(null);
  const [optionsAccion, setOptionsAccion] = useState(defaultOptions);
  const { customEdgeConnection } = useAppSelector(state => state.config);
  //const [optionsRol, setOptionsRol] = useState(defaultOptions);

  const [connection, setConnection] = useState<Connection>(null);
  const flow = useReactFlow();

  useEffect(() => {
    subscribeMenssage(EventFlowTypes.LOAD_ACTIONS, (msj: any) => {
      console.info('[GRAPH] postMessage load actions', msj);
      setOptionsAccion(msj.data.actions);
    });
  }, [setOptionsAccion]);

  useImperativeHandle(ref, () => ({
    onConnect: connections => {
      sendMessage({ type: EventFlowTypes.CREATE_EDGE, payload: connections });

      if (!customEdgeConnection) {
        setOpen(true);
        setConnection(connections);
      }
    },
  }));

  const handleClose = () => {
    setOpen(false);
    setAction(null);
    setConnection(null);
  };

  const handleChange = (value: number) => {
    setAction(optionsAccion.find(el => el.id === Number(value)));
  };

  const createConnect = () => {
    flow.setEdges(edges =>
      addEdge({ ...connection, data: action, label: action.nombre }, edges)
    );
    handleClose();
  };

  useEffect(() => {
    const suscription = subscribeMenssage(EventFlowTypes.ADD_EDGE, event => {
      commandManager.executeCommand('addEdge', {
        state: flow,
        object: event.payload,
      });
    });
    return () => {
      suscription.unsubscribe();
    };
  }, [flow]);

  useEffect(() => {
    if (openSnackbar) {
      message.warning('La accion ya existe, conectada a otro nodo.');
      setOpenSnackbar(false);
    }
  }, [openSnackbar]);

  return (
    <>
      {!customEdgeConnection && (
        <Modal
          title={`Accion ${connection?.source} -> ${connection?.target}`}
          open={open}
          onCancel={handleClose}
          footer={[
            <Button key="cancel" onClick={() => handleClose()}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={() => createConnect()}>
              Aceptar
            </Button>,
          ]}
        >
          <p>
            Seleccione un accion que permite cambiar de estado.
            <br />
            (Pasar del nodo A al B)
          </p>
          <Form layout="vertical">
            <Form.Item label="Estado">
              <Select
                value={action?.id}
                onChange={handleChange}
                placeholder="Seleccione un estado"
              >
                {optionsAccion.map(opt => (
                  <Select.Option key={opt.id} value={opt.id}>
                    {opt.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <Formik
            initialValues={{
              idEstado: action?.id,
            }}
            onSubmit={values => {
              console.log('values', values);
            }}
          ></Formik>
        </Modal>
      )}
    </>
  );
});

export default OnConnectEdge;
