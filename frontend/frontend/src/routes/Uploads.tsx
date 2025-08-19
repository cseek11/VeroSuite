import { useState } from 'react';
import { presignUpload } from '@/lib/api';

export default function Uploads() {
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function onSelect(file: File) {
    setUploading(true);
    try {
      const presign = await presignUpload(file.name, file.type);
      await fetch(presign.uploadUrl, { method: presign.method, headers: presign.headers, body: file });
      setFiles((prev) => [presign.fileUrl, ...prev]);
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Uploads</h1>
      <label className="block">
        <span className="text-sm">Select image</span>
        <input className="block mt-1" type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files && onSelect(e.target.files[0])} />
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((url) => (
          <div key={url} className="bg-white shadow rounded overflow-hidden">
            <img src={url} alt="Uploaded" className="w-full h-40 object-cover" />
            <div className="p-2 text-xs break-all">{url}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
