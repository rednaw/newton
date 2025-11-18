<script>
	import { getPhysicsModel } from '$lib/physics-models';

	export let ctx;
	export let masses = [];
	export let physicsModel = 'newtonian';
	export let relativisticFactor = 0.1;
	export let quantumUncertainty = 0.15;

	const TRAIL_LENGTH = 30;
	let trails = [];

	$: model = getPhysicsModel(physicsModel);
	$: modelParams = { relativisticFactor, quantumUncertainty };

	function updateTrails() {
		if (masses.length !== trails.length) {
			trails = masses.map(() => []);
		}
		for (let i = 0; i < masses.length; i++) {
			const trail = trails[i];
			trail.push({ x: masses[i].pos.x, y: masses[i].pos.y });
			if (trail.length > TRAIL_LENGTH) {
				trail.shift();
			}
		}
	}

	function drawTrail(mass, index) {
		if (!model.shouldShowTrails()) return;
		const trail = trails[index];
		if (!trail || trail.length < 2) return;

		const gamma = model.getGammaFactor(mass, modelParams);
		const vizParams = model.getVisualizationParams();
		const intensity = Math.min(1, (gamma - 1) * vizParams.trailIntensityMultiplier);
		const alpha = 0.3 + intensity * 0.4;

		ctx.strokeStyle = `rgba(255, 200, 100, ${alpha})`;
		ctx.lineWidth = 1 + intensity * 2;
		ctx.beginPath();
		ctx.moveTo(trail[0].x, trail[0].y);
		for (let i = 1; i < trail.length; i++) {
			ctx.lineTo(trail[i].x, trail[i].y);
		}
		ctx.stroke();
	}

	function parseHSL(color) {
		const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
		return match ? { h: match[1], s: match[2], l: match[3] } : null;
	}

	function createGradient(x, y, radius, stops) {
		const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
		stops.forEach(({ offset, color }) => {
			gradient.addColorStop(offset, color);
		});
		return gradient;
	}

	function drawMass(mass) {
		if (!ctx) return;

		const gamma = model.getGammaFactor(mass, modelParams);
		const vizParams = model.getVisualizationParams();
		const intensity = Math.min(1, (gamma - 1) * vizParams.intensityMultiplier);

		let color = mass.color;
		const hsl = parseHSL(mass.color);
		if (hsl && model.shouldApplyRelativisticEffects() && gamma > 1) {
			const lightness = Math.min(100, parseInt(hsl.l) + intensity * 30);
			color = `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`;
		}

		const effectiveRadius = model.shouldApplyRelativisticEffects()
			? mass.radius * (1 + (gamma - 1) * vizParams.radiusMultiplier)
			: mass.radius;

		if (vizParams.uncertaintyGlow && quantumUncertainty && hsl) {
			const uncertaintyGlow = effectiveRadius * (1 + quantumUncertainty * 4);
			const gradient = createGradient(mass.pos.x, mass.pos.y, uncertaintyGlow * 2, [
				{ offset: 0, color: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.5)` },
				{ offset: 0.3, color: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.3)` },
				{ offset: 0.6, color: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.15)` },
				{ offset: 1, color: 'transparent' }
			]);
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(mass.pos.x, mass.pos.y, uncertaintyGlow * 2, 0, Math.PI * 2);
			ctx.fill();
		}

		const glowRadius = effectiveRadius * (1 + intensity * vizParams.glowMultiplier);
		const gradient = createGradient(mass.pos.x, mass.pos.y, glowRadius * 2, [
			{ offset: 0, color },
			{ offset: 1, color: 'transparent' }
		]);
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(mass.pos.x, mass.pos.y, glowRadius * 2, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(mass.pos.x, mass.pos.y, effectiveRadius, 0, Math.PI * 2);
		ctx.fill();

		const strokeAlpha = 0.5 + intensity * 0.5;
		ctx.strokeStyle = `rgba(255, 255, 255, ${strokeAlpha})`;
		ctx.lineWidth = 2 + intensity;
		ctx.beginPath();
		ctx.arc(mass.pos.x, mass.pos.y, effectiveRadius, 0, Math.PI * 2);
		ctx.stroke();
	}

	let renderTrigger = 0;

	export function triggerRender() {
		renderTrigger++;
	}

	$: if (ctx && masses && masses.length > 0) {
		renderTrigger;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		updateTrails();

		for (let i = 0; i < masses.length; i++) {
			drawTrail(masses[i], i);
		}

		for (const mass of masses) {
			drawMass(mass);
		}
	}
</script>
