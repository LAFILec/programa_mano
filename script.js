const PDF_FILE = 'PdM_LFec.pdf';
const EXTERNAL_URL = 'https://lafilec.github.io/LAFILec/';
const LOGO_PATH = 'lafil.png';
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let canvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('pdfCanvas');
    ctx = canvas.getContext('2d');
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const pageInfo = document.getElementById('pageInfo');
    const btnFullscreen = document.getElementById('btnFullscreen');
    const iconMaximize = document.getElementById('iconMaximize');
    const iconMinimize = document.getElementById('iconMinimize');
    const pdfContainer = document.querySelector('.pdf-container');
    const logoLink = document.getElementById('logoLink');
    const navButton = document.getElementById('navButton');
    const logoImg = document.getElementById('logoImg');
    const loadingDiv = document.getElementById('loading');
    
    navButton.href = EXTERNAL_URL;
    logoImg.src = LOGO_PATH;
    
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        location.reload();
    });
    
    function adjustScale() {
        const pdfViewer = document.querySelector('.pdf-viewer');
        const viewerWidth = pdfViewer.clientWidth - 40; 
        if (window.innerWidth < 768) {
            scale = Math.min(viewerWidth / 595, 1.5); 
        } else {
            scale = Math.min(viewerWidth / 595, 2);
        }

        if (scale < 0.8) scale = 0.8;
        if (scale > 2.5) scale = 2.5;
    }
    adjustScale();

    if (typeof pdfjsLib !== 'undefined') {
        loadingDiv.textContent = 'Cargando PDF...';
        
        pdfjsLib.getDocument(PDF_FILE).promise.then(pdf => {
            pdfDoc = pdf;
            pageInfo.textContent = `Página ${pageNum} de ${pdf.numPages}`;
            renderPage(pageNum);
        }).catch(err => {
            console.error('Error al cargar PDF con PDF.js:', err);
            loadingDiv.textContent = 'Cargando documento...';
            fallbackToIframe();
        });
    } else {
        fallbackToIframe();
    }

    function fallbackToIframe() {
        const pdfViewer = document.querySelector('.pdf-viewer');
        pdfViewer.innerHTML = '<iframe id="pdfFrame" title="PDF Viewer"></iframe>';
        const iframe = document.getElementById('pdfFrame');
        iframe.src = PDF_FILE;

        const paginationControls = document.querySelector('.controls:first-child');
        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
    }

    function renderPage(num) {
        if (!pdfDoc) return;
        
        pageRendering = true;
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            const renderTask = page.render(renderContext);
            
            renderTask.promise.then(() => {
                pageRendering = false;
                canvas.style.display = 'block';
                
                if (pageNumPending !== null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            }).catch(err => {
                console.error('Error al renderizar página:', err);
                pageRendering = false;
            });
        }).catch(err => {
            console.error('Error al obtener página:', err);
            pageRendering = false;
        });
        
        pageInfo.textContent = `Página ${num} de ${pdfDoc.numPages}`;
        btnPrevPage.disabled = (num <= 1);
        btnNextPage.disabled = (num >= pdfDoc.numPages);
    }
    
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }
    
    btnPrevPage.addEventListener('click', () => {
        if (pageNum <= 1) return;
        pageNum--;
        queueRenderPage(pageNum);
    });
    
    btnNextPage.addEventListener('click', () => {
        if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
        pageNum++;
        queueRenderPage(pageNum);
    });
    
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

    window.addEventListener('resize', () => {
        const oldScale = scale;
        adjustScale();
        if (oldScale !== scale && pdfDoc) {
            renderPage(pageNum);
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
