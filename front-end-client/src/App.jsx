import React, { useState } from 'react';
import { Upload, FileText, Send, Cpu, Layers } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Function to upload file to Spring Boot Backend
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus('Processing vector embedding...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setStatus(res.ok ? 'Data vectorized successfully!' : `Failed: ${data.message}`);
    } catch (err) {
      setStatus('Error contacting backend server.');
    } finally {
      setUploading(false);
    }
  };

  // Function to send query to Spring Boot Backend
  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const userPrompt = query;
    setMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/api/analysis/query?question=${encodeURIComponent(userPrompt)}`);
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error contacting analytics server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f1f5f9', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers color="#0ea5e9" /> Financial RAG Engine
        </h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Upload Section */}
        <aside style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3>Upload Document</h3>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ margin: '1rem 0', width: '100%' }} />
          <button onClick={handleUpload} disabled={!file || uploading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0ea5e9', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            {uploading ? 'Processing...' : 'Upload & Embed'}
          </button>
          {status && <p style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '1rem' }}>{status}</p>}
        </aside>

        {/* Chat Section */}
        <main style={{ backgroundColor: '#111827', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: m.role === 'user' ? '#0ea5e9' : '#1e293b', borderRadius: '4px' }}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleQuery} style={{ padding: '1rem', borderTop: '1px solid #1e293b', display: 'flex' }}>
            <input value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#1e293b', color: '#fff', border: 'none' }} placeholder="Ask about the document..." />
            <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}><Send size={16} /></button>
          </form>
        </main>
      </div>
    </div>
  );
}