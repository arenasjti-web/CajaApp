import React from 'react'
import Papa from "papaparse";
import api from '../../lib/axios'
import toast from 'react-hot-toast';
import { Copy,AlertCircle  } from 'lucide-react';
import {SelectBrands }from "../generic/SelectBrands"
import { SelectProviders } from '../generic/SelectProviders';
import { SelectCategories } from '../generic/SelectCategories';
const preview = "/dropfile.png";

export const ItemFileForm = () => {
  const [file,setFile] = React.useState(null)
  const [csvData, setCsvData] = React.useState([]);
  const [csvHeaders, setCsvHeaders] = React.useState([]);
  const [csvError, setCsvError] = React.useState(null);
  const [value, setValue] = React.useState("")
  const formRef = React.useRef(null)
  // Headers obligatorios
  const expectedHeaders = ["sku","name", "price", "stock","lowStockThreshold"];
  const optionalHeaders =["category","brand(Marca)","provider(Proveedor)","unit(Unidad en caso que se venda por esta)","ppu(Precio Por unidad)","items(En caso de que sea pack)"];

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if(!file) return 

      setFile(file)// asi me aseguro que haya solo un archivo dando vueltas
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(), // normaliza
        complete: (results) => {
          setCsvHeaders(results.meta.fields); // headers detectados
          setCsvData(results.data);            // filas parseadas
        },
        error: (err) => {
          setCsvError(err.message);
        }
      });
    };

    function validateHeaders(){
      
      if (!csvHeaders) return false;

      const missing = expectedHeaders.filter(h => !csvHeaders.includes(h.trim()));
      
      if (missing.length > 0) {
        setCsvError(`Faltan headers: ${missing.join(", ")}`);
        console.log("en headers")
        return false;
      }
        return true;
    }

    function validateData(){
      const errors = [];
      csvData.forEach((row, index) => {
        // console.log(row)
        if (!row.name) errors.push(`Fila ${index + 1}: name vacío`);
        if (!row.price || !isValidNumber(row.price)) errors.push(`Fila ${index + 1}: price inválido`);
        if (!row.stock || !isValidNumber(row.stock)) errors.push(`Fila ${index + 1}: stock inválido`);
        if (!row.lowStockThreshold || !isValidNumber(row.lowStockThreshold)) errors.push(`Fila ${index + 1}: lowstockthreshold inválido`);
        // ojo que el parser me transformó todo a minusculas los headers
      });

      if (errors.length > 0) {
        setCsvError(errors.join("\n"));
        console.log("en data")
        return false;
      }
      return true;
    }
    const isValidNumber = (value) => {
      console.log(value, typeof value)
      console.log(...value)
        if (value === null || value === undefined) return false
        if (String(value).trim() === "") return false
        return !isNaN(Number(value))
    }


    const handleSubmit = async (e)=>{
         e.preventDefault()
        if(  !validateHeaders()||!validateData()) 
        {
          toast.error("problema con el csv")
          console.log(csvError)
          return
        }
        try {
          const formData = new FormData()
          formData.append("file", file) // file = File del input type="file"
          const result = await api
                               .post("/inventory/importCsv", formData, {
                                    headers: {
                                        "Content-Type": "multipart/form-data"
                                    }
                                })

          toast.success("CSV Importado con éxito!")
          console.log(result.data.errors)
          console.log(result.data.insertedCount)
        } catch (error) {
          toast.error("Error al importar CSV")
          console.log(error)
        }
        finally{
          // mostrar los errores
         
        }
    }
   return (
    <form
  onSubmit={handleSubmit}
  ref={formRef}
  className="flex flex-col items-center gap-6 w-full"
>
  {/* Preview */}
  <figure className="w-full max-w-md overflow-hidden rounded-lg">
    <img
      src={preview}
      alt="Preview"
      className="w-full h-full object-cover"
    />
  </figure>

  {/* Copiar headers */}
  <div className="flex flex-wrap justify-center gap-4">
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="btn btn-ghost btn-xs"
        onClick={() =>
          navigator.clipboard.writeText(expectedHeaders.join("\t"))
        }
      >
        <Copy size={14} />
      </button>
      <span className="text-sm">Headers necesarios</span>
    </div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        className="btn btn-ghost btn-xs"
        onClick={() =>
          navigator.clipboard.writeText(optionalHeaders.join("\t"))
        }
      >
        <Copy size={14} />
      </button>
      <span className="text-sm">Headers adicionales</span>
    </div>
  </div>
  {/* Disclaimer */}
  <div className="flex items-center gap-2 text-sm text-gray-500 max-w-3xl">
    <AlertCircle size={16} className="shrink-0" />
    <span>
      Puedes copiar desde aquí los valores válidos para estos campos del CSV.
    </span>
  </div>
     
  {/* Selects guía */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 w-full max-w-3xl">
    {/* Brand */}
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="btn btn-ghost btn-xs"
        onClick={() => {
          const data = new FormData(formRef.current)
          navigator.clipboard.writeText(data.get("brand"))
        }}
      >
        <Copy size={20} />
      </button>
      <SelectBrands setValue={setValue} />
    </div>

    {/* Provider */}
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="btn btn-ghost btn-xs"
        onClick={() => {
          const data = new FormData(formRef.current)
          navigator.clipboard.writeText(data.get("provider"))
        }}
      >
        <Copy size={20} />
      </button>
      <SelectProviders setValue={setValue} />
    </div>

    {/* Category */}
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="btn btn-ghost btn-xs"
        onClick={() => {
          const data = new FormData(formRef.current)
          navigator.clipboard.writeText(data.get("category"))
        }}
      >
        <Copy size={20} />
      </button>
      <SelectCategories setValue={setValue} />
    </div>
  </div>

  {/* Archivo */}
  <input
    type="file"
    accept="image/*"
    className="file-input file-input-ghost w-full max-w-xs"
    onChange={handleFileChange}
  />

  {/* Submit */}
  <button
    type="submit"
    className="btn btn-primary w-full max-w-xs"
    disabled={!file}
  >
    Subir archivo
  </button>
</form>

  );
}
