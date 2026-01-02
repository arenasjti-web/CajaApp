import React from 'react'
import { NavBar } from '../components/navbar/NavBar'
import { Login } from '../components/auth/Login';
import { Signin } from '../components/auth/Signin';
import api from '../lib/axios'
import toast from "react-hot-toast"
import { useNavigate } from 'react-router';
export const AuthPage = () => {

    // para saber si está logeando o registrandose
    const [mode, setMode] = React.useState("login")
    const [loading, setLoading] = React.useState(false)
    const [disable,setDisabled]= React.useState(true);

    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        username: "" // solo usado en signin
    })
    
    const navigate = useNavigate()

    const fetchAuth = async ()=>{
        try {
            
            const res = await api.post("/auth/login", {
                username: formData.username,
                password: formData.password
            })
            // guardar el token en caso de funcionar
            localStorage.setItem("token", res.data.token)
            api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
            navigate("/Home")
            
        } catch (error) {
            if(error.response?.status === 404){

                console.log("User does not exist")
                toast.error("Usuario no existe")
            }
            else{
                console.log("Internal server error")
            }

        }
    }

    const createUser = async ()=>{
        try {
            const res =  await api.post("/signin")
            toast.success("Usuario Creado")
        } catch (error) {
            console.log("Error creating new User")
            toast.error("No se pudo crear el usuario")
        }
        finally{
            //clearForm()
            //navigate/ refresh aquí para volver a login
        }
    }
        

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (mode === "login") {
            await fetchAuth()
            
        } else {
            await createUser()
        }
    }


    // limpio la data al cambiar de modo
    React.useEffect(() => {
    setFormData({
        email: "",
        password: "",
        username: ""
    })
    }, [mode])


return (
    <div className='flex flex-1 h-screen bg-base-200'>
        <NavBar></NavBar>
        <main className="flex flex-1 items-center justify-center ">

            <div className="card w-full max-w-sm sm:max-w-md md:max-w-lg
            bg-base-100 shadow-xl mx-auto">
                <div className="card-body">
                    <h2 className="card-title">
                    {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
                    {mode === "signup" && (
                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={ e => setFormData({...formData,email:e.target.value})}
                        />
                    )}

                    <input
                        type="text"
                        placeholder="Nombre"
                        className="input input-bordered  w-full"
                        id='username'
                        name='username'
                        value={formData.username}
                        onChange={ e => setFormData({...formData,username:e.target.value})}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input input-bordered  w-full"
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={ e => setFormData({...formData,password:e.target.value})}
                    />

                    <button type= "submit" className="btn btn-primary mt-2">
                        {mode === "login" ? "Entrar" : "Registrarse"}
                    </button>
                    </form>

                    <button
                    type="button"
                    className="btn btn-ghost btn-sm mt-2"
                    onClick={() =>
                        setMode(mode === "login" ? "signup" : "login")
                    }
                    >
                    {mode === "login"
                        ? "¿No tienes cuenta? Regístrate"
                        : "¿Ya tienes cuenta? Inicia sesión"}
                    </button>
                </div>
            </div>
        </main>
    

      

    </div>
  )
}
