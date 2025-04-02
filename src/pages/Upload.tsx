import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  ChevronDown,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import Header from "../components/Header";
import BackToHome from "../components/BackToHome";
import toast from "react-hot-toast";
import { useContent } from "../context/ContentContext";

type GenerationType = "background" | "animation" | null;
type BackgroundOption =
  | "marble"
  | "wood"
  | "industrial"
  | "linen"
  | "brick"
  | "counter"
  | "liso"
  | null;

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [generationType, setGenerationType] = useState<GenerationType>(null);
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  const [showAnimationOptions, setShowAnimationOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<BackgroundOption>(null);
  const [selectAnimation, setSelectAnimation] = useState(false);
  const { setContent } = useContent();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsVideo(selectedFile.type.startsWith("video/"));
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      resetOptions();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://72jdmlb6-3500.brs.devtunnels.ms/upload-image",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || localStorage.getItem("devToken")
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const fileName = data.fileName; // Assuming the response contains the file name

      console.log("fileName", fileName);

      toast.success("Archivo subido exitosamente");
      try {
        if (!fileName) throw new Error("File name not found");
        console.log("animation", selectAnimation);
        console.log("background", selectedOption);
        const timeout = 120000; // 2 minutos en milisegundos

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(
          `https://72jdmlb6-3500.brs.devtunnels.ms/remove-background`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") ||
                localStorage.getItem("devToken")
              }`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName,
              background: selectedOption === "liso" ? null : selectedOption,
              animation: selectAnimation,
            }),
            signal: controller.signal,  // Asociar el AbortController con la solicitud
          }
        );

        clearTimeout(timeoutId);  // Limpiar el timeout si la solicitud es exitosa
        const { result_url, type } = await response.json();
        console.log("result_url", result_url);
        console.log("type", type);

        setContent({
          id: data.id,
          url: result_url,
          type: type,
        });
        navigate(`/view/${data.id}`);
      } catch (error:any) {
        if (error.name === 'AbortError') {
          console.error('La solicitud fue cancelada por un timeout');
        } else {
          console.error('Error en la solicitud', error);
        }
        toast.error("Error al eliminar el fondo");
      }
    } catch (error) {
      toast.error("Error al subir el archivo");
      console.error("Upload error:", error);
    }
  };
  const resetOptions = () => {
    setGenerationType(null);
    setSelectedOption(null);
    setShowBackgroundOptions(false);
    setShowAnimationOptions(false);
  };

  const handleOptionSelect = (option: BackgroundOption) => {
    setSelectedOption(option);
    setShowBackgroundOptions(false);
    setShowAnimationOptions(false);
  };

  const handleGenerationTypeSelect = (type: GenerationType) => {
    setGenerationType(type);
    if (type === "background") {
      setShowBackgroundOptions(!showBackgroundOptions);
      setShowAnimationOptions(false);
    } else if (type === "animation") {
      setShowAnimationOptions(!showAnimationOptions);
      setShowBackgroundOptions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-700 rounded-lg p-12">
            <div className="max-w-xl mx-auto text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300">
                  Subir archivo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Seleccionar archivo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {preview && (
              <div className="mt-8 max-w-md mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-lg ">
                  {isVideo ? (
                    <video src={preview} controls className="w-full h-auto" />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto"
                    />
                  )}
                  <div className="p-4 space-y-4 ">
                    {!selectedOption ? (
                      <div className="space-y-3 ">
                        <div className="relative">
                          <button
                            onClick={() =>
                              handleGenerationTypeSelect("background")
                            }
                            className="w-full flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                          >
                            <span>Generar Fondo</span>
                            <ChevronDown size={20} />
                          </button>

                          {showBackgroundOptions && (
                            <div className="absolute w-full mt-1 bg-gray-700 rounded-md shadow-lg z-10 ">
                              <div className="py-1">
                                <button
                                  onClick={() => handleOptionSelect("liso")}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Liso
                                </button>
                                <button
                                  onClick={() => handleOptionSelect("marble")}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Mármol
                                </button>
                                <button
                                  onClick={() => handleOptionSelect("wood")}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Madera
                                </button>
                                <button
                                  onClick={() =>
                                    handleOptionSelect("industrial")
                                  }
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Industrial
                                </button>
                                <button
                                  onClick={() => handleOptionSelect("linen")}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Lino
                                </button>
                                <button
                                  onClick={() => handleOptionSelect("brick")}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Ladrillo
                                </button>
                                <button
                                  onClick={() => handleOptionSelect("counter")}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Mostrador
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            onClick={() =>
                              handleGenerationTypeSelect("animation")
                            }
                            className="w-full flex justify-between items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                          >
                            <span>Generar Fondo + Animación</span>
                            <ChevronDown size={20} />
                          </button>

                          {showAnimationOptions && (
                            <div className="absolute w-full mt-1 bg-gray-700 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleOptionSelect("liso");
                                    setSelectAnimation(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Liso
                                </button>
                                <button
                                  onClick={() => {
                                    handleOptionSelect("marble");
                                    setSelectAnimation(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Mármol
                                </button>
                                <button
                                  onClick={() => {
                                    handleOptionSelect("wood");
                                    setSelectAnimation(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Madera
                                </button>
                                <button
                                  onClick={() => {
                                    handleOptionSelect("industrial");
                                    setSelectAnimation(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Industrial
                                </button>
                                <button
                                  onClick={() => {
                                    handleOptionSelect("linen");
                                    setSelectAnimation(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Lino
                                </button>
                                <button
                                  onClick={() => {
                                    handleOptionSelect("brick");

                                    setSelectAnimation(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Ladrillo
                                </button>
                                <button
                                  onClick={() => {
                                    handleOptionSelect("counter");

                                    setSelectAnimation(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                                >
                                  Mostrador
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={resetOptions}
                          className="flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          <ArrowLeft size={16} className="mr-1" />
                          Volver atrás
                        </button>
                        <button
                          onClick={handleUpload}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                        >
                          Crear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BackToHome />
    </div>
  );
}
