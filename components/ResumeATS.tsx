import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenAI, Type } from "@google/genai";
import { Upload, CheckCircle, AlertCircle, FileText, Target } from './ui/Icons';
import { AnalysisStatus, AtsResult } from '../types';

// Set worker source for pdf.js to a stable CDN location matching the pinned version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const ResumeATS: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AtsResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setText(''); // Clear text while processing
      
      if (selectedFile.type === 'application/pdf') {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
          const pdf = await loadingTask.promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // @ts-ignore - item.str exists on TextItem
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          setText(fullText);
        } catch (error) {
          console.error("Error parsing PDF:", error);
          alert("Failed to parse PDF. Please ensure it is a valid text-based PDF.");
        }
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if(typeof ev.target?.result === 'string') {
            setText(ev.target.result);
          }
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const analyze = async () => {
    if (!text && !file) return;
    setStatus(AnalysisStatus.LOADING);
    
    try {
      // Initialize Gemini Client
      // Note: In a real production environment, this key should be handled via a proxy server to avoid exposure.
      // We assume process.env.API_KEY is available as per instructions.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const prompt = `
        Act as an expert Application Tracking System (ATS) and Career Coach. 
        Analyze the following resume text for the position of "${jobRole}".
        
        Resume Content:
        ${text}
        
        Provide:
        1. An ATS Score (0-100) based on relevance to the role.
        2. A list of critical Missing Keywords that are common for this role but missing in the resume.
        3. Constructive Feedback on how to improve the resume.
        4. A brief Summary of the candidate's profile.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.NUMBER, description: "ATS score from 0 to 100" },
                    missingKeywords: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "List of important keywords missing from the resume" 
                    },
                    feedback: { type: Type.STRING, description: "Detailed actionable feedback" },
                    summary: { type: Type.STRING, description: "Executive summary of the profile" }
                },
                required: ["score", "missingKeywords", "feedback", "summary"]
            }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setResult(data);
        setStatus(AnalysisStatus.SUCCESS);
      } else {
        throw new Error("Empty response from AI");
      }

    } catch (error) {
      console.error("Analysis failed:", error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume ATS Analyzer</h1>
        <p className="text-gray-500 mt-1">Optimize your resume for Application Tracking Systems using AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
           {/* Target Role Input */}
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1.5">Target Job Role</label>
             <input 
                type="text" 
                id="jobRole"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                placeholder="e.g. Software Engineer"
             />
           </div>

           {/* Upload Card */}
           <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 hover:border-primary-500 transition-colors text-center cursor-pointer group relative">
             <input 
              type="file" 
              accept=".txt,.md,.pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-50 transition-colors">
               <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
             </div>
             <p className="text-sm font-medium text-gray-900">
               {file ? file.name : "Click to upload or drag and drop"}
             </p>
             <p className="text-xs text-gray-500 mt-1">PDF, TXT, or MD files supported</p>
           </div>
           
           <div className="relative">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-gray-200"></div>
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-gray-50 text-gray-500">Or paste text</span>
             </div>
           </div>

           <textarea
             className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none resize-none text-sm font-mono text-gray-700 bg-white"
             placeholder="Paste your resume content here..."
             value={text}
             onChange={(e) => setText(e.target.value)}
           ></textarea>
           
           <button 
             onClick={analyze}
             disabled={status === AnalysisStatus.LOADING || (!text && !file)}
             className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
           >
             {status === AnalysisStatus.LOADING ? (
               <>
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Analyzing...</span>
               </>
             ) : (
               <>
                 <FileText className="w-5 h-5" />
                 Analyze Resume
               </>
             )}
           </button>
        </div>

        <div className="space-y-6">
          {status === AnalysisStatus.IDLE && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border border-gray-100 rounded-xl bg-white text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-900">No Analysis Yet</p>
              <p className="text-sm mt-1">Upload your resume and define a role to see your ATS score.</p>
            </div>
          )}
          
          {status === AnalysisStatus.ERROR && (
             <div className="h-full flex flex-col items-center justify-center text-red-400 p-8 border border-red-100 rounded-xl bg-red-50 text-center">
               <AlertCircle className="w-10 h-10 mb-2 text-red-500" />
               <p className="font-bold text-red-800">Analysis Failed</p>
               <p className="text-sm text-red-600 mt-1">Please check your internet connection or API key and try again.</p>
             </div>
          )}

          {status === AnalysisStatus.SUCCESS && result && (
             <div className="space-y-6 animate-fade-in-up">
               {/* Score Card */}
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">ATS Score</p>
                   <h2 className={`text-4xl font-bold mt-1 ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                     {result.score}/100
                   </h2>
                 </div>
                 <div className="w-20 h-20 relative">
                   <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                     <path
                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                       fill="none"
                       stroke="#f3f4f6"
                       strokeWidth="3"
                     />
                     <path
                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                       fill="none"
                       stroke={result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f97316' : '#ef4444'}
                       strokeWidth="3"
                       strokeDasharray={`${result.score}, 100`}
                     />
                   </svg>
                 </div>
               </div>

               {/* Summary */}
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-gray-400" />
                   Profile Summary
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {result.summary}
                  </p>
               </div>

               {/* Missing Keywords */}
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <AlertCircle className="w-5 h-5 text-orange-500" />
                   Missing Keywords
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {result.missingKeywords?.map((kw, i) => (
                     <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-100">
                       {kw}
                     </span>
                   ))}
                 </div>
               </div>

               {/* Feedback */}
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <CheckCircle className="w-5 h-5 text-blue-500" />
                   AI Feedback
                 </h3>
                 <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                   {result.feedback}
                 </p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeATS;