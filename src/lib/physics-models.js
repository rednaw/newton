import { getForce, getRelativisticForce, getQuantumForce } from './physics.js';

export const PHYSICS_MODELS = {
	newtonian: 'newtonian',
	relativistic: 'relativistic',
	quantum: 'quantum'
};

class PhysicsModel {
	constructor(name) {
		this.name = name;
	}

	getForce(m1, m2, g, softening, params = {}) {
		return getForce(m1, m2, g, softening);
	}

	getGammaFactor(mass, params = {}) {
		return 1;
	}

	shouldShowTrails() {
		return false;
	}

	shouldApplyRelativisticEffects() {
		return false;
	}

	getVisualizationParams() {
		return {
			radiusMultiplier: 0,
			intensityMultiplier: 1,
			glowMultiplier: 0,
			trailIntensityMultiplier: 1
		};
	}
}

class NewtonianModel extends PhysicsModel {
	constructor() {
		super(PHYSICS_MODELS.newtonian);
	}

  shouldShowTrails() {
		return true;
	}
}

class RelativisticModel extends PhysicsModel {
	constructor() {
		super(PHYSICS_MODELS.relativistic);
	}

	getForce(m1, m2, g, softening, params = {}) {
		const relativisticFactor = params.relativisticFactor || 0.1;
		return getRelativisticForce(m1, m2, g, softening, relativisticFactor);
	}

	getGammaFactor(mass, params = {}) {
		const relativisticFactor = params.relativisticFactor || 0.1;
		const vSq = mass.vel.x * mass.vel.x + mass.vel.y * mass.vel.y;
		const gammaArg = 1 - relativisticFactor * vSq;
		return gammaArg > 0 ? 1 / Math.sqrt(gammaArg) : 1;
	}

	shouldShowTrails() {
		return true;
	}

	shouldApplyRelativisticEffects() {
		return true;
	}

	getVisualizationParams() {
		return {
			radiusMultiplier: 0.3,
			intensityMultiplier: 3,
			glowMultiplier: 0.5,
			trailIntensityMultiplier: 2
		};
	}
}

class QuantumModel extends PhysicsModel {
	constructor() {
		super(PHYSICS_MODELS.quantum);
	}

	getForce(m1, m2, g, softening, params = {}) {
		const quantumUncertainty = params.quantumUncertainty || 0.15;
		const tunnelingProbability = params.tunnelingProbability || 0.1;
		return getQuantumForce(m1, m2, g, softening, quantumUncertainty, tunnelingProbability);
	}

	getGammaFactor(mass, params = {}) {
		return 1;
	}

	shouldShowTrails() {
		return true;
	}

	shouldApplyRelativisticEffects() {
		return false;
	}

	getVisualizationParams() {
		return {
			radiusMultiplier: 0.2,
			intensityMultiplier: 2,
			glowMultiplier: 0.8,
			trailIntensityMultiplier: 1.5,
			uncertaintyGlow: true
		};
	}
}

const models = {
	[PHYSICS_MODELS.newtonian]: new NewtonianModel(),
	[PHYSICS_MODELS.relativistic]: new RelativisticModel(),
	[PHYSICS_MODELS.quantum]: new QuantumModel()
};

export function getPhysicsModel(modelName) {
	const model = models[modelName];
	if (!model) {
		return models[PHYSICS_MODELS.newtonian];
	}
	return model;
}

export function getDefaultPhysicsModel() {
	return PHYSICS_MODELS.newtonian;
}

