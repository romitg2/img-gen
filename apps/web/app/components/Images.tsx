interface ImageGridProps {
  images: string[];
}

const ImageGrid = ({ images }: ImageGridProps) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", padding: "16px" }}>
      {images.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`image ${index + 1}`}
          style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", objectFit: "cover" }}
        />
      ))}
    </div>
  );
};

export default ImageGrid;