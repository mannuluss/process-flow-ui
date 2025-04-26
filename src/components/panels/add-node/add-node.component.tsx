import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useReactFlow, useStore } from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { AppNode } from "../../../nodes/types";
import axios from "axios";

// Simulate an API call to fetch options
const fetchOptions = () => {
  return axios.get("options-states.json");
};

export default function AddNodeButton() {
  const nodes = useStore<any[]>((s) => s.nodes);
  const [open, setOpen] = useState(false);
  const [optionState, setOptionState] = useState("");
  const [options, setOptions] = useState([]);
  const { setNodes } = useReactFlow();

  //evento que cierra el modal
  const handleClose = useCallback(() => {
    //if (reason !== "backdropClick") {
    setOpen(false);
    //}
  }, []);

  const onAddNode = () => {
    if (!optionState) {
      alert("Seleccione un estado");
      return;
    }
    setOpen(false);
    const opt = options.find((opt) => opt.id === optionState);
    //crear el nuevo nodo
    const newNode: AppNode = {
      id: opt.id.toString() || (nodes.length + 1).toString(),
      type: "default",
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      data: { label: opt.nombre || `Node ${nodes.length + 1}` },
    };
    console.log("agregando un nodo", newNode);
    setNodes((current) => [...current, newNode]);
  };

  const handleChange = (event: SelectChangeEvent<any>) => {
    setOptionState(Number(event.target.value) || null);
  };

  useEffect(() => {
    fetchOptions().then((resp) => setOptions(resp.data));
  }, []);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Agregar estado
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill the form</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="idEstado">Estado</InputLabel>
              <Select
                native
                value={optionState}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => onAddNode()}>Crear</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
