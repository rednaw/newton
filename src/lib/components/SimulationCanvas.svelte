<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    export let centerX = 0;
    export let centerY = 0;
    export let orbitRadius = 0;

    let canvas;
    let ctx;

    function updateCanvasSize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const width = canvas.width;
        const height = canvas.height;
        centerX = width / 2;
        centerY = height / 2;
        orbitRadius = Math.min(width, height) * 0.3;
    }

    onMount(() => {
        if (browser) {
            ctx = canvas.getContext('2d');
            updateCanvasSize();
            window.addEventListener('resize', updateCanvasSize);
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener('resize', updateCanvasSize);
        }
    });

    export { canvas, ctx };
</script>

<canvas 
    bind:this={canvas} 
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #111;"
></canvas> 