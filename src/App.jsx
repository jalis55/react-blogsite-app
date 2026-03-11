import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import Write from "./pages/Write";
import Dashboard from "./pages/Dashboard";
import EditPost from "./pages/EditPost";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<BlogPost />} />
            <Route path="/write" element={<Write />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
