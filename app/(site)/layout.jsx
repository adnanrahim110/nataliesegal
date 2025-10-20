import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

