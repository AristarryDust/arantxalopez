console.log("¡SCRIPT.JS ESTÁ CONECTADO!");
document.addEventListener("DOMContentLoaded", () => {

    const stage = document.querySelector(".preview-stage");

    if (!stage) return;

    const cards = Array.from(
        stage.querySelectorAll(".preview-card")
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let ticking = false;

    // Activa el modo de transiciones.
    stage.classList.add("is-enhanced");

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function smoothStep(value) {
        const t = clamp(value, 0, 1);
        return t * t * (3 - 2 * t);
    }

    function updatePreviews() {

        const stageRect = stage.getBoundingClientRect();

        const stageTop = window.scrollY + stageRect.top;

        const viewportHeight = window.innerHeight;

        // Cada unidad de progreso equivale a una pantalla.
        const progress = clamp(
            (window.scrollY - stageTop) / viewportHeight,
            0,
            cards.length - 1
        );

        cards.forEach((card, index) => {

            // Entrada y salida gradual de cada preview.
            const enter = smoothStep(
                (progress - (index - 0.45)) / 0.65
            );

            const leave = 1 - smoothStep(
                (progress - (index + 0.35)) / 0.65
            );

            const opacity = enter * leave;

            // Pequeño desplazamiento durante la transición.
            const movement = (1 - opacity) * 24;

            const horizontalDirection =
                card.classList.contains("preview-right") ? -1 : 1;

            card.style.opacity = opacity;

            card.style.transform = `
                translate3d(
                    ${movement * horizontalDirection}px,
                    ${movement}px,
                    0
                )
            `;

            const isActive = opacity > 0.15;

            card.classList.toggle("is-active", isActive);

            card.setAttribute(
                "aria-hidden",
                isActive ? "false" : "true"
            );

            // Evita que los enlaces de previews ocultas
            // reciban el foco del teclado.
            card.inert = !isActive;

        });

        ticking = false;
    }

    function requestUpdate() {

        if (!ticking) {
            window.requestAnimationFrame(updatePreviews);
            ticking = true;
        }

    }

    window.addEventListener("scroll", requestUpdate, {
        passive: true
    });

    window.addEventListener("resize", requestUpdate);

    updatePreviews();

});