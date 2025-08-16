import { useRef, useEffect } from "react";
import { Badge } from "lucide-react";

interface BadgePreviewProps {
  photo: string | null;
  name: string;
  position: string;
  templateImage?: string;
}

// Constantes para posicionamento baseadas no template fornecido
const BADGE_CONFIG = {
  width: 400,
  height: 600,
  photoArea: {
    x: 95,
    y: 200,
    width: 210,
    height: 270
  },
  nameArea: {
    x: 200,
    y: 520,
    fontSize: 22,
    fontFamily: "Arial, sans-serif",
    color: "#FFFFFF",
    align: "center" as const
  },
  positionArea: {
    x: 200,
    y: 575,
    fontSize: 18,
    fontFamily: "Arial, sans-serif", 
    color: "#FFFFFF",
    align: "center" as const
  }
};

export const BadgePreview = ({ photo, name, position }: BadgePreviewProps) => {
  const templateImage = "/template-cracha.png";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBadge = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar fundo temporário (até o template ser fornecido)
    if (!templateImage) {
      // Gradiente temporário
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#3B82F6");
      gradient.addColorStop(1, "#1E40AF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Área da foto (cinza temporário)
      ctx.fillStyle = "#E5E7EB";
      ctx.fillRect(
        BADGE_CONFIG.photoArea.x,
        BADGE_CONFIG.photoArea.y,
        BADGE_CONFIG.photoArea.width,
        BADGE_CONFIG.photoArea.height
      );

      // Borda da área da foto
      ctx.strokeStyle = "#9CA3AF";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        BADGE_CONFIG.photoArea.x,
        BADGE_CONFIG.photoArea.y,
        BADGE_CONFIG.photoArea.width,
        BADGE_CONFIG.photoArea.height
      );

      // Texto de placeholder se não houver foto
      if (!photo) {
        ctx.fillStyle = "#6B7280";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "ÁREA DA FOTO",
          BADGE_CONFIG.photoArea.x + BADGE_CONFIG.photoArea.width / 2,
          BADGE_CONFIG.photoArea.y + BADGE_CONFIG.photoArea.height / 2
        );
      }
    } else {
      // Desenhar template de fundo quando fornecido
      const bgImage = new Image();
      bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        drawContent();
      };
      bgImage.src = templateImage;
      return;
    }

    drawContent();
  };

  const drawContent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Desenhar foto se disponível
    if (photo) {
      const img = new Image();
      img.onload = () => {
        // Calcular crop para manter proporção
        const { x, y, width, height } = BADGE_CONFIG.photoArea;
        
        // Desenhar foto com crop centralizado
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

        // Desenhar textos após a foto
        drawTexts();
      };
      img.src = photo;
    } else {
      drawTexts();
    }
  };

  const drawTexts = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    // Resetar sombra
    ctx.shadowColor = "transparent";
  };

  useEffect(() => {
    drawBadge();
  }, [photo, name, position, templateImage]);

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-soft border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Badge className="w-5 h-5 text-corporate-blue" />
        Preview do Crachá
      </h3>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-medium border border-border">
          <canvas
            ref={canvasRef}
            width={BADGE_CONFIG.width}
            height={BADGE_CONFIG.height}
            className="max-w-full h-auto border border-border/50 rounded"
            style={{ maxHeight: "400px" }}
          />
        </div>
      </div>

      <div className="mt-4 bg-corporate-light/50 rounded-lg p-3 border border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          O crachá será renderizado automaticamente conforme você preenche os dados. 
          {!templateImage && " Aguardando template de fundo..."}
        </p>
      </div>
    </div>
  );
};

export { BADGE_CONFIG };