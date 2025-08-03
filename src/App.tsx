import "./App.css";
import Viewer from "./Viewer";
import TopBar from "./TopBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <TopBar />
        <Viewer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
