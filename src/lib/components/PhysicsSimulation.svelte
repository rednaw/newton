<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { getForce } from '$lib/physics';

    export let masses = [];
    export let onUpdate = () => {};

    let animationFrame;
    let lastTime = 0;
    const FIXED_TIME_STEP = 1/60;

    function updatePhysics(deltaTime) {
        const steps = Math.min(Math.floor(deltaTime / FIXED_TIME_STEP), 3);
        
        for (let step = 0; step < steps; step++) {
            for (let i = 0; i < masses.length; i++) {
                for (let j = 0; j < masses.length; j++) {
                    if (i !== j) {
                        const force = getForce(masses[i], masses[j]);
                        masses[i].applyForce(force);
                    }
                }
            }
            for (const m of masses) {
                m.update();
            }
        }
        
        masses = [...masses];
        onUpdate(masses);
    }

    function loop(currentTime) {
        if (browser) {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            updatePhysics(deltaTime);
            animationFrame = requestAnimationFrame(loop);
        }
    }

    onMount(() => {
        if (browser) {
            lastTime = performance.now();
            animationFrame = requestAnimationFrame(loop);
        }
    });

    onDestroy(() => {
        if (browser) {
            cancelAnimationFrame(animationFrame);
        }
    });
</script> 