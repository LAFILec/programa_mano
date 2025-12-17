const PDF_FILE = 'PdM_LFec.pdf';
const EXTERNAL_URL = 'https://lafilec.github.io/LAFILec/';
const LOGO_PATH = 'lafil.png';

document.addEventListener('DOMContentLoaded', () => {
    const pdfFrame = document.getElementById('pdfFrame');
    const btnFullscreen = document.getElementById('btnFullscreen');
    const iconMaximize = document.getElementById('iconMaximize');
    const iconMinimize = document.getElementById('iconMinimize');
    const pdfContainer = document.querySelector('.pdf-container');
    const logoLink = document.getElementById('logoLink');
    const navButton = document.getElementById('navButton');
    const logoImg = document.getElementById('logoImg');
    
    pdfFrame.src = PDF_FILE;
    navButton.href = EXTERNAL_URL;
    logoImg.src = LOGO_PATH;
    
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        location.reload();
    });
    
    let isFullscreen = false;
    
    btnFullscreen.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            pdfFrame.classList.add('fullscreen');
            pdfContainer.classList.add('fullscreen');
            iconMaximize.classList.add('hidden');
            iconMinimize.classList.remove('hidden');
        } else {
            pdfFrame.classList.remove('fullscreen');
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

    const ambientLight = new THREE.AmbientLight(0xe6f0ff, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 150);
    pointLight1.position.set(10, 10, 8);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff4444, 1.2, 120);
    pointLight2.position.set(-10, 8, 6);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffcc, 1, 100);
    pointLight3.position.set(0, -8, 10);
    scene.add(pointLight3);

    const createChristmasTree = (x, y, z, scale) => {
        const treeGroup = new THREE.Group();
        
        const trunkGeometry = new THREE.CylinderGeometry(0.15 * scale, 0.2 * scale, 1 * scale, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a2511,
            roughness: 0.8,
            metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0;
        treeGroup.add(trunk);
        
        const foliageGeometry1 = new THREE.ConeGeometry(1.2 * scale, 1.5 * scale, 8);
        const foliageGeometry2 = new THREE.ConeGeometry(1 * scale, 1.3 * scale, 8);
        const foliageGeometry3 = new THREE.ConeGeometry(0.7 * scale, 1 * scale, 8);
        
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x0d5c2a,
            roughness: 0.7,
            metalness: 0.2
        });
        
        const cone1 = new THREE.Mesh(foliageGeometry1, foliageMaterial);
        cone1.position.y = 1 * scale;
        
        const cone2 = new THREE.Mesh(foliageGeometry2, foliageMaterial);
        cone2.position.y = 1.8 * scale;
        
        const cone3 = new THREE.Mesh(foliageGeometry3, foliageMaterial);
        cone3.position.y = 2.5 * scale;
        
        treeGroup.add(cone1, cone2, cone3);
        
        for (let i = 0; i < 8; i++) {
            const ornamentGeometry = new THREE.SphereGeometry(0.1 * scale, 8, 8);
            const ornamentMaterial = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0xff0000 : 0xffd700,
                emissive: i % 2 === 0 ? 0xcc0000 : 0xcc9900,
                emissiveIntensity: 0.5,
                metalness: 0.9,
                roughness: 0.1
            });
            const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
            const angle = (i / 8) * Math.PI * 2;
            const radius = 0.5 * scale + (Math.random() * 0.3 * scale);
            ornament.position.x = Math.cos(angle) * radius;
            ornament.position.z = Math.sin(angle) * radius;
            ornament.position.y = 1.2 * scale + Math.random() * 1.5 * scale;
            treeGroup.add(ornament);
        }
        
        const starGeometry = new THREE.ConeGeometry(0.15 * scale, 0.3 * scale, 4);
        const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1
        });
        const star1 = new THREE.Mesh(starGeometry, starMaterial);
        const star2 = new THREE.Mesh(starGeometry, starMaterial);
        star1.position.y = 3.2 * scale;
        star2.position.y = 3.2 * scale;
        star2.rotation.z = Math.PI;
        treeGroup.add(star1, star2);
        
        treeGroup.position.set(x, y, z);
        return treeGroup;
    };

    const trees = [];
    for (let i = 0; i < 6; i++) {
        const tree = createChristmasTree(
            (Math.random() - 0.5) * 25,
            -4,
            -8 - Math.random() * 8,
            0.8 + Math.random() * 0.6
        );
        tree.userData.swaySpeed = 0.5 + Math.random();
        tree.userData.swayAmount = 0.05 + Math.random() * 0.05;
        scene.add(tree);
        trees.push(tree);
    }

    const snowflakes = [];
    const snowGeometry = new THREE.SphereGeometry(0.06, 6, 6);
    const snowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
    });
    
    for (let i = 0; i < 200; i++) {
        const snowflake = new THREE.Mesh(snowGeometry, snowMaterial);
        snowflake.position.x = (Math.random() - 0.5) * 40;
        snowflake.position.y = Math.random() * 20 - 5;
        snowflake.position.z = (Math.random() - 0.5) * 30;
        snowflake.userData.velocity = Math.random() * 0.02 + 0.01;
        snowflake.userData.drift = Math.random() * 0.015;
        scene.add(snowflake);
        snowflakes.push(snowflake);
    }

    const createGift = (x, y, z, size, color1, color2) => {
        const giftGroup = new THREE.Group();
        
        const boxGeometry = new THREE.BoxGeometry(size, size, size);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: color1,
            roughness: 0.3,
            metalness: 0.4
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        giftGroup.add(box);
        
        const ribbonGeometry = new THREE.BoxGeometry(size * 1.1, size * 0.1, size * 0.1);
        const ribbonMaterial = new THREE.MeshStandardMaterial({
            color: color2,
            emissive: color2,
            emissiveIntensity: 0.3,
            roughness: 0.4,
            metalness: 0.6
        });
        const ribbon1 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        const ribbon2 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbon2.rotation.y = Math.PI / 2;
        giftGroup.add(ribbon1, ribbon2);
        
        const bowGeometry = new THREE.SphereGeometry(size * 0.2, 8, 8);
        const bow = new THREE.Mesh(bowGeometry, ribbonMaterial);
        bow.position.y = size * 0.6;
        giftGroup.add(bow);
        
        giftGroup.position.set(x, y, z);
        return giftGroup;
    };

    const gifts = [];
    const giftColors = [
        [0xcc0000, 0xffd700],
        [0x0066cc, 0xffffff],
        [0x00aa00, 0xff0000],
        [0xff6600, 0xffd700]
    ];
    
    for (let i = 0; i < 12; i++) {
        const colorPair = giftColors[i % giftColors.length];
        const gift = createGift(
            (Math.random() - 0.5) * 20,
            -5,
            -5 - Math.random() * 6,
            0.4 + Math.random() * 0.3,
            colorPair[0],
            colorPair[1]
        );
        gift.userData.floatSpeed = 1 + Math.random() * 2;
        gift.userData.rotationSpeed = 0.005 + Math.random() * 0.01;
        scene.add(gift);
        gifts.push(gift);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 400;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const createCandy = (x, y, z) => {
        const candyGroup = new THREE.Group();
        const caneGeometry = new THREE.TorusGeometry(0.3, 0.08, 8, 32, Math.PI);
        const caneMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.3
        });
        const cane = new THREE.Mesh(caneGeometry, caneMaterial);
        cane.rotation.z = -Math.PI / 2;
        
        const stickGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const stickMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xcc0000,
            emissiveIntensity: 0.3,
            roughness: 0.2,
            metalness: 0.3
        });
        const stick = new THREE.Mesh(stickGeometry, stickMaterial);
        stick.position.y = -0.2;
        
        candyGroup.add(cane, stick);
        candyGroup.position.set(x, y, z);
        return candyGroup;
    };

    const candies = [];
    for (let i = 0; i < 8; i++) {
        const candy = createCandy(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 12,
            -6 - Math.random() * 4
        );
        candy.userData.rotationSpeed = 0.01 + Math.random() * 0.02;
        scene.add(candy);
        candies.push(candy);
    }

    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.001;

        trees.forEach((tree, i) => {
            tree.rotation.z = Math.sin(time * tree.userData.swaySpeed + i) * tree.userData.swayAmount;
        });

        snowflakes.forEach((snowflake, i) => {
            snowflake.position.y -= snowflake.userData.velocity;
            snowflake.position.x += Math.sin(time * 2 + i) * snowflake.userData.drift;
            snowflake.rotation.y += 0.02;
            
            if (snowflake.position.y < -10) {
                snowflake.position.y = 10;
                snowflake.position.x = (Math.random() - 0.5) * 40;
            }
        });

        gifts.forEach((gift, i) => {
            gift.position.y = -5 + Math.sin(time * gift.userData.floatSpeed + i) * 0.15;
            gift.rotation.y += gift.userData.rotationSpeed;
        });

        candies.forEach(candy => {
            candy.rotation.y += candy.userData.rotationSpeed;
        });

        particlesMesh.rotation.y += 0.0002;

        pointLight1.intensity = 1.5 + Math.sin(time * 2) * 0.3;
        pointLight2.intensity = 1.2 + Math.cos(time * 1.8) * 0.3;

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