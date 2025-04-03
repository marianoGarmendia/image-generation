import { useParams } from "react-router-dom";
import { Download, Trash2, Save, Loader2 } from "lucide-react";
import Header from "../components/Header";
import BackToHome from "../components/BackToHome";
import { useContent } from "../context/ContentContext";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

export default function ViewContent() {
  const { id } = useParams<{ id: string }>();
 
  const { content, setContent , status ,setStatus } = useContent();
  
  const valorRef = useRef(false);
  const valor = valorRef.current;

  // const [content, setContent] = useState<Content | null>(null);

  // useEffect(() => {
  //   if (valorRef.current) return;
  //   const get_content = async () => {
  //     try {
  //       console.log("useEffect removeBackground");
  //       if (!id) return;
  //       if (!content) return;

  //       console.log("fileName", id);
  //       console.log("animation", content.animation);
  //       console.log("background", content.background);

  //       const contentRes = await fetch(
  //         `https://imagemotionapp-production.up.railway.app/remove-background`,
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${
  //               localStorage.getItem("token") ||
  //               localStorage.getItem("devToken")
  //             }`,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             fileName: id,
  //             animation: content.animation,
  //             background:
  //               content.background === "liso" ? false : content.background,
  //           }),
  //         }
  //       );
  //       const data = await contentRes.json();
  //       const { jobId, status } = data;
  //       setStatus({id: jobId, status});
  //       // setContent({ url: result_url, type });
  //       valorRef.current = jobId;
  //       toast.success("Contenido cargado");
  //     } catch (error) {}
  //   };
  //   get_content();
  // }, [id]);


  // Polling cada 10 segundos
  useEffect(() => {
    if (!status) return;

    const interval = setInterval(async () => {
      const res = await fetch(`https://imagemotionapp-production.up.railway.app/job/${status.id}`);
      const data = await res.json();

      if (data.status === "done") {
       
        setContent({ url: data.result_url, type: data.type });
        clearInterval(interval);
        toast.success("¡Contenido listo!");
      } else {
        console.log("⏳ Procesando...");
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [status]);

  const handleDownload = () => {
    if (content?.url) {
      window.open(content.url, "_blank");
    }
  };

  const handleDelete = async () => {
    setContent(null);
    // try {
    //   const response = await fetch(
    //     `https://imagemotionapp-production.up.railway.app/content/${id}`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${
    //           localStorage.getItem("token") || localStorage.getItem("devToken")
    //         }`,
    //       },
    //     }
    //   );

    //   if (!response.ok) throw new Error("Failed to delete");

    //   toast.success("Contenido eliminado");
    //   navigate("/my-content");
    // } catch (error) {
    //   toast.error("Error al eliminar el contenido");
    // }
  };

  const handleSave = async () => {
    toast.success("Estamos construyendo esta funcionalidad");
    // try {
    //   const response = await fetch(`http://localhost:3000/content/${id}/save`, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${
    //         localStorage.getItem("token") || localStorage.getItem("devToken")
    //       }`,
    //     },
    //   });

    //   if (!response.ok) throw new Error("Failed to save");

    //   toast.success("Contenido guardado");
    // } catch (error) {
    //   toast.error("Error al guardar el contenido");
    // }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {status?.status === "done" && content.url ? (
              content.type === "image" ? (
                <img src={content.url} alt="Contenido" />
              ) : content.type === "video" ? (
                <video controls>
                  <source src={content.url} type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
              ) : null
            ) : (
              <div className="flex flex-col items-center justify-center h-64 space-y-2">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-gray-400 text-sm">
                   {valor ? "Volver atras" : "Cargando contenido... puede demorar unos minutos"}{" "}
                </p>
              </div>
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
