export class Mass {
    constructor(mass, radius, color, pos, vel) {
        if (mass <= 0 || !isFinite(mass)) {
            throw new Error(`Invalid mass: ${mass}. Mass must be a positive finite number.`);
        }
        if (radius < 0 || !isFinite(radius)) {
            throw new Error(`Invalid radius: ${radius}. Radius must be a non-negative finite number.`);
        }
        if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number' || !isFinite(pos.x) || !isFinite(pos.y)) {
            throw new Error('Invalid position. Position must have finite x and y coordinates.');
        }
        if (!vel || typeof vel.x !== 'number' || typeof vel.y !== 'number' || !isFinite(vel.x) || !isFinite(vel.y)) {
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

export function getForce(m1, m2, g, softening) {
    if (!m1 || !m2) {
        return { x: 0, y: 0 };
    }
    if (!isFinite(g) || g <= 0 || !isFinite(softening) || softening <= 0) {
        return { x: 0, y: 0 };
    }
    
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
    
    const forceMag = (g * m1.mass * m2.mass) / 
        (distSq + softening * softening);
    
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