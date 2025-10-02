function scrollToProducts() {
  console.log('Scroll to products functionality');
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
      //768: {
      //  slidesPerView: 2,
      //  spaceBetween: 24,
      //},
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

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function () {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const answer = this.nextElementSibling;

      // Close all other FAQ items
      faqQuestions.forEach((otherQuestion) => {
        if (otherQuestion !== this) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherQuestion.nextElementSibling.classList.remove('active');
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

// ===========================================
// HOOK CUSTOMIZER FUNCTIONALITY
// ===========================================

// Configuration - Color options and image paths
const COLORS = [
  { name: 'Candy Red', hex: '#ff0000' },
  { name: 'Coral', hex: '#ff7f50' },
  { name: 'Orange', hex: '#ff8c00' },
  { name: 'Sunny Yellow', hex: '#ffd700' },
  { name: 'Lime Green', hex: '#32cd32' },
  { name: 'Forest Green', hex: '#228b22' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Sky Blue', hex: '#87ceeb' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Royal Blue', hex: '#4169e1' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Lavender', hex: '#b57edc' },
  { name: 'Pink', hex: '#ff69b4' },
  { name: 'Charcoal', hex: '#36454f' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
];

const CONFIG = {
  rails: {
    style1: {
      3: 'assets/rails/rail-style1-3.png',
      6: 'assets/rails/rail-style1-6.png',
      9: 'assets/rails/rail-style1-9.png',
    },
    style2: {
      3: 'assets/rails/rail-style2-3.png',
      6: 'assets/rails/rail-style2-6.png',
      9: 'assets/rails/rail-style2-9.png',
    },
  },
  hookTemplate: 'assets/hooks/hook-template.png',
  hookRed: 'assets/hooks/hook-red.png',
  hookWhite: 'assets/hooks/hook-white.png',
  hookSizes: {
    3: '14%',
    6: '7%',
    9: '4%',
  },
  hook3Positions: [
    { left: 20, top: 48 },
    { left: 54.5, top: 44 },
    { left: 89, top: 40 },
  ],
  hook6Positions: [
    { left: 10, top: 42 },
    { left: 26, top: 40 },
    { left: 42, top: 38 },
    { left: 58, top: 36 },
    { left: 74, top: 34 },
    { left: 90, top: 32 },
  ],
  hook9Positions: [
    { left: 7, top: 42 },
    { left: 18, top: 40 },
    { left: 29, top: 38 },
    { left: 40, top: 36 },
    { left: 51, top: 34 },
    { left: 62, top: 32 },
    { left: 73, top: 30 },
    { left: 84, top: 31 },
    { left: 95, top: 32 },
  ],
};

// State
let hookState = {
  railStyle: 'style1',
  hookCount: 3,
  hookColors: ['#ff0000', '#ff0000', '#ff0000'], // Array of colors, one per hook position
  hookColorNames: ['Candy Red', 'Candy Red', 'Candy Red'], // Array of color names
  selectedHookPosition: 0, // Currently selected hook position (0-indexed)
};

// Initialize hook customizer after Shopify components are ready
function initializeHookCustomizer() {
  console.log('=== HOOK CUSTOMIZER INITIALIZATION START ===');
  console.log('Initial state:', JSON.stringify(hookState));

  console.log('Step 1: Initializing color swatches...');
  initColorSwatches();

  console.log('Step 2: Initializing event listeners...');
  initEventListeners();

  console.log('Step 3: Initializing line item properties...');
  updateLineItemProperties();

  console.log('Step 4: Rendering hooks...');
  renderHooks();

  console.log('=== HOOK CUSTOMIZER INITIALIZATION COMPLETE ===');
}

// Wait for Shopify Web Components to render the template content
let initialized = false;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, waiting for Shopify components to render...');

  // Use MutationObserver to detect when the customizer elements are added to DOM
  const observer = new MutationObserver((mutations, obs) => {
    const modalContainer = document.getElementById('modalColorSwatchesContainer');
    const hooksContainer = document.getElementById('hooksContainer');

    if (modalContainer && hooksContainer && !initialized) {
      initialized = true;
      console.log('✓ Customizer elements found in DOM!');
      obs.disconnect(); // Stop observing
      initializeHookCustomizer();
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
      !initialized
    ) {
      initialized = true;
      console.log('Fallback: Initializing via timeout');
      observer.disconnect();
      initializeHookCustomizer();
    }
  }, 1000);
});

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
    swatch.className =
      'hook-color-swatch' + (index === 0 ? ' active' : '');
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

  console.log(
    '✓ Color swatches initialized in modal:',
    container.children.length,
    'swatches created'
  );
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
  console.log('New rail style:', event.target.dataset.railStyle);

  document.querySelectorAll('.rail-style-button').forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-checked', 'false');
  });
  event.target.classList.add('active');
  event.target.setAttribute('aria-checked', 'true');

  hookState.railStyle = event.target.dataset.railStyle;
  console.log('Updated state:', JSON.stringify(hookState));

  updateRailImage();
  setTimeout(() => renderHooks(), 50);
  updateVariantSelection();
}

// Handle hook count change
function handleHookCountChange(event) {
  console.log('=== HOOK COUNT CHANGE ===');
  console.log('New hook count:', event.target.dataset.hookCount);

  document.querySelectorAll('.hook-count-button').forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-checked', 'false');
  });
  event.target.classList.add('active');
  event.target.setAttribute('aria-checked', 'true');

  const newHookCount = parseInt(event.target.dataset.hookCount);
  const oldHookCount = hookState.hookCount;

  hookState.hookCount = newHookCount;

  // Resize color arrays to match new hook count
  if (newHookCount > oldHookCount) {
    // Adding hooks - fill with the last color
    const fillColor = hookState.hookColors[oldHookCount - 1] || '#ff0000';
    const fillColorName = hookState.hookColorNames[oldHookCount - 1] || 'Candy Red';
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
    sw.innerHTML = '';
  });

  swatch.classList.add('active');
  swatch.innerHTML = `<svg class="swatch-check" width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  // Update color for the currently selected hook position
  hookState.hookColors[hookState.selectedHookPosition] = swatch.dataset.colorHex;
  hookState.hookColorNames[hookState.selectedHookPosition] = swatch.dataset.colorName;
  console.log('Updated state:', JSON.stringify(hookState));

  // Update line item properties for cart
  updateLineItemProperties();

  renderHooks();
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
    sw.innerHTML = '';
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
    console.log('Modal computed style:', window.getComputedStyle(modal).display);
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

  console.log('✓ Updated line item properties for', hookState.hookCount, 'hooks');
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
    const isRed = colorNameLower.includes('red');
    const isWhite = colorNameLower === 'white';

    let hookImage = CONFIG.hookTemplate;
    let filter = hexToFilter(hookColor);

    if (isRed && CONFIG.hookRed) {
      hookImage = CONFIG.hookRed;
      filter = 'none';
    } else if (isWhite && CONFIG.hookWhite) {
      hookImage = CONFIG.hookWhite;
      filter = 'none';
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
    badge.style.top = `${pos.top}%`;
    badge.dataset.position = index;

    // Add active class if this is the selected position
    if (index === hookState.selectedHookPosition) {
      badge.classList.add('active');
    }

    // Click handler to open color picker modal
    badge.addEventListener('click', (e) => {
      console.log('BADGE CLICKED! Position:', index);
      e.stopPropagation();
      openColorPickerModal(index);
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
    s =
      l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
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
  const railStyleValue = hookState.railStyle === 'style1' ? 'Style 1' : 'Style 2';
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
    const hookCountInputs = form.querySelectorAll('[name="option-Number of Hooks"]');
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

  console.log('✓ Variant selection update complete (Rail Style + Hook Count only)');

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

// Handle custom Buy Now with line item properties using cart permalink
async function handleCustomBuyNow(event) {
  console.log('=== CUSTOM BUY NOW CLICKED ===');
  console.log('Current state:', JSON.stringify(hookState));

  // Ensure variant selection is updated
  updateVariantSelection();

  // Wait for variant selection to complete
  await new Promise(resolve => setTimeout(resolve, 250));

  // Get variant ID from the shopify-data element
  const variantIdElement = document.getElementById('currentVariantId');
  let variantId = variantIdElement ? variantIdElement.textContent.trim() : null;

  console.log('Variant ID from shopify-data:', variantId);

  if (!variantId) {
    console.error('❌ Could not find variant ID');
    alert('Could not determine product variant. Please refresh the page and try again.');
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
  const storeDomain = storeElement ? storeElement.getAttribute('store-domain') : null;

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

  // Build cart permalink with properties
  // Format: /cart/{variantId}:1?properties={base64EncodedJSON}
  const cartPermalink = `${storeDomain}/cart/${numericVariantId}:1?properties=${propertiesBase64}`;

  console.log('✓ Cart permalink:', cartPermalink);

  // Redirect to cart permalink (which will add item and redirect to checkout)
  window.location.href = cartPermalink;
}
