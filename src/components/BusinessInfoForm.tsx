import { Save, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BusinessInfoFormProps {
  data: {
    salon_name: string;
    salon_description: string;
    phone: string;
    email: string;
    address: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const BusinessInfoForm = ({ data, onInputChange, onSubmit, isLoading }: BusinessInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Información del Salón</span>
        </CardTitle>
        <CardDescription>Datos de contacto y descripción del negocio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salon_name">Nombre del Salón</Label>
            <Input
              id="salon_name"
              placeholder="Bella Nails"
              value={data.salon_name}
              onChange={(e) => onInputChange('salon_name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salon_description">Descripción</Label>
            <Textarea
              id="salon_description"
              placeholder="Salón de belleza especializado en manicura y pedicura..."
              value={data.salon_description}
              onChange={(e) => onInputChange('salon_description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="+52 555 123 4567"
                value={data.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="contacto@bellanails.com"
                value={data.email}
                onChange={(e) => onInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              placeholder="Calle Principal #123, Colonia Centro, Ciudad de México"
              value={data.address}
              onChange={(e) => onInputChange('address', e.target.value)}
            />
          </div>

          <Button onClick={onSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Información
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoForm;