function scrollToProducts() {
  const productsSection = document.querySelector('.products-grid');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    console.log('Scrolling to products section');
  }
}

function scrollToReviews() {
  const reviewsSection = document.querySelector('.reviews-section');
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    console.log('Scrolling to reviews section');
  }
}

// Initialize Swiper
document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 55,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      disabledClass: 'swiper-button-disabled-hidden',
      hideOnClick: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 55,
      },
    },
    loop: true,
    centeredSlides: false,
    allowTouchMove: true,
    watchOverflow: false,
  });

  // Force navigation buttons to always be enabled and visible
  const nextButton = document.querySelector('.swiper-button-next');
  const prevButton = document.querySelector('.swiper-button-prev');

  // Remove disabled classes and ensure visibility
  const forceEnableButtons = () => {
    if (nextButton) {
      nextButton.classList.remove('swiper-button-disabled');
      nextButton.style.opacity = '1';
      nextButton.style.pointerEvents = 'auto';
    }
    if (prevButton) {
      prevButton.classList.remove('swiper-button-disabled');
      prevButton.style.opacity = '1';
      prevButton.style.pointerEvents = 'auto';
    }
  };

  // Initial force enable
  forceEnableButtons();

  // Force enable on all swiper events
  swiper.on('slideChange', forceEnableButtons);
  swiper.on('reachEnd', forceEnableButtons);
  swiper.on('reachBeginning', forceEnableButtons);
  swiper.on('transitionEnd', forceEnableButtons);
});

// Generate star rating HTML
function createStarRating(rating = 5, size = 16) {
  const starSVG = `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.61212 15.443C3.22612 15.641 2.78812 15.294 2.86612 14.851L3.69612 10.121L0.173118 6.76501C-0.155882 6.45101 0.0151183 5.87701 0.456118 5.81501L5.35412 5.11901L7.53812 0.792012C7.73512 0.402012 8.26812 0.402012 8.46512 0.792012L10.6491 5.11901L15.5471 5.81501C15.9881 5.87701 16.1591 6.45101 15.8291 6.76501L12.3071 10.121L13.1371 14.851C13.2151 15.294 12.7771 15.641 12.3911 15.443L8.00012 13.187L3.61212 15.443Z" fill="#F8BE00"/>
  </svg>`;

  return starSVG.repeat(rating);
}

// Initialize star ratings
function initializeStarRatings() {
  document.querySelectorAll('.review-stars').forEach((container) => {
    if (!container.innerHTML.trim()) {
      const size = container.dataset.starSize || 16;
      container.innerHTML = createStarRating(5, parseInt(size));
      console.log('Initialized stars with size:', size);
    }
  });
}

// Initialize star ratings on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeStarRatings();

  // Also watch for dynamically added star containers (for Shopify components)
  const observer = new MutationObserver(() => {
    initializeStarRatings();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

// Add click listener to product rating to scroll to reviews
document.addEventListener('DOMContentLoaded', function () {
  function addProductRatingListener() {
    const productRating = document.querySelector('.product-rating');
    if (productRating && !productRating.dataset.listenerAdded) {
      productRating.addEventListener('click', scrollToReviews);
      productRating.dataset.listenerAdded = 'true';
      console.log('Product rating click listener added');
      return true;
    }
    return false;
  }

  // Try immediately
  if (!addProductRatingListener()) {
    // If not found, watch for it to be added by Shopify components
    const observer = new MutationObserver(() => {
      if (addProductRatingListener()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Fallback timeout
    setTimeout(() => {
      addProductRatingListener();
      observer.disconnect();
    }, 2000);
  }
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function () {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      // Support semantic <dt>/<dd> structure: if button is in <dt>, answer is dt's next sibling
      const answer = this.parentElement.classList.contains('faq-question')
        ? this.nextElementSibling
        : this.parentElement.nextElementSibling;

      // Close all other FAQ items
      faqQuestions.forEach((otherQuestion) => {
        if (otherQuestion !== this) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherQuestion.parentElement.classList.contains(
            'faq-question'
          )
            ? otherQuestion.nextElementSibling
            : otherQuestion.parentElement.nextElementSibling;
          if (otherAnswer) {
            otherAnswer.classList.remove('active');
          }
        }
      });

      // Toggle current FAQ item
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        answer.classList.remove('active');
      } else {
        this.setAttribute('aria-expanded', 'true');
        answer.classList.add('active');
      }
    });
  });
});

// Product Info Accordion functionality
function initProductInfoAccordion() {
  const productInfoQuestions = document.querySelectorAll(
    '.product-info-question'
  );

  if (productInfoQuestions.length === 0) {
    console.log('Product info accordion buttons not found yet, will retry...');
    return false;
  }

  productInfoQuestions.forEach((question) => {
    // Remove existing listeners to avoid duplicates
    const newQuestion = question.cloneNode(true);
    question.parentNode.replaceChild(newQuestion, question);

    newQuestion.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      // Support semantic <dt>/<dd> structure: if button is in <dt>, answer is dt's next sibling
      const answer = this.parentElement.classList.contains(
        'product-info-question'
      )
        ? this.nextElementSibling
        : this.parentElement.nextElementSibling;
      const allQuestions = document.querySelectorAll('.product-info-question');

      // Close all other product info items
      allQuestions.forEach((otherQuestion) => {
        if (otherQuestion !== this) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherQuestion.parentElement.classList.contains(
            'product-info-question'
          )
            ? otherQuestion.nextElementSibling
            : otherQuestion.parentElement.nextElementSibling;
          if (otherAnswer) {
            otherAnswer.classList.remove('active');
          }
        }
      });

      // Toggle current product info item
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        answer.classList.remove('active');
      } else {
        this.setAttribute('aria-expanded', 'true');
        answer.classList.add('active');
      }
    });
  });

  console.log(
    'Product info accordion initialized with',
    productInfoQuestions.length,
    'items'
  );
  return true;
}

// Handle metafield fallback logic
function handleMetafieldFallbacks() {
  const metafieldContents = document.querySelectorAll('[data-metafield]');

  metafieldContents.forEach((container) => {
    const shopifyData = container.querySelector(
      'shopify-data.metafield-content'
    );
    const fallbackSpan = container.querySelector('.fallback-content');

    if (!shopifyData || !fallbackSpan) return;

    // Wait a bit for Shopify components to populate
    setTimeout(() => {
      const metafieldText = shopifyData.textContent?.trim();

      if (metafieldText && metafieldText.length > 0) {
        // Metafield has data - show it, hide fallback
        shopifyData.style.display = 'block';
        fallbackSpan.style.display = 'none';
        console.log(
          'Using metafield data for:',
          container.dataset.metafield,
          '-',
          metafieldText
        );
      } else {
        // No metafield data - show fallback
        shopifyData.style.display = 'none';
        fallbackSpan.style.display = 'block';
        console.log('Using fallback data for:', container.dataset.metafield);
      }
    }, 500);
  });
}

// Try to initialize accordion after DOM loads
document.addEventListener('DOMContentLoaded', function () {
  // Try immediately
  if (!initProductInfoAccordion()) {
    // If not found, wait for Shopify components to render
    setTimeout(() => {
      if (!initProductInfoAccordion()) {
        // Try one more time after a longer delay
        setTimeout(() => {
          initProductInfoAccordion();
          handleMetafieldFallbacks();
        }, 1000);
      } else {
        handleMetafieldFallbacks();
      }
    }, 500);
  } else {
    handleMetafieldFallbacks();
  }
});

// ===========================================
// HOOK CUSTOMIZER FUNCTIONALITY
// ===========================================

// Configuration - Color options and image paths
const COLORS = [
  { name: 'Black', hex: '#121212' },
  { name: 'Dark Gray', hex: '#4B4B4B' },
  { name: 'Gray', hex: '#A9A9A9' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Light Gray', hex: '#D3D3D3' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Antique White', hex: '#FAEBD7' },
  { name: 'Terra Cotta', hex: '#E2725B' },
  { name: 'Red', hex: '#FF0800' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Deep Purple', hex: '#673AB7' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Dark Green', hex: '#0F4813' },
  { name: 'Light Green', hex: '#A7D3A0' },
  { name: 'Green', hex: '#14771F' },
  { name: 'Lime', hex: '#16B210' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Powder Blue', hex: '#B0E0E6' },
];

const CONFIG = {
  rails: {
    style1: {
      3: 'assets/rails/rail-style1-3.webp',
      6: 'assets/rails/rail-style1-6.webp',
      9: 'assets/rails/rail-style1-9.webp',
    },
    style2: {
      3: 'assets/rails/rail-style2-3.webp',
      6: 'assets/rails/rail-style2-6.webp',
      9: 'assets/rails/rail-style2-9.webp',
    },
  },
  hookTemplate: 'assets/hooks/hook-template.webp',
  // Pre-rendered hook images for accurate colors
  // Map color names (lowercase) to image paths
  hookImages: {
    black: 'assets/hooks/hook-black.webp',
    'dark gray': 'assets/hooks/hook-dark-gray.webp',
    gray: 'assets/hooks/hook-gray.webp',
    silver: 'assets/hooks/hook-silver.webp',
    'light gray': 'assets/hooks/hook-light-gray.webp',

    'antique white': 'assets/hooks/hook-antique-white.webp',
    white: 'assets/hooks/hook-white.webp',
    'terra cotta': 'assets/hooks/hook-terra-cotta.webp',
    red: 'assets/hooks/hook-red.webp',
    'hot pink': 'assets/hooks/hook-hot-pink.webp',
    'deep purple': 'assets/hooks/hook-deep-purple.webp',
    orange: 'assets/hooks/hook-orange.webp',
    yellow: 'assets/hooks/hook-yellow.webp',
    'dark green': 'assets/hooks/hook-dark-green.webp',
    'light green': 'assets/hooks/hook-light-green.webp',
    green: 'assets/hooks/hook-green.webp',
    lime: 'assets/hooks/hook-lime.webp',
    navy: 'assets/hooks/hook-navy.webp',
    'sky blue': 'assets/hooks/hook-sky-blue.webp',
    'powder blue': 'assets/hooks/hook-powder-blue.webp',
  },
  hookSizes: {
    3: '14%',
    6: '10%',
    9: '4%',
  },
  hook3Positions: [
    { left: 20, top: 38 },
    { left: 54.5, top: 24 },
    { left: 89, top: 10 },
  ],
  hook6Positions: [
    { left: 11.0, top: 54.0 }, // #1
    { left: 26.8, top: 39.6 }, // #2
    { left: 42.6, top: 25.2 }, // #3
    { left: 58.4, top: 10.8 }, // #4
    { left: 74.2, top: -3.6 }, // #5
    { left: 90.0, top: -18.0 }, // #6
  ],

  hook9Positions: [
    { left: 7, top: 100 },
    { left: 18, top: 81.875 },
    { left: 29, top: 63.75 },
    { left: 40, top: 45.625 },
    { left: 51, top: 27.5 },
    { left: 62, top: 9.375 },
    { left: 73, top: -8.75 },
    { left: 84, top: -26.875 },
    { left: 95, top: -45 },
  ],
};

// State
let hookState = {
  railStyle: 'style1',
  hookCount: 3,
  hookColors: ['#FF0800', '#FF0800', '#FF0800'], // Array of colors, one per hook position
  hookColorNames: ['Red', 'Red', 'Red'], // Array of color names
  selectedHookPosition: 0, // Currently selected hook position (0-indexed)
  selectedInlineColor: null, // Currently selected color from inline selector {hex: '', name: ''}
};

// localStorage key for persisting state
const STORAGE_KEY = 'toughook-customizer-state';

// Save state to localStorage
function saveStateToLocalStorage() {
  try {
    const stateToSave = {
      railStyle: hookState.railStyle,
      hookCount: hookState.hookCount,
      hookColors: hookState.hookColors,
      hookColorNames: hookState.hookColorNames,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    console.log('✓ State saved to localStorage:', stateToSave);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

// Load state from localStorage
function loadStateFromLocalStorage() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) {
      console.log('No saved state found in localStorage');
      return false;
    }

    const parsed = JSON.parse(savedState);
    console.log('Loaded state from localStorage:', parsed);

    // Validate the loaded state
    if (
      !parsed.railStyle ||
      !parsed.hookCount ||
      !Array.isArray(parsed.hookColors) ||
      !Array.isArray(parsed.hookColorNames)
    ) {
      console.warn('Invalid saved state, using defaults');
      return false;
    }

    // Validate arrays match hook count
    if (
      parsed.hookColors.length !== parsed.hookCount ||
      parsed.hookColorNames.length !== parsed.hookCount
    ) {
      console.warn('Saved state array lengths mismatch, using defaults');
      return false;
    }

    // Apply the loaded state
    hookState.railStyle = parsed.railStyle;
    hookState.hookCount = parsed.hookCount;
    hookState.hookColors = parsed.hookColors;
    hookState.hookColorNames = parsed.hookColorNames;

    console.log('✓ State restored from localStorage');
    return true;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return false;
  }
}

// Initialize hook customizer after Shopify components are ready
function initializeHookCustomizer() {
  console.log('=== HOOK CUSTOMIZER INITIALIZATION START ===');
  console.log('Initial state:', JSON.stringify(hookState));

  console.log('Step 1: Loading saved state from localStorage...');
  const stateLoaded = loadStateFromLocalStorage();

  console.log('Step 2: Initializing modal color swatches...');
  initColorSwatches();

  console.log('Step 3: Initializing inline color swatches...');
  initInlineColorSwatches();

  console.log('Step 4: Initializing event listeners...');
  initEventListeners();

  if (stateLoaded) {
    console.log('Step 5: Updating UI to match loaded state...');
    updateUIFromState();
  }

  console.log('Step 6: Initializing line item properties...');
  updateLineItemProperties();

  console.log('Step 7: Rendering hooks...');
  renderHooks();

  console.log('=== HOOK CUSTOMIZER INITIALIZATION COMPLETE ===');
}

// Update UI elements to match current state
function updateUIFromState() {
  // Update rail style buttons
  document.querySelectorAll('.rail-style-button').forEach((btn) => {
    const isActive = btn.dataset.railStyle === hookState.railStyle;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
  });

  // Update hook count buttons
  document.querySelectorAll('.hook-count-button').forEach((btn) => {
    const isActive = parseInt(btn.dataset.hookCount) === hookState.hookCount;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
  });

  // Update finish text
  const finishText = document.getElementById('railFinishText');
  if (finishText) {
    finishText.textContent =
      hookState.railStyle === 'style1' ? 'White Finish' : 'Oak Finish';
  }

  // Update rail image
  updateRailImage();

  // Update variant selection
  updateVariantSelection();

  console.log('✓ UI updated to match loaded state');
}

// Wait for Shopify Web Components to render the template content
let initialized = false;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, waiting for Shopify components to render...');

  // Use MutationObserver to detect when the customizer elements are added to DOM
  const observer = new MutationObserver((mutations, obs) => {
    const modalContainer = document.getElementById(
      'modalColorSwatchesContainer'
    );
    const hooksContainer = document.getElementById('hooksContainer');
    const inlineContainer = document.getElementById('inlineColorSwatches');

    if (modalContainer && hooksContainer && inlineContainer && !initialized) {
      initialized = true;
      console.log('✓ Customizer elements found in DOM!');
      obs.disconnect(); // Stop observing
      initializeHookCustomizer();
      logProductMetafield();
    }
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Fallback: Try initialization after a delay if observer doesn't catch it
  setTimeout(() => {
    if (
      document.getElementById('modalColorSwatchesContainer') &&
      document.getElementById('inlineColorSwatches') &&
      !initialized
    ) {
      initialized = true;
      console.log('Fallback: Initializing via timeout');
      observer.disconnect();
      initializeHookCustomizer();
      logProductMetafield();
    }
  }, 1000);
});

// Log product metafield content
function logProductMetafield() {
  console.log('=== LOGGING PRODUCT METAFIELD ===');

  // Wait for DOM to be ready, then add a hidden metafield logger to the page
  setTimeout(() => {
    // Create a new product context just for logging metafields
    const loggerContext = document.createElement('shopify-context');
    loggerContext.setAttribute('type', 'product');
    loggerContext.setAttribute('handle', 'toughook-coat-rack');
    loggerContext.style.display = 'none';

    const loggerTemplate = document.createElement('template');
    loggerTemplate.innerHTML = `
      <shopify-context type="metafield" query="product.metafield" namespace="specifications" key="dimensions">
        <template>
          <div id="metafield-logger-output">
            <shopify-data query="metafield.value"></shopify-data>
          </div>
        </template>
      </shopify-context>
    `;

    loggerContext.appendChild(loggerTemplate);
    document.body.appendChild(loggerContext);

    // Wait for Shopify to render the metafield
    setTimeout(() => {
      const output = document.getElementById('metafield-logger-output');
      if (output) {
        const metafieldContent = output.textContent?.trim();

        if (metafieldContent && metafieldContent.length > 0) {
          console.log('✓ Metafield specifications.dimensions content:');
          console.log(metafieldContent);
          console.log('Content length:', metafieldContent.length, 'characters');
        } else {
          console.log(
            '⚠ Metafield specifications.dimensions is empty or not found'
          );
          console.log('Make sure:');
          console.log(
            '  1. The metafield exists with namespace "specifications" and key "dimensions"'
          );
          console.log(
            '  2. You have a public-access-token in the shopify-store component'
          );
          console.log(
            '  3. The metafield is exposed to Storefront API (PUBLIC_READ access)'
          );
        }

        // Clean up
        loggerContext.remove();
      } else {
        console.log(
          '⚠ Metafield output element not found - component may not have rendered'
        );
      }
    }, 2000);
  }, 500);
}

// Generate color swatches in modal
function initColorSwatches() {
  console.log('initColorSwatches() called');
  const container = document.getElementById('modalColorSwatchesContainer');
  console.log('Modal container found:', !!container);

  if (!container) {
    console.error('ERROR: modalColorSwatchesContainer not found!');
    return;
  }

  console.log('Creating', COLORS.length, 'color swatches in modal...');

  COLORS.forEach((color, index) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'hook-color-swatch' + (index === 0 ? ' active' : '');
    swatch.dataset.colorHex = color.hex;
    swatch.dataset.colorName = color.name;
    swatch.style.backgroundColor = color.hex;
    swatch.setAttribute('aria-label', color.name);
    swatch.setAttribute('title', color.name);

    if (index === 0) {
      swatch.innerHTML = `<svg class="swatch-check" width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    }

    swatch.addEventListener('click', handleColorChange);
    container.appendChild(swatch);
  });

  // Add custom color picker swatch
  const customSwatch = document.createElement('button');
  customSwatch.type = 'button';
  customSwatch.className = 'hook-color-swatch hook-color-swatch-custom';
  customSwatch.setAttribute('aria-label', 'Custom Color');
  customSwatch.setAttribute('title', 'Custom Color');
  customSwatch.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_91_681)">
<path d="M13.4834 10.3519L10.8186 7.68579V9.80314H10.5577C9.33853 9.80314 8.5526 9.08434 7.84023 8.08002C7.64383 8.40064 7.43673 8.73399 7.2124 9.06469C8.02063 10.091 9.03943 10.9003 10.5577 10.9003H10.8185V13.0174L13.4834 10.3519Z" fill="#747474"/>
<path d="M13.4812 3.76989L10.8163 1.10376V3.22113H10.5554C8.23635 3.22113 7.0825 5.10923 6.0645 6.77508C5.07125 8.40031 4.2135 9.80396 2.50973 9.80396H0.681152V10.9011H2.50973C4.8288 10.9011 5.98265 9.01301 7.00065 7.34716C7.9939 5.72189 8.85165 4.31824 10.5554 4.31824H10.8163V6.43539L13.4812 3.76989Z" fill="#747474"/>
<path d="M2.50973 3.22095H0.681152V4.3181H2.50973C3.72888 4.3181 4.5148 5.0369 5.22718 6.04122C5.42358 5.7206 5.63068 5.38725 5.855 5.05655C5.04675 4.0302 4.02795 3.22095 2.50973 3.22095Z" fill="#747474"/>
</g>
<defs>
<clipPath id="clip0_91_681">
<rect width="12.8" height="12.8" fill="white" transform="translate(0.681152 0.6604)"/>
</clipPath>
</defs>
</svg>`;
  customSwatch.addEventListener('click', handleRandomColorInModal);
  container.appendChild(customSwatch);

  console.log(
    '✓ Color swatches initialized in modal:',
    container.children.length,
    'swatches created (including random color button)'
  );
}

// Generate color swatches in inline selector
function initInlineColorSwatches() {
  console.log('initInlineColorSwatches() called');
  const container = document.getElementById('inlineColorSwatches');
  console.log('Inline swatches container found:', !!container);

  if (!container) {
    console.error('ERROR: inlineColorSwatches container not found!');
    return;
  }

  console.log(
    'Creating',
    COLORS.length,
    'color swatches in inline selector...'
  );

  COLORS.forEach((color, index) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'hook-color-swatch';
    swatch.dataset.colorHex = color.hex;
    swatch.dataset.colorName = color.name;
    swatch.style.backgroundColor = color.hex;
    swatch.setAttribute('aria-label', color.name);
    swatch.setAttribute('title', color.name);

    swatch.addEventListener('click', handleInlineColorClick);
    container.appendChild(swatch);
  });

  // Add custom color picker swatch
  const customSwatch = document.createElement('button');
  customSwatch.type = 'button';
  customSwatch.className = 'hook-color-swatch hook-color-swatch-custom';
  customSwatch.setAttribute('aria-label', 'Custom Color');
  customSwatch.setAttribute('title', 'Custom Color');
  customSwatch.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_91_681_inline)">
<path d="M13.4834 10.3519L10.8186 7.68579V9.80314H10.5577C9.33853 9.80314 8.5526 9.08434 7.84023 8.08002C7.64383 8.40064 7.43673 8.73399 7.2124 9.06469C8.02063 10.091 9.03943 10.9003 10.5577 10.9003H10.8185V13.0174L13.4834 10.3519Z" fill="#747474"/>
<path d="M13.4812 3.76989L10.8163 1.10376V3.22113H10.5554C8.23635 3.22113 7.0825 5.10923 6.0645 6.77508C5.07125 8.40031 4.2135 9.80396 2.50973 9.80396H0.681152V10.9011H2.50973C4.8288 10.9011 5.98265 9.01301 7.00065 7.34716C7.9939 5.72189 8.85165 4.31824 10.5554 4.31824H10.8163V6.43539L13.4812 3.76989Z" fill="#747474"/>
<path d="M2.50973 3.22095H0.681152V4.3181H2.50973C3.72888 4.3181 4.5148 5.0369 5.22718 6.04122C5.42358 5.7206 5.63068 5.38725 5.855 5.05655C5.04675 4.0302 4.02795 3.22095 2.50973 3.22095Z" fill="#747474"/>
</g>
<defs>
<clipPath id="clip0_91_681_inline">
<rect width="12.8" height="12.8" fill="white" transform="translate(0.681152 0.6604)"/>
</clipPath>
</defs>
</svg>`;
  customSwatch.addEventListener('click', handleRandomColorInline);
  container.appendChild(customSwatch);

  console.log(
    '✓ Inline color swatches initialized:',
    container.children.length,
    'swatches created (including random color button)'
  );
}

// Handle inline color swatch click
function handleInlineColorClick(event) {
  const swatch = event.currentTarget;
  console.log('=== INLINE COLOR SELECTED ===');
  console.log(
    'Selected color:',
    swatch.dataset.colorName,
    swatch.dataset.colorHex
  );

  // Update state
  hookState.selectedInlineColor = {
    hex: swatch.dataset.colorHex,
    name: swatch.dataset.colorName,
  };

  // Update visual state of all inline swatches
  document
    .querySelectorAll('#inlineColorSwatches .hook-color-swatch')
    .forEach((sw) => {
      sw.classList.remove('active');
      // Don't clear innerHTML of custom color swatch
      if (!sw.classList.contains('hook-color-swatch-custom')) {
        sw.innerHTML = '';
      }
    });

  swatch.classList.add('active');
  swatch.innerHTML = `<svg class="swatch-check" width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  // Show clear button
  const clearBtn = document.getElementById('clearColorBtn');
  if (clearBtn) {
    clearBtn.style.display = 'block';
  }

  // Show apply-all container and update text
  updateApplyAllUI();

  console.log('Updated state:', JSON.stringify(hookState));
}

// Handle random color selection in inline selector
function handleRandomColorInline(event) {
  event.stopPropagation();
  console.log('=== RANDOM COLOR IN INLINE SELECTOR ===');

  const randomColor = getRandomColor();
  console.log('Randomly selected:', randomColor.name, randomColor.hex);

  // Update state - set as selected inline color
  hookState.selectedInlineColor = {
    hex: randomColor.hex,
    name: randomColor.name,
  };

  // Update visual state - find and activate the randomly selected swatch
  document
    .querySelectorAll('#inlineColorSwatches .hook-color-swatch')
    .forEach((sw) => {
      sw.classList.remove('active');
      // Don't clear innerHTML of custom color swatch
      if (!sw.classList.contains('hook-color-swatch-custom')) {
        sw.innerHTML = '';
      }
      if (sw.dataset.colorHex === randomColor.hex) {
        sw.classList.add('active');
        sw.innerHTML = `<svg class="swatch-check" width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      }
    });

  // Show clear button
  const clearBtn = document.getElementById('clearColorBtn');
  if (clearBtn) {
    clearBtn.style.display = 'block';
  }

  // Show apply-all container and update text
  updateApplyAllUI();

  console.log('Updated state:', JSON.stringify(hookState));
}

// Clear inline color selection
function clearInlineColorSelection() {
  console.log('=== CLEARING INLINE COLOR SELECTION ===');

  // Clear state
  hookState.selectedInlineColor = null;

  // Clear visual state of all inline swatches
  document
    .querySelectorAll('#inlineColorSwatches .hook-color-swatch')
    .forEach((sw) => {
      sw.classList.remove('active');
      // Don't clear innerHTML of custom color swatch
      if (!sw.classList.contains('hook-color-swatch-custom')) {
        sw.innerHTML = '';
      }
    });

  // Hide clear button
  const clearBtn = document.getElementById('clearColorBtn');
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }

  // Hide apply-all container and uncheck checkbox
  const applyAllContainer = document.getElementById('applyAllContainer');
  const applyAllCheckbox = document.getElementById('applyAllCheckbox');
  if (applyAllContainer) {
    applyAllContainer.style.display = 'none';
  }
  if (applyAllCheckbox) {
    applyAllCheckbox.checked = false;
  }

  console.log('Inline color selection cleared');
}

// Get random color from COLORS array
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

// Update apply-all UI (show/hide and update text)
function updateApplyAllUI() {
  const applyAllContainer = document.getElementById('applyAllContainer');
  const applyAllText = document.getElementById('applyAllText');
  const applyAllCheckbox = document.getElementById('applyAllCheckbox');

  if (!applyAllContainer || !applyAllText) {
    console.error('Apply-all UI elements not found');
    return;
  }

  if (hookState.selectedInlineColor) {
    // Show the apply-all container
    applyAllContainer.style.display = 'block';

    // Update text with selected color name (bold the color name only)
    applyAllText.innerHTML = `Apply <strong>${hookState.selectedInlineColor.name}</strong> to all hooks`;

    // Uncheck the checkbox when color changes
    if (applyAllCheckbox) {
      applyAllCheckbox.checked = false;
    }

    console.log(
      'Apply-all UI updated for color:',
      hookState.selectedInlineColor.name
    );
  } else {
    // Hide the apply-all container
    applyAllContainer.style.display = 'none';
  }
}

// Handle apply-all checkbox change
function handleApplyAllChange() {
  const applyAllCheckbox = document.getElementById('applyAllCheckbox');

  if (!applyAllCheckbox) {
    console.error('Apply-all checkbox not found');
    return;
  }

  if (applyAllCheckbox.checked && hookState.selectedInlineColor) {
    console.log('=== APPLYING COLOR TO ALL HOOKS ===');
    console.log('Color:', hookState.selectedInlineColor.name);

    // Apply selected color to all hooks
    for (let i = 0; i < hookState.hookCount; i++) {
      hookState.hookColors[i] = hookState.selectedInlineColor.hex;
      hookState.hookColorNames[i] = hookState.selectedInlineColor.name;
    }

    console.log('All hooks updated to:', hookState.selectedInlineColor.name);

    // Update line item properties
    updateLineItemProperties();

    // Re-render hooks
    renderHooks();
    saveStateToLocalStorage();
  }
}

// Initialize event listeners
function initEventListeners() {
  // Rail style buttons
  document.querySelectorAll('.rail-style-button').forEach((button) => {
    button.addEventListener('click', handleRailStyleChange);
  });

  // Hook count buttons
  document.querySelectorAll('.hook-count-button').forEach((button) => {
    button.addEventListener('click', handleHookCountChange);
  });

  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log('Window resized - recalculating hook positions');
      renderHooks();
    }, 150);
  });
}

// Handle rail style change
function handleRailStyleChange(event) {
  console.log('=== RAIL STYLE CHANGE ===');

  // Get the button element (in case event.target is a child element like img or span)
  const button = event.currentTarget;
  console.log('New rail style:', button.dataset.railStyle);

  document.querySelectorAll('.rail-style-button').forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-checked', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-checked', 'true');

  hookState.railStyle = button.dataset.railStyle;
  console.log('Updated state:', JSON.stringify(hookState));

  // Update finish text in title
  const finishText = document.getElementById('railFinishText');
  if (finishText) {
    finishText.textContent =
      button.dataset.railStyle === 'style1' ? 'White Finish' : 'Oak Finish';
  }

  updateRailImage();
  setTimeout(() => renderHooks(), 50);
  updateVariantSelection();
  saveStateToLocalStorage();
}

// Handle hook count change
function handleHookCountChange(event) {
  console.log('=== HOOK COUNT CHANGE ===');

  // Get the button element (in case event.target is a child element like img or span)
  const button = event.currentTarget;
  console.log('New hook count:', button.dataset.hookCount);

  document.querySelectorAll('.hook-count-button').forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-checked', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-checked', 'true');

  const newHookCount = parseInt(button.dataset.hookCount);
  const oldHookCount = hookState.hookCount;

  hookState.hookCount = newHookCount;

  // Resize color arrays to match new hook count
  if (newHookCount > oldHookCount) {
    // Adding hooks - fill with the last color
    const fillColor = hookState.hookColors[oldHookCount - 1] || '#FF0800';
    const fillColorName = hookState.hookColorNames[oldHookCount - 1] || 'Red';
    for (let i = oldHookCount; i < newHookCount; i++) {
      hookState.hookColors[i] = fillColor;
      hookState.hookColorNames[i] = fillColorName;
    }
  } else {
    // Removing hooks - truncate arrays
    hookState.hookColors = hookState.hookColors.slice(0, newHookCount);
    hookState.hookColorNames = hookState.hookColorNames.slice(0, newHookCount);
  }

  // Reset selected position if it's now out of bounds
  if (hookState.selectedHookPosition >= newHookCount) {
    hookState.selectedHookPosition = newHookCount - 1;
  }

  console.log('Updated state:', JSON.stringify(hookState));

  updateLineItemProperties();

  updateRailImage();
  setTimeout(() => renderHooks(), 50);
  updateVariantSelection();
  saveStateToLocalStorage();
}

// Handle color change for the currently selected hook position
function handleColorChange(event) {
  const swatch = event.currentTarget;
  console.log('=== COLOR CHANGE ===');
  console.log(
    'New color:',
    swatch.dataset.colorName,
    swatch.dataset.colorHex,
    'for position:',
    hookState.selectedHookPosition
  );

  document.querySelectorAll('.hook-color-swatch').forEach((sw) => {
    sw.classList.remove('active');
    // Don't clear innerHTML of custom color swatch
    if (!sw.classList.contains('hook-color-swatch-custom')) {
      sw.innerHTML = '';
    }
  });

  swatch.classList.add('active');
  swatch.innerHTML = `<svg class="swatch-check" width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  // Update color for the currently selected hook position
  hookState.hookColors[hookState.selectedHookPosition] =
    swatch.dataset.colorHex;
  hookState.hookColorNames[hookState.selectedHookPosition] =
    swatch.dataset.colorName;
  console.log('Updated state:', JSON.stringify(hookState));

  // Update line item properties for cart
  updateLineItemProperties();

  renderHooks();
  saveStateToLocalStorage();
}

// Handle random color selection in modal
function handleRandomColorInModal(event) {
  event.stopPropagation();
  console.log('=== RANDOM COLOR IN MODAL ===');

  const randomColor = getRandomColor();
  console.log(
    'Randomly selected:',
    randomColor.name,
    randomColor.hex,
    'for position:',
    hookState.selectedHookPosition
  );

  // Update color for the currently selected hook position
  hookState.hookColors[hookState.selectedHookPosition] = randomColor.hex;
  hookState.hookColorNames[hookState.selectedHookPosition] = randomColor.name;
  console.log('Updated state:', JSON.stringify(hookState));

  // Update visual state - find and activate the randomly selected swatch
  document
    .querySelectorAll('#modalColorSwatchesContainer .hook-color-swatch')
    .forEach((sw) => {
      sw.classList.remove('active');
      if (!sw.classList.contains('hook-color-swatch-custom')) {
        sw.innerHTML = '';
      }
      if (sw.dataset.colorHex === randomColor.hex) {
        sw.classList.add('active');
        sw.innerHTML = `<svg class="swatch-check" width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      }
    });

  // Update line item properties for cart
  updateLineItemProperties();

  renderHooks();
  saveStateToLocalStorage();
}

// Open color picker modal for a specific hook position
function openColorPickerModal(position) {
  console.log('=== OPENING COLOR PICKER MODAL ===');
  console.log('Position:', position);

  hookState.selectedHookPosition = position;

  // Update modal title
  const titleElement = document.getElementById('colorPickerTitle');
  console.log('Title element found:', !!titleElement);
  if (titleElement) {
    titleElement.textContent = `Hook Position ${position + 1}:`;
  }

  // Update active swatch in modal to show current color
  const selectedColor = hookState.hookColors[position];
  const swatches = document.querySelectorAll('.hook-color-swatch');
  console.log('Found swatches:', swatches.length);

  swatches.forEach((sw) => {
    sw.classList.remove('active');
    // Don't clear innerHTML of custom color swatch
    if (!sw.classList.contains('hook-color-swatch-custom')) {
      sw.innerHTML = '';
    }
    if (sw.dataset.colorHex === selectedColor) {
      sw.classList.add('active');
      sw.innerHTML = `<svg class="swatch-check" width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    }
  });

  // Show modal
  const modal = document.getElementById('colorPickerModal');
  console.log('Modal element found:', !!modal);
  console.log('Modal current display:', modal ? modal.style.display : 'N/A');

  if (modal) {
    modal.style.display = 'flex';
    console.log('Modal display set to flex');
    console.log(
      'Modal computed style:',
      window.getComputedStyle(modal).display
    );
  } else {
    console.error('Modal element not found!');
  }

  // Re-render to show active badge
  renderHooks();
}

// Close color picker modal
function closeColorPickerModal() {
  console.log('=== CLOSING COLOR PICKER MODAL ===');

  const modal = document.getElementById('colorPickerModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Note: updatePositionSelectorUI is no longer needed as position badges are rendered directly on hooks

// Update hidden line item property inputs for cart
function updateLineItemProperties() {
  const container = document.getElementById('lineItemPropertiesContainer');
  if (!container) {
    console.warn('Line item properties container not found');
    return;
  }

  container.innerHTML = '';

  // Add properties for each hook position
  for (let i = 0; i < hookState.hookCount; i++) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = `properties[Hook_${i + 1}_Color]`;
    input.value = hookState.hookColorNames[i];
    container.appendChild(input);
  }

  console.log(
    '✓ Updated line item properties for',
    hookState.hookCount,
    'hooks'
  );
}

// Update rail image
function updateRailImage() {
  const railImage = document.getElementById('railImage');
  if (!railImage) return;

  railImage.src = CONFIG.rails[hookState.railStyle][hookState.hookCount];
  console.log(
    'Updated rail image:',
    hookState.railStyle,
    hookState.hookCount,
    railImage.src
  );
}

// Render hooks on the canvas
function renderHooks() {
  console.log('renderHooks() called');
  const container = document.getElementById('hooksContainer');
  console.log('Hooks container found:', !!container);

  if (!container) {
    console.error('ERROR: hooksContainer not found!');
    return;
  }

  console.log(
    'Rendering hooks - Count:',
    hookState.hookCount,
    'Colors:',
    hookState.hookColorNames
  );
  container.innerHTML = '';

  let positions;
  if (hookState.hookCount === 3) positions = CONFIG.hook3Positions;
  else if (hookState.hookCount === 6) positions = CONFIG.hook6Positions;
  else if (hookState.hookCount === 9) positions = CONFIG.hook9Positions;

  console.log('Positions array:', positions.length, 'hooks');

  const hookSize = CONFIG.hookSizes[hookState.hookCount];

  positions.forEach((pos, index) => {
    const hookColor = hookState.hookColors[index];
    const hookColorName = hookState.hookColorNames[index];
    const colorNameLower = hookColorName.toLowerCase();

    let hookImage = CONFIG.hookTemplate;
    let filter = hexToFilter(hookColor);

    // Check if we have a pre-rendered image for this color
    if (CONFIG.hookImages[colorNameLower]) {
      hookImage = CONFIG.hookImages[colorNameLower];
      filter = 'none';
      console.log(
        `Using pre-rendered image for ${hookColorName}: ${hookImage}`
      );
    } else {
      // Fallback: use template with CSS filter for custom colors
      console.log(`Using CSS filter for ${hookColorName} (${hookColor})`);
    }

    // Render hook image
    const hook = document.createElement('img');
    hook.src = hookImage;
    hook.className = 'hook-preview-canvas__hook';
    hook.style.left = `${pos.left}%`;
    hook.style.top = `${pos.top}%`;
    hook.style.width = hookSize;
    hook.style.filter = filter;
    hook.alt = `Hook ${index + 1} - ${hookColorName}`;
    hook.dataset.position = index;
    container.appendChild(hook);

    // Create position number badge overlaid on hook
    const badge = document.createElement('div');
    badge.className = 'hook-position-badge';
    badge.textContent = String(index + 1).padStart(2, '0'); // Format as 01, 02, etc.
    badge.style.left = `${pos.left}%`;

    // Stagger badges vertically in chess board pattern
    // Even indices (0, 2, 4, ...) go down, odd indices (1, 3, 5, ...) go up
    const verticalOffset = index % 2 === 0 ? 25 : -25; // Adjust this value to control spacing
    badge.style.top = `calc(${pos.top}% + ${verticalOffset}px)`;

    badge.dataset.position = index;

    // Add active class if this is the selected position
    if (index === hookState.selectedHookPosition) {
      badge.classList.add('active');
    }

    // Click handler - supports both inline color application and modal workflow
    badge.addEventListener('click', (e) => {
      console.log('BADGE CLICKED! Position:', index);
      e.stopPropagation();

      // Check if inline color is selected
      if (hookState.selectedInlineColor) {
        console.log(
          'Applying inline color:',
          hookState.selectedInlineColor.name
        );
        // Apply the selected inline color to this hook
        hookState.hookColors[index] = hookState.selectedInlineColor.hex;
        hookState.hookColorNames[index] = hookState.selectedInlineColor.name;

        // Update line item properties
        updateLineItemProperties();

        // Re-render hooks
        renderHooks();
        saveStateToLocalStorage();
      } else {
        // No inline color selected - open modal picker
        console.log('Opening modal for position:', index);
        openColorPickerModal(index);
      }
    });

    container.appendChild(badge);
  });

  console.log('✓ Rendered', container.children.length, 'hooks to canvas');
}

// Color filter calculator (converts hex to CSS filters)
function hexToFilter(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let s = 0;
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }

  let h = 0;
  if (max !== min) {
    if (max === r) {
      h = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / (max - min) + 2) / 6;
    } else {
      h = ((r - g) / (max - min) + 4) / 6;
    }
  }

  const hueRotate = h * 360 - 0;
  const saturate = s * 200;
  const brightness = l * 200;

  return `hue-rotate(${hueRotate}deg) saturate(${saturate}%) brightness(${brightness}%)`;
}

// Update variant selection in Shopify variant selector (only rail style and hook count, no color)
function updateVariantSelection() {
  console.log('=== UPDATE VARIANT SELECTION ===');

  // Find the variant selector
  const variantSelector = document.querySelector('shopify-variant-selector');

  if (!variantSelector) {
    console.warn('⚠ Variant selector not found');
    return;
  }

  if (!variantSelector.shadowRoot) {
    console.error('❌ No shadowRoot found on variant selector!');
    return;
  }

  // Get the form inside the variant selector
  const form = variantSelector.shadowRoot.querySelector('form');
  if (!form) {
    console.warn('⚠ Variant selector form not found in shadowRoot');
    return;
  }

  console.log('✓ Form found, updating variant selection...');

  // Update Rail Style (radio buttons with name="option-Rail Style")
  const railStyleInputs = form.querySelectorAll('[name="option-Rail Style"]');
  const railStyleValue =
    hookState.railStyle === 'style1' ? 'Style 1' : 'Style 2';
  console.log(`Looking for rail style: ${railStyleValue}`);

  let railStyleSelected = false;
  railStyleInputs.forEach((input, idx) => {
    console.log(`  Rail Style option[${idx}]: value="${input.value}"`);
    if (input.value === railStyleValue) {
      input.click();
      console.log('✓ Clicked rail style:', railStyleValue);
      railStyleSelected = true;
    }
  });

  if (!railStyleSelected) {
    console.warn('⚠ Could not select rail style');
  }

  // Small delay to let the first option update
  setTimeout(() => {
    // Update Hook Count (radio buttons with name="option-Number of Hooks")
    const hookCountInputs = form.querySelectorAll(
      '[name="option-Number of Hooks"]'
    );
    console.log(`Looking for hook count: ${hookState.hookCount}`);

    let hookCountSelected = false;
    hookCountInputs.forEach((input, idx) => {
      console.log(`  Hook option[${idx}]: value="${input.value}"`);
      if (input.value == hookState.hookCount) {
        // Simulate an actual click on the radio button
        input.click();
        console.log('✓ Clicked hook count:', hookState.hookCount);
        hookCountSelected = true;
      }
    });

    if (!hookCountSelected) {
      console.warn('⚠ Could not select hook count');
    }
  }, 50);

  console.log(
    '✓ Variant selection update complete (Rail Style + Hook Count only)'
  );

  // Debug: Check what's currently selected after our changes
  setTimeout(() => {
    const checkedInputs = form.querySelectorAll('input:checked');

    console.log('=== CURRENT SELECTION ===');
    console.log('Checked inputs:', checkedInputs.length);
    checkedInputs.forEach((input, idx) => {
      console.log(`  Checked[${idx}]: ${input.name} = "${input.value}"`);
    });
  }, 100);
}

// Quantity selector functions
function incrementQuantity() {
  const input = document.getElementById('quantityInput');
  const currentValue = parseInt(input.value);
  const maxValue = parseInt(input.max);

  if (currentValue < maxValue) {
    input.value = currentValue + 1;
    console.log('Quantity increased to:', input.value);
  }
}

function decrementQuantity() {
  const input = document.getElementById('quantityInput');
  const currentValue = parseInt(input.value);
  const minValue = parseInt(input.min);

  if (currentValue > minValue) {
    input.value = currentValue - 1;
    console.log('Quantity decreased to:', input.value);
  }
}

// Handle custom Buy Now with line item properties using cart permalink
async function handleCustomBuyNow(event) {
  console.log('=== CUSTOM BUY NOW CLICKED ===');
  console.log('Current state:', JSON.stringify(hookState));

  // Ensure variant selection is updated
  updateVariantSelection();

  // Wait for variant selection to complete
  await new Promise((resolve) => setTimeout(resolve, 250));

  // Get variant ID from the shopify-data element
  const variantIdElement = document.getElementById('currentVariantId');
  let variantId = variantIdElement ? variantIdElement.textContent.trim() : null;

  console.log('Variant ID from shopify-data:', variantId);

  if (!variantId) {
    console.error('❌ Could not find variant ID');
    alert(
      'Could not determine product variant. Please refresh the page and try again.'
    );
    return;
  }

  // Extract numeric ID from GID format (gid://shopify/ProductVariant/12345 -> 12345)
  const numericVariantId = variantId.split('/').pop();
  console.log('Numeric variant ID:', numericVariantId);

  // Build line item properties as Base64 encoded JSON
  const properties = {};
  for (let i = 0; i < hookState.hookCount; i++) {
    properties[`Hook ${i + 1} Color`] = hookState.hookColorNames[i];
  }

  console.log('✓ Line item properties:', properties);

  // Get store domain
  const storeElement = document.querySelector('shopify-store');
  const storeDomain = storeElement
    ? storeElement.getAttribute('store-domain')
    : null;

  if (!storeDomain) {
    console.error('❌ Store domain not found');
    alert('Store configuration error. Please refresh the page.');
    return;
  }

  // Encode properties as Base64 URL-safe JSON
  const propertiesJson = JSON.stringify(properties);
  const propertiesBase64 = btoa(propertiesJson)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  console.log('Properties JSON:', propertiesJson);
  console.log('Properties Base64:', propertiesBase64);

  // Get quantity from input
  const quantityInput = document.getElementById('quantityInput');
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

  console.log('✓ Quantity:', quantity);

  // Build cart permalink with properties
  // Format: /cart/{variantId}:{quantity}?properties={base64EncodedJSON}
  const cartPermalink = `${storeDomain}/cart/${numericVariantId}:${quantity}?properties=${propertiesBase64}`;

  console.log('✓ Cart permalink:', cartPermalink);

  // Redirect to cart permalink (which will add item and redirect to checkout)
  window.location.href = cartPermalink;
}
