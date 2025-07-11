import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 border-t border-border/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-gradient">
                  Bella Nails
                </h3>
                <p className="text-xs text-muted-foreground">Salón de Belleza</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              El mejor salón de belleza en Hermosillo. Especialistas en manicure, 
              pedicure y diseño de uñas con más de 5 años de experiencia.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Av. Revolución #123</p>
                  <p className="text-sm text-muted-foreground">Centro, Hermosillo, Son.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <p className="text-sm">(662) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-sm">hola@bellanails.com</p>
              </div>
            </div>
          </div>

          {/* Hours Column */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Horarios</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lunes - Viernes</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sábados</span>
                <span>10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Domingos</span>
                <span className="text-muted-foreground">Cerrado</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-primary text-sm">
              <Clock className="w-4 h-4" />
              <span>Agendamiento online 24/7</span>
            </div>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Servicios</h4>
            <div className="space-y-2 text-sm">
              <p className="hover:text-primary transition-colors cursor-pointer">Manicure con Gel</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Pedicure Spa</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Diseño de Arte</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Uñas Acrílicas</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Extensiones</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Tratamientos</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Bella Nails. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Cancelaciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;