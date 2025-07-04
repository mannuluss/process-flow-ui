// filepath: c:\Users\pipe_\Documents\Personal\process-flow-ui\src\app\components\custom\button-import.tsx
import { useCommand } from '@commands/manager/CommandContext';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useRef } from 'react';
import { setLoading } from 'src/store/configSlice';
import { useAppDispatch, useAppSelector } from 'src/store/store';

const ButtonImport = () => {
  const { open } = useAppSelector(state => state.config.loading);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { commandManager, generateContextApp } = useCommand();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onFileLoad = (fileContent: string | ArrayBuffer | null) => {
    //se convierte el archivo en un objeto JSON
    if (fileContent === null) {
      return;
    }
    try {
      const data = JSON.parse(fileContent as string);
      commandManager.executeCommand(
        'loadData',
        generateContextApp('Graph', data)
      );
    } catch (error) {
      console.error('Error parsing file content:', error);
      return;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setLoading({ open: true, message: 'Cargando archivo...' }));
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

      const reader = new FileReader();
      reader.onload = e => {
        onFileLoad(e.target?.result || null);
        dispatch(setLoading({ open: false }));
      };
      reader.onerror = () => {
        console.error('Error reading file');
        onFileLoad(null); // Notify of error or handle appropriately
        dispatch(setLoading({ open: false }));
      };
      reader.readAsText(file); // Or readAsArrayBuffer, readAsDataURL
    }
    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".json,.txt"
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={
          open ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <FileUploadIcon />
          )
        }
        onClick={handleButtonClick}
        disabled={open}
      >
        {open ? 'Cargando...' : 'Importar'}
      </Button>
    </>
  );
};

export default ButtonImport;
