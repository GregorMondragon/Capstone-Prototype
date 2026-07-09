/**
 * Comprehensive banana leaf disease knowledge base.
 * Contains detailed information about each disease class
 * including symptoms, treatments, and prevention measures.
 */

const diseaseData = [
  {
    id: 'healthy',
    name: 'Healthy',
    scientificName: null,
    type: 'Normal',
    severity: 'none',
    severityLevel: 0,
    color: '#3da36e',
    icon: '🌿',
    shortDescription: 'The leaf shows no signs of disease or infection.',
    description:
      'A healthy banana leaf exhibits a vibrant, uniform green color with smooth texture and no visible lesions, spots, or discoloration. The leaf surface is intact with no signs of wilting, curling, or necrotic tissue. Healthy leaves are essential for optimal photosynthesis and fruit development.',
    symptoms: [
      'Uniform green coloration across the entire leaf surface',
      'Smooth, intact leaf blade with no tears from disease',
      'Strong midrib and veins with no discoloration',
      'No visible spots, streaks, or lesions',
      'Leaf edges are smooth and not curled or dried',
    ],
    causes: 'No pathogenic cause — the plant is in good health.',
    affectedParts: [],
    spreadRate: 'N/A',
    commonRegions: 'All banana-growing regions',
    treatment: {
      chemical: [],
      biological: [],
      cultural: [
        'Continue regular monitoring for early signs of disease',
        'Maintain proper irrigation and drainage schedules',
        'Apply balanced fertilization (N-P-K) as per soil test recommendations',
        'Ensure adequate spacing between plants for air circulation',
      ],
    },
    prevention: [
      'Conduct weekly visual inspection of all plants',
      'Maintain field hygiene — remove dead leaves and debris',
      'Use disease-free planting materials from certified sources',
      'Ensure proper drainage to avoid waterlogging',
      'Rotate crops where possible to break disease cycles',
      'Monitor weather conditions for disease-favorable environments',
    ],
    references: [
      'FAO Banana Production Guidelines',
      'IITA Banana Health Management Manual',
    ],
  },
  {
    id: 'black_sigatoka',
    name: 'Black Sigatoka',
    scientificName: 'Mycosphaerella fijiensis (Pseudocercospora fijiensis)',
    type: 'Fungal',
    severity: 'critical',
    severityLevel: 4,
    color: '#a63d3d',
    icon: '⚫',
    shortDescription:
      'A severe fungal disease causing dark leaf streaks and major yield loss.',
    description:
      'Black Sigatoka is one of the most economically devastating diseases affecting banana worldwide. Caused by the fungus Mycosphaerella fijiensis, it destroys leaf tissue, reducing photosynthetic capacity by up to 50%. This leads to premature fruit ripening, smaller bunches, and yield losses of 30-50%. The disease thrives in warm, humid conditions and spreads rapidly through airborne spores.',
    symptoms: [
      'Initial small, dark-brown streaks on the underside of leaves (Stage 1-2)',
      'Streaks expand into dark brown or black oval spots with yellow halos (Stage 3-4)',
      'Spots merge to form large necrotic areas that turn gray-black (Stage 5-6)',
      'Severe leaf drying and curling from the edges inward',
      'Premature leaf death — entire canopy can be destroyed',
      'Premature ripening of fruit bunches on affected plants',
    ],
    causes:
      'Airborne ascospores and conidia of Mycosphaerella fijiensis spread by wind and rain splash. The fungus penetrates leaf stomata and colonizes mesophyll tissue. Warm temperatures (25-28°C) and high humidity (>90%) favor infection.',
    affectedParts: ['Leaves', 'Fruit (indirect — premature ripening)'],
    spreadRate: 'Very High',
    commonRegions:
      'Tropical and subtropical regions worldwide — Central America, Southeast Asia, Africa, Pacific Islands',
    treatment: {
      chemical: [
        'Systemic fungicides: Propiconazole, Difenoconazole, or Azoxystrobin (rotate groups to prevent resistance)',
        'Protectant fungicides: Mancozeb or Chlorothalonil applied every 2-3 weeks during wet season',
        'Aerial application of oil-based fungicide mixtures for large plantations',
        'Use spray monitoring systems (biological forecasting) to optimize timing',
      ],
      biological: [
        'Apply Trichoderma-based bio-fungicides to reduce inoculum levels',
        'Use Bacillus subtilis formulations as preventive foliar sprays',
        'Integrate compost teas to boost natural leaf microbiome defense',
      ],
      cultural: [
        'Remove and destroy severely infected leaves (deleafing) — cut at the petiole base',
        'Improve canopy airflow through proper plant spacing (3m × 3m minimum)',
        'Ensure good drainage to reduce leaf wetness duration',
        'Remove fallen leaf debris which harbors spores',
        'Reduce overhead irrigation — use drip systems instead',
      ],
    },
    prevention: [
      'Plant resistant or tolerant varieties (FHIA-01, FHIA-18, Yangambi Km5)',
      'Establish early warning systems using weather-based disease models',
      'Implement strict quarantine measures for new planting material',
      'Maintain optimal nutrition — potassium-rich fertilization enhances resistance',
      'Regular scouting: inspect youngest fully expanded leaves weekly',
      'Avoid introducing plant material from infected regions',
    ],
    references: [
      'Ploetz, R.C. (2015) - Management of Fusarium Wilt of Banana',
      'FAO Black Sigatoka Management Guide',
      'IITA Disease Management Protocol',
    ],
  },
  {
    id: 'yellow_sigatoka',
    name: 'Yellow Sigatoka',
    scientificName: 'Mycosphaerella musicola (Pseudocercospora musae)',
    type: 'Fungal',
    severity: 'high',
    severityLevel: 3,
    color: '#c8a84e',
    icon: '🟡',
    shortDescription:
      'A widespread fungal disease causing yellow-brown leaf spots and reduced yields.',
    description:
      'Yellow Sigatoka, also known as Sigatoka Leaf Spot, is caused by Mycosphaerella musicola. While less aggressive than Black Sigatoka, it still causes significant yield losses of 15-30% in susceptible varieties. The disease primarily destroys photosynthetic tissue, weakening the plant over successive cycles. It was the first major leaf spot disease identified in bananas (1902, Java) and remains prevalent in cooler highland banana-growing regions.',
    symptoms: [
      'Faint yellowish-green streaks on upper leaf surface (early stage)',
      'Streaks turn yellow-brown with defined margins',
      'Spots develop gray centers with dark brown borders',
      'Older spots may have a yellow halo around brown necrotic center',
      'Spots primarily appear between leaf veins in parallel rows',
      'Premature leaf senescence reducing functional leaf count',
    ],
    causes:
      'Conidia (asexual spores) spread by wind and rain. The fungus infects through stomata on the leaf surface. Optimal conditions: 20-25°C with extended leaf wetness periods. Cooler and more temperate environments than Black Sigatoka.',
    affectedParts: ['Leaves'],
    spreadRate: 'High',
    commonRegions:
      'Cooler tropical and subtropical regions — highlands of East Africa, parts of Latin America, Australia',
    treatment: {
      chemical: [
        'Apply systemic fungicides: Triazoles (Propiconazole) or Strobilurins (Trifloxystrobin)',
        'Protectant sprays: Mancozeb at 14-21 day intervals during rainy seasons',
        'Rotate between different fungicide groups to prevent resistance buildup',
      ],
      biological: [
        'Trichoderma harzianum foliar applications to suppress fungal growth',
        'Neem oil-based sprays as supplementary treatment',
        'Strengthen plant immunity with silicon-based foliar fertilizers',
      ],
      cultural: [
        'Regular deleafing — remove affected leaves and destroy them by burning or burying',
        'Maintain 2.5-3m spacing between plants for improved air circulation',
        'Avoid excessive nitrogen fertilization which produces soft, susceptible tissue',
        'Ensure adequate drainage to minimize leaf wetness duration',
      ],
    },
    prevention: [
      'Plant tolerant varieties — Cavendish types have moderate tolerance',
      'Conduct routine leaf inspections every 7-10 days',
      'Manage micro-climate through shade regulation and windbreaks',
      'Avoid over-irrigation and overhead sprinkler use',
      'Remove and destroy crop residue after harvest',
      'Maintain balanced soil fertility with emphasis on potassium',
    ],
    references: [
      'Stover, R.H. (1980) - Sigatoka Leaf Spots of Bananas',
      'CGIAR Banana Disease Factsheet',
    ],
  },
  {
    id: 'fusarium_wilt',
    name: 'Fusarium Wilt (Panama Disease)',
    scientificName: 'Fusarium oxysporum f. sp. cubense (Foc)',
    type: 'Fungal',
    severity: 'critical',
    severityLevel: 4,
    color: '#a63d3d',
    icon: '🔴',
    shortDescription:
      'A devastating soil-borne disease that clogs vascular tissue, causing permanent wilting.',
    description:
      'Fusarium Wilt, commonly known as Panama Disease, is caused by the soil-borne fungus Fusarium oxysporum f. sp. cubense (Foc). It is considered one of the most destructive plant diseases in history — Tropical Race 1 (TR1) nearly wiped out the Gros Michel banana in the 1950s. The current threat, Tropical Race 4 (TR4), affects Cavendish bananas and is spreading globally. The fungus invades roots and colonizes the vascular system, blocking water and nutrient transport. There is NO effective chemical cure once infection occurs.',
    symptoms: [
      'Yellowing of older (lower) leaves starting from the margins',
      'Leaves wilt and collapse, hanging down along the pseudostem ("skirt" of dead leaves)',
      'Longitudinal splitting of the pseudostem base',
      'Internal vascular tissue shows reddish-brown discoloration when pseudostem is cut',
      'Progressive wilting from older to younger leaves',
      'Plant death within 2-8 weeks of visible symptom onset',
    ],
    causes:
      'Soil-borne chlamydospores can persist in soil for 30+ years. The fungus enters through roots (especially wounded roots) and colonizes xylem vessels. Spread through contaminated soil, water, tools, and infected planting material. Thrives in acidic soils (pH < 6) and warm conditions (25-30°C).',
    affectedParts: [
      'Roots',
      'Pseudostem (vascular system)',
      'Leaves (secondary)',
    ],
    spreadRate: 'Moderate (but persistent — soil remains contaminated for decades)',
    commonRegions:
      'TR4: Southeast Asia, Middle East, Africa, Latin America (spreading). TR1: Worldwide in older plantations.',
    treatment: {
      chemical: [
        'No effective fungicide treatment exists for established infections',
        'Soil fumigation with methyl bromide alternatives may reduce inoculum (limited efficacy)',
        'Experimental: Soil injection with biological agents combined with organic amendments',
      ],
      biological: [
        'Apply Trichoderma spp. and non-pathogenic Fusarium as soil bio-control agents',
        'Inoculate with arbuscular mycorrhizal fungi (AMF) to enhance root defense',
        'Apply Bacillus amyloliquefaciens to suppress pathogen in rhizosphere',
        'Use banana endophytes that induce systemic resistance',
      ],
      cultural: [
        'IMMEDIATELY remove and destroy infected plants (uproot and burn)',
        'Do NOT replant banana in infested soil for a minimum of 5 years',
        'Quarantine affected areas — restrict movement of soil, water, and tools',
        'Disinfect all tools and equipment with sodium hypochlorite (1%) or quaternary ammonium',
        'Raise soil pH to 6.5-7.0 with lime to suppress the pathogen',
        'Improve soil organic matter content through composting',
      ],
    },
    prevention: [
      'Use certified disease-free tissue culture plantlets for new plantings',
      'Plant resistant varieties (Yangambi Km5, FHIA hybrids, Goldfinger)',
      'Implement strict biosecurity protocols — foot baths, vehicle washes at farm entry',
      'Avoid flood irrigation that can spread contaminated water',
      'Maintain soil health through crop rotation with non-host crops',
      'Regular soil testing for Foc using molecular detection methods (PCR)',
      'Do not share tools or equipment between farms without sterilization',
    ],
    references: [
      'Ploetz, R.C. (2015) - Fusarium Wilt of Banana',
      'FAO TR4 Global Response Guidelines',
      'Dita, M. et al. (2018) - Fusarium Wilt of Banana: Current Knowledge',
    ],
  },
  {
    id: 'bract_mosaic_virus',
    name: 'Bract Mosaic Virus',
    scientificName: 'Banana Bract Mosaic Virus (BBrMV)',
    type: 'Viral',
    severity: 'moderate',
    severityLevel: 2,
    color: '#7e5fad',
    icon: '🟣',
    shortDescription:
      'A viral disease causing mosaic patterns on leaves and bracts, transmitted by aphids.',
    description:
      'Banana Bract Mosaic Virus (BBrMV) belongs to the Potyvirus genus and is transmitted primarily by aphid vectors (Pentalonia nigronervosa, Aphis gossypii). The virus causes characteristic mosaic and spindle-shaped streaks on leaves, pseudostems, and bracts. While yield losses are typically moderate (10-40%), the virus weakens plants over successive ratoon cycles and reduces fruit quality. It is especially prevalent in South and Southeast Asia.',
    symptoms: [
      'Spindle-shaped reddish-brown to dark brown streaks on leaf petioles and midribs',
      'Mosaic pattern (irregular light and dark green patches) on leaf blades',
      'Conspicuous dark streaks on the flower bracts (most diagnostic symptom)',
      'Mild leaf curling and distortion in severe cases',
      'Reduced bunch size and irregular fruit development',
      'Traveler (cigar) leaf may show chlorotic streaks',
    ],
    causes:
      'Transmitted by aphid vectors in a non-persistent manner (acquired in seconds during probing). Also spread through infected planting material (suckers, corms). The virus infects phloem tissue and interferes with nutrient transport and photosynthesis.',
    affectedParts: ['Leaves', 'Petioles', 'Bracts', 'Pseudostem', 'Fruit'],
    spreadRate: 'Moderate to High (via aphid vectors)',
    commonRegions:
      'Philippines, India, Sri Lanka, Vietnam, and other parts of South-Southeast Asia',
    treatment: {
      chemical: [
        'No direct antiviral treatment exists for plant viruses',
        'Control aphid vectors with systemic insecticides: Imidacloprid or Thiamethoxam (soil drench)',
        'Use neem-based insecticides for organic aphid management',
        'Apply reflective mulches to disorient aphids and reduce landing rates',
      ],
      biological: [
        'Encourage natural aphid predators: ladybugs, lacewings, parasitic wasps',
        'Release Aphidius colemani (parasitoid wasp) for biological aphid control',
        'Apply entomopathogenic fungi (Beauveria bassiana) against aphid colonies',
      ],
      cultural: [
        'Rogue (remove and destroy) infected plants immediately upon detection',
        'Use virus-free tissue culture plantlets for replanting',
        'Remove alternate weed hosts that harbor aphids around the plantation',
        'Implement barrier crops (tall grasses or maize) around plantings to filter aphids',
      ],
    },
    prevention: [
      'Source planting material ONLY from certified virus-indexed nurseries',
      'Screen tissue culture plants using RT-PCR or ELISA before field planting',
      'Regular field scouting for mosaic symptoms — inspect young leaves and bracts',
      'Maintain weed-free zones around the plantation perimeter',
      'Use insect-proof nets in nurseries to prevent aphid access',
      'Implement a roguing protocol: remove symptomatic plants within 48 hours',
    ],
    references: [
      'Thomas, J.E. et al. (2015) - Banana Viruses',
      'ICTV Potyvirus Classification',
      'PCAARRD BBrMV Management Guide',
    ],
  },
  {
    id: 'cordana',
    name: 'Cordana Leaf Spot',
    scientificName: 'Cordana musae (Neocordana musae)',
    type: 'Fungal',
    severity: 'moderate',
    severityLevel: 2,
    color: '#8a7646',
    icon: '🟤',
    shortDescription:
      'A fungal disease causing oval pale spots with dark margins on banana leaves.',
    description:
      'Cordana Leaf Spot is a fungal disease caused by Cordana musae. It is typically considered a secondary pathogen, often colonizing tissue already weakened by Sigatoka or other stresses. However, under high humidity conditions, it can cause primary infections resulting in significant leaf area loss. The disease is most common on lower, older leaves and in shaded, poorly ventilated plantations. Yield impact is generally low to moderate unless infections are severe and untreated.',
    symptoms: [
      'Oval to irregular pale brown spots (1-4 cm) on leaf lamina',
      'Spots have distinct dark brown to maroon borders',
      'Central area of spots turns pale gray-white as tissue dies',
      'Spots often appear near the leaf margins and tips first',
      'Multiple spots can merge, causing large areas of dead tissue',
      'Commonly found on the third-oldest and older leaves',
    ],
    causes:
      'Conidia (spores) are dispersed by wind and rain splash. The fungus is saprophytic (feeds on dead tissue) but becomes parasitic on weakened leaves. Favored by humid, poorly ventilated conditions and temperatures of 20-28°C. Often follows mechanical damage or Sigatoka infection.',
    affectedParts: ['Leaves (primarily older leaves)'],
    spreadRate: 'Low to Moderate',
    commonRegions:
      'Tropical regions worldwide — especially in humid lowland plantations with poor management',
    treatment: {
      chemical: [
        'Copper-based fungicides (Copper hydroxide, Copper oxychloride) as foliar sprays',
        'Mancozeb applied at 2-3 week intervals during humid periods',
        'Usually controlled when Sigatoka fungicide programs are in place',
      ],
      biological: [
        'Apply Trichoderma-based products to reduce fungal load on leaf surfaces',
        'Compost tea foliar sprays to promote beneficial microorganisms',
      ],
      cultural: [
        'Remove and destroy infected older leaves (improves air circulation)',
        'Reduce plant density to improve ventilation within the canopy',
        'Avoid overhead irrigation that prolongs leaf wetness',
        'Maintain good plantation hygiene — clear ground debris',
      ],
    },
    prevention: [
      'Maintain proper plant spacing for adequate air movement',
      'Ensure balanced nutrition — avoid nitrogen excess',
      'Control Sigatoka effectively, as Cordana often follows Sigatoka damage',
      'Regular deleafing of older, non-productive leaves',
      'Monitor humidity levels and reduce irrigation during wet periods',
      'Scout for early symptoms on lower canopy leaves bi-weekly',
    ],
    references: [
      'Jones, D.R. (2000) - Diseases of Banana, Abaca and Enset',
      'CABI Cordana musae Datasheet',
    ],
  },
  {
    id: 'pestalotiopsis',
    name: 'Pestalotiopsis Leaf Spot',
    scientificName: 'Pestalotiopsis spp.',
    type: 'Fungal',
    severity: 'moderate',
    severityLevel: 2,
    color: '#8a7646',
    icon: '🔶',
    shortDescription:
      'A fungal disease causing diamond-shaped necrotic lesions on leaf margins.',
    description:
      'Pestalotiopsis Leaf Spot is caused by various species of the Pestalotiopsis genus. This opportunistic fungal pathogen typically attacks banana leaves that have been stressed by environmental factors (drought, cold, nutrient deficiency) or mechanically damaged. The disease is increasingly reported in tropical regions and can cause significant defoliation in young plantations. While often considered a secondary pathogen, recent studies suggest some species can be primary pathogens under favorable conditions.',
    symptoms: [
      'Diamond-shaped or irregular necrotic lesions, often starting at leaf edges',
      'Lesions are tan to dark brown with concentric zonation',
      'Small black fruiting bodies (acervuli) visible in the center of older lesions',
      'Lesions may have a water-soaked appearance initially',
      'Premature drying and curling of affected leaf tips',
      'In severe cases, extensive defoliation of young plants',
    ],
    causes:
      'Conidia spread through rain splash and wind. The fungus often enters through wounds or natural openings. Stress factors (drought, cold, poor nutrition, herbicide damage) predispose plants to infection. Warm, humid conditions (25-30°C, >85% RH) promote disease development.',
    affectedParts: ['Leaves', 'Leaf sheaths', 'Occasionally fruit'],
    spreadRate: 'Low to Moderate',
    commonRegions:
      'Tropical and subtropical regions — commonly reported in Southeast Asia, India, Brazil, Central America',
    treatment: {
      chemical: [
        'Copper-based fungicides as preventive foliar sprays',
        'Systemic fungicides: Carbendazim or Thiophanate-methyl for active infections',
        'Mancozeb applications during high-risk periods (prolonged rainfall)',
      ],
      biological: [
        'Trichoderma viride or T. harzianum as foliar bio-protectants',
        'Pseudomonas fluorescens-based formulations to suppress infection',
      ],
      cultural: [
        'Remove and destroy infected plant tissues promptly',
        'Reduce plant stress through proper irrigation management',
        'Apply balanced fertilization — correct any nutrient deficiencies',
        'Avoid mechanical damage during farming operations',
      ],
    },
    prevention: [
      'Maintain optimal plant health through balanced fertilization (especially potassium)',
      'Protect plants from environmental stress (wind breaks, shade management)',
      'Ensure good drainage to prevent root stress',
      'Use clean, disease-free planting material',
      'Regular monitoring of young plantations which are most susceptible',
      'Avoid wounding leaves during pruning — use sharp, sterilized tools',
    ],
    references: [
      'Maharachchikumbura et al. (2014) - Pestalotiopsis revisited',
      'Keith, L.M. et al. (2006) - Pestalotiopsis on banana',
    ],
  },
];

/**
 * Get severity configuration for display
 */
export const severityConfig = {
  none: {
    label: 'Healthy',
    color: '#3da36e',
    bgColor: 'rgba(61, 163, 110, 0.1)',
    borderColor: 'rgba(61, 163, 110, 0.2)',
    badgeClass: 'badge-healthy',
  },
  moderate: {
    label: 'Moderate',
    color: '#c8a84e',
    bgColor: 'rgba(200, 168, 78, 0.1)',
    borderColor: 'rgba(200, 168, 78, 0.2)',
    badgeClass: 'badge-warning',
  },
  high: {
    label: 'High',
    color: '#c45c4a',
    bgColor: 'rgba(196, 92, 74, 0.1)',
    borderColor: 'rgba(196, 92, 74, 0.2)',
    badgeClass: 'badge-danger',
  },
  critical: {
    label: 'Critical',
    color: '#a63d3d',
    bgColor: 'rgba(166, 61, 61, 0.1)',
    borderColor: 'rgba(166, 61, 61, 0.2)',
    badgeClass: 'badge-critical',
  },
};

/**
 * Get disease type configuration
 */
export const typeConfig = {
  Normal: { label: 'Normal', badgeClass: 'badge-healthy' },
  Fungal: { label: 'Fungal', badgeClass: 'badge-fungal' },
  Viral: { label: 'Viral', badgeClass: 'badge-viral' },
};

/**
 * Class labels matching model output order
 */
export const CLASS_LABELS = [
  'healthy',
  'black_sigatoka',
  'yellow_sigatoka',
  'fusarium_wilt',
  'bract_mosaic_virus',
  'cordana',
  'pestalotiopsis',
];

/**
 * Find disease by ID
 */
export const getDiseaseById = (id) => diseaseData.find((d) => d.id === id);

/**
 * Find disease by index (matching model output)
 */
export const getDiseaseByIndex = (index) =>
  getDiseaseById(CLASS_LABELS[index]);

/**
 * Get all diseases (excluding healthy)
 */
export const getDiseasesOnly = () =>
  diseaseData.filter((d) => d.id !== 'healthy');

export default diseaseData;
