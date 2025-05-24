import React, { useState } from 'react';
import './App.css';
import {
  bruteForceSearch,
  horspoolSearch,
  boyerMooreSearch,
} from './utils/algorithms';
import codonMap from './utils/codonMap';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import CodonViewer from './CodonViewer';


function App() {
  const [dnaSequence, setDnaSequence] = useState('');
  const [pattern, setPattern] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState({
    bruteForce: true,
    horspool: true,
    boyerMoore: true,
  });
  const [results, setResults] = useState([]);

  const runAnalysis = () => {
    if (!dnaSequence || !pattern) {
      alert("Please enter both a DNA sequence and a pattern.");
      return;
    }

    const newResults = [];

    if (selectedAlgorithms.bruteForce) {
      const start = performance.now();
      const matches = bruteForceSearch(dnaSequence, pattern);
      const end = performance.now();
      newResults.push({
        name: "Brute-Force",
        matches,
        count: matches.length,
        time: (end - start).toFixed(2),
      });
    }

    if (selectedAlgorithms.horspool) {
      const start = performance.now();
      const matches = horspoolSearch(dnaSequence, pattern);
      const end = performance.now();
      newResults.push({
        name: "Horspool",
        matches,
        count: matches.length,
        time: (end - start).toFixed(2),
      });
    }

    if (selectedAlgorithms.boyerMoore) {
      const start = performance.now();
      const matches = boyerMooreSearch(dnaSequence, pattern);
      const end = performance.now();
      newResults.push({
        name: "Boyer-Moore",
        matches,
        count: matches.length,
        time: (end - start).toFixed(2),
      });
    }

    setResults(newResults);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.fasta')) {
      alert('Only .txt or .fasta files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result.toUpperCase().replace(/[^ATCGN]/g, '');
      setDnaSequence(text);
    };
    reader.readAsText(file);
  };

  const toggleAlgorithm = (algo) => {
    setSelectedAlgorithms((prev) => ({
      ...prev,
      [algo]: !prev[algo],
    }));
  };

  const clearAll = () => {
    setDnaSequence('');
    setPattern('');
    setSelectedAlgorithms({
      bruteForce: true,
      horspool: true,
      boyerMoore: true,
    });
    setResults([]);
  };

  const getCodonColor = (codon) => {
    if (codon === "ATG") return "bg-green-200 text-green-800";
    if (["TAA", "TAG", "TGA"].includes(codon)) return "bg-red-200 text-red-800";
    return "bg-blue-100 text-blue-900";
  };

  return (
    <div className="app">
      <h1>DNA Pattern Matching Laboratory</h1>
      <div className="input-panel">
        <h2>DNA Sequence Input</h2>
        <textarea
          id="dna-sequence-input"
          placeholder="Paste or upload your DNA sequence (A/T/C/G/N)..."
          value={dnaSequence}
          onChange={(e) => setDnaSequence(e.target.value.toUpperCase())}
          rows={10}
          cols={50}
        />
        <p>Character Count: {dnaSequence.length}</p>
        <input type="file" accept=".txt,.fasta" onChange={handleFileUpload} />

        <h2>Pattern Input</h2>
        <input
          id="pattern-input"
          type="text"
          placeholder="Enter DNA pattern to search (A/T/C/G/N)..."
          value={pattern}
          onChange={(e) => setPattern(e.target.value.toUpperCase())}
        />

        <h2>Select Algorithms</h2>
        <label>
          <input
            type="checkbox"
            checked={selectedAlgorithms.bruteForce}
            onChange={() => toggleAlgorithm('bruteForce')}
          />
          Brute-Force
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedAlgorithms.horspool}
            onChange={() => toggleAlgorithm('horspool')}
          />
          Horspool
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedAlgorithms.boyerMoore}
            onChange={() => toggleAlgorithm('boyerMoore')}
          />
          Boyer-Moore
        </label>

        <div className="buttons">
          <button>Step Mode</button>
          <button onClick={clearAll}>Clear All</button>
          <button onClick={runAnalysis}>Run Analysis</button>
        </div>

        {results.length > 0 && (
  <div className="results-summary">
    <h2>Results Summary</h2>
    <div className="results-container">
      {results.map((res, idx) => (
       <div key={idx} className="result-card">
  <h3>{res.name}</h3>
  <p><strong>Matches Found:</strong> {res.count}</p>
  <p><strong>Match Positions:</strong> {res.matches.join(', ') || 'None'}</p>
  <p><strong>Time Taken:</strong> {res.time} ms</p>
  <CodonViewer
    sequence={dnaSequence}
    matches={res.matches}
    patternLength={pattern.length}
  />
</div>

      ))}
    </div>
  </div>
)}


        {results.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "ms", angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="time" fill="#3b82f6" name="Execution Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {dnaSequence.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">DNA Codon Viewer</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {(dnaSequence.match(/.{1,3}/g) || []).map((codon, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-2 text-center ${getCodonColor(codon)}`}
                >
                  <p className="font-mono text-lg font-semibold">{codon}</p>
                  <p className="text-sm">{codonMap[codon] || 'Unknown'}</p>
                  
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
