import React from 'react'
import { NavBar } from '../components/navbar/NavBar'
import { NewItemForm } from '../components/Inventory/NewItemForm'
import { ItemFileForm } from '../components/Inventory/ItemFileForm'
import { BrandProviderForm } from '../components/Inventory/BrandProviderForm'
import { useParams } from 'react-router'

export const ItemPage = () => {

    const { sku } = useParams()
    const [activeTab, setActiveTab] = React.useState(0)

   

    

  return (
    <div className='flex flex-1 h-screen bg-base-200'>
        <NavBar></NavBar>
        <main className='flex flex-1 items-center justify-center'>
            <div className='card bg-base-100 w-full  sm:max-w-md md:max-w-lg lg:max-w-3xl
             shadow-xl mx-auto'>
                
                <div className='card-body '>
                     {/* Tabs */}
                     { !sku &&
                        <div className="tabs tabs-lift" role='tablist'>
                            <a
                                role='tab'
                                className={`tab tab-lifted ${activeTab === 0 ? "tab-active" : ""}`}
                                onClick={() => setActiveTab(0)}
                            >
                                Ingresar Producto
                            </a>
                            <a
                                role='tab'  
                                className={`tab tab-lifted ${activeTab === 1 ? "tab-active" : ""}`}
                                onClick={() => setActiveTab(1)}
                            >
                                Ingresar desde Archivo
                            </a>
                            <a
                                role='tab'
                                className={`tab tab-lifted ${activeTab === 2 ? "tab-active" : ""}`}
                                onClick={() => setActiveTab(2)}
                            >
                                Ingresar Proveedor/Marca
                            </a>
                        </div>
                     }
                    {/** forms*/}
                    {activeTab === 0 && <NewItemForm {...(sku && { sku })} ></NewItemForm>}
                    {activeTab === 1 && <ItemFileForm></ItemFileForm>}
                    {activeTab === 2 && <BrandProviderForm></BrandProviderForm>}
                    

                </div>

            </div>
        </main>

    </div>
  )
}
