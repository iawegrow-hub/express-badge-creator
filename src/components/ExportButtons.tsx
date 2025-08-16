import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BADGE_CONFIG } from "./BadgePreview";

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
      canvas.width = BADGE_CONFIG.width;
      canvas.height = BADGE_CONFIG.height;
      const ctx = canvas.getContext("2d")!;

      const drawComplete = () => {
        // Desenhar foto se disponível
        if (photo) {
          const img = new Image();
          img.onload = () => {
            const { x, y, width, height } = BADGE_CONFIG.photoArea;
            
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.clip();

            const scale = Math.max(width / img.width, height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const offsetX = (width - scaledWidth) / 2;
            const offsetY = (height - scaledHeight) / 2;

            ctx.drawImage(img, x + offsetX, y + offsetY, scaledWidth, scaledHeight);
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
        // Configurar sombra para texto
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Desenhar nome
        if (name.trim()) {
          ctx.fillStyle = BADGE_CONFIG.nameArea.color;
          ctx.font = `${BADGE_CONFIG.nameArea.fontSize}px ${BADGE_CONFIG.nameArea.fontFamily}`;
          ctx.textAlign = BADGE_CONFIG.nameArea.align;
          ctx.fillText(name.trim(), BADGE_CONFIG.nameArea.x, BADGE_CONFIG.nameArea.y);
        }

        // Desenhar função
        if (position.trim()) {
          ctx.fillStyle = BADGE_CONFIG.positionArea.color;
          ctx.font = `${BADGE_CONFIG.positionArea.fontSize}px ${BADGE_CONFIG.positionArea.fontFamily}`;
          ctx.textAlign = BADGE_CONFIG.positionArea.align;
          ctx.fillText(position.trim(), BADGE_CONFIG.positionArea.x, BADGE_CONFIG.positionArea.y);
        }
      };

      if (templateImage) {
        const bgImage = new Image();
        bgImage.onload = () => {
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
          drawComplete();
        };
        bgImage.src = templateImage;
      } else {
        // Fundo temporário
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#3B82F6");
        gradient.addColorStop(1, "#1E40AF");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Área da foto
        ctx.fillStyle = "#E5E7EB";
        ctx.fillRect(
          BADGE_CONFIG.photoArea.x,
          BADGE_CONFIG.photoArea.y,
          BADGE_CONFIG.photoArea.width,
          BADGE_CONFIG.photoArea.height
        );

        drawComplete();
      }
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