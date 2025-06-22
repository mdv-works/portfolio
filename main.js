const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target); // solo anima una vez
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll("[data-animate]").forEach((el) => {
  observer.observe(el);
});

// Script 3D
// Get container
const container = document.getElementById("background-3d");

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false; // Disable all shadows
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load Font
const loader = new THREE.FontLoader();
loader.load(
  "https://ik.imagekit.io/bnkcab5v4/PORTFOLIO%20MDV/DentonText_Regular.json?updatedAt=1750530748021",
  function (font) {
    const geometry = new THREE.TextGeometry("mdv", {
      font: font,
      size: 5.2,
      height: 0.1, // Thickness
      curveSegments: 35,
    });

    // Reflective material
    const material = new THREE.MeshStandardMaterial({
      color: 0x2f439f, // Base color
    });

    const pivot = new THREE.Object3D(); // Create a pivot point
    scene.add(pivot);

    const textMesh = new THREE.Mesh(geometry, material);

    // Shift the mesh relative to the pivot
    textMesh.position.set(-8, -1.2, 0.2); // Move it left so it rotates around a different point
    pivot.add(textMesh); // Add to the pivot instead of the scene
    textMesh.castShadow = false;
    textMesh.receiveShadow = false;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      pivot.rotation.y += 0.003; // Rotate the pivot, not the mesh directly
      pivot.rotation.x += 0.005; // Rotate the pivot, not the mesh directly
      renderer.render(scene, camera);
    }

    animate();
  }
);

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Scale the blur effect – tweak the factor (e.g. 0.02) to control how fast it grows
  const blurAmount = Math.min(scrollY * 0.09, 100); // cap blur to 10px max

  // Optionally dim the brightness a little when scrolling
  const brightnessAmount = Math.max(1 - scrollY * 0.0015, 0.0015);

  document.getElementById(
    "background-3d"
  ).style.filter = `blur(${blurAmount}px) brightness(${brightnessAmount})`;
});

(function () {
  const h2 = document.querySelector("header h2[data-animate]");
  let vh = window.innerHeight - 850;
  const speed = 1.15; // 0 = stuck forever, 1 = normal scroll speed

  // Recompute on resize
  window.addEventListener("resize", () => {
    vh = window.innerHeight;
    update(); // re‐apply in case scrollY < new vh
  });

  // Core update function
  function update() {
    const y = window.scrollY;
    if (y < vh) {
      // still in the first viewport: keep center
      h2.style.transform = "translate(-50%, -50%)";
    } else {
      // past 100vh: drift up at 'speed'
      const offset = (y - vh) * speed;
      h2.style.transform = `translate(-50%, -50%) translateY(-${offset}px)`;
    }
  }

  // Wire it up
  window.addEventListener("scroll", update);

  // Initial call to lock into place immediately
  update();
})();

const btn = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");
btn.addEventListener("click", () => {
  nav.classList.toggle("open");
});
