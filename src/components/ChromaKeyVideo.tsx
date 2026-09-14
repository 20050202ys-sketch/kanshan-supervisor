import { useEffect, useRef } from "react";

export default function ChromaKeyVideo({
  src,
  active,
  onEnded,
  className = "",
}: {
  src: string;
  active: boolean;
  onEnded?: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !active) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let frame = 0;

    const render = () => {
      if (video.readyState >= 2) {
        const width = Math.min(video.videoWidth || 480, 480);
        const height = Math.round(width * ((video.videoHeight || 720) / (video.videoWidth || 720)));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        ctx.drawImage(video, 0, 0, width, height);
        const pixels = ctx.getImageData(0, 0, width, height);
        const data = pixels.data;
        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          const dominance = green - Math.max(red, blue);
          if (green > 72 && dominance > 12) {
            const removal = Math.min(1, Math.max(0, (dominance - 12) / 40));
            data[i + 3] = Math.round(255 * (1 - removal));
            data[i + 1] = Math.min(green, Math.round(Math.max(red, blue) * 1.08));
          }
        }
        ctx.putImageData(pixels, 0, 0);
      }
      if (!video.ended && active) frame = requestAnimationFrame(render);
    };

    const start = () => {
      video.currentTime = 0;
      video.play().then(() => {
        frame = requestAnimationFrame(render);
      }).catch(() => {});
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("loadeddata", start, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      video.pause();
      video.removeEventListener("loadeddata", start);
    };
  }, [active, src]);

  return (
    <div className={`chroma-video ${className}`}>
      <video ref={videoRef} src={src} muted playsInline preload="auto" onEnded={onEnded} className="chroma-video__source" aria-hidden="true" />
      <canvas ref={canvasRef} className="chroma-video__canvas" aria-label="刘看山拳击提醒动画" />
    </div>
  );
}
