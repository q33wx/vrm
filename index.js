// State Variables
let currentViewMode = 'booklet'; // 'booklet' or 'sheets'
let bookletState = 'show-front'; // 'show-front', 'show-inside', 'show-back'

document.addEventListener('DOMContentLoaded', () => {
    // Set default body class
    document.body.className = 'view-booklet';
    
    // Initialize previews by copying high-fidelity DOM content
    initializePreviews();

    // Setup booklet transition event handlers
    setupBookletInteractions();
    
    // Initialize booklet state
    setBookletState('show-front');
});

// Cloning content from high-fidelity print DOM to preview wrappers
function initializePreviews() {
    // 1. Clones for Sheets View
    const s1Wrapper = document.getElementById('scale-s1');
    const s2Wrapper = document.getElementById('scale-s2');
    
    const outsideClone = document.getElementById('sheet-outside').cloneNode(true);
    outsideClone.removeAttribute('id');
    s1Wrapper.innerHTML = '';
    s1Wrapper.appendChild(outsideClone);

    const insideClone = document.getElementById('sheet-inside').cloneNode(true);
    insideClone.removeAttribute('id');
    s2Wrapper.innerHTML = '';
    s2Wrapper.appendChild(insideClone);

    // 2. Clones for Booklet View
    const insideLeftPreview = document.querySelector('.inside-left-preview');
    const insideRightPreview = document.querySelector('.inside-right-preview');

    const insideLeftContent = document.querySelector('.page-inside-left').cloneNode(true);
    insideLeftContent.className = 'print-page page-inside-left booklet-inner-page';
    insideLeftPreview.innerHTML = '';
    insideLeftPreview.appendChild(insideLeftContent);

    // Remove dashed border in booklet preview for cleaner display
    const leftBorder = insideLeftContent.querySelector('.inside-page-border');
    if (leftBorder) leftBorder.style.display = 'none';

    const insideRightContent = document.querySelector('.page-inside-right').cloneNode(true);
    insideRightContent.className = 'print-page page-inside-right booklet-inner-page';
    insideRightPreview.innerHTML = '';
    insideRightPreview.appendChild(insideRightContent);

    // Remove dashed border in booklet preview for cleaner display
    const rightBorder = insideRightContent.querySelector('.inside-page-border');
    if (rightBorder) rightBorder.style.display = 'none';
}

// Set View Mode: 'booklet' or 'sheets'
function setViewMode(mode) {
    currentViewMode = mode;
    
    // Toggle Active Class on buttons
    document.getElementById('btn-booklet').classList.toggle('active', mode === 'booklet');
    document.getElementById('btn-sheets').classList.toggle('active', mode === 'sheets');
    
    // Toggle Class on Body
    document.body.className = `view-${mode}`;
}

// Booklet State Machine & Page Turning Interaction
function setupBookletInteractions() {
    const book = document.getElementById('book');
    const frontCover = document.getElementById('bp-front');
    const backCover = document.getElementById('bp-back');
    const insideSpread = document.getElementById('bp-inside');

    // Click front cover -> open to inside
    frontCover.addEventListener('click', () => {
        setBookletState('show-inside');
    });

    // Click back cover -> open back to inside
    backCover.addEventListener('click', () => {
        setBookletState('show-inside');
    });

    // Click inside spread -> determine left or right click to flip accordingly
    insideSpread.addEventListener('click', (e) => {
        const rect = insideSpread.getBoundingClientRect();
        const clickX = e.clientX - rect.left; // x position within element
        const width = rect.width;

        if (clickX < width / 2) {
            // Clicked left side -> go back to Front Cover
            setBookletState('show-front');
        } else {
            // Clicked right side -> go to Back Cover
            setBookletState('show-back');
        }
    });
}

function setBookletState(state) {
    bookletState = state;
    const book = document.getElementById('book');
    
    // Reset all state classes
    book.classList.remove('show-front', 'show-inside', 'show-back');
    
    // Add active state class
    book.classList.add(state);
}

// Print Handler
function triggerPrint() {
    window.print();
}
