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
const nav = document.querySelector("nav"); // The <nav> element, which contains the <ul>

// Function to close the main mobile menu
const closeMenu = () => {
  nav.classList.remove("open");
  // IMPORTANT: Also close the language dropdown when the main menu closes
  if (languageOptions.classList.contains("show")) {
    languageOptions.classList.remove("show");
  }
};

// Toggle main mobile menu on hamburger button click
btn.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent this click from immediately propagating to the document listener
  nav.classList.toggle("open");

  // If the menu is being closed by clicking the hamburger icon, also close the language dropdown
  if (!nav.classList.contains("open")) {
    languageOptions.classList.remove("show");
  }
});

// Close main mobile menu when clicking on any link inside the nav
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    // We want to allow the language dropdown links to redirect, so check if it's a language link
    if (!link.closest(".language-dropdown")) {
      // If it's NOT a link within the language dropdown
      closeMenu();
    }
    // For language links, the page will redirect, so no need to close the menu explicitly here.
  });
});

// NEW: Close main mobile menu when clicking on the nav's background (empty space within the open nav)
nav.addEventListener("click", (event) => {
  // If the menu is open AND the click target is exactly the nav element itself
  // (meaning, you clicked on the background, not a child link or element)
  if (nav.classList.contains("open") && event.target === nav) {
    closeMenu();
  }
});

// Close main mobile menu when clicking anywhere on the document *outside* the toggle button AND the nav itself
document.addEventListener("click", (event) => {
  // If the menu is open AND the clicked element is NOT the hamburger button
  // AND the clicked element is NOT inside the main navigation area (nav itself)
  if (
    nav.classList.contains("open") &&
    !btn.contains(event.target) &&
    !nav.contains(event.target)
  ) {
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
  // Check if iframe exists before trying to create a Vimeo.Player
  if (iframe) {
    const player = new Vimeo.Player(iframe);

    player
      .getQualities()
      .then((qualities) => {
        qualities.sort((a, b) => b.height - a.height);
        return player.setQuality(qualities[0].quality);
      })
      .catch(console.error);
  }
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

// Get references to the language dropdown elements (these were likely duplicated, consolidating)
const languageDropdownToggle = document.getElementById("language-toggle");
const languageOptions = document.querySelector(".language-options");
const languageDropdown = document.querySelector(".language-dropdown"); // The parent li element

// --- Language Dropdown Logic (moved here for clarity and to ensure all elements are defined) ---

// Toggle the visibility of the language options when the language toggle is clicked
languageDropdownToggle.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation(); // <--- THIS IS CRUCIAL FOR LANGUAGE TOGGLE
  // Toggle a class that can be used to show/hide the dropdown content via CSS
  languageOptions.classList.toggle("show");
});

// Close the language dropdown if the user clicks outside of it AND not on the main nav
document.addEventListener("click", function (event) {
  // Check if the clicked element is NOT inside the language dropdown container
  // and is NOT the language toggle button itself.
  if (
    !languageDropdown.contains(event.target) &&
    !languageDropdownToggle.contains(event.target)
  ) {
    // If the dropdown is currently open, hide it
    if (languageOptions.classList.contains("show")) {
      languageOptions.classList.remove("show");
    }
  }
});

// Add functionality for the language options themselves (EN, JA)
languageOptions.querySelectorAll("a").forEach((option) => {
  option.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior, as we'll handle the redirection
    event.stopPropagation(); // Prevent this click from closing the main menu immediately

    const selectedLang = this.dataset.lang; // Get the 'data-lang' attribute (e.g., 'en', 'ja')
    const currentPath = window.location.pathname; // Get the current path, e.g., "/portfolio/es/index.html"

    // Split the path into segments, filtering out any empty strings from leading/trailing slashes
    const pathSegments = currentPath
      .split("/")
      .filter((segment) => segment !== "");

    let newPath;
    // Assuming your structure is always like /portfolio/{lang}/page.html
    // The language code should be the second-to-last segment (e.g., 'es' in ['portfolio', 'es', 'index.html'])
    if (pathSegments.length >= 2) {
      // Replace the current language segment with the newly selected one
      pathSegments[pathSegments.length - 2] = selectedLang;
      // Reconstruct the new path with a leading slash
      newPath = "/" + pathSegments.join("/");
    } else {
      // Fallback for unexpected paths: go directly to the new language's index page
      console.warn(
        "Could not determine current language from path. Redirecting to new language's index page."
      );
      newPath = `/${selectedLang}/index.html`; // Adjust if your root path is different
    }

    // Redirect the user to the new language page
    window.location.href = newPath;

    // No need to explicitly close the dropdown here as the page will reload
  });
});
