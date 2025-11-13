export class Mass {
	constructor(mass, radius, color, pos, vel) {
		if (mass <= 0 || !isFinite(mass)) {
			throw new Error(`Invalid mass: ${mass}. Mass must be a positive finite number.`);
		}
		if (radius < 0 || !isFinite(radius)) {
			throw new Error(`Invalid radius: ${radius}. Radius must be a non-negative finite number.`);
		}
		if (
			!pos ||
			typeof pos.x !== 'number' ||
			typeof pos.y !== 'number' ||
			!isFinite(pos.x) ||
			!isFinite(pos.y)
		) {
			throw new Error('Invalid position. Position must have finite x and y coordinates.');
		}
		if (
			!vel ||
			typeof vel.x !== 'number' ||
			typeof vel.y !== 'number' ||
			!isFinite(vel.x) ||
			!isFinite(vel.y)
		) {
			throw new Error('Invalid velocity. Velocity must have finite x and y components.');
		}

		this.mass = mass;
		this.radius = radius;
		this.color = color;
		this.pos = pos;
		this.vel = vel;
		this.acc = { x: 0, y: 0 };
	}

	applyForce(force) {
		if (!force || typeof force.x !== 'number' || typeof force.y !== 'number') {
			return;
		}
		this.acc.x += force.x / this.mass;
		this.acc.y += force.y / this.mass;
	}

	update(dt) {
		if (!dt || dt <= 0 || !isFinite(dt)) {
			return;
		}
		this.vel.x += this.acc.x * dt;
		this.vel.y += this.acc.y * dt;
		this.pos.x += this.vel.x * dt;
		this.pos.y += this.vel.y * dt;
		this.acc.x = 0;
		this.acc.y = 0;
	}
}

function calculateBaseForce(m1, m2, g, effectiveMass1, effectiveMass2, effectiveSoftening) {
	if (!m1 || !m2) {
		return null;
	}
	if (!isFinite(g) || g <= 0 || !isFinite(effectiveSoftening) || effectiveSoftening <= 0) {
		return null;
	}

	const dx = m2.pos.x - m1.pos.x;
	const dy = m2.pos.y - m1.pos.y;
	const distSq = dx * dx + dy * dy;

	if (distSq === 0 || !isFinite(distSq)) {
		return null;
	}

	const dist = Math.sqrt(distSq);

	if (dist === 0 || !isFinite(dist)) {
		return null;
	}

	const forceMag = (g * effectiveMass1 * effectiveMass2) / (distSq + effectiveSoftening * effectiveSoftening);

	if (!isFinite(forceMag) || forceMag === 0) {
		return null;
	}

	const forceX = (dx / dist) * forceMag;
	const forceY = (dy / dist) * forceMag;

	if (!isFinite(forceX) || !isFinite(forceY)) {
		return null;
	}

	return {
		x: forceX,
		y: forceY
	};
}

export function getForce(m1, m2, g, softening) {
	const result = calculateBaseForce(m1, m2, g, m1.mass, m2.mass, softening);
	return result || { x: 0, y: 0 };
}

export function getRelativisticForce(m1, m2, g, softening, relativisticFactor = 0.1) {
	const v1Sq = m1.vel.x * m1.vel.x + m1.vel.y * m1.vel.y;
	const v2Sq = m2.vel.x * m2.vel.x + m2.vel.y * m2.vel.y;

	const gamma1Arg = 1 - relativisticFactor * v1Sq;
	const gamma2Arg = 1 - relativisticFactor * v2Sq;

	const gamma1 = gamma1Arg > 0 ? 1 / Math.sqrt(gamma1Arg) : 1;
	const gamma2 = gamma2Arg > 0 ? 1 / Math.sqrt(gamma2Arg) : 1;

	const m1Rel = m1.mass * gamma1;
	const m2Rel = m2.mass * gamma2;

	const maxVSq = Math.max(v1Sq, v2Sq);
	const velocitySoftening = Math.max(0, (maxVSq - 500) * 0.1);
	const effectiveSoftening = softening + velocitySoftening;

	const result = calculateBaseForce(m1, m2, g, m1Rel, m2Rel, effectiveSoftening);
	return result || { x: 0, y: 0 };
}

export function getQuantumForce(m1, m2, g, softening, quantumUncertainty = 0.15, tunnelingProbability = 0.1) {
	const dx = m2.pos.x - m1.pos.x;
	const dy = m2.pos.y - m1.pos.y;
	const distSq = dx * dx + dy * dy;

	if (distSq === 0 || !isFinite(distSq)) {
		return { x: 0, y: 0 };
	}

	const dist = Math.sqrt(distSq);

	if (dist === 0 || !isFinite(dist)) {
		return { x: 0, y: 0 };
	}

	const uncertaintyFactor = 1 + quantumUncertainty * Math.random();
	const effectiveDistSq = distSq * uncertaintyFactor * uncertaintyFactor;

	const minDist = (m1.radius + m2.radius) * 0.5;
	const tunnelingFactor = dist < minDist ? 1 - tunnelingProbability : 1;

	const forceMag = (g * m1.mass * m2.mass * tunnelingFactor) / (effectiveDistSq + softening * softening);

	if (!isFinite(forceMag) || forceMag === 0) {
		return { x: 0, y: 0 };
	}

	const forceX = (dx / dist) * forceMag;
	const forceY = (dy / dist) * forceMag;

	if (!isFinite(forceX) || !isFinite(forceY)) {
		return { x: 0, y: 0 };
	}

	return {
		x: forceX,
		y: forceY
	};
}
