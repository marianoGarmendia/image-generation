
import { useParams, useNavigate } from "react-router-dom";
import { Download, Trash2, Save } from "lucide-react";
import Header from "../components/Header";
import BackToHome from "../components/BackToHome";
import {useContent } from "../context/ContentContext";
import toast from "react-hot-toast";
import { useEffect } from "react";



export default function ViewContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {  content , setContent} = useContent();
  const {background, animation} = content
  // const [content, setContent] = useState<Content | null>(null);

 

  useEffect(() => {

    const get_content = async () => {
      
      try {
        console.log("useEffect removeBackground");
        if(!id) return;
        console.log("fileName", id);
        console.log("animation", animation);
        console.log("background", background);
        
        
        const content = await fetch(`https://imagemotionapp-production.up.railway.app/remove-background`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || localStorage.getItem("devToken")
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            fileName:  id,
            animation ,
            background: background === "liso" ? false : true
           }),
        })
        const data = await content.json();
        const {result_url , type} = data
        setContent({url: result_url, type})

        toast.success("Contenido cargado");
      } catch (error) {
        
      }
    }
    get_content()
  }, [id]);

  const handleDownload = () => {
    if (content?.url) {
      window.open(content.url, "_blank");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://imagemotionapp-production.up.railway.app/content/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || localStorage.getItem("devToken")
          }`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Contenido eliminado");
      navigate("/my-content");
    } catch (error) {
      toast.error("Error al eliminar el contenido");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/content/${id}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || localStorage.getItem("devToken")
          }`,
        },
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Contenido guardado");
    } catch (error) {
      toast.error("Error al guardar el contenido");
    }
  };

  if (!content) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {content.url ? (
              content.type === "image" ? (
                <img src={content.url} alt="Contenido" />
              ) : content.type === "video" ? (
                <video controls>
                  <source src={content.url} type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
              ) : null
            ) : (
              <p>Cargando...</p>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download size={20} className="mr-2" />
                Descargar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Save size={20} className="mr-2" />
                Guardar
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 size={20} className="mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </main>

      <BackToHome />
    </div>
  );
}
