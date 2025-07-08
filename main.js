window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  const content = document.getElementById("content");

  // fade out the preloader
  pre.classList.add("fade-out");

  // once fade-out is done, hide it and show your content
  pre.addEventListener("transitionend", () => {
    pre.style.display = "none";
    content.style.display = "";
  });
});

// Menu hamburguesa

const btn = document.getElementById("menu-toggle"); // Assuming "menu-toggle" is your hamburger button's ID
const nav = document.querySelector("nav");

// Function to close the menu
const closeMenu = () => {
  nav.classList.remove("open");
};

// Toggle menu on hamburger button click
btn.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent this click from immediately propagating to the document listener
  nav.classList.toggle("open");
});

// Close menu when clicking on any link inside the nav
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    // Optionally, you might want to stop propagation here too if your links
    // trigger other events or hash changes that might interfere.
    // event.stopPropagation();
    closeMenu();
  });
});

// Close menu when clicking anywhere on the document *except* the toggle button
document.addEventListener("click", (event) => {
  // If the menu is open AND the clicked element is NOT the hamburger button
  if (nav.classList.contains("open") && !btn.contains(event.target)) {
    closeMenu();
  }
});

// --- Intersection Observer code (remains unchanged as it's not related to menu closing) ---
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

// Parallax header

(function () {
  const h2 = document.querySelector("header h2[data-animate]");
  let vh = window.innerHeight;
  const speed = 1.2;

  window.addEventListener("resize", () => {
    vh = window.innerHeight;
    update(); // re-center if viewport size changes
  });

  function update() {
    const y = window.scrollY + 200;
    if (y < vh) {
      h2.style.transform = "translate(-50%, -50%)";
    } else {
      const offset = (y - vh) * speed;
      h2.style.transform = `translate(-50%, -50%) translateY(-${offset}px)`;
    }
  }

  window.addEventListener("scroll", update);
  update(); // ← fire once on load so it never “jumps” into place
})();

// Calidad máxima vimeo
document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.querySelector(".project-image iframe");
  const player = new Vimeo.Player(iframe);

  player
    .getQualities()
    .then((qualities) => {
      qualities.sort((a, b) => b.height - a.height);
      return player.setQuality(qualities[0].quality);
    })
    .catch(console.error);
});

document.addEventListener("DOMContentLoaded", () => {
  const subtitle = document.querySelector(".center-subtitle");
  if (!subtitle) return;

  const speed = 0.32; // 0.3 = subtitle moves at 30% of scroll speed

  let latestY = 0,
    ticking = false;

  function onScroll() {
    latestY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    // Use translate3d for GPU acceleration
    subtitle.style.transform = `translate3d(0, ${latestY * speed}px, 0)`;
    ticking = false;
  }

  // initial position
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
});
