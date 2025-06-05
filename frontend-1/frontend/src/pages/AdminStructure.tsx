// src/pages/AdminStructure.tsx
import { useState } from 'react';
import api from '../api/axios';

export default function AdminStructure() {
  const [rawText, setRawText] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [structured, setStructured] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStructure = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/ai/structure-doc', { rawText });
      setStructured(res.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Content Structuring</h1>
      <textarea
        rows={10}
        className="w-full p-2 border rounded mb-4"
        placeholder="Paste the official documentation or raw text here..."
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />

      <button
        onClick={handleStructure}
        disabled={loading || rawText.length < 50}
        className="btn btn-primary mb-4"
      >
        {loading ? 'Structuring...' : 'Structure with AI'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {structured && (
        <div className="bg-gray-100 p-4 rounded overflow-auto">
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(structured, null, 2)}
          </pre>
          {/* Here you could render a form to edit modules/lessons before saving */}
        </div>
      )}
    </div>
  );
}
