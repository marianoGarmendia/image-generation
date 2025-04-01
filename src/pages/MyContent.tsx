import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BackToHome from '../components/BackToHome';
import toast from 'react-hot-toast';

interface ContentItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  createdAt: string;
}

export default function MyContent() {
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:3000/my-content', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('devToken')}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch content');
        
        const data = await response.json();
        setContent(data);
      } catch (error) {
        toast.error('Error al cargar el contenido');
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-2xl font-bold mb-6 text-white">Mi Contenido</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <Link
                key={item.id}
                to={`/view/${item.id}`}
                className="block bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-48 object-cover" />
                ) : (
                  <img src={item.url} alt="" className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <p className="text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {content.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No tienes contenido guardado</p>
              <Link
                to="/"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Subir contenido
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <BackToHome />
    </div>
  );
}