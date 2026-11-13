import https from 'node:https';

/**
 * EARTHORA Platform AI Knowledge Base & Doubt Clearing Engine
 */
const KNOWLEDGE_CATEGORIES = [
  {
    id: 'admin_auth',
    keywords: [
      'admin',
      'login',
      'credential',
      'password',
      'fixed admin',
      'admin login',
      'admin credentials',
      'sign in as admin',
      'how to login',
      'default password',
    ],
    title: 'Platform Authentication & Admin Access',
    response: `### 🔐 EARTHORA Authentication & Access

EARTHORA supports role-based access for 4 distinct user roles:

1. **Platform Administrator**:
   - Centralized platform command center located at \`/dashboard/admin\` (manage farmers, approve expert accreditations, manage catalog products, monitor order dispatch, and view analytics).
   - **Administrative Privacy:** Admin credentials are confidential and issued privately to authorized system owners.

2. **Customer & Farmer Registration**:
   - Customers and Farmers register directly at \`/register\` with instant, automatic account activation.
   - Customers gain access to \`/dashboard/customer\` (order history, wishlist, tracked packages).
   - Farmers gain access to \`/dashboard/farmer\` (crop plot records, acreage, and farm sales).

3. **Agriculture Expert Approval Policy**:
   - When an expert registers with role *Agriculture Expert*, the account is placed in **"Pending Admin Verification"** for quality assurance.
   - The Administrator reviews credentials under **Admin Dashboard > Expert Management** and approves the profile before the expert can log in.`,
    relatedLinks: [
      { label: 'Admin Login', url: '/login' },
      { label: 'Register New Account', url: '/register' },
      { label: 'Admin Dashboard', url: '/dashboard/admin' },
    ],
    suggestedQuestions: [
      'Why is my expert account pending approval?',
      'How does the admin approve new experts?',
      'How do I switch between farmer and customer roles?',
    ],
  },
  {
    id: 'expert_approval',
    keywords: [
      'expert',
      'approval',
      'pending',
      'verification',
      'expert login',
      'expert registration',
      'accepted by admin',
      'approve expert',
    ],
    title: 'Agriculture Expert Accreditation & Approval',
    response: `### 👨‍🌾 Agriculture Expert Verification Workflow

To guarantee high-standard agronomic advice for farmers:

1. **Registration**: An agronomist or specialist registers at \`/register\` selecting role **"Agriculture Expert"**, providing their title, organization, and specialization.
2. **Pending Queue**: The account status is set to \`pending\`. If the expert attempts to sign in immediately, the system clarifies that administrative accreditation is required.
3. **Admin Verification**:
   - The Administrator logs into \`/dashboard/admin\`.
   - Navigates to the **Expert Management** tab.
   - Reviews the expert's qualifications and clicks **"Approve Accreditation"**.
4. **Active Advisory**: Once approved, the expert can log in at \`/login\` and access \`/dashboard/expert\` to review farmer consultation bookings, manage advisory rates, and publish field advice.`,
    relatedLinks: [
      { label: 'Expert Connect Directory', url: '/expert-connect' },
      { label: 'Admin Dashboard', url: '/dashboard/admin' },
      { label: 'Register as Expert', url: '/register' },
    ],
    suggestedQuestions: [
      'What are the fixed admin login credentials?',
      'How do farmers book an expert consultation?',
      'Where do experts manage incoming appointments?',
    ],
  },
  {
    id: 'crop_management',
    keywords: [
      'crop',
      'crops',
      'harvest',
      'planting',
      'irrigation',
      'fertilizer',
      'phenology',
      'growth stage',
      'seedling',
      'vegetative',
      'flowering',
      'maturing',
      'yield',
      'plot',
      'soil score',
      'cycle',
    ],
    title: 'Crop Lifecycle & Phenology Management',
    response: `### 🌱 Crop Lifecycle & Phenology Management

The **EARTHORA Crop Engine** (\`/crop-management\`) lets farmers track biological growth stages and inputs:

1. **Active Phenological Stages**:
   - **Seedling:** Early germination & root development.
   - **Vegetative:** Foliar canopy growth & active nutrient uptake.
   - **Flowering:** Pollination & blossom formation.
   - **Maturing:** Fruit sizing & ripening.
   - **Harvested:** Yield collected & biomass recycled.

2. **Key Capabilities**:
   - **Add New Crop Cycle:** Click \`+ Add New Crop Cycle\` to log crop name, variety, acreage, planting date, and estimated harvest.
   - **Log Root-Zone Irrigation:** Record water volumes (in Liters) and methods (e.g. *Precision Drip, Subsurface Infiltration*).
   - **Log Biological Fertility:** Record organic amendments such as *Living Humus, Biochar Inoculation, and Mycorrhizae Compost Tea*.
   - **Telemetry Cards:** Review soil vigor score (0–100), moisture percentage, and projected metric tonnage yield.`,
    relatedLinks: [
      { label: 'Open Crop Management', url: '/crop-management' },
      { label: 'Soil Health Analytics', url: '/soil-insights' },
      { label: 'Farmer Dashboard', url: '/dashboard/farmer' },
    ],
    suggestedQuestions: [
      'How do I log a drip irrigation event?',
      'What biological amendments are recommended for living soil?',
      'How does soil pH affect crop yield projections?',
    ],
  },
  {
    id: 'marketplace_cart',
    keywords: [
      'marketplace',
      'shop',
      'store',
      'buy',
      'product',
      'cart',
      'checkout',
      'order',
      'seed',
      'seeds',
      'fertilizer',
      'equipment',
      'produce',
      'discount',
      'coupon',
      'payment',
      'stripe',
      'cash on delivery',
      'track order',
    ],
    title: 'Agricultural Marketplace & Ordering System',
    response: `### 🛒 EARTHORA Marketplace & Ordering Guide

Our curated marketplace (\`/marketplace\`) connects verified organic producers and bio-intensive suppliers:

1. **Product Categories**:
   - **Organic Seeds:** Heirloom San Marzano tomatoes, Heritage Einkorn wheat, ancient grains.
   - **Bio-Fertilizers & Inoculants:** Biochar blend, living mycorrhizae, cold-water kelp hydrolysate.
   - **Farming Equipment:** Ergonomic broadforks, IoT soil telemetry probes, solar automated drip valves.
   - **Fresh Farm Produce:** Crisp organic apples, Savoy cabbage, raw clover honeycomb.

2. **Shopping & Cart Management**:
   - Click the **Cart Icon** or visit \`/cart\` to adjust quantities or remove items.
   - Use promo code **\`ORGANIC10\`** at checkout for **10% off** your order!
   - Choose between **Credit Card (Stripe SSL)** or **Cash on Delivery (COD)**.

3. **Order Tracking**:
   - After checkout, you receive a unique tracking code (e.g. \`EO-92841\`).
   - Track packaging, transit, and delivery at \`/track-order\`.`,
    relatedLinks: [
      { label: 'Browse Marketplace', url: '/marketplace' },
      { label: 'View Shopping Cart', url: '/cart' },
      { label: 'Track Live Order', url: '/track-order' },
    ],
    suggestedQuestions: [
      'What promo code is currently active?',
      'How do I track my order status?',
      'Can I pay with Cash on Delivery?',
    ],
  },
  {
    id: 'soil_insights',
    keywords: [
      'soil',
      'ph',
      'nitrogen',
      'phosphorus',
      'potassium',
      'npk',
      'spectrometry',
      'soil test',
      'moisture',
      'mycorrhizae',
      'humus',
      'organic matter',
      'carbon',
    ],
    title: 'Soil Insights & Spectrometry Telemetry',
    response: `### 🧪 Soil Insights & Laboratory Telemetry

Located at \`/soil-insights\`, EARTHORA monitors topsoil vitality:

1. **Optimal Parameters**:
   - **Soil pH:** Ideal range is **6.2 – 6.8** for bio-intensive vegetable and grain cultivation.
   - **Nitrogen (N):** Essential for chlorophyll synthesis and leaf canopy vigor (target ~45–65 ppm).
   - **Phosphorus (P):** Powers root architecture and floral blossoming (target ~25–40 ppm).
   - **Potassium (K):** Strengthens cell walls, enzyme activity, and drought resilience (target ~180–240 ppm).

2. **Biological Metrics**:
   - **Topsoil Organic Carbon:** Aiming for >4.0% in regenerative systems.
   - **Fungal-to-Bacterial Ratio:** 1.2 : 1 to 2.0 : 1 for perennial and vegetable agroecosystems.
   - **Spectrometry Testing:** Farmers can request a new field assay and download laboratory compliance reports.`,
    relatedLinks: [
      { label: 'Soil Insights Page', url: '/soil-insights' },
      { label: 'Crop Lifecycle Engine', url: '/crop-management' },
      { label: 'Book Soil Microbiologist', url: '/expert-connect' },
    ],
    suggestedQuestions: [
      'How do I correct acidic soil with pH below 6.0?',
      'What does a high fungal-to-bacterial ratio mean?',
      'How do I request a laboratory soil test?',
    ],
  },
  {
    id: 'weather_intelligence',
    keywords: [
      'weather',
      'forecast',
      'rain',
      'rainfall',
      'temperature',
      'humidity',
      'frost',
      'heat stress',
      'radar',
      'wind',
      'climate',
      'microclimate',
      'alerts',
    ],
    title: 'Weather Intelligence & Microclimate Radar',
    response: `### 🌦️ Weather Intelligence & Agro-Radar

Visit \`/weather-intelligence\` for hyper-localized microclimate telemetry tailored to farming operations:

1. **Core Meteorological Metrics**:
   - **Ambient Temp & Dew Point:** Monitors diurnal fluctuations and condensation risk.
   - **Relative Humidity:** Informs fungal spore germination alerts.
   - **Barometric Pressure & Wind Velocity:** Predicts cold fronts and optimal aerial drone flight windows.
   - **Precipitation Radar:** Real-time 24-hour rainfall accumulation in millimeters.

2. **Farming Condition Alerts**:
   - **Optimal Windows:** Highlighted green when soil moisture and wind speeds favor organic foliar spraying.
   - **Advisories:** Warns of approaching early morning frost or mid-day heat stress so farmers can trigger protective row covers or micro-misting.`,
    relatedLinks: [
      { label: 'Weather Intelligence', url: '/weather-intelligence' },
      { label: 'Crop Management', url: '/crop-management' },
      { label: 'Smart Agriculture Suite', url: '/smart-agriculture' },
    ],
    suggestedQuestions: [
      'What is the optimal spraying window for foliar compost tea?',
      'How do frost warnings protect fruit orchards?',
      'How often does weather telemetry update?',
    ],
  },
  {
    id: 'farmer_hub',
    keywords: [
      'farmer hub',
      'farmer',
      'farms',
      'farm profile',
      'acreage',
      'land',
      'elena',
      'marcus',
      'priya',
      'daniel',
      'green valley',
      'sunridge',
    ],
    title: 'Farmer Hub & Sustainable Acreage Directory',
    response: `### 🌾 Farmer Hub & Farm Directory

Accessible at \`/farmer-hub\`, the Farmer Hub showcases verified regenerative producers across our ecosystem:

1. **Featured Bio-Intensive Farms**:
   - **Green Valley Regenerative Farm** (Sonoma Valley, CA · 120 Acres) – Certified organic heirloom vegetables & living compost.
   - **Sunridge Orchard & Apiary** (Yakima Valley, WA · 85 Acres) – Precision drip fruit canopy & wildflower honey.
   - **Golden Meadow Heritage Grains** (Willamette Valley, OR · 210 Acres) – Ancient grain cultivars & zero-till soil stewardship.
   - **Clearwater Hydro-Organic Greens** (Boulder, CO · 45 Acres) – Closed-loop nutrient cycling & baby greens.

2. **Farmer Capabilities**:
   - Register farm acreage, coordinates, and soil classifications.
   - Manage farm listings, harvest supplies, and live customer orders directly in the \`/dashboard/farmer\`.`,
    relatedLinks: [
      { label: 'Explore Farmer Hub', url: '/farmer-hub' },
      { label: 'Farmer Dashboard', url: '/dashboard/farmer' },
      { label: 'Register as Farmer', url: '/register' },
    ],
    suggestedQuestions: [
      'How can a farmer list their organic produce for sale?',
      'What certifications are highlighted on farm profiles?',
      'How do I view a farm location on the map?',
    ],
  },
  {
    id: 'expert_connect',
    keywords: [
      'consultation',
      'appointment',
      'book',
      'dr aris',
      'sofia',
      'julian',
      'maya',
      'agronomist',
      'advice',
      'qa',
      'question',
    ],
    title: 'Expert Connect & 1-on-1 Consultations',
    response: `### 👨‍🔬 Expert Connect & Agronomic Consultations

Visit \`/expert-connect\` to consult with our network of accredited agricultural researchers and specialists:

1. **Featured Specialists**:
   - **Dr. Aris Thorne, Ph.D.** – Principal Soil Microbiologist & Rhizosphere Specialist (₹1,800/session).
   - **Sofia Al-Mansoor, M.Sc.** – Precision Irrigation Architect & Water Engineer (₹1,500/session).
   - **Julian Morales, B.Sc.** – Bio-Intensive Pest & Disease Diagnostician (₹1,600/session).
   - **Dr. Maya Lin, Ph.D.** – Regenerative Agroecology & Carbon Sequestration Researcher (₹1,750/session).

2. **How to Book a Consultation**:
   - Browse the directory and click **"Book Consultation"** on any expert's card.
   - Select your preferred date, time slot, and describe your field challenge (e.g. soil deficiency, pest pressure).
   - Once submitted, you'll receive confirmation and direct access to your session!`,
    relatedLinks: [
      { label: 'Browse Experts', url: '/expert-connect' },
      { label: 'Knowledge Hub Articles', url: '/knowledge-hub' },
      { label: 'Contact Support', url: '/contact' },
    ],
    suggestedQuestions: [
      'How much do expert consultations cost?',
      'Can I ask a question before booking an appointment?',
      'How do experts manage appointments in their dashboard?',
    ],
  },
  {
    id: 'knowledge_hub',
    keywords: [
      'knowledge',
      'articles',
      'blog',
      'news',
      'guide',
      'tutorial',
      'research',
      'whitepaper',
      'mycorrhizae',
      'drip',
      'ndvi',
      'drone',
      'biochar',
    ],
    title: 'Knowledge Hub & Agricultural Field Research',
    response: `### 📚 Knowledge Hub & Field Research

The **EARTHORA Knowledge Hub** (\`/knowledge-hub\`) publishes peer-reviewed research, actionable guides, and modern techniques:

- **Precision Drip Irrigation Protocols:** Optimizing root-zone hydraulic conductivity and water savings.
- **Living Soil Microbiology:** Restoring mycorrhizal fungal networks for superior mineral uptake.
- **Multispectral Drone NDVI Mapping:** Early stress detection and canopy health analysis from above.
- **Organic Bio-Intensive Pest Management:** Botanical extracts, beneficial predatory insects, and barrier strategies.
- **Biochar & Active Composting:** Fast-tracking stable topsoil organic carbon sequestration.
- **Heirloom Seed Saving & Genetic Diversity:** Preserving heritage genetics resilient to climate variance.`,
    relatedLinks: [
      { label: 'Explore Knowledge Hub', url: '/knowledge-hub' },
      { label: 'Smart Agriculture Suite', url: '/smart-agriculture' },
      { label: 'Expert Connect', url: '/expert-connect' },
    ],
    suggestedQuestions: [
      'How do I calculate NDVI from multispectral imagery?',
      'What are the best companion plants for natural pest control?',
      'How does biochar improve fertilizer retention in sandy soil?',
    ],
  },
  {
    id: 'smart_agriculture',
    keywords: [
      'smart agriculture',
      'smart agri',
      'iot',
      'drone',
      'sensor',
      'automation',
      'actuator',
      'telemetry',
      'ecosystem',
      'technology',
    ],
    title: 'Smart Agriculture & IoT Automation',
    response: `### 🛰️ EARTHORA Smart Agriculture Ecosystem

Visit \`/smart-agriculture\` to see how we blend ecological farming principles with cutting-edge agtech:

1. **Subsurface IoT Soil Probes:** Continuous monitoring of volumetric water content, soil temperature, and electrical conductivity at 15cm and 45cm depths.
2. **Autonomous Drone NDVI Radiometry:** Multispectral canopy flights calculating Normalized Difference Vegetation Index (NDVI) to detect stress 7 days before visual onset.
3. **Automated Precision Drip Actuators:** Solar-powered smart valves that dynamically trigger irrigation based on transpiration and vapor pressure deficit (VPD).
4. **Agrometeorological Predictive Radar:** Hyperlocal weather station arrays syncing predictive analytics into your dashboard.`,
    relatedLinks: [
      { label: 'Smart Agriculture Page', url: '/smart-agriculture' },
      { label: 'Smart Dashboard', url: '/dashboard/smart' },
      { label: 'Crop Lifecycle Engine', url: '/crop-management' },
    ],
    suggestedQuestions: [
      'How do IoT soil sensors communicate data?',
      'What is Vapor Pressure Deficit (VPD) in greenhouse irrigation?',
      'Where can I see live ecosystem telemetry charts?',
    ],
  },
  {
    id: 'general_troubleshooting',
    keywords: [
      'help',
      'error',
      'bug',
      'doubt',
      'how to use',
      'issue',
      'not working',
      'cart not opening',
      'refresh',
      'support',
      'contact',
    ],
    title: 'General Support & Troubleshooting',
    response: `### 💡 EARTHORA Help & Quick Troubleshooting

Here are quick solutions for common questions:

- **Cart or Page Not Updating?** Perform a hard refresh using \`Ctrl + F5\` (or \`Ctrl + Shift + R\`) to clear your browser cache and load the latest build.
- **Viewing the Cart:** Click the shopping bag icon in the upper right header or navigate directly to \`/cart\`.
- **Forgot Password or Access Issues:** Contact the platform administrator at \`admin@earthora.io\` or re-register at \`/register\`.
- **Contact Our Team:** Visit \`/contact\` or email \`support@earthora.io\` for dedicated enterprise or agronomic onboarding assistance.`,
    relatedLinks: [
      { label: 'Visit Contact Page', url: '/contact' },
      { label: 'Platform Home', url: '/' },
      { label: 'Explore Marketplace', url: '/marketplace' },
    ],
    suggestedQuestions: [
      'What are the admin credentials?',
      'How do I add a new crop to my farm?',
      'Where can I browse verified organic seeds?',
    ],
  },
];

/**
 * High-precision Intent & Knowledge Scoring Engine
 */
function findBestKnowledgeMatch(message) {
  const normalized = message.toLowerCase().trim();
  const words = normalized.split(/[^a-z0-9_#]+/i).filter((w) => w.length > 0);

  let bestMatch = null;
  let highestScore = 0;

  for (const cat of KNOWLEDGE_CATEGORIES) {
    let score = 0;

    for (const kw of cat.keywords) {
      const lowerKw = kw.toLowerCase();

      // Multi-word phrase match (huge bonus)
      if (lowerKw.includes(' ') && normalized.includes(lowerKw)) {
        score += lowerKw.length * 3;
        continue;
      }

      // Single word boundary match
      if (words.includes(lowerKw)) {
        // High-specificity keywords
        if (['ph', 'npk', 'admin', 'password', 'spectrometry', 'irrigation', 'phenology', 'biochar', 'ndvi'].includes(lowerKw)) {
          score += 15;
        } else {
          score += lowerKw.length * 2;
        }
      } else if (normalized.includes(lowerKw) && lowerKw.length >= 4) {
        score += lowerKw.length;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = cat;
    }
  }

  // Threshold: must have matched meaningful keywords
  if (highestScore >= 5) {
    return bestMatch;
  }
  return null;
}

/**
 * Optional Gemini LLM integration if GEMINI_API_KEY is configured
 */
async function callGeminiIfAvailable(message, history = [], context = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are the EARTHORA AI Assistant, an expert agronomist and official guide for the EARTHORA Smart Agriculture & Sustainable Farming Ecosystem.
Brand Tagline: Rooted in Nature. Driven by Innovation.
Context:
- Platform URL: http://127.0.0.1:5000
- Admin Role: Full platform administration console at /dashboard/admin
- Expert Registration: Requires admin verification at /dashboard/admin
- Modules: /marketplace, /crop-management, /soil-insights, /weather-intelligence, /farmer-hub, /expert-connect, /knowledge-hub, /dashboard/smart.
- User context: ${JSON.stringify(context)}

Respond helpfully in markdown with clear steps and recommendations.

User Question: ${message}`;

    const bodyData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    });

    return await new Promise((resolve) => {
      const req = https.request(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bodyData),
          },
          timeout: 7000,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              if (res.statusCode === 200) {
                const parsed = JSON.parse(data);
                const reply = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (reply) return resolve(reply);
              }
              resolve(null);
            } catch {
              resolve(null);
            }
          });
        }
      );
      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.write(bodyData);
      req.end();
    });
  } catch {
    return null;
  }
}

/**
 * Main AI Chat processor
 */
export async function processAIChat({ message, history = [], context = {} }) {
  if (!message || typeof message !== 'string') {
    throw new Error('Please provide a valid question or message.');
  }

  const cleanMsg = message.trim();

  // 1. Check for quick greetings
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'help me', 'start'];
  if (greetings.includes(cleanMsg.toLowerCase())) {
    return {
      reply: `🌱 **Welcome to EARTHORA AI Assistant!**

I am your 24/7 smart farming copilot and platform guide. I can help you with:

* 🌾 **Platform Navigation:** Learn how to use Crop Management, Soil Insights, Weather Radar, and the Marketplace.
* 🔐 **Login & Permissions:** Admin credentials, farmer access, and how expert accreditation works.
* 🌿 **Crop Health & Irrigation:** Guidance on growth stages, NPK ratios, precision drip irrigation, and biological fertility inputs.
* 🛒 **Marketplace & Orders:** Purchasing organic inputs, tracking orders, or applying coupons.
* 👨‍🌾 **Expert Consultations:** Booking sessions with accredited agronomists and soil scientists.

What would you like to explore or rectify today?`,
      category: 'greeting',
      relatedLinks: [
        { label: 'Crop Management', url: '/crop-management' },
        { label: 'Soil Insights', url: '/soil-insights' },
        { label: 'Marketplace', url: '/marketplace' },
        { label: 'Expert Connect', url: '/expert-connect' },
      ],
      suggestedQuestions: [
        'How do I add and manage crops in the field roster?',
        'How do user roles and permissions work in EARTHORA?',
        'How do I book a consultation with an agricultural expert?',
        'How does marketplace ordering and order tracking work?',
      ],
    };
  }

  // 2. High-precision Knowledge Retrieval Matcher
  const match = findBestKnowledgeMatch(cleanMsg);

  if (match) {
    return {
      reply: match.response,
      category: match.id,
      title: match.title,
      relatedLinks: match.relatedLinks,
      suggestedQuestions: match.suggestedQuestions,
    };
  }

  // 3. Optional LLM invocation if API key is present in environment
  const llmReply = await callGeminiIfAvailable(cleanMsg, history, context);
  if (llmReply) {
    return {
      reply: llmReply,
      category: 'generative_ai',
      relatedLinks: [
        { label: 'Platform Home', url: '/' },
        { label: 'Knowledge Hub', url: '/knowledge-hub' },
        { label: 'Smart Dashboard', url: '/dashboard/smart' },
      ],
      suggestedQuestions: [
        'Tell me more about living soil microbiology',
        'How do I view telemetry in the Smart Dashboard?',
        'Where can I contact human agronomy support?',
      ],
    };
  }

  // 4. Smart Comprehensive Fallback with context-aware navigation options
  return {
    reply: `### 🌱 EARTHORA Agricultural Intelligence & Platform Guide

Thank you for your question! Here is how you can resolve or explore this in EARTHORA:

1. **Platform Features & Navigation**:
   - **Crop Phenology & Plots:** Visit \`/crop-management\` to log growth stages, irrigation, and fertility amendments.
   - **Soil Testing & Telemetry:** Visit \`/soil-insights\` for pH, NPK levels, and moisture diagnostics.
   - **Live Weather Radar:** Visit \`/weather-intelligence\` for 7-day microclimate forecasts and spray alerts.
   - **Agricultural Marketplace:** Visit \`/marketplace\` for organic seeds, biochar, tools, and produce.
   - **Expert Consultations:** Visit \`/expert-connect\` to book 1-on-1 virtual advisory sessions.

2. **Login & Accounts**:
   - Secure sign-in portal available at \`/login\`.
   - Expert registrations require admin verification in the Admin Dashboard.
   - Customer and Farmer registrations are instantly active.

3. **Need Dedicated Human Support?**
   - Visit our [Contact Page](/contact) or email **\`support@earthora.io\`**.`,
    category: 'general_assistance',
    relatedLinks: [
      { label: 'Explore Features', url: '/smart-agriculture' },
      { label: 'Browse Marketplace', url: '/marketplace' },
      { label: 'Contact Team', url: '/contact' },
    ],
    suggestedQuestions: [
      'How do user roles and permissions work in EARTHORA?',
      'How does the agricultural expert approval process work?',
      'How do I track a crop cycle and log irrigation?',
      'How do I test soil pH and NPK balance?',
    ],
  };
}

/**
 * Return curated quick-start question categories
 */
export function getQuickSuggestions() {
  return [
    {
      category: 'Getting Started',
      questions: [
        'How do user roles and account permissions work?',
        'How do I register as a customer, farmer, or expert?',
        'Why does my expert registration require admin approval?',
      ],
    },
    {
      category: 'Crops & Soil',
      questions: [
        'How do I add a new crop cycle and log irrigation?',
        'What is the ideal soil pH and NPK ratio for organic farming?',
        'How do I request a laboratory soil test?',
      ],
    },
    {
      category: 'Marketplace & Orders',
      questions: [
        'How do I search products and add items to my cart?',
        'What promo discount codes are available?',
        'How do I track my delivery status after checkout?',
      ],
    },
    {
      category: 'Experts & Knowledge',
      questions: [
        'How do I book a 1-on-1 session with an agronomist?',
        'Where can I read research on drone NDVI mapping?',
        'How can experts manage their appointments?',
      ],
    },
  ];
}
