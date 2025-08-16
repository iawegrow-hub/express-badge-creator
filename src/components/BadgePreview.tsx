import { useRef, useEffect } from "react";
import { Badge } from "lucide-react";

interface BadgePreviewProps {
  photo: string | null;
  name: string;
  position: string;
  templateImage?: string;
}

// Constantes em percentuais (funcionam para qualquer tamanho)
const SLOT_PCT = { x: 0.3213, y: 0.2695, w: 0.3565, h: 0.2474 }; // área da FOTO (retângulo cinza do template)
const NAME_PCT = { x: 0.50, y: 0.710, size: 0.070, weight: 700, color: "#FFFFFF", font: "Arial", align: "center" as const };
const ROLE_PCT = { x: 0.50, y: 0.800, size: 0.055, weight: 600, color: "#FFFFFF", font: "Arial", align: "center" as const };

export const BadgePreview = ({ photo, name, position }: BadgePreviewProps) => {
  const templateImage = "/template-cracha.png";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBadge = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Carregar template e definir dimensões do canvas
    const bgImage = new Image();
    bgImage.onload = () => {
      // Definir canvas com tamanho natural do template
      canvas.width = bgImage.naturalWidth;
      canvas.height = bgImage.naturalHeight;
      
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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
      
      drawContent(SLOT, NAME, ROLE);
    };
    bgImage.src = templateImage;
  };

  const drawContent = (SLOT: any, NAME: any, ROLE: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

        // Desenhar textos após a foto
        drawTexts(NAME, ROLE);
      };
      img.src = photo;
    } else {
      drawTexts(NAME, ROLE);
    }
  };

  const drawTexts = (NAME: any, ROLE: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

export { SLOT_PCT, NAME_PCT, ROLE_PCT };