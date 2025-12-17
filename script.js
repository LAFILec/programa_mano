const PDF_FILE = 'PdM_LFec.pdf';
const EXTERNAL_URL = 'https://lafilec.github.io/LAFILec/';
const LOGO_PATH = 'lafil.png';

document.addEventListener('DOMContentLoaded', () => {
    const btnFullscreen = document.getElementById('btnFullscreen');
    const iconMaximize = document.getElementById('iconMaximize');
    const iconMinimize = document.getElementById('iconMinimize');
    const pdfContainer = document.querySelector('.pdf-container');
    const logoLink = document.getElementById('logoLink');
    const navButton = document.getElementById('navButton');
    const logoImg = document.getElementById('logoImg');
    
    navButton.href = EXTERNAL_URL;
    logoImg.src = LOGO_PATH;
    
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        location.reload();
    });

    loadPDFWithIframe();
    
    function loadPDFWithIframe() {
        const pdfViewer = document.querySelector('.pdf-viewer');
        pdfViewer.innerHTML = '<iframe id="pdfFrame" title="PDF Viewer"></iframe>';
        const iframe = document.getElementById('pdfFrame');
        iframe.src = PDF_FILE;

        const paginationControls = document.querySelector('.controls:first-child');
        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
    }

    let isFullscreen = false;
    
    btnFullscreen.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            pdfContainer.classList.add('fullscreen');
            iconMaximize.classList.add('hidden');
            iconMinimize.classList.remove('hidden');
        } else {
            pdfContainer.classList.remove('fullscreen');
            iconMaximize.classList.remove('hidden');
            iconMinimize.classList.add('hidden');
        }
    });

    init3DScene();
});

function init3DScene() {
    const canvas = document.getElementById('canvas3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 12;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const snowflakes = [];
    const snowGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const snowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95
    });
    
    for (let i = 0; i < 300; i++) {
        const snowflake = new THREE.Mesh(snowGeometry, snowMaterial);
        snowflake.position.x = (Math.random() - 0.5) * 50;
        snowflake.position.y = Math.random() * 30;
        snowflake.position.z = (Math.random() - 0.5) * 40;
        snowflake.userData.velocity = Math.random() * 0.03 + 0.015;
        snowflake.userData.drift = Math.random() * 0.02;
        scene.add(snowflake);
        snowflakes.push(snowflake);
    }

    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.001;

        snowflakes.forEach((snowflake, i) => {
            snowflake.position.y -= snowflake.userData.velocity;
            snowflake.position.x += Math.sin(time * 2 + i) * snowflake.userData.drift;
            snowflake.rotation.y += 0.02;
            snowflake.rotation.x += 0.01;
            
            if (snowflake.position.y < -15) {
                snowflake.position.y = 15;
                snowflake.position.x = (Math.random() - 0.5) * 50;
                snowflake.position.z = (Math.random() - 0.5) * 40;
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
}
