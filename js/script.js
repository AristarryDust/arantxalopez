document.addEventListener("DOMContentLoaded", () => {

    const stage = document.querySelector(".preview-stage");

    if (!stage) return;

    const cards = Array.from(
        stage.querySelectorAll(".preview-card")
    );

    if (cards.length === 0) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let ticking = false;

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

        // Una pantalla equivale a una unidad de progreso.
        const stageHeight = stage.offsetHeight;

const scrollDistance = Math.max(
    stageHeight - viewportHeight,
    1
);

const progress = clamp(
    ((window.scrollY - stageTop) / scrollDistance) *
    (cards.length - 1),
    0,
    cards.length - 1
);

        // Determina qué nota está más cerca del centro
        // del recorrido.
        const activeIndex = Math.round(progress);

        cards.forEach((card, index) => {

            // Distancia entre la nota y el scroll actual.
            const distance = Math.abs(progress - index);

            // Fundido cruzado.
            // Las notas vecinas se mezclan progresivamente.
            const opacity = 1 - smoothStep(
                distance / 1.15
            );

            // Movimiento direccional y discreto.
            const direction = progress - index;

            const verticalMovement = direction < 0
                ? Math.abs(direction) * 18
                : -Math.min(direction, 1) * 14;

            const horizontalDirection =
                card.classList.contains("preview-right")
                    ? -1
                    : 1;

            const horizontalMovement =
                clamp(direction, -1, 1) *
                10 *
                horizontalDirection;

            // Aplicar transformaciones.
            card.style.opacity = opacity;

            card.style.transform = `
                translate3d(
                    ${horizontalMovement}px,
                    ${verticalMovement}px,
                    0
                )
            `;

            // Accesibilidad e interacción.
            const isActive = index === activeIndex;

            card.classList.toggle(
                "is-active",
                isActive
            );

            card.setAttribute(
                "aria-hidden",
                isActive ? "false" : "true"
            );

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