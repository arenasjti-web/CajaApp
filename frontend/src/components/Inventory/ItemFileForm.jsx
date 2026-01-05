import React from 'react'

const preview = "/dropfile.png";

export const ItemFileForm = () => {
    const [file,setFile] = React.useState(false)
    
    const handleSubmit = ()=>{
        
    }
    const handleFileChange = (e)=>{
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);
    }
   return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <figure className="w-1/2 h-auto overflow-hidden rounded-lg ">
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover transition-all duration-300"
        />
      </figure>

      <input
        type="file"
        accept="image/*"
        className="file-input file-input-ghost w-full max-w-xs"
        onChange={handleFileChange}
      />

      <button
        type="submit"
        className="btn btn-primary w-full max-w-xs"
        disabled={!file}
      >
        Subir Imagen
      </button>
    </form>
  );
}
