import { useEffect, useState } from "react";
import { getFiles } from "../services/api";

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
              }}
              onClick={() => handleSelect(file)}
            >
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileSelector;