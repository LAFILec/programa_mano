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

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    loadPDF(isMobile);
    
    function loadPDF(mobile) {
        const container = document.getElementById('pdfCanvasContainer');
        const loadingText = document.getElementById('loadingText');
        
        if (mobile) {
            loadingText.style.display = 'none';
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 20px; padding: 40px;">
                    <svg style="width: 80px; height: 80px; color: #92400e;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <p style="color: #92400e; font-size: 1.2rem; font-weight: 600; text-align: center;">Visualización no disponible en móviles</p>
                    <a href="${PDF_FILE}" download style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(to right, #eab308, #d97706); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4);">
                        <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Descargar PDF
                    </a>
                </div>
            `;
        } else {
            const iframe = document.createElement('iframe');
            iframe.src = PDF_FILE;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.onload = function() {
                loadingText.style.display = 'none';
            };
            container.appendChild(iframe);
        }
    }

    let isFullscreen = false;
    
    btnFullscreen.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            pdfContainer.classList.add('fullscreen');
            document.querySelector('.pdf-viewer').classList.add('fullscreen');
            iconMaximize.classList.add('hidden');
            iconMinimize.classList.remove('hidden');
        } else {
            pdfContainer.classList.remove('fullscreen');
            document.querySelector('.pdf-viewer').classList.remove('fullscreen');
            iconMaximize.classList.remove('hidden');
            iconMinimize.classList.add('hidden');
        }
    });

    let wasMobile = isMobile;
    window.addEventListener('resize', () => {
        const nowMobile = window.innerWidth < 768;
        if (wasMobile !== nowMobile) {
            wasMobile = nowMobile;
            document.getElementById('pdfCanvasContainer').innerHTML = '';
            loadPDF(nowMobile);
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
