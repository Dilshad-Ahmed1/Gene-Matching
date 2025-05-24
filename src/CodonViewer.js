// CodonViewer.js
import React from 'react';
import './CodonViewer.css';

const CodonViewer = ({ sequence, matches, patternLength }) => {
  const codons = [];
  const matchedIndices = new Set();

  matches.forEach((index) => {
    for (let i = index; i < index + patternLength; i++) {
      matchedIndices.add(i);
    }
  });

  for (let i = 0; i < sequence.length; i += 3) {
    const codon = sequence.slice(i, i + 3);
    const codonIndices = [i, i + 1, i + 2];
    const isMatched = codonIndices.some((idx) => matchedIndices.has(idx));

    codons.push(
      <span
        key={i}
        className={`codon ${isMatched ? 'match' : i % 6 === 0 ? 'even' : 'odd'}`}
      >
        {codon}
      </span>
    );
  }

  return (
    <div className="codon-viewer">
      <strong>Sequence:</strong>
      <div className="codon-line">{codons}</div>
    </div>
  );
};

export default CodonViewer;
