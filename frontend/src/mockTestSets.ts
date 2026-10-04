/**
 * IELTS Mock Test Simulator — Additional Question Sets 2 & 3 (frontend/src/mockTestSets.ts).
 * Delivers diverse, realistic questions across all 4 skills to prevent repetition on retakes.
 */

// ==============================================================================
// TEST SET 2 (Advanced Analytical Assessment)
// ==============================================================================

export function getClientMockPackageSet2(testType: string = "academic", module: string = "full") {
  const isAcademic = testType === "academic";

  const listeningSection = {
    title: "IELTS Listening Section (Set 2: Advanced Assessment)",
    allocated_time_seconds: 1800,
    total_questions: 11,
    parts: [
      {
        part_number: 1,
        title: "Part 1: University Accommodation Registration (Cotswold Student Hall)",
        context: "A phone conversation between international postgraduate student David Miller and housing administrator Ms. Gable.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section1_accommodation.mp3",
        transcript_cue: "Ms. Gable: Cotswold Student Housing, how can I help? David: Hello, I would like to confirm my room booking for the semester. My surname is Miller, spelt M-I-L-L-E-R, and student ID ST-8492. Ms. Gable: Yes, we have the Ensuite Studio available at £185 per week with a refundable deposit of £250. David: Perfect, that covers my quiet study needs.",
        questions: [
          {
            question_id: "L2-P1-Q1",
            question_number: 1,
            question_type: "form_completion",
            instruction: "Complete the form below. Write ONE WORD ONLY.",
            question: "Applicant surname: ________",
            options: [],
            answer: "Miller",
            explanation: "David confirms his surname as Miller (M-I-L-L-E-R)."
          },
          {
            question_id: "L2-P1-Q2",
            question_number: 2,
            question_type: "form_completion",
            instruction: "Write ONE CODE AND/OR NUMBER.",
            question: "Student ID reference: ________",
            options: [],
            answer: "ST-8492",
            explanation: "The student gives his ID as ST-8492."
          },
          {
            question_id: "L2-P1-Q3",
            question_number: 3,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "Which room category has David selected?",
            options: [
              "A. Shared Flat with communal kitchen",
              "B. Ensuite Studio with dedicated study space",
              "C. Twin Dormitory Suite"
            ],
            answer: "B",
            explanation: "David specifically chooses the Ensuite Studio for his doctoral studies."
          },
          {
            question_id: "L2-P1-Q4",
            question_number: 4,
            question_type: "form_completion",
            instruction: "Write ONE NUMBER ONLY.",
            question: "Refundable security deposit amount: £________",
            options: [],
            answer: "250",
            explanation: "Ms. Gable confirms the deposit required is £250."
          }
        ]
      },
      {
        part_number: 2,
        title: "Part 2: Orientation Guide for Heritage Steam Railway Volunteers",
        context: "A safety talk by coordinator Arthur Vance to new volunteers at the Severn Valley Heritage Steam Railway.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section2_heritage_rail.mp3",
        transcript_cue: "Welcome volunteers to Severn Valley Railway. Operational safety: morning briefings meet strictly at 08:30 AM at the North Platform Shed. Volunteers entering sidings must wear high-visibility vests. Maintain a 3-meter safety perimeter near engine fireboxes.",
        questions: [
          {
            question_id: "L2-P2-Q5",
            question_number: 5,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "Where does the daily morning volunteer safety briefing take place?",
            options: [
              "A. In the locomotive workshop",
              "B. At the North Platform Shed",
              "C. Inside the station tearoom"
            ],
            answer: "B",
            explanation: "The safety coordinator specifies the briefing meets at the North Platform Shed."
          },
          {
            question_id: "L2-P2-Q6",
            question_number: 6,
            question_type: "sentence_completion",
            instruction: "Write NO MORE THAN TWO WORDS.",
            question: "Volunteers entering track sidings must wear a ________.",
            options: [],
            answer: "high-visibility vest",
            explanation: "Volunteers are instructed to wear a high-visibility vest."
          },
          {
            question_id: "L2-P2-Q7",
            question_number: 7,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "What time does the morning volunteer briefing commence?",
            options: ["A. 08:00 AM", "B. 08:30 AM", "C. 09:15 AM"],
            answer: "B",
            explanation: "Arthur states the briefing convenes strictly at 08:30 AM."
          }
        ]
      },
      {
        part_number: 3,
        title: "Part 3: Graduate Tutorial: Deep Borehole Geothermal Energy",
        context: "Engineering postgraduates Marcus and Priya discussing geothermal ground loops with Professor Thorne.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section3_geothermal.mp3",
        transcript_cue: "Prof. Thorne: How did you size the loop? Marcus: We selected vertical boreholes drilled 150 meters deep to avoid large land use. Priya: Delivering 14 degrees Celsius year round with a coefficient of performance of 4.2. Marcus: Summer data center heat dumping recharges the strata.",
        questions: [
          {
            question_id: "L2-P3-Q8",
            question_number: 8,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "Why did the students choose vertical boreholes over horizontal trenches?",
            options: [
              "A. Excessive surface land footprint required for horizontal trenches",
              "B. Inability to withstand winter freezing",
              "C. High municipal permit fees"
            ],
            answer: "A",
            explanation: "Marcus notes horizontal trenches required too much land area."
          },
          {
            question_id: "L2-P3-Q9",
            question_number: 9,
            question_type: "sentence_completion",
            instruction: "Write ONE NUMBER ONLY.",
            question: "The vertical geothermal boreholes were drilled to ________ meters.",
            options: [],
            answer: "150",
            explanation: "Marcus mentions vertical boreholes drilled 150 meters deep."
          }
        ]
      },
      {
        part_number: 4,
        title: "Part 4: Academic Lecture: Aerodynamics of Modern Hybrid Airships",
        context: "Lecture by Dr. Elizabeth Caldwell on rigid hybrid airships for zero-emission bulk logistics.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section4_airships.mp3",
        transcript_cue: "Modern hybrid airships generate 70% of lift aerostatically via non-flammable helium and 30% dynamically via aerofoil hulls. Vertical thrust-vectoring allows landing on remote tundra without building concrete runways.",
        questions: [
          {
            question_id: "L2-P4-Q10",
            question_number: 10,
            question_type: "sentence_completion",
            instruction: "Write ONE WORD ONLY.",
            question: "Modern hybrid airships achieve aerostatic buoyancy using non-flammable ________.",
            options: [],
            answer: "helium",
            explanation: "The lecture explains that aerostatic lift is generated using non-flammable helium."
          },
          {
            question_id: "L2-P4-Q11",
            question_number: 11,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "What makes hybrid airships suitable for remote Arctic extraction sites?",
            options: [
              "A. They cruise at hypersonic speeds above weather",
              "B. They do not require constructed runways for take-off or landing",
              "C. They generate zero engine noise"
            ],
            answer: "B",
            explanation: "Thrust-vectoring vertical landing eliminates the need for concrete runways on sensitive tundra."
          }
        ]
      }
    ]
  };

  const readingSection = {
    title: `IELTS Reading Section (Set 2: ${isAcademic ? "Academic" : "General Training"})`,
    allocated_time_seconds: 3600,
    total_questions: 10,
    passages: [
      {
        passage_number: 1,
        title: "Passage 1: The Renaissance of Lighter-Than-Air Aviation",
        topic: "Aerospace & Sustainable Transport",
        word_count: 840,
        text: (
          "For nearly nine decades following the dramatic demise of the Hindenburg in 1937, lighter-than-air aviation remained " +
          "largely relegated to nostalgic historical retrospectives and advertising blimps. However, in the contemporary era of urgent " +
          "decarbonization, aerospace engineers are reevaluating rigid airships as transformative vehicles for heavy freight transport.\n\n" +
          "Conventional jet air freighters emit enormous quantities of carbon dioxide per ton-kilometer. In contrast, modern hybrid airships " +
          "combine aerostatic buoyancy from inert helium envelopes with aerodynamic lift produced by elliptical hull profiles. " +
          "Relying on aerostatic buoyancy to support cargo weight means the craft requires only a fraction of engine thrust demanded by fixed-wing airplanes.\n\n" +
          "Equipped with hovercraft-style air-cushion landing systems, modern airships can touch down on swamp, snow, sand, or calm ocean water, " +
          "reversing airflow to vacuum-seal their hulls to the terrain during cargo offloading without constructing concrete runways."
        ),
        questions: [
          {
            question_id: "R2-P1-Q1",
            question_number: 1,
            question_type: "true_false_not_given",
            instruction: "Write TRUE, FALSE, or NOT GIVEN.",
            question: "Conventional air freighters produce lower per-ton carbon emissions than hybrid airships.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "FALSE",
            explanation: "Conventional jet freighters emit enormous quantities of carbon compared to airships."
          },
          {
            question_id: "R2-P1-Q2",
            question_number: 2,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "Why do hybrid airships require significantly less engine thrust than conventional airplanes?",
            options: [
              "A. They fly at substantially higher altitudes",
              "B. Aerostatic buoyancy from helium supports the majority of their cargo mass",
              "C. Their hulls are fabricated from carbon metamaterials",
              "D. They travel exclusively with wind currents"
            ],
            answer: "B",
            explanation: "Helium aerostatic buoyancy supports structural and cargo weight, demanding only a fraction of engine thrust."
          },
          {
            question_id: "R2-P1-Q3",
            question_number: 3,
            question_type: "sentence_completion",
            instruction: "Write ONE WORD ONLY from the passage.",
            question: "Airships anchor themselves securely to the terrain during unloading by reversing their air-cushion ________.",
            options: [],
            answer: "airflow",
            explanation: "The passage notes they reverse airflow to vacuum-seal hulls to the terrain."
          }
        ]
      },
      {
        passage_number: 2,
        title: "Passage 2: The Neuroscience of Long-Term Memory Consolidation",
        topic: "Cognitive Neuroscience",
        word_count: 880,
        text: (
          "Initial acquisition of episodic memories depends critically upon the hippocampus, a seahorse-shaped structure in the medial temporal lobe. " +
          "The hippocampus acts as a rapid, high-capacity indexing buffer, binding together disparate cortical sensory signals. " +
          "However, synaptic connections within the hippocampus are fragile. Active system replay during non-rapid eye movement (NREM) slow-wave sleep " +
          "transfers synaptic weights from the hippocampus into distributed neocortical networks via sharp-wave ripples, conferring enduring long-term retention."
        ),
        questions: [
          {
            question_id: "R2-P2-Q4",
            question_number: 4,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "What is the primary role of the hippocampus during initial memory formation?",
            options: [
              "A. Permanent long-term storage of reflexes",
              "B. Acting as a rapid indexing buffer that binds cortical sensory signals",
              "C. Filtering out toxic metabolic byproducts",
              "D. Regulating heartbeat rates"
            ],
            answer: "B",
            explanation: "The hippocampus acts as a rapid, high-capacity indexing buffer binding disparate cortical sensory signals."
          },
          {
            question_id: "R2-P2-Q5",
            question_number: 5,
            question_type: "sentence_completion",
            instruction: "Write ONE WORD ONLY.",
            question: "Coordinated neural bursts during deep sleep are termed sharp-wave ________.",
            options: [],
            answer: "ripples",
            explanation: "High-frequency bursts are termed sharp-wave ripples."
          },
          {
            question_id: "R2-P2-Q6",
            question_number: 6,
            question_type: "true_false_not_given",
            instruction: "Write TRUE, FALSE, or NOT GIVEN.",
            question: "After neocortical integration, memories remain completely dependent on the hippocampus.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "FALSE",
            explanation: "Once neocortical integration is complete, memories become largely independent of the hippocampus."
          }
        ]
      },
      {
        passage_number: 3,
        title: "Passage 3: Geochemical Carbon Mineralization and Basalt Storage",
        topic: "Geochemistry & Climate Mitigation",
        word_count: 890,
        text: (
          "Traditional carbon capture stores CO2 as a pressurized fluid deep beneath sedimentary caprocks, risking seismic leakage. " +
          "In contrast, carbon mineralization in reactive basalt rock permanently binds carbon into solid stone. " +
          "In the CarbFix method, CO2 dissolved in water is pumped deep underground. Because carbonated water is denser than groundwater, it sinks. " +
          "Cations dissolve and precipitate out as solid calcite (CaCO3). Over 95% of injected carbon solidifies into stone within two years."
        ),
        questions: [
          {
            question_id: "R2-P3-Q7",
            question_number: 7,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "What risk accompanies traditional supercritical CO2 storage beneath caprocks?",
            options: [
              "A. Radioactive contamination",
              "B. Potential upward gas leakage through seismic fractures",
              "C. Extreme cooling that shatters rock",
              "D. Spontaneous combustion"
            ],
            answer: "B",
            explanation: "Seismic activity could allow pressurized gas to escape upward back into aquifers."
          },
          {
            question_id: "R2-P3-Q8",
            question_number: 8,
            question_type: "sentence_completion",
            instruction: "Write ONE WORD ONLY.",
            question: "Precipitated carbonate stone formed during mineralization includes solid ________.",
            options: [],
            answer: "calcite",
            explanation: "The text states cations precipitate out as solid calcite (CaCO3)."
          },
          {
            question_id: "R2-P3-Q9",
            question_number: 9,
            question_type: "true_false_not_given",
            instruction: "Write TRUE, FALSE, or NOT GIVEN.",
            question: "Carbonated water sinks because it is denser than surrounding groundwater.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "TRUE",
            explanation: "Dissolved CO2 is denser than surrounding groundwater, so it sinks rather than rises."
          },
          {
            question_id: "R2-P3-Q10",
            question_number: 10,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "What percentage of injected CO2 solidifies into stone within two years?",
            options: ["A. 25 percent", "B. 50 percent", "C. Over 95 percent", "D. 100 percent"],
            answer: "C",
            explanation: "Over 95 percent of injected carbon is permanently mineralized into solid stone within two years."
          }
        ]
      }
    ]
  };

  const writingSection = {
    title: `IELTS Writing Section (Set 2: ${isAcademic ? "Academic" : "General Training"})`,
    allocated_time_seconds: 3600,
    tasks: [
      {
        task_number: 1,
        title: isAcademic ? "Writing Task 1 (Academic Data Report)" : "Writing Task 1 (General Training Formal Letter)",
        min_words: 150,
        recommended_minutes: 20,
        prompt: isAcademic
          ? "The line graph below shows global commercial aviation passenger traffic (in billions of passenger journeys) and total airline carbon offset investments (in millions of metric tons) between 2005 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant."
          : "You rent an apartment from a property management agency. Over the past three weeks, the central heating boiler has repeatedly malfunctioned during freezing winter weather, and previous phone inquiries have received no response.\n\nWrite a formal letter to the property manager detailing the issue, explaining the impact, and demanding urgent repairs.",
        guidance: "Write at least 150 words."
      },
      {
        task_number: 2,
        title: "Writing Task 2 (Discursive Essay)",
        min_words: 250,
        recommended_minutes: 40,
        prompt: "Some people argue that national governments should allocate substantial financial budgets to space exploration and planetary missions. Others contend that all public funding should be concentrated exclusively on urgent terrestrial challenges, such as eradicating poverty, improving healthcare, and combating climate change.\n\nDiscuss both views and give your own opinion.",
        guidance: "Write at least 250 words. Organize your essay with a clear introduction, 2 balanced body paragraphs, and a conclusive stance."
      }
    ]
  };

  const speakingSection = {
    title: "IELTS Speaking Examination (Set 2: AI Voice Examiner)",
    allocated_time_seconds: 840,
    parts: [
      {
        part_number: 1,
        title: "Part 1: Daily Routines and Leisure Preferences",
        instruction: "Answer questions naturally in 2 to 4 sentences.",
        questions: [
          { id: "SPK2-P1-Q1", examiner_script: "Good morning. My name is Dr. Harrison. To start with, what is your typical morning routine on a normal working or study day?" },
          { id: "SPK2-P1-Q2", examiner_script: "Do you prefer spending your weekends relaxing quietly at home, or do you enjoy traveling and social outings?" },
          { id: "SPK2-P1-Q3", examiner_script: "Which season of the year do you enjoy most in your country, and why?" },
          { id: "SPK2-P1-Q4", examiner_script: "Do you find it easy to manage your time effectively, or do you sometimes struggle with procrastination?" }
        ]
      },
      {
        part_number: 2,
        title: "Part 2: Individual Long Turn (Cue Card)",
        instruction: "You have 1 minute to plan your response, then speak continuously for 1 to 2 minutes.",
        prep_time_seconds: 60,
        speak_time_seconds: 120,
        cue_card: {
          topic: "Describe a memorable journey or educational trip you took that taught you something valuable.",
          bullet_points: [
            "Where you went and who accompanied you",
            "What modes of transportation you utilized",
            "What activities or cultural sites you explored",
            "And explain what valuable lesson or insight you gained from that journey."
          ]
        },
        examiner_script: "Now, I am going to give you a topic and I would like you to speak on it for one to two minutes. Before you speak, you will have one minute to prepare. Here is your cue card."
      },
      {
        part_number: 3,
        title: "Part 3: In-Depth Analytical Discussion on Travel & Mobility",
        instruction: "Discuss broader topics related to Part 2 with justifications and hypotheses.",
        questions: [
          { id: "SPK2-P3-Q1", examiner_script: "How has the rise of low-cost international mass tourism affected historic cultural landmarks and local communities?" },
          { id: "SPK2-P3-Q2", examiner_script: "Should governments invest more heavily in high-speed electric rail networks rather than expanding municipal airports?" },
          { id: "SPK2-P3-Q3", examiner_script: "Do you think virtual reality and immersive travel technologies will ever reduce people's desire to physically visit foreign countries?" }
        ]
      }
    ]
  };

  const packageObj: any = {
    test_type: testType,
    module: module,
    set_id: 2,
    title: `Official IELTS ${isAcademic ? "Academic" : "General Training"} Mock Examination (Set 2)`,
    sections: {}
  };

  if (module === "full" || module === "listening") packageObj.sections.listening = listeningSection;
  if (module === "full" || module === "reading") packageObj.sections.reading = readingSection;
  if (module === "full" || module === "writing") packageObj.sections.writing = writingSection;
  if (module === "full" || module === "speaking") packageObj.sections.speaking = speakingSection;

  return packageObj;
}

// ==============================================================================
// TEST SET 3 (Comprehensive Global Assessment)
// ==============================================================================

export function getClientMockPackageSet3(testType: string = "academic", module: string = "full") {
  const isAcademic = testType === "academic";

  const listeningSection = {
    title: "IELTS Listening Section (Set 3: Comprehensive Assessment)",
    allocated_time_seconds: 1800,
    total_questions: 11,
    parts: [
      {
        part_number: 1,
        title: "Part 1: International Green Tech Conference Registration",
        context: "A phone dialogue between delegate Dr. Priya Patel and registration coordinator Liam at the World Eco-Innovations Forum.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section1_conference_reg.mp3",
        transcript_cue: "Liam: Eco-Innovations registration office. Priya: Good morning, I am calling to register. My surname is Patel, P-A-T-E-L, from Imperial College. I wish to book the Clean Hydrogen workshop package. Liam: Excellent, the subsidized fee is £180.",
        questions: [
          {
            question_id: "L3-P1-Q1",
            question_number: 1,
            question_type: "form_completion",
            instruction: "Write ONE WORD ONLY.",
            question: "Delegate surname: ________",
            options: [],
            answer: "Patel",
            explanation: "The caller provides her surname as Patel (P-A-T-E-L)."
          },
          {
            question_id: "L3-P1-Q2",
            question_number: 2,
            question_type: "form_completion",
            instruction: "Write ONE WORD ONLY.",
            question: "Academic institution: ________ College",
            options: [],
            answer: "Imperial",
            explanation: "Dr. Patel represents Imperial College."
          },
          {
            question_id: "L3-P1-Q3",
            question_number: 3,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "Which technical workshop did Dr. Patel enroll in?",
            options: [
              "A. Solar Battery Chemistry",
              "B. Clean Hydrogen Technologies",
              "C. Carbon Accounting Standards"
            ],
            answer: "B",
            explanation: "She enrolls specifically in the Clean Hydrogen technical workshop."
          },
          {
            question_id: "L3-P1-Q4",
            question_number: 4,
            question_type: "form_completion",
            instruction: "Write ONE NUMBER ONLY.",
            question: "Subsidized registration fee: £________",
            options: [],
            answer: "180",
            explanation: "Liam confirms the fee is £180."
          }
        ]
      },
      {
        part_number: 2,
        title: "Part 2: Royal Palm Botanical Conservatory Guided Tour Briefing",
        context: "Head horticulturist Fiona Stewart guiding visitors through the Victorian glasshouse conservatory.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section2_conservatory.mp3",
        transcript_cue: "Fiona: Welcome to Royal Palm Conservatory. Visitors must remain on the central stone pathway to protect sensitive root epiphytes. Strobe flash photography is forbidden. Our guided lecture begins at 10:15 AM beside the lily pond.",
        questions: [
          {
            question_id: "L3-P2-Q5",
            question_number: 5,
            question_type: "sentence_completion",
            instruction: "Write NO MORE THAN TWO WORDS.",
            question: "Visitors inside the mist pavilion must remain on the central ________.",
            options: [],
            answer: "stone pathway",
            explanation: "Fiona warns visitors to remain on the central stone pathway."
          },
          {
            question_id: "L3-P2-Q6",
            question_number: 6,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "What activity is strictly forbidden inside the glasshouse?",
            options: [
              "A. Taking notes in notebooks",
              "B. Using flash photography",
              "C. Carrying personal water bottles"
            ],
            answer: "B",
            explanation: "Photography using artificial strobe flash is strictly prohibited."
          },
          {
            question_id: "L3-P2-Q7",
            question_number: 7,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "What time does the medicinal flora lecture begin?",
            options: ["A. 10:00 AM", "B. 10:15 AM", "C. 11:30 AM"],
            answer: "B",
            explanation: "The lecture commences promptly at 10:15 AM."
          }
        ]
      },
      {
        part_number: 3,
        title: "Part 3: Research Seminar: Chemosynthesis at Deep-Sea Hydrothermal Vents",
        context: "Marine biology postgraduates Elena and Tariq discussing benthic findings with Professor Al-Mansoor.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section3_abyssal.mp3",
        transcript_cue: "Elena: We discovered tube worm colonies at depths exceeding 2,500 meters. Tariq: Bacteria oxidize toxic hydrogen sulfide gas to synthesize glucose, supporting the benthic food chain without sunlight.",
        questions: [
          {
            question_id: "L3-P3-Q8",
            question_number: 8,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "What is the primary biological energy source in hydrothermal vent ecosystems?",
            options: [
              "A. Decaying surface whale carcasses",
              "B. Bacterial oxidation of hydrogen sulfide gas",
              "C. Faint blue light bioluminescence"
            ],
            answer: "B",
            explanation: "Chemosynthetic bacteria oxidize toxic hydrogen sulfide gas to synthesize glucose."
          },
          {
            question_id: "L3-P3-Q9",
            question_number: 9,
            question_type: "sentence_completion",
            instruction: "Write ONE NUMBER ONLY.",
            question: "The tube worm colonies were discovered at depths exceeding ________ meters.",
            options: [],
            answer: "2500",
            explanation: "Elena states colonies thrive at depths exceeding 2,500 meters."
          }
        ]
      },
      {
        part_number: 4,
        title: "Part 4: Academic Lecture: Avian Biomimicry in Shinkansen High-Speed Trains",
        context: "Lecture by Dr. Kenji Sato on how bird anatomy resolved bullet train noise pollution.",
        audio_url: "https://assets.ieltsaicoach.com/audio/section4_biomimicry.mp3",
        transcript_cue: "Dr. Sato: When entering tunnels at 300 km/h, blunt train noses caused tunnel sonic booms. Chief engineer Nakatsu modeled the nose after the kingfisher bird beak, eliminating the boom and reducing electrical power use by 15%.",
        questions: [
          {
            question_id: "L3-P4-Q10",
            question_number: 10,
            question_type: "sentence_completion",
            instruction: "Write ONE WORD ONLY.",
            question: "The redesigned bullet train nose was modelled directly after the beak of the ________.",
            options: [],
            answer: "kingfisher",
            explanation: "The text confirms the redesign was modeled after the beak of the kingfisher."
          },
          {
            question_id: "L3-P4-Q11",
            question_number: 11,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, or C.",
            question: "What additional engineering benefit resulted from adopting the avian nose profile?",
            options: [
              "A. Train manufacturing costs dropped by 50%",
              "B. Electrical power consumption decreased by 15%",
              "C. Passenger seating capacity increased substantially"
            ],
            answer: "B",
            explanation: "The redesign reduced electrical power consumption by 15%."
          }
        ]
      }
    ]
  };

  const readingSection = {
    title: `IELTS Reading Section (Set 3: ${isAcademic ? "Academic" : "General Training"})`,
    allocated_time_seconds: 3600,
    total_questions: 10,
    passages: [
      {
        passage_number: 1,
        title: "Passage 1: Chemosynthesis in Deep Ocean Hydrothermal Ecosystems",
        topic: "Oceanography & Astrobiology",
        word_count: 860,
        text: (
          "Until the discovery of hydrothermal vents along the Galápagos Rift in 1977, biological dogma asserted that " +
          "all metazoan life was fueled by solar photosynthesis. In the pitch-black abyss exceeding two thousand meters, " +
          "researchers were astonished to uncover vibrant ecosystems supported by chemosynthesis.\n\n" +
          "Primary production is driven by chemolithoautotrophic bacteria that oxidize hydrogen sulfide (H2S) emitted in scalding subterranean fluids. " +
          "Adult Riftia tube worms possess neither a mouth nor gut; their visceral cavity houses a trophosome packed with endosymbiotic bacteria. " +
          "Their unique hemoglobin binds both oxygen and toxic sulfide simultaneously to nourish the symbionts."
        ),
        questions: [
          {
            question_id: "R3-P1-Q1",
            question_number: 1,
            question_type: "true_false_not_given",
            instruction: "Write TRUE, FALSE, or NOT GIVEN.",
            question: "Prior to 1977, biologists believed all complex multicellular life depended upon solar photosynthesis.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "TRUE",
            explanation: "The text confirms dogma asserted all metazoan life was fueled by solar photosynthesis."
          },
          {
            question_id: "R3-P1-Q2",
            question_number: 2,
            question_type: "sentence_completion",
            instruction: "Write ONE WORD ONLY from the passage.",
            question: "Adult Riftia tube worms house symbiotic bacteria in an internal organ called the ________.",
            options: [],
            answer: "trophosome",
            explanation: "The passage identifies the internal organ as the 'trophosome'."
          },
          {
            question_id: "R3-P1-Q3",
            question_number: 3,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "What is biologically unique about the hemoglobin in Riftia tube worms?",
            options: [
              "A. It glows brightly via bioluminescence",
              "B. It can bind both dissolved oxygen and toxic hydrogen sulfide simultaneously",
              "C. It contains copper instead of iron atoms",
              "D. It freezes solid at water temperatures below four degrees"
            ],
            answer: "B",
            explanation: "Unique high-affinity hemoglobin binds both oxygen and toxic sulfide simultaneously."
          }
        ]
      },
      {
        passage_number: 2,
        title: "Passage 2: Avian Biomimicry and Aerodynamic Transport",
        topic: "Engineering Biomimetics",
        word_count: 870,
        text: (
          "Biomimicry—the practice of emulating nature's time-tested designs—has revolutionized transportation. " +
          "Japan's 500-Series Shinkansen bullet train previously generated explosive noise known as tunnel boom when entering narrow tunnels. " +
          "By reshaping the locomotive after the splash-free beak of the kingfisher bird, engineers eliminated the shockwave and dropped power consumption by 15%. " +
          "Similarly, wavy tubercles modeled after humpback whale flippers on wind turbines increase power output by up to 20% while delaying aerodynamic stall."
        ),
        questions: [
          {
            question_id: "R3-P2-Q4",
            question_number: 4,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "What inspired the acoustic redesign of the Shinkansen train nose?",
            options: [
              "A. The dorsal fin of an orca whale",
              "B. The streamlined beak of a kingfisher bird",
              "C. The wing structure of a peregrine falcon",
              "D. The shell shape of a sea turtle"
            ],
            answer: "B",
            explanation: "Engineers modeled the train nose directly after the beak of the kingfisher."
          },
          {
            question_id: "R3-P2-Q5",
            question_number: 5,
            question_type: "sentence_completion",
            instruction: "Write ONE WORD ONLY from the passage.",
            question: "Turbine blades inspired by humpback whale flippers feature wavy ridges known as ________.",
            options: [],
            answer: "tubercles",
            explanation: "The text refers to serrated aerodynamic tubercles on humpback flippers."
          },
          {
            question_id: "R3-P2-Q6",
            question_number: 6,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "By what percentage did humpback-inspired turbine blades improve annual energy generation?",
            options: ["A. Up to 5%", "B. Up to 10%", "C. Up to 20%", "D. Over 50%"],
            answer: "C",
            explanation: "The passage confirms increasing annual power output by up to 20%."
          }
        ]
      },
      {
        passage_number: 3,
        title: "Passage 3: Cognitive Linguistics and the Bilingual Advantage",
        topic: "Psycholinguistics & Neuroscience",
        word_count: 890,
        text: (
          "Research has conclusively refuted the old belief that childhood multilingualism causes mental confusion. " +
          "In bilingual brains, both linguistic systems remain perpetually active, forcing the prefrontal cortex to continually suppress competing candidates. " +
          "This mental exercise strengthens executive function—governing attentional control, working memory, and cognitive flexibility. " +
          "Longitudinal data demonstrates that bilingualism builds substantial cognitive reserve, delaying the onset of Alzheimer's dementia symptoms by an average of 4 to 5 years."
        ),
        questions: [
          {
            question_id: "R3-P3-Q7",
            question_number: 7,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "What was the prevalent belief regarding bilingualism in the early twentieth century?",
            options: [
              "A. It prevented children from developing artistic creativity",
              "B. It would cause mental confusion and impede intellectual development",
              "C. It caused hearing loss",
              "D. It accelerated mathematical learning rates"
            ],
            answer: "B",
            explanation: "Early orthodoxy warned that learning two languages would induce cognitive confusion."
          },
          {
            question_id: "R3-P3-Q8",
            question_number: 8,
            question_type: "sentence_completion",
            instruction: "Write NO MORE THAN TWO WORDS.",
            question: "Bilingualism strengthens front lobe mechanisms known as ________ function.",
            options: [],
            answer: "executive",
            explanation: "The text highlights executive function."
          },
          {
            question_id: "R3-P3-Q9",
            question_number: 9,
            question_type: "true_false_not_given",
            instruction: "Write TRUE, FALSE, or NOT GIVEN.",
            question: "When a bilingual speaks one language, their other language is completely deactivated in the brain.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "FALSE",
            explanation: "Both linguistic systems remain perpetually active."
          },
          {
            question_id: "R3-P3-Q10",
            question_number: 10,
            question_type: "multiple_choice",
            instruction: "Choose the correct letter, A, B, C, or D.",
            question: "By how many years does lifelong bilingualism delay the onset of Alzheimer's symptoms on average?",
            options: ["A. 1 to 2 years", "B. 4 to 5 years", "C. 10 years", "D. 15 years"],
            answer: "B",
            explanation: "Epidemiological data shows a delay of four to five years compared to monolinguals."
          }
        ]
      }
    ]
  };

  const writingSection = {
    title: `IELTS Writing Section (Set 3: ${isAcademic ? "Academic" : "General Training"})`,
    allocated_time_seconds: 3600,
    tasks: [
      {
        task_number: 1,
        title: isAcademic ? "Writing Task 1 (Academic Process Flow Diagram)" : "Writing Task 1 (General Training Formal Letter)",
        min_words: 150,
        recommended_minutes: 20,
        prompt: isAcademic
          ? "The diagram below illustrates the sequential stages involved in the industrial process of seawater desalination via reverse osmosis to produce potable municipal drinking water.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant."
          : "There is an overgrown, abandoned plot of municipal land in your neighborhood. Write a letter to the local council chairperson proposing to convert this land into a community organic garden and educational park.",
        guidance: "Write at least 150 words."
      },
      {
        task_number: 2,
        title: "Writing Task 2 (Discursive Essay)",
        min_words: 250,
        recommended_minutes: 40,
        prompt: "Some educators argue that universities should focus exclusively on imparting specialized vocational skills and practical training directly aligned with immediate industry employment. Others believe that the fundamental purpose of higher education is to cultivate broad theoretical knowledge, critical philosophy, and intellectual inquiry.\n\nDiscuss both views and give your own opinion.",
        guidance: "Write at least 250 words. Structure your response with an introduction, two cohesive body paragraphs, and a justified personal stance."
      }
    ]
  };

  const speakingSection = {
    title: "IELTS Speaking Examination (Set 3: AI Voice Examiner)",
    allocated_time_seconds: 840,
    parts: [
      {
        part_number: 1,
        title: "Part 1: Cultural Interests and Personal Learning",
        instruction: "Answer questions naturally in 2 to 4 sentences.",
        questions: [
          { id: "SPK3-P1-Q1", examiner_script: "Good morning. My name is Dr. Harrison. To start with, what genres of music do you most enjoy listening to when you want to concentrate or relax?" },
          { id: "SPK3-P1-Q2", examiner_script: "Do you prefer reading physical printed books, or do you find reading on digital screens and e-readers more convenient?" },
          { id: "SPK3-P1-Q3", examiner_script: "What do you find most challenging when learning a foreign language?" },
          { id: "SPK3-P1-Q4", examiner_script: "Is there a traditional cultural festival in your hometown that you particularly look forward to each year?" }
        ]
      },
      {
        part_number: 2,
        title: "Part 2: Individual Long Turn (Cue Card)",
        instruction: "You have 1 minute to plan your response, then speak continuously for 1 to 2 minutes.",
        prep_time_seconds: 60,
        speak_time_seconds: 120,
        cue_card: {
          topic: "Describe a challenging project or milestone that required significant discipline and planning to achieve.",
          bullet_points: [
            "What this project or personal objective was",
            "What obstacles or setbacks you encountered during the process",
            "How you organized your time and resources to overcome those hurdles",
            "And explain how you felt when you successfully completed the objective."
          ]
        },
        examiner_script: "Now, I am going to give you a topic and I would like you to speak on it for one to two minutes. Before you speak, you will have one minute to think and take notes. Here is your cue card."
      },
      {
        part_number: 3,
        title: "Part 3: In-Depth Analytical Discussion on Achievement & Education",
        instruction: "Discuss broader topics related to Part 2 with justifications and hypotheses.",
        questions: [
          { id: "SPK3-P3-Q1", examiner_script: "In modern educational institutions, is too much emphasis placed on standardized examination scores rather than creative problem-solving?" },
          { id: "SPK3-P3-Q2", examiner_script: "What role does learning from failure or temporary setbacks play in long-term intellectual and professional growth?" },
          { id: "SPK3-P3-Q3", examiner_script: "How can governments foster lifelong adult education programs in an era of rapid technological disruption?" }
        ]
      }
    ]
  };

  const packageObj: any = {
    test_type: testType,
    module: module,
    set_id: 3,
    title: `Official IELTS ${isAcademic ? "Academic" : "General Training"} Mock Examination (Set 3)`,
    sections: {}
  };

  if (module === "full" || module === "listening") packageObj.sections.listening = listeningSection;
  if (module === "full" || module === "reading") packageObj.sections.reading = readingSection;
  if (module === "full" || module === "writing") packageObj.sections.writing = writingSection;
  if (module === "full" || module === "speaking") packageObj.sections.speaking = speakingSection;

  return packageObj;
}
