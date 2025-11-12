import { config } from './config';

export class Mass {
    constructor(mass, radius, color, pos, vel) {
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.pos = pos;
        this.vel = vel;
        this.acc = { x: 0, y: 0 };
    }

    applyForce(force) {
        this.acc.x += force.x / this.mass;
        this.acc.y += force.y / this.mass;
    }

    update() {
        this.vel.x += this.acc.x * config.DT;
        this.vel.y += this.acc.y * config.DT;
        this.pos.x += this.vel.x * config.DT;
        this.pos.y += this.vel.y * config.DT;
        this.acc.x = 0;
        this.acc.y = 0;
    }
}

export function getForce(m1, m2) {
    const dx = m2.pos.x - m1.pos.x;
    const dy = m2.pos.y - m1.pos.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);
    const forceMag = (config.G * m1.mass * m2.mass) / 
        (distSq + config.SOFTENING * config.SOFTENING);
    
    return {
        x: (dx / dist) * forceMag,
        y: (dy / dist) * forceMag
    };
} 