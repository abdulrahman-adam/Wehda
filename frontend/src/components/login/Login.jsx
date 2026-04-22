import React from 'react'
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const Login = () => {
    const { setShowUserLogin, axios, setUser, navigate } = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

            if (data.success) {
                navigate("/");
                setUser(data.user);
                setShowUserLogin(false);
                toast.success(state === "login" ? "Connexion réussie !" : "Votre compte a été créé avec succès !");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        /* FIX: Ajout de fixed, inset-0, et z-index élevé pour couvrir tout l'écran */
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowUserLogin(false)}
        >
            <form 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className="relative flex flex-col gap-4 items-start p-8 py-10 w-full max-w-[380px] text-gray-600 rounded-2xl shadow-2xl border border-gray-100 bg-white animate-in fade-in zoom-in duration-300"
            >
                {/* Bouton de fermeture avec icône Bootstrap */}
                <button 
                    type="button"
                    onClick={() => setShowUserLogin(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <i className="bi bi-x-lg text-xl"></i>
                </button>

                <p className="text-2xl font-bold m-auto mb-2">
                    <span className="text-indigo-600">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p className="text-sm font-semibold mb-1">Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="John Doe" className="border border-gray-200 rounded-lg w-full p-2.5 outline-indigo-500 bg-gray-50" type="text" required />
                    </div>
                )}
                
                <div className="w-full">
                    <p className="text-sm font-semibold mb-1">Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="example@mail.com" className="border border-gray-200 rounded-lg w-full p-2.5 outline-indigo-500 bg-gray-50" type="email" required />
                </div>

                <div className="w-full">
                    <p className="text-sm font-semibold mb-1">Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" className="border border-gray-200 rounded-lg w-full p-2.5 outline-indigo-500 bg-gray-50" type="password" required />
                </div>

                <button className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white w-full py-3 rounded-lg font-bold shadow-lg mt-2">
                    {state === "register" ? "Create Account" : "Login"}
                </button>

                {state === "register" ? (
                    <p className="text-sm m-auto">
                        Already have an account? <span onClick={() => setState("login")} className="text-indigo-600 font-bold cursor-pointer hover:underline">Click here</span>
                    </p>
                ) : (
                    <p className="text-sm m-auto">
                        Create an account? <span onClick={() => setState("register")} className="text-indigo-600 font-bold cursor-pointer hover:underline">Click here</span>
                    </p>
                )}
            </form>
        </div>
    );
}

export default Login;