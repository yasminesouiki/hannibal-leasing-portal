import { AuthProvider } from "./context/AuthProvider";
import AppRouter from "./routes/AppRouter";
import "./styles/variables.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

