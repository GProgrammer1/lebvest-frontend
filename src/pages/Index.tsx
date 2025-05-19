
import LandingPage from "@/components/LandingPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
