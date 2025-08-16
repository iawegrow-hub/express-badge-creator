import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Briefcase } from "lucide-react";

interface FormFieldsProps {
  name: string;
  position: string;
  onNameChange: (name: string) => void;
  onPositionChange: (position: string) => void;
}

export const FormFields = ({ name, position, onNameChange, onPositionChange }: FormFieldsProps) => {
  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-soft border border-border space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-corporate-blue" />
        Dados do Funcionário
      </h3>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
          <User className="w-4 h-4" />
          Nome Completo *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Digite o nome completo"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-background border-border focus:border-corporate-blue focus:ring-corporate-blue/20 transition-smooth"
          maxLength={50}
        />
        {name.length > 40 && (
          <p className="text-xs text-warning">
            Nome longo pode não caber bem no crachá ({name.length}/50 caracteres)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position" className="text-sm font-medium text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Função Desempenhada *
        </Label>
        <Input
          id="position"
          type="text"
          placeholder="Ex: Desenvolvedor, Analista, Gerente..."
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          className="bg-background border-border focus:border-corporate-blue focus:ring-corporate-blue/20 transition-smooth"
          maxLength={30}
        />
        {position.length > 25 && (
          <p className="text-xs text-warning">
            Função longa pode não caber bem no crachá ({position.length}/30 caracteres)
          </p>
        )}
      </div>

      <div className="bg-corporate-light/50 rounded-lg p-3 border border-border/50">
        <p className="text-xs text-muted-foreground">
          * Campos obrigatórios. Os dados serão posicionados automaticamente no template do crachá.
        </p>
      </div>
    </div>
  );
};