import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ServicesSection />
      <BookingSection />
      <Footer />
    </div>
  );
};

export default Index;
