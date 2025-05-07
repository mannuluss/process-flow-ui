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
import { useAppSelector } from "src/store/store";
import { subscribeMenssage } from "src/core/services/message.service";
import { EventFlowTypes } from "src/core/types/message";
import commandManager from "@commands/manager/command.manager";

// Simulate an API call to fetch options
const fetchOptions = () => {
  return axios.get("options-states.json");
};

export default function AddNodeButton() {
  const nodes = useStore<any[]>((s) => s.nodes);
  const [open, setOpen] = useState(false);
  const [optionState, setOptionState] = useState("");
  const [options, setOptions] = useState([]);
  const reacFlowContext = useReactFlow();
  const store = useAppSelector((state) => state);

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
    reacFlowContext.setNodes((current) => [...current, newNode]);
  };

  const handleChange = (event: SelectChangeEvent<any>) => {
    setOptionState(event.target.value);
  };

  //dar click al boton de agregar estado
  const handleclick = () => {
    setOpen(
      commandManager.executeCommand("createNode", {
        appStore: store,
        object: null,
      })
    );
  };

  useEffect(() => {
    fetchOptions().then((resp) => setOptions(resp.data));
    console.info("[GRAPH] AddNodeButton", nodes);
    const subscription = subscribeMenssage(EventFlowTypes.ADD_NODE, (msj) => {
      //se manda a crear el nodo
      commandManager.executeCommand("addNode", {
        appStore: store,
        state: reacFlowContext,
        object: msj.payload,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Button variant="outlined" onClick={handleclick}>
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
