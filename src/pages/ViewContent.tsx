
import { useParams, useNavigate } from "react-router-dom";
import { Download, Trash2, Save } from "lucide-react";
import Header from "../components/Header";
import BackToHome from "../components/BackToHome";
import {useContent } from "../context/ContentContext";
import toast from "react-hot-toast";



export default function ViewContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {  content } = useContent();
  // const [content, setContent] = useState<Content | null>(null);

  // useEffect(() => {
  //   const fetchContent = async () => {
  //     try {
  //       console.log(`Fetching content with ID: ${id}`);
  //       if (!id) {
  //         toast.error("ID no válido");
  //         navigate("/");
  //         return;
  //       }

  //       const response = await fetch(
  //         `https://72jdmlb6-3500.brs.devtunnels.ms/images/${id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${
  //               localStorage.getItem("token") ||
  //               localStorage.getItem("devToken")
  //             }`,
  //           },
  //         }
  //       );
  //       if (!response.ok) throw new Error("Failed to fetch content");

  //       // Verificar si la respuesta es una imagen o un JSON
  //       const contentType = response.headers.get("Content-Type");

  //       if (contentType && contentType.includes("application/json")) {
  //         // Si la respuesta es un JSON, la parseamos como tal
  //         const data = await response.json();
  //         setContent(data);
  //       } else if (contentType && contentType.includes("image")) {
  //         // Si la respuesta es una imagen, la manejamos de otra forma
  //         const imageBlob = await response.blob();
  //         const imageUrl = URL.createObjectURL(imageBlob);
  //         setContent({
  //           id, // Asignar el ID recibido desde el parámetro
  //           url: imageUrl, // URL de la imagen generada
  //           type: "image", // Especificar que es una imagen
  //         });
  //       } else if (contentType && contentType.includes("video")) {
  //         // Si la respuesta es un video
  //         const videoBlob = await response.blob();
  //         const videoUrl = URL.createObjectURL(videoBlob);

  //         setContent({
  //           id, // El ID del contenido
  //           url: videoUrl, // URL del video
  //           type: "video", // Tipo de contenido: 'video'
  //         });
  //       } else {
  //         throw new Error("Unexpected content type");
  //       }
  //     } catch (error) {
  //       toast.error("Error al cargar el contenido");
  //       navigate("/");
  //     }
  //   };

  //   fetchContent();
  // }, [id, navigate]);



  const handleDownload = () => {
    if (content?.url) {
      window.open(content.url, "_blank");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/content/${id}`, {
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
            {content ? (
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
