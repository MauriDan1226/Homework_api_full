import { useEffect, useRef } from 'react';

const SRC = '/aurora-loop.mp4';
const POSTER = '/aurora-poster.jpg';

// Duracion del fundido, en segundos.
const FADE = 0.7;

// El primer y el ultimo fotograma del clip no coinciden, asi que reproducirlo
// en bucle deja un corte visible cada vuelta. Aqui se pintan dos copias del
// mismo video desfasadas media vuelta: cuando a una le toca el corte, esta a
// cero de opacidad y se ve la otra, que en ese momento va por el medio del
// clip. El resultado es un bucle continuo sin salto.
function AuroraBackdrop() {
  const baseRef = useRef(null);
  const offsetRef = useRef(null);

  useEffect(() => {
    const base = baseRef.current;
    const offset = offsetRef.current;
    if (!base || !offset) return undefined;

    // Con movimiento reducido no hay video que sincronizar
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return undefined;

    let frame = 0;
    let lastTime = 0;
    // En la primera pasada todavia no hay corte que tapar al arrancar
    let wrapped = false;

    function smoothstep(x) {
      const c = Math.min(1, Math.max(0, x));
      return c * c * (3 - 2 * c);
    }

    // 0 justo en el corte, 1 en el resto del clip, con rampa suave a los lados
    function opacityAt(time, total) {
      const fade = Math.min(FADE, total / 6);
      if (time < fade) return smoothstep(time / fade);
      if (time > total - fade) return smoothstep((total - time) / fade);
      return 1;
    }

    function tick() {
      frame = requestAnimationFrame(tick);

      const total = base.duration;
      if (!Number.isFinite(total) || total <= 0) return;

      const time = base.currentTime;
      if (time < lastTime) wrapped = true;
      lastTime = time;

      let alpha = opacityAt(time, total);
      if (!wrapped && time < Math.min(FADE, total / 6)) alpha = 1;

      // Solo se atenua la copia de arriba. Si tambien se atenuara la de abajo,
      // a mitad del fundido las dos quedarian translucidas y se veria el fondo
      // por debajo, con el consiguiente bajon de brillo.
      offset.style.opacity = 1 - alpha;

      // Si el desfase se descuadra (un tiron del decodificador, la pestana en
      // segundo plano) se recoloca, pero solo mientras la copia de arriba esta
      // invisible: reposicionarla a mitad de un fundido se veria como un salto.
      if (alpha === 1 && !offset.seeking) {
        const half = total / 2;
        const gap = (offset.currentTime - time + total) % total;
        if (Math.abs(gap - half) > 0.2) {
          offset.currentTime = (time + half) % total;
        }
      }
    }

    function start() {
      const total = base.duration;
      if (Number.isFinite(total) && total > 0) {
        offset.currentTime = total / 2;
      }
      // Los navegadores pueden rechazar la reproduccion automatica; al estar
      // silenciados no deberia pasar, pero si pasa se queda el poster.
      base.play().catch(() => {});
      offset.play().catch(() => {});
    }

    if (base.readyState >= 1) start();
    else base.addEventListener('loadedmetadata', start, { once: true });

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      base.removeEventListener('loadedmetadata', start);
    };
  }, []);

  const shared = {
    className: 'auth__video',
    src: SRC,
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
    preload: 'auto',
    tabIndex: -1,
  };

  return (
    <>
      <video {...shared} ref={baseRef} poster={POSTER} />
      <video {...shared} ref={offsetRef} style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}

export default AuroraBackdrop;
