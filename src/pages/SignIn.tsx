import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Asegúrate de importar tu AuthContext
import { useNavigate } from "react-router";

const SignIn = () => {
  const { login, loading } = useAuth(); // Obtén la función login y el estado loading del contexto
  const [email, setEmail] = useState(""); // Estado para el email
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente

    setError(null); // Limpia cualquier error previo

    try {
      const result = await login(email, password); // Llama a la función login del contexto
      if (result) navigate('/')
      // Si el login es exitoso, puedes redirigir al usuario o hacer otras acciones
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales."); // Muestra un mensaje de error
      console.error(err);
    }
  };

  return (
    <div className="w-full h-screen flex bg-orange-300">
      <form
        onSubmit={handleSubmit}
        className="m-auto p-6 rounded-2xl bg-white shadow-lg shadow-black/40 w-[90%] max-w-[400px] text-xl font-semibold"
      >
        <h1 className="mb-4 text-3xl font-extrabold text-center">File It</h1>

        {/* Campo de email */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg w-full p-2 my-2 border"
          required
        />

        {/* Campo de contraseña */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg w-full p-2 my-2 border"
          required
        />

        {/* Mostrar mensaje de error si existe */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={loading} // Deshabilita el botón mientras se carga
          className="w-full bg-black text-white p-2 rounded-lg mt-4 disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;