// filepath: c:\Users\pipe_\Documents\Personal\process-flow-ui\src\app\components\custom\button-import.tsx
import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CircularProgress from "@mui/material/CircularProgress";
import { useCommand } from "@commands/manager/CommandContext";

const ButtonImport = () => {
  const [loading, setLoading] = useState(false);
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
        "loadData",
        generateContextApp("Graph", data)
      );
    } catch (error) {
      console.error("Error parsing file content:", error);
      return;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay

      const reader = new FileReader();
      reader.onload = (e) => {
        onFileLoad(e.target?.result || null);
        setLoading(false);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        onFileLoad(null); // Notify of error or handle appropriately
        setLoading(false);
      };
      reader.readAsText(file); // Or readAsArrayBuffer, readAsDataURL
    }
    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".json,.txt"
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <FileUploadIcon />
          )
        }
        onClick={handleButtonClick}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Importar"}
      </Button>
    </>
  );
};

export default ButtonImport;
