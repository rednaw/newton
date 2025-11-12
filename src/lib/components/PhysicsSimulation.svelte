<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { getForce } from '$lib/physics';
	import { physicsConfig } from '$lib/stores/physics-config';

	export let masses = [];
	export let onUpdate = () => {};

	let animationFrame;
	let lastTime = 0;
	const FIXED_TIME_STEP = 1 / 60;

	let currentConfig;
	let unsubscribe;

	function updatePhysics(deltaTime) {
		if (!currentConfig || masses.length === 0) return;

		const steps = Math.min(Math.floor(deltaTime / FIXED_TIME_STEP), 3);

		for (let step = 0; step < steps; step++) {
			for (let i = 0; i < masses.length; i++) {
				for (let j = 0; j < masses.length; j++) {
					if (i !== j) {
						const force = getForce(masses[i], masses[j], currentConfig.G, currentConfig.SOFTENING);
						masses[i].applyForce(force);
					}
				}
			}
			for (const m of masses) {
				m.update(currentConfig.DT);
			}
		}

		onUpdate();
	}

	function loop(currentTime) {
		const deltaTime = (currentTime - lastTime) / 1000;
		lastTime = currentTime;

		updatePhysics(deltaTime);
		animationFrame = requestAnimationFrame(loop);
	}

	onMount(() => {
		if (browser) {
			currentConfig = $physicsConfig;
			unsubscribe = physicsConfig.subscribe((value) => {
				currentConfig = value;
			});
			lastTime = performance.now();
			animationFrame = requestAnimationFrame(loop);
		}
	});

	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(animationFrame);
		}
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>
