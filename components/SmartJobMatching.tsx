import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Briefcase, MapPin, ExternalLink, AlertCircle, Sparkles } from './ui/Icons';
import { Job } from '../types';

// Set worker source for pdf.js to a stable CDN location matching the pinned version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

// Mock data for fallback when backend is unreachable
const MOCK_JOBS: Job[] = [
  {
    title: "Senior Frontend Engineer",
    company: "TechFlow Systems",
    location: "Remote",
    url: "https://google.com/search?q=frontend+jobs",
    score: 94
  },
  {
    title: "React Developer",
    company: "Creative Solutions Inc.",
    location: "New York, NY",
    url: "https://google.com/search?q=react+jobs",
    score: 88
  },
  {
    title: "Full Stack Developer",
    company: "Innovate AI",
    location: "San Francisco, CA",
    url: "https://google.com/search?q=fullstack+jobs",
    score: 82
  },
  {
    title: "UI/UX Engineer",
    company: "Design Studio",
    location: "Austin, TX (Hybrid)",
    url: "https://google.com/search?q=ui+ux+jobs",
    score: 76
  }
];

type Status = 'idle' | 'loading' | 'success' | 'error';

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreColor()}`}>
      {score}% Match
    </div>
  );
};

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <a
    href={job.url}
    target="_blank"
    rel="noopener noreferrer"
    className="relative block bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-300 group"
  >
    <ScoreBadge score={job.score} />
    <h3 className="font-bold text-gray-900 pr-24">{job.title}</h3>
    <p className="text-sm text-gray-600 mt-1">{job.company}</p>
    <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
      <MapPin className="w-3 h-3" />
      <span>{job.location}</span>
    </div>
    <ExternalLink className="absolute bottom-4 right-4 w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
  </a>
);

const SmartJobMatching: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResumeText('');
      setError(null);
      setIsDemoMode(false);
      
      if (selectedFile.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          if (ev.target?.result instanceof ArrayBuffer) {
            try {
              const loadingTask = pdfjsLib.getDocument(new Uint8Array(ev.target.result));
              const pdf = await loadingTask.promise;
              let fullText = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
                fullText += pageText + '\n';
              }
              setResumeText(fullText);
            } catch (pdfError) {
              console.error('Error parsing PDF:', pdfError);
              setError("Failed to parse the PDF file. It might be corrupted or protected.");
              setStatus('error');
            }
          }
        };
        reader.onerror = () => {
          setError("Failed to read the PDF file.");
          setStatus('error');
        };
        reader.readAsArrayBuffer(selectedFile);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (typeof ev.target?.result === 'string') {
            setResumeText(ev.target.result);
          }
        };
        reader.onerror = () => {
            setError("Failed to read the file.");
            setStatus('error');
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const findJobs = async () => {
    if (!resumeText.trim()) return;

    setStatus('loading');
    setError(null);
    setJobs([]);
    setIsDemoMode(false);

    try {
      // Attempt to fetch from real backend
      const response = await fetch('http://localhost:5678/webhook-test/resume-job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setStatus('success');
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock data:', err);
      
      // Fallback to mock data with a slight delay to simulate processing
      setTimeout(() => {
          setJobs(MOCK_JOBS);
          setStatus('success');
          setIsDemoMode(true);
          setError('Backend connection failed. Showing demo matches for preview.'); 
      }, 1500);
    }
  };
  
  const renderResults = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="font-semibold text-gray-800">Finding jobs for you...</p>
            <p className="text-sm text-gray-500">This may take a moment.</p>
          </div>
        );
      case 'success':
        return (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Matches For You</h2>
            {isDemoMode && (
              <div className="mb-4 p-3 bg-orange-50 text-orange-800 text-sm rounded-lg flex items-center gap-2 border border-orange-200 animate-fade-in">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span><strong>Demo Mode:</strong> Backend not reachable. Showing example data.</span>
              </div>
            )}
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <JobCard key={`${job.url}-${index}`} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-bold text-gray-800">No Job Matches Found</h3>
                <p className="text-sm text-gray-500 mt-1">Try refining your resume or check back later.</p>
              </div>
            )}
          </>
        );
      case 'error':
        return (
          <div className="text-center py-12 bg-red-50 border border-red-200 rounded-xl">
             <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
             <h3 className="font-bold text-red-800">An Error Occurred</h3>
             <p className="text-sm text-red-600 mt-1 max-w-sm mx-auto">{error}</p>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-bold text-gray-800">Your Future Awaits</h3>
            <p className="text-sm text-gray-500 mt-1">Upload your resume to find job matches.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Smart Job Matching</h1>
        <p className="text-gray-500 mt-1">Let AI find the best job opportunities based on your resume.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 sticky top-8">
          <div className="relative border border-dashed border-gray-300 rounded-xl p-8 text-center group hover:border-primary-500 transition-colors">
            <input 
              type="file" 
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 mx-auto bg-gray-100 group-hover:bg-primary-50 rounded-full flex items-center justify-center transition-colors">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
            </div>
            <p className="font-medium text-gray-800 mt-2">{file ? file.name : 'Upload your resume'}</p>
            <p className="text-xs text-gray-500 mt-1">.pdf, .txt or .md files only</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or paste content</span></div>
          </div>

          <textarea
            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none resize-y text-sm font-mono text-gray-700"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          ></textarea>

          <button
            onClick={findJobs}
            disabled={status === 'loading' || !resumeText.trim()}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Briefcase className="w-5 h-5" />
                Find Matching Jobs
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[600px]">
            {renderResults()}
        </div>
      </div>
    </div>
  );
};

export default SmartJobMatching;