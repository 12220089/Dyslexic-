// import axios from 'axios';

// // Use your FastAPI backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Main text simplification function - now calls your FastAPI backend
// export const simplifyText = async (text) => {
//   try {
//     console.log('🔄 Calling FastAPI backend with text:', text.substring(0, 100) + '...');
    
//     const response = await api.post('/simplify', { 
//       text: text 
//     });
    
//     console.log('✅ FastAPI Response:', response.data);
    
//     // Transform the response to match our frontend format
//     const transformedResponse = transformBackendResponse(response.data);
//     console.log('🔄 Transformed Response:', transformedResponse);
    
//     return transformedResponse;
//   } catch (error) {
//     console.error('❌ FastAPI Error:', error);
    
//     // Fallback to mock data if backend is not available
//     console.log('🔄 Falling back to mock data');
//     return mockSimplifyText(text);
//   }
// };

// // Transform backend response to frontend format
// const transformBackendResponse = (backendData) => {
//   const simplifiedText = backendData.simplified || '';
//   const complexWords = backendData.complex_words || {};
  
//   // Convert complex_words object to lexicalGaps array
//   const lexicalGaps = Object.entries(complexWords).map(([word, explanations]) => {
//     // Handle different response formats from backend
//     let definition = '';
//     let examples = [];
//     let alternatives = [];
    
//     if (Array.isArray(explanations)) {
//       // If explanations is an array of synonyms/definitions
//       alternatives = explanations.slice(0, 3);
//       definition = explanations[0] || `A complex word that may need explanation.`;
//       examples = [`Example usage of ${word}.`];
//     } else if (typeof explanations === 'string') {
//       // If explanations is a single string
//       definition = explanations;
//       examples = [`Example usage of ${word}.`];
//       alternatives = [];
//     } else {
//       // Default fallback
//       definition = `A complex word that may need explanation.`;
//       examples = [`Example usage of ${word}.`];
//       alternatives = [];
//     }
    
//     return {
//       word: word,
//       definition: definition,
//       examples: examples,
//       alternatives: alternatives
//     };
//   });
  
//   return {
//     simplifiedText: simplifiedText,
//     lexicalGaps: lexicalGaps
//   };
// };

// // File upload function
// export const uploadAndSimplifyFile = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await api.post('/upload-simplify', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('File Upload API Error:', error);
//     // Fallback to mock data
//     return mockUploadAndSimplifyFile(file);
//   }
// };

// // Keep mock data as fallback
// export const mockSimplifyText = async (text) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const simplifiedText = `This is a simplified version of your text. Complex words like comprehension and dyslexia have been explained below.\n\nLong sentences are broken into shorter parts. This helps with readability for people with reading difficulties.\n\nThe text maintains the original meaning while improving accessibility.`;

//       const lexicalGaps = [
//         { 
//           word: "version", 
//           definition: "A particular form of something that is slightly different from other forms",
//           examples: ["This is the latest version of the software.", "I prefer the original version."],
//           alternatives: ["edition", "form"]
//         },
//         { 
//           word: "Complex", 
//           definition: "Made of multiple connected parts; not simple",
//           examples: ["This is a complex problem.", "The machine has a complex design."],
//           alternatives: ["complicated", "intricate"]
//         }
//       ];

//       resolve({
//         simplifiedText: simplifiedText,
//         lexicalGaps: lexicalGaps
//       });
//     }, 1000);
//   });
// };

// // Mock implementation for file upload
// export const mockUploadAndSimplifyFile = async (file) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const simplifiedText = `This document has been processed and simplified for better readability. Complex terms are explained below.`;
      
//       const lexicalGaps = [
//         {
//           word: "document",
//           definition: "A piece of written, printed, or electronic matter that provides information",
//           examples: ["Please read this important document.", "Save the document before closing."],
//           alternatives: ["file", "paper"]
//         }
//       ];

//       resolve({
//         simplifiedText: simplifiedText,
//         lexicalGaps: lexicalGaps
//       });
//     }, 2000);
//   });
// };

// // Health check function
// export const checkApiHealth = async () => {
//   try {
//     const response = await api.get('/');
//     return response.data;
//   } catch (error) {
//     console.error('Health check failed:', error);
//     return { status: 'unavailable', message: 'Backend service is not available' };
//   }
// };

// export default api;

import axios from 'axios';

// Use your FastAPI backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Main text simplification function - now calls your FastAPI backend
export const simplifyText = async (text) => {
  try {
    console.log('🔄 Calling FastAPI backend with text:', text.substring(0, 100) + '...');

    const response = await api.post('/simplify', { text });

    console.log('✅ FastAPI Response:', response.data);

    // Transform the response to match frontend format
    const transformedResponse = transformBackendResponse(response.data);
    console.log('🔄 Transformed Response:', transformedResponse);

    return transformedResponse;
  } catch (error) {
    console.error('❌ FastAPI Error:', error);

    // Fallback to mock data if backend is not available
    console.log('🔄 Falling back to mock data');
    return mockSimplifyText(text);
  }
};

// Transform backend response to frontend format
const transformBackendResponse = (backendData) => {
  const simplifiedText = backendData.simplified || '';
  const lexicalGapsObj = backendData.lexical_gaps || backendData.complex_words || {};

  // Convert lexical gaps object to array for frontend
  const lexicalGaps = Object.entries(lexicalGapsObj).map(([word, info]) => {
    return {
      word: word,
      definition: info?.definition || '',
      examples: info?.example ? [info.example] : [],
      alternatives: info?.synonyms || [],
    };
  });

  return {
    simplifiedText,
    lexicalGaps,
  };
};

// File upload function
export const uploadAndSimplifyFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-simplify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return transformBackendResponse(response.data);
  } catch (error) {
    console.error('File Upload API Error:', error);
    // Fallback to mock data
    return mockUploadAndSimplifyFile(file);
  }
};

// Keep mock data as fallback
export const mockSimplifyText = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const simplifiedText = `This is a simplified version of your text. Complex words like comprehension and dyslexia have been explained below.\n\nLong sentences are broken into shorter parts. This helps with readability for people with reading difficulties.\n\nThe text maintains the original meaning while improving accessibility.`;

      const lexicalGaps = [
        {
          word: "version",
          definition: "A particular form of something that is slightly different from other forms",
          examples: ["This is the latest version of the software.", "I prefer the original version."],
          alternatives: ["edition", "form"],
        },
        {
          word: "Complex",
          definition: "Made of multiple connected parts; not simple",
          examples: ["This is a complex problem.", "The machine has a complex design."],
          alternatives: ["complicated", "intricate"],
        },
      ];

      resolve({
        simplifiedText,
        lexicalGaps,
      });
    }, 1000);
  });
};

// Mock implementation for file upload
export const mockUploadAndSimplifyFile = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const simplifiedText = `This document has been processed and simplified for better readability. Complex terms are explained below.`;

      const lexicalGaps = [
        {
          word: "document",
          definition: "A piece of written, printed, or electronic matter that provides information",
          examples: ["Please read this important document.", "Save the document before closing."],
          alternatives: ["file", "paper"],
        },
      ];

      resolve({
        simplifiedText,
        lexicalGaps,
      });
    }, 2000);
  });
};

// Health check function
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unavailable', message: 'Backend service is not available' };
  }
};

export default api;
