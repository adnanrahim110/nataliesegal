import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import Popup from "@/components/layouts/Popup";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <Popup />
    </>
  );
}
