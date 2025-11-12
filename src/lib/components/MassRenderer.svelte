<script>
    export let ctx;
    export let masses = [];

    function drawMass(mass) {
        if (!ctx) return;

        const gradient = ctx.createRadialGradient(mass.pos.x, mass.pos.y, 0, mass.pos.x, mass.pos.y, mass.radius * 2);
        gradient.addColorStop(0, mass.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mass.pos.x, mass.pos.y, mass.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = mass.color;
        ctx.beginPath();
        ctx.arc(mass.pos.x, mass.pos.y, mass.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mass.pos.x, mass.pos.y, mass.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    $: if (ctx && masses) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (const mass of masses) {
            drawMass(mass);
        }
    }
</script> 