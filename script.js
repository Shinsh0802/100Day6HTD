const wrap = document.getElementById('wrap');
const stage = document.getElementById('perspective');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const motionButton = document.getElementById('toggle-motion');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let radius = getRadius();
let rotation = 0;
let tilt = -12;
let drag = null;
let suppressClick = false;
let previousTime = 0;
const photos = [];
const letter = document.getElementById('letter');
let velocity = 0;
const album = window.ALBUM_PHOTOS.map((photo, index) => ({
    src: typeof photo === 'string' ? photo : photo.src,
    caption: (typeof photo === 'object' && photo.caption) || `Kỷ niệm ${index + 1}`,
}));
const groupSize = 10;
let currentGroup = 0;
const groupCount = Math.ceil(album.length / groupSize);
const groupControls = document.getElementById('album-groups');
const groupStatus = document.getElementById('group-status');
const previousGroup = document.getElementById('previous-group');
const nextGroup = document.getElementById('next-group');
previousGroup.addEventListener('click', () => showGroup(currentGroup - 1));
nextGroup.addEventListener('click', () => showGroup(currentGroup + 1));
const ambience = document.querySelector('.ambience');
// Reuse a small set of stars; CSS handles their staggered flights.
for (let i = 0; i < 12; i++) {
    const meteor = document.createElement('span');
    meteor.className = 'shooting-star';
    meteor.style.cssText = `left:${(i * 29) % 85}%;top:${2 + (i * 17) % 55}%;--meteor-delay:-${(i * 1.37).toFixed(2)}s;--meteor-duration:${7 + (i % 5) * .8}s`;
    ambience.append(meteor);
}
for (let i = 0; i < 18; i++) {
    const light = document.createElement('span');
    light.className = 'firefly';
    light.style.cssText = `left:${(i * 37) % 100}%;top:${(i * 23) % 100}%;--delay:-${i * 1.3}s;--duration:${8 + i % 7}s`;
    ambience.append(light);
}
document.getElementById('open-letter').addEventListener('click', () => letter.showModal());
document.getElementById('close-letter').addEventListener('click', () => letter.close());
letter.addEventListener('click', event => { if (event.target === letter) letter.close(); });
stage.addEventListener('click', event => {
    if (event.target !== stage || suppressClick || reducedMotion.matches || paused) return;
    const heart = document.createElement('span');
    heart.className = 'touch-heart';
    heart.textContent = '♥';
    heart.setAttribute('aria-hidden', 'true');
    heart.style.left = `${event.clientX}px`;
    heart.style.top = `${event.clientY}px`;
    document.body.append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    setTimeout(() => heart.remove(), 1500);
});

function getRadius() {
    return Math.min(420, Math.max(165, window.innerWidth * .36));
}

function showGroup(group) {
    currentGroup = Math.max(0, Math.min(group, Math.max(0, groupCount - 1)));
    wrap.replaceChildren();
    photos.length = 0;
    rotation = 0;
    velocity = 0;
    suppressClick = false;
    const start = currentGroup * groupSize;
    album.slice(start, start + groupSize).forEach((photo, offset) => {
    const i = start + offset + 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'photo';
    button.setAttribute('aria-label', `Xem ảnh kỷ niệm ${i}`);
    const img = document.createElement('img');
    img.src = photo.src;
    img.decoding = 'async';
    img.alt = `Ảnh kỷ niệm ${i}`;
    img.draggable = false;
    const reflection = img.cloneNode();
    reflection.alt = '';
    reflection.className = 'reflection';
    reflection.setAttribute('aria-hidden', 'true');
    const caption = document.createElement('span');
    caption.className = 'photo-caption';
    caption.textContent = photo.caption;
    button.append(img, caption, reflection);
    button.addEventListener('click', event => {
        if (suppressClick && event.detail !== 0) return;
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        document.getElementById('modal-caption').textContent = `${photo.caption} · ${i} / ${album.length}`;
        modal.showModal();
    });
    wrap.append(button);
    photos.push(button);
    });
    groupControls.hidden = groupCount <= 1;
    groupStatus.textContent = album.length
        ? `Nhóm ${currentGroup + 1} / ${groupCount} · ${album.length} ảnh`
        : 'Chưa có ảnh kỷ niệm';
    previousGroup.disabled = currentGroup === 0;
    nextGroup.disabled = currentGroup >= groupCount - 1;
    if (!album.length) {
        const empty = document.createElement('p');
        empty.textContent = 'Chưa có ảnh kỷ niệm';
        wrap.append(empty);
    }
    arrange();
    render();
}

function arrange() {
    photos.forEach((photo, index) => {
        photo.style.transform = `rotateY(${index * (360 / photos.length)}deg) translateZ(${radius}px)`;
    });
}
function render() {
    wrap.style.transform = `rotateX(${tilt}deg) rotateY(${rotation}deg)`;
}
function updateMotionButton() {
    motionButton.textContent = paused ? 'Tiếp tục xoay' : 'Tạm dừng xoay';
    motionButton.setAttribute('aria-pressed', String(paused));
    document.body.classList.toggle('motion-paused', paused);
    if (paused) velocity = 0;
}
motionButton.addEventListener('click', () => { paused = !paused; updateMotionButton(); });
reducedMotion.addEventListener('change', event => { paused = event.matches; updateMotionButton(); });

stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || modal.open) return;
    suppressClick = false;
    velocity = 0;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, rotation, tilt, lastX: event.clientX, time: event.timeStamp };
    event.target.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 8) suppressClick = true;
    if (!suppressClick) return;
    const deltaTime = Math.max(1, event.timeStamp - drag.time);
    velocity = Math.max(-.4, Math.min(.4, (event.clientX - drag.lastX) * .25 / deltaTime));
    drag.lastX = event.clientX;
    drag.time = event.timeStamp;
    rotation = drag.rotation + dx * .25;
    tilt = Math.max(-25, Math.min(15, drag.tilt - dy * .1));
    render();
});
function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (event.type !== 'pointerup' || event.timeStamp - drag.time > 100 || reducedMotion.matches) velocity = 0;
    drag = null;
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', event => { suppressClick = true; endDrag(event); });
stage.addEventListener('lostpointercapture', endDrag);
stage.addEventListener('wheel', event => {
    if (event.ctrlKey || modal.open) return;
    event.preventDefault();
    radius = Math.max(165, Math.min(520, radius + Math.sign(event.deltaY) * 15));
    arrange();
}, { passive: false });

document.getElementById('close-modal').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
window.addEventListener('resize', () => { radius = getRadius(); arrange(); });
function animate(time) {
    const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
    previousTime = time;
    if (!paused && !drag && !modal.open && !letter.open && !document.hidden && (!wrap.contains(document.activeElement) || Math.abs(velocity) > .001)) {
        rotation = (rotation + elapsed * (.003 + velocity)) % 360;
        velocity *= Math.exp(-elapsed / 240);
        render();
    }
    requestAnimationFrame(animate);
}
showGroup(0);
updateMotionButton();
requestAnimationFrame(animate);
