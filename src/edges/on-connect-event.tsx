import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { addEdge, Connection, Edge, useReactFlow } from "@xyflow/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { addEventData, EventFlowTypes } from "../events/manage.event";

const defaultOptions = [
  {
    id: 1,
    nombre: "Por validar",
  },
  {
    id: 2,
    nombre: "Validar",
  },
  {
    id: 3,
    nombre: "Rechazar",
  },
];

/**
 * Proceso que valida que una conexion sea unica entre cada nodo
 */
const validateUniqueConection = (connection: Connection, edge: Edge[]) => {
  return edge.some(
    (ed) => ed.source === connection.source && ed.target === connection.target
  );
};

export const OnConnectEdge = forwardRef((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [action, setAction] = useState(null);
  const [options, setOptions] = useState(defaultOptions);
  const [connection, setConnection] = useState<Connection>(null);
  const flow = useReactFlow();

  useEffect(() => {
    addEventData(EventFlowTypes.LOAD_ACTIONS, (msj) => {
      console.info("[GRAPH] postMessage load actions");
      setOptions(msj.data.actions);
    });
  }, [setOptions]);

  useImperativeHandle(ref, () => ({
    onConnect: (conections) => {
      setOpen(true);
      setConnection(conections);
    },
  }));

  const handleClose = () => {
    setOpen(false);
    setAction(null);
    setConnection(null);
  };

  const handleChange = (event: SelectChangeEvent<any>) => {
    setAction(options.find((el) => el.id === Number(event.target.value)));
  };

  const createConnect = () => {
    flow.setEdges((edges) =>
      addEdge({ ...connection, data: action, label: action.nombre }, edges)
    );
    handleClose();
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        message="La accion ya existe, conectada a otro nodo."
      />

      <Dialog open={open}>
        <DialogTitle>
          Accion {connection?.source} {"->"} {connection?.target}{" "}
        </DialogTitle>
        <DialogContentText
          sx={{
            padding: "16px",
          }}
        >
          Seleccione un accion que permite cambiar de estado.
          <br />
          (Pasar del nodo A al B)
        </DialogContentText>
        <DialogContent>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="idEstado">Estado</InputLabel>
            <Select
              native
              value={action?.id}
              onChange={handleChange}
              input={<OutlinedInput label="Estado" id="idEstado" />}
            >
              <option aria-label="None" value="" />
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.nombre}
                </option>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancelar</Button>
          <Button onClick={() => createConnect()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default OnConnectEdge;
