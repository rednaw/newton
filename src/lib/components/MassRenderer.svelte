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

	function drawMass(mass) {
		if (!ctx) return;

		const gamma = model.getGammaFactor(mass, modelParams);
		const vizParams = model.getVisualizationParams();
		const intensity = Math.min(1, (gamma - 1) * vizParams.intensityMultiplier);

		let color = mass.color;
		if (model.shouldApplyRelativisticEffects() && gamma > 1) {
			const hslMatch = mass.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
			if (hslMatch) {
				const lightness = Math.min(100, parseInt(hslMatch[3]) + intensity * 30);
				color = `hsl(${hslMatch[1]}, ${hslMatch[2]}%, ${lightness}%)`;
			}
		}

		const effectiveRadius = model.shouldApplyRelativisticEffects()
			? mass.radius * (1 + (gamma - 1) * vizParams.radiusMultiplier)
			: mass.radius;

		if (vizParams.uncertaintyGlow && quantumUncertainty) {
			const uncertaintyGlow = effectiveRadius * (1 + quantumUncertainty * 4);
			const hslMatch = mass.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
			if (hslMatch) {
				const uncertaintyGradient = ctx.createRadialGradient(
					mass.pos.x,
					mass.pos.y,
					0,
					mass.pos.x,
					mass.pos.y,
					uncertaintyGlow * 2
				);
				uncertaintyGradient.addColorStop(0, `hsla(${hslMatch[1]}, ${hslMatch[2]}%, ${hslMatch[3]}%, 0.5)`);
				uncertaintyGradient.addColorStop(0.3, `hsla(${hslMatch[1]}, ${hslMatch[2]}%, ${hslMatch[3]}%, 0.3)`);
				uncertaintyGradient.addColorStop(0.6, `hsla(${hslMatch[1]}, ${hslMatch[2]}%, ${hslMatch[3]}%, 0.15)`);
				uncertaintyGradient.addColorStop(1, 'transparent');
				ctx.fillStyle = uncertaintyGradient;
				ctx.beginPath();
				ctx.arc(mass.pos.x, mass.pos.y, uncertaintyGlow * 2, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		const glowRadius = effectiveRadius * (1 + intensity * vizParams.glowMultiplier);
		const gradient = ctx.createRadialGradient(
			mass.pos.x,
			mass.pos.y,
			0,
			mass.pos.x,
			mass.pos.y,
			glowRadius * 2
		);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, 'transparent');
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
