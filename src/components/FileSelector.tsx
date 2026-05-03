import { useEffect, useState } from "react";
import { getFiles, deleteFile } from "../services/api";

type FileType = {
  id: string;
  name: string;
};

type Props = {
  onSelect: (file: { id: string; name: string }) => void;
};

const FileSelector = ({ onSelect }: Props) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFiles();
        console.log("API response:", data);

        let filesArray: any[] = [];

        if (Array.isArray(data)) {
          filesArray = data;
        } else if (Array.isArray(data.files)) {
          filesArray = data.files;
        } else if (Array.isArray(data.data)) {
          filesArray = data.data;
        }

        const normalizedFiles = filesArray.map((file, index) => ({
          id: file.id || file._id || file.file_id || `fallback-${index}`,
          name: file.name || file.filename || "Unnamed file",
        }));

        setFiles(normalizedFiles);
      } catch (error) {
        console.error("Error fetching files", error);
        setFiles([]);
      }
    };

    fetchFiles();
  }, []);

  const handleSelect = (file: FileType) => {
    setSelectedId(file.id);
    onSelect(file);
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);

      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      if (selectedId === fileId) {
        setSelectedId("");
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete file");
    }
  };

  return (
    <div>
      <h3>Select File</h3>

      {files.length === 0 ? (
        <p>No files available</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li
              key={`${file.id}-${index}`}
              style={{
                cursor: "pointer",
                fontWeight: selectedId === file.id ? "bold" : "normal",
                padding: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => handleSelect(file)}
            >
              <span>{file.name}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 prevents select
                  handleDelete(file.id);
                }}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileSelector;