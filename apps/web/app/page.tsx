'use client';

import { useEffect, useState } from 'react';
import { getGeneratedImageForUser } from './api/images/util';
import { GeneratedImage } from './api/images/route';

interface ImageGridProps {
  images: string[];
}

const ImageGrid = ({ images }: ImageGridProps) => {
  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `generated-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", padding: "16px" }}>
      {images.map((url, index) => (
        <div key={index} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "8px" }}>
          <img
            src={url}
            alt={`image ${index + 1}`}
            style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", objectFit: "cover" }}
          />
          <button
            onClick={() => handleDownload(url, index)}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
              transition: "background-color 0.2s",
              width: "100%",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007BFF"}
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
};


const Home = () => {
  const prompt = "Select your favorite programming language:";
  const options = [
    { label: "romit's model", value: "https://v3.fal.media/files/lion/FnLjyI4t2h7hB-1lv3q1O_pytorch_lora_weights.safetensors" },
  ];

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [urls, setUrls] = useState<string[]>(["https://v3.fal.media/files/rabbit/VLmypZTQ_kN6sSMQx2y2j_9daa8b7196074418b68fc478d292db49.jpg"]);
  
  useEffect(() => {
    const fetchImages = async () => {
      const images = await fetch('/api/images').then(res => res.json());
      console.log(images);
      if (Array.isArray(images)) {
        setUrls((prev) => [...prev, ...images]);
      }
      console.log("urls: ", urls);
    };
    fetchImages();
  }, []);

  async function fetchImageData(lora: string, prompt: string): Promise<any> {
    try {

      const response = await fetch('/api/generate', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lora, prompt })
      }).then(res => res.json());

      setUrls((prev) => [...prev, (response.data.images[0].url)]);
      return response;
    } catch (error) {
      console.log("error");
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption && imagePrompt) {
      alert(`You selected: ${selectedOption}\nImage Prompt: ${imagePrompt}`);
    }

    const data = await fetchImageData(selectedOption, imagePrompt);
    console.log("data: ", data);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '0 auto' }}>
        <label style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{prompt}</label>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '16px' }}
        >
          <option value="" disabled>Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Enter Image Prompt:</label>
        <input
          type="text"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '16px' }}
          placeholder="Describe an image"
        />

        <button
          type="submit"
          style={{ width: '100%', backgroundColor: selectedOption && imagePrompt ? '#007BFF' : '#ccc', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: selectedOption && imagePrompt ? 'pointer' : 'not-allowed' }}
          disabled={!selectedOption || !imagePrompt}
        >
          Submit
        </button>
      </form>
      <ImageGrid images={urls} />
    </>
  );
};

const Page = () => {

  return (
    <>
      <Home />

    </>
  )

}

export default Page;