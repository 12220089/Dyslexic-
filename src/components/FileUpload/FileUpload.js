import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';
import { parseFileContent } from '../../utils/fileParsers';

const FileUpload = ({ onFileUpload }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError('File is too large. Maximum size is 10MB.');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.');
      } else {
        setError('Error uploading file. Please try again.');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsParsing(true);

    try {
      const extractedText = await parseFileContent(file);
      onFileUpload(extractedText);
    } catch (err) {
      console.error('Error parsing file:', err);
      setError('Error reading file content. Please try another file.');
      setUploadedFile(null);
    } finally {
      setIsParsing(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
  };

  return (
    <div className="file-upload-section">
      <div className="file-upload-header">
        <h3>Upload Document</h3>
        {/* <span className="upload-supported">Supports: PDF, DOC, DOCX, TXT</span> */}
      </div>
      
      <div className="file-upload-container">
        {!uploadedFile ? (
          <div 
            {...getRootProps()} 
            className={`file-upload-area ${isDragActive ? 'drag-active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <p>Drag & drop a file here, or click to select</p>
              {/* <p className="file-size-limit">Max file size: 10MB</p> */}
            </div>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <span className="file-icon">📄</span>
              <div className="file-details">
                <div className="file-name">{uploadedFile.name}</div>
                <div className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button 
                className="remove-file-btn"
                onClick={handleRemoveFile}
                disabled={isParsing}
                title="Remove file"
              >
                ×
              </button>
            </div>
            {isParsing && (
              <div className="parsing-status">
                <div className="spinner-small"></div>
                <span>Extracting text from document...</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="file-error">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;