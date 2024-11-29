// src/components/features/FileTree/FileTree.jsx
import { useState } from 'react';
import { FolderIcon, FileIcon, ChevronRight } from 'lucide-react';
import './FileTree.css';

const FileTree = ({ 
  files = [], 
  selectedFile = null,
  onFileSelect 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const buildFileTree = (paths) => {
    const tree = {};
    paths.forEach(path => {
      const parts = path.split('\\');
      let current = tree;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          if (!current.files) current.files = [];
          current.files.push(part);
        } else {
          if (!current.folders) current.folders = {};
          if (!current.folders[part]) current.folders[part] = {};
          current = current.folders[part];
        }
      });
    });
    return tree;
  };

  const renderTree = (tree, path = '') => {
    if (!tree) return null;

    return (
      <div className="tree-content">
        {tree.folders && Object.entries(tree.folders).map(([folderName, content]) => {
          const folderPath = path ? `${path}\\${folderName}` : folderName;
          const isExpanded = expandedFolders.has(folderPath);
          
          return (
            <div key={folderPath} className="folder">
              <button 
                className="folder-name"
                onClick={() => toggleFolder(folderPath)}
              >
                <ChevronRight 
                  size={16}
                  className={`folder-icon ${isExpanded ? 'expanded' : ''}`}
                />
                <FolderIcon size={16} className="folder-type-icon" />
                <span>{folderName}</span>
              </button>
              {isExpanded && (
                <div className="folder-content">
                  {renderTree(content, folderPath)}
                </div>
              )}
            </div>
          );
        })}

        {tree.files && tree.files.map(file => {
          const filePath = path ? `${path}\\${file}` : file;
          return (
            <button 
              key={filePath}
              className={`file ${selectedFile === filePath ? 'selected' : ''}`}
              onClick={() => onFileSelect?.(filePath)}
            >
              <FileIcon size={16} className="file-type-icon" />
              <span>{file}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="file-tree">
      {files.length === 0 ? (
        <div className="empty-state">No files available</div>
      ) : (
        renderTree(buildFileTree(files))
      )}
    </div>
  );
};

export default FileTree;