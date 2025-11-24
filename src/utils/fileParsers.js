// Text file parser
const parseTextFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// PDF file parser
const parsePdfFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = `[PDF File: ${file.name}]\n\nPDF text extraction requires backend service. Please use text files for now or contact administrator.\n\nFile: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        resolve(text);
      } catch (error) {
        reject(new Error('PDF parsing requires backend service.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// DOCX file parser
const parseDocxFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const mammoth = await import('mammoth');
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(new Error('Failed to parse DOCX file.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// DOC file parser
const parseDocFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        let text = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
          if (uint8Array[i] >= 32 && uint8Array[i] <= 126) {
            text += String.fromCharCode(uint8Array[i]);
          }
        }
        
        text = text.replace(/\s+/g, ' ').trim();
        
        if (text.length > 100) {
          resolve(text);
        } else {
          resolve(`[DOC File: ${file.name}]\n\nLimited text extracted. For better results, convert to .docx or PDF.\n\nExtracted text:\n${text || 'No readable text found'}`);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// RTF file parser
const parseRtfFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rtfContent = e.target.result;
        let text = rtfContent
          .replace(/\\[a-z]+\*?\d*(\s|)/gi, ' ')
          .replace(/\{[^}]*\}/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (text.length > 50) {
          resolve(text);
        } else {
          resolve(`[RTF File: ${file.name}]\n\nLimited text extracted. Use .txt or .docx for better results.\n\nExtracted text:\n${text || 'No readable text found'}`);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Main file parser function
export const parseFileContent = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePdfFile(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileName.endsWith('.docx')) {
      return await parseDocxFile(file);
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return await parseDocFile(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await parseTextFile(file);
    } else if (fileType === 'application/rtf' || fileName.endsWith('.rtf')) {
      return await parseRtfFile(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType || 'unknown'}`);
    }
  } catch (error) {
    throw new Error(`Failed to process ${file.name}: ${error.message}`);
  }
};