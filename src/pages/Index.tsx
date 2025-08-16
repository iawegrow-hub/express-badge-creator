import { useState } from "react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { FormFields } from "@/components/FormFields";
import { BadgePreview } from "@/components/BadgePreview";
import { ExportButtons } from "@/components/ExportButtons";
import { Badge, Zap } from "lucide-react";

const Index = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  const handleReset = () => {
    setPhoto(null);
    setName("");
    setPosition("");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <Badge className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-inter">
                Crachá Express
              </h1>
              <p className="text-muted-foreground text-sm">
                Gerador profissional de crachás com exportação automática
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-corporate-blue">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Rápido & Fácil</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
            <PhotoUpload photo={photo} onPhotoChange={setPhoto} />
            <FormFields
              name={name}
              position={position}
              onNameChange={setName}
              onPositionChange={setPosition}
            />
            <ExportButtons
              photo={photo}
              name={name}
              position={position}
              onReset={handleReset}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8">
            <BadgePreview
              photo={photo}
              name={name}
              position={position}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-card rounded-xl p-6 shadow-soft border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Como usar o Crachá Express
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-corporate-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-corporate-blue font-bold text-lg">1</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Adicione a Foto</h3>
                <p className="text-muted-foreground">
                  Faça upload ou capture uma foto do funcionário. A imagem será ajustada automaticamente.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-corporate-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-corporate-blue font-bold text-lg">2</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Preencha os Dados</h3>
                <p className="text-muted-foreground">
                  Digite o nome completo e a função. Os textos aparecerão automaticamente no preview.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-corporate-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-corporate-blue font-bold text-lg">3</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Exporte & Imprima</h3>
                <p className="text-muted-foreground">
                  Baixe em PNG para uso digital ou PDF no formato CR80 para impressão profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Crachá Express. Sistema profissional de geração de crachás.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Feito com ❤️ para sua empresa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;