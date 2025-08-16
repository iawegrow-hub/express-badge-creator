import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SLOT_PCT, NAME_PCT, ROLE_PCT } from "./BadgePreview";

interface ExportButtonsProps {
  photo: string | null;
  name: string;
  position: string;
  templateImage?: string;
  onReset: () => void;
}

export const ExportButtons = ({ photo, name, position, onReset }: ExportButtonsProps) => {
  const templateImage = "/template-cracha.png";
  const isValid = photo && name.trim() && position.trim();

  const generateBadgeCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Carregar template e definir dimensões
      const bgImage = new Image();
      bgImage.onload = () => {
        // Definir canvas com tamanho natural do template
        canvas.width = bgImage.naturalWidth;
        canvas.height = bgImage.naturalHeight;
        
        // Desenhar template de fundo
        ctx.drawImage(bgImage, 0, 0);
        
        // Calcular constantes em pixels baseadas no tamanho do template
        const W = bgImage.naturalWidth;
        const H = bgImage.naturalHeight;
        
        const SLOT = { 
          x: Math.round(W * SLOT_PCT.x), 
          y: Math.round(H * SLOT_PCT.y),
          w: Math.round(W * SLOT_PCT.w), 
          h: Math.round(H * SLOT_PCT.h) 
        };
        const NAME = { 
          x: W * NAME_PCT.x, 
          y: H * NAME_PCT.y, 
          size: Math.round(W * NAME_PCT.size),
          ...NAME_PCT 
        };
        const ROLE = { 
          x: W * ROLE_PCT.x, 
          y: H * ROLE_PCT.y, 
          size: Math.round(W * ROLE_PCT.size),
          ...ROLE_PCT 
        };

        const drawComplete = () => {
          // Desenhar foto se disponível
          if (photo) {
            const img = new Image();
            img.onload = () => {
              // Desenhar foto com "cover" (preencher sem distorcer)
              ctx.save();
              
              // Criar clip arredondado
              const radius = Math.min(SLOT.w, SLOT.h) * 0.06;
              ctx.beginPath();
              ctx.roundRect(SLOT.x, SLOT.y, SLOT.w, SLOT.h, radius);
              ctx.clip();

              // Calcular escala cover
              const scale = Math.max(SLOT.w / img.width, SLOT.h / img.height);
              const dw = Math.ceil(img.width * scale);
              const dh = Math.ceil(img.height * scale);
              const dx = SLOT.x + Math.round((SLOT.w - dw) / 2);
              const dy = SLOT.y + Math.round((SLOT.h - dh) / 2);

              ctx.drawImage(img, dx, dy, dw, dh);
              ctx.restore();

              drawTexts();
              resolve(canvas);
            };
            img.src = photo;
          } else {
            drawTexts();
            resolve(canvas);
          }
        };

        const drawTexts = () => {
          // Desenhar nome
          if (name.trim()) {
            ctx.font = `${NAME.weight} ${NAME.size}px ${NAME.font}`;
            ctx.fillStyle = NAME.color;
            ctx.textAlign = NAME.align;
            ctx.textBaseline = "middle";
            ctx.fillText(name.trim(), NAME.x, NAME.y);
          }

          // Desenhar função
          if (position.trim()) {
            ctx.font = `${ROLE.weight} ${ROLE.size}px ${ROLE.font}`;
            ctx.fillStyle = ROLE.color;
            ctx.textAlign = ROLE.align;
            ctx.textBaseline = "middle";
            ctx.fillText(position.trim(), ROLE.x, ROLE.y);
          }
        };

        drawComplete();
      };
      bgImage.src = templateImage;
    });
  };

  const exportPNG = async () => {
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const canvas = await generateBadgeCanvas();
      const link = document.createElement("a");
      link.download = `cracha_${name.replace(/\s+/g, "_").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast.success("Crachá exportado em PNG!");
    } catch (error) {
      console.error("Erro ao exportar PNG:", error);
      toast.error("Erro ao exportar PNG");
    }
  };

  const exportPDF = async () => {
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const canvas = await generateBadgeCanvas();
      
      // Converter tamanho CR80 (85.6 × 54 mm) para points (vertical = 54 × 85.6 mm)
      const pdfWidth = 54 * 2.83465; // ~153 points
      const pdfHeight = 85.6 * 2.83465; // ~242 points
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [pdfWidth, pdfHeight]
      });

      // Adicionar imagem do canvas ao PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`cracha_${name.replace(/\s+/g, "_").toLowerCase()}.pdf`);
      toast.success("Crachá exportado em PDF!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF");
    }
  };

  const handleReset = () => {
    onReset();
    toast.success("Dados resetados!");
  };

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-soft border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Download className="w-5 h-5 text-corporate-blue" />
        Exportar Crachá
      </h3>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button 
            variant="corporate" 
            onClick={exportPNG}
            disabled={!isValid}
            className="flex-1"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Exportar PNG
          </Button>
          
          <Button 
            variant="corporate"
            onClick={exportPDF}
            disabled={!isValid}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        <Button 
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar Dados
        </Button>

        {!isValid && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <p className="text-sm text-warning font-medium">
              ⚠️ Complete todos os campos para exportar:
            </p>
            <ul className="text-xs text-warning/80 mt-1 ml-4 list-disc">
              {!photo && <li>Adicione uma foto</li>}
              {!name.trim() && <li>Preencha o nome completo</li>}
              {!position.trim() && <li>Preencha a função</li>}
            </ul>
          </div>
        )}

        <div className="bg-corporate-light/50 rounded-lg p-3 border border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>PNG:</strong> Tamanho original para uso digital<br />
            <strong>PDF:</strong> Formato CR80 (85,6×54mm) para impressão
          </p>
        </div>
      </div>
    </div>
  );
};