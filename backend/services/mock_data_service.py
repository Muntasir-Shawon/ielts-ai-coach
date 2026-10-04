"""
Mock Data Service (backend/services/mock_data_service.py).
Constructs realistic IELTS Academic and General Training examination packages
from processed Kaggle datasets and standardized IELTS item specifications.
"""
import os
import json
import csv
from typing import Dict, Any, List
from backend.services.mock_test_sets import (
    build_listening_set_2,
    build_listening_set_3,
    build_reading_set_2,
    build_reading_set_3,
    build_writing_set_2,
    build_writing_set_3,
    build_speaking_set_2,
    build_speaking_set_3
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "processed")

class MockDataService:
    def __init__(self):
        self._reading_tests = self._load_json("clean_ielts_reading_tests.json")
        self._listening_tests = self._load_json("clean_ielts_listening_tests.json")
        self._speaking_topics = self._load_json("clean_ielts_speaking_topics.json")
        self._writing_prompts = self._load_writing_prompts()

    def _load_json(self, filename: str) -> List[Dict[str, Any]]:
        path = os.path.join(DATA_DIR, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def _load_writing_prompts(self) -> List[Dict[str, Any]]:
        path = os.path.join(DATA_DIR, "clean_writing_essays.csv")
        prompts = []
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    prompts.append({
                        "id": row.get("id"),
                        "task": row.get("task", "Task 2"),
                        "topic": row.get("topic", "general"),
                        "prompt": row.get("prompt"),
                        "question_type": row.get("question_type", "opinion")
                    })
        return prompts

    def get_mock_package(self, test_type: str = "academic", module: str = "full", set_id: int = 1) -> Dict[str, Any]:
        """
        Builds a comprehensive examination package for Academic or General Training.
        Supports multiple test sets (set_id=1, 2, 3) to prevent repeating questions.
        """
        package: Dict[str, Any] = {
            "test_type": test_type,
            "module": module,
            "set_id": set_id,
            "title": f"Official IELTS {test_type.replace('_', ' ').title()} Mock Examination (Set {set_id})",
            "sections": {}
        }

        if module in ("full", "listening"):
            package["sections"]["listening"] = self._build_listening_section(set_id)

        if module in ("full", "reading"):
            package["sections"]["reading"] = self._build_reading_section(test_type, set_id)

        if module in ("full", "writing"):
            package["sections"]["writing"] = self._build_writing_section(test_type, set_id)

        if module in ("full", "speaking"):
            package["sections"]["speaking"] = self._build_speaking_section(set_id)

        return package

    def _build_listening_section(self, set_id: int = 1) -> Dict[str, Any]:
        """
        Realistic IELTS Listening: 4 parts, authentic audio cues, questions with form completion,
        multiple choice, sentence completion, and matching.
        """
        if set_id == 2:
            return build_listening_set_2()
        elif set_id == 3:
            return build_listening_set_3()
        return self._build_listening_set_1()

    def _build_listening_set_1(self) -> Dict[str, Any]:
        parts = []
        
        # Part 1: Social Dialogue / Form completion
        parts.append({
            "part_number": 1,
            "title": "Part 1: Community Sports Centre Membership Registration",
            "context": "A conversation between a customer and a sports facility receptionist regarding club membership options.",
            "audio_url": "https://assets.ieltsaicoach.com/audio/section1_sports_reg.mp3",
            "audio_duration_seconds": 180,
            "transcript_cue": "Receptionist: Good morning, City Sports Centre. How can I help you today? Caller: Hello, I would like to inquire about becoming a member of the badminton and swimming club for the autumn session. Receptionist: Certainly. Let me take down a few details first. Can I have your full name please? Caller: Yes, it is Sarah Henderson. That is H-E-N-D-E-R-S-O-N. Receptionist: And a contact phone number? Caller: 07700 900123. Receptionist: Excellent. We offer three tiers: Off-Peak, Silver Racquet & Swim, and Gold All-Inclusive. Which were you interested in? Caller: I only need weekday access for court sessions and the heated pool, so the Silver Racquet & Swim tier sounds perfect. Receptionist: Great, that is 45 pounds per month. Your first session can begin this upcoming Monday at 9:00 AM.",
            "questions": [
                {
                    "question_id": "L-P1-Q1",
                    "question_number": 1,
                    "question_type": "form_completion",
                    "instruction": "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
                    "question": "Applicant surname: ________",
                    "options": [],
                    "answer": "Henderson",
                    "explanation": "Sarah spells out her surname as H-E-N-D-E-R-S-O-N."
                },
                {
                    "question_id": "L-P1-Q2",
                    "question_number": 2,
                    "question_type": "form_completion",
                    "instruction": "Write ONE WORD AND/OR A NUMBER.",
                    "question": "Contact telephone: 07700 ________",
                    "options": [],
                    "answer": "900123",
                    "explanation": "The caller clearly gives 07700 900123."
                },
                {
                    "question_id": "L-P1-Q3",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "instruction": "Choose the correct letter, A, B, or C.",
                    "question": "Which membership category has the candidate selected?",
                    "options": [
                        "A. Gold All-Inclusive",
                        "B. Silver Racquet & Swim",
                        "C. Off-Peak Weekend"
                    ],
                    "answer": "B",
                    "explanation": "Sarah selects Silver Racquet & Swim as it covers weekday court and pool sessions."
                },
                {
                    "question_id": "L-P1-Q4",
                    "question_number": 4,
                    "question_type": "form_completion",
                    "instruction": "Write ONE NUMBER ONLY.",
                    "question": "Monthly membership fee: £________",
                    "options": [],
                    "answer": "45",
                    "explanation": "The receptionist quotes 45 pounds per month."
                }
            ]
        })

        # Part 2: Monologue / Public Guide
        parts.append({
            "part_number": 2,
            "title": "Part 2: Orientation Guide for New Volunteers at Haven Wildlife Sanctuary",
            "context": "A talk by a sanctuary manager briefing volunteers on site navigation, feeding schedules, and safety protocols.",
            "audio_url": "https://assets.ieltsaicoach.com/audio/section2_sanctuary.mp3",
            "audio_duration_seconds": 210,
            "transcript_cue": "Welcome everyone to Haven Wildlife Sanctuary. Over the next six weeks, you will be assisting our keepers. Let me draw your attention to the site map. The main gate opens into the visitor pavilion. Immediately to the left of the visitor pavilion is the Veterinary clinic, where all medical checkups occur. Across the central courtyard to the north is the Raptor Rehabilitation Aviary. Please note that volunteers must wear protective leather gauntlets before entering the aviary. Feeding times for the coastal otter enclosure are strictly at 11:30 AM and 3:30 PM. In the event of extreme weather, all personnel report to the emergency assembly point behind the administration cottage.",
            "questions": [
                {
                    "question_id": "L-P2-Q5",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "instruction": "Choose the correct letter, A, B, or C.",
                    "question": "Where is the Veterinary Clinic situated relative to the visitor pavilion?",
                    "options": [
                        "A. Directly opposite across the courtyard",
                        "B. Immediately to the left of the pavilion",
                        "C. Behind the administration cottage"
                    ],
                    "answer": "B",
                    "explanation": "The speaker specifies the clinic is 'immediately to the left of the visitor pavilion'."
                },
                {
                    "question_id": "L-P2-Q6",
                    "question_number": 6,
                    "question_type": "sentence_completion",
                    "instruction": "Complete the sentence with NO MORE THAN TWO WORDS.",
                    "question": "Volunteers entering the raptor aviary must wear ________.",
                    "options": [],
                    "answer": "protective gauntlets",
                    "explanation": "The guide instructs volunteers to wear 'protective leather gauntlets' (gauntlets / protective gauntlets)."
                },
                {
                    "question_id": "L-P2-Q7",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "instruction": "Choose the correct letter, A, B, or C.",
                    "question": "What time is the morning otter feeding scheduled?",
                    "options": [
                        "A. 10:00 AM",
                        "B. 11:30 AM",
                        "C. 12:00 PM"
                    ],
                    "answer": "B",
                    "explanation": "Feeding times for the otter enclosure are strictly at 11:30 AM and 3:30 PM."
                }
            ]
        })

        # Part 3: Academic Discussion
        parts.append({
            "part_number": 3,
            "title": "Part 3: University Seminar on Sustainable Architectural Design",
            "context": "Two architecture students, Liam and Chloe, discussing their design project with their tutor, Dr. Evans.",
            "audio_url": "https://assets.ieltsaicoach.com/audio/section3_architecture.mp3",
            "audio_duration_seconds": 240,
            "transcript_cue": "Dr. Evans: Liam, Chloe, let's review your final submission for the solar passive library proposal. Liam: Thanks, Dr. Evans. We've decided to prioritize cross-ventilation through central atrium lightwells rather than relying on active air conditioning. Chloe: That significantly drops thermal mechanical load during peak summer months. However, our main debate is whether to specify cross-laminated timber or recycled steel for the structural frame. Liam: Timber sequester carbon, but our lifecycle analysis showed timber transport costs from overseas forestry were higher than localized steel recycling. Dr. Evans: A valid tradeoff. Make sure your design report substantiates that decision with cost-emission ratios.",
            "questions": [
                {
                    "question_id": "L-P3-Q8",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "instruction": "Choose the correct letter, A, B, or C.",
                    "question": "Why did Liam and Chloe incorporate central atrium lightwells into the building?",
                    "options": [
                        "A. To provide natural illumination and passive cross-ventilation",
                        "B. To reduce the acoustic echo between reading halls",
                        "C. To support rooftop rain catchment reservoirs"
                    ],
                    "answer": "A",
                    "explanation": "They prioritized cross-ventilation through central lightwells to drop thermal mechanical load."
                },
                {
                    "question_id": "L-P3-Q9",
                    "question_number": 9,
                    "question_type": "sentence_completion",
                    "instruction": "Write NO MORE THAN TWO WORDS.",
                    "question": "The students chose recycled steel over timber due to excessive ________ costs.",
                    "options": [],
                    "answer": "transport",
                    "explanation": "Timber transport costs from overseas forestry exceeded localized recycled steel."
                },
                {
                    "question_id": "L-P3-Q10",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "instruction": "Choose the correct letter, A, B, or C.",
                    "question": "What does Dr. Evans recommend the students emphasize in their final report?",
                    "options": [
                        "A. A detailed 3D architectural blueprint",
                        "B. The cost-emission ratios of their structural material choice",
                        "C. An interview with local construction contractors"
                    ],
                    "answer": "B",
                    "explanation": "Dr. Evans advises substantiating the decision with 'cost-emission ratios'."
                }
            ]
        })

        # Part 4: Academic Lecture
        parts.append({
            "part_number": 4,
            "title": "Part 4: Academic Lecture: Urban Heat Island Mitigation",
            "context": "A university lecture on the thermodynamic drivers of metropolitan heat islands and urban planning countermeasures.",
            "audio_url": "https://assets.ieltsaicoach.com/audio/section4_urban_heat.mp3",
            "audio_duration_seconds": 270,
            "transcript_cue": "Professor: Today we examine the urban heat island phenomenon. In dense metropolitan regions, anthropogenic heat output and dense paved surfaces cause ambient temperatures to register 3 to 7 degrees Celsius higher than adjoining rural terrain. The primary thermodynamic culprit is low surface albedo: dark asphalt pavements and bitumen rooftops absorb up to 90% of solar radiation. Furthermore, the absence of vegetative transpiration eliminates natural evaporative cooling. Mitigation studies confirm that retrofitting rooftops with sedum vegetation and deploying permeable, high-albedo pavements can drop surface temperatures by up to 15 degrees Celsius.",
            "questions": [
                {
                    "question_id": "L-P4-Q11",
                    "question_number": 11,
                    "question_type": "sentence_completion",
                    "instruction": "Complete the notes below. Write ONE WORD ONLY.",
                    "question": "Dark asphalt surfaces absorb high solar radiation due to having a low ________.",
                    "options": [],
                    "answer": "albedo",
                    "explanation": "Low surface albedo in asphalt causes up to 90% solar absorption."
                },
                {
                    "question_id": "L-P4-Q12",
                    "question_number": 12,
                    "question_type": "multiple_choice",
                    "instruction": "Choose the correct letter, A, B, or C.",
                    "question": "What is identified as the most effective municipal countermeasure?",
                    "options": [
                        "A. Banning diesel vehicle traffic in metropolitan zones",
                        "B. Retrofitting green vegetated roofs and high-albedo pavements",
                        "C. Diverting municipal storm runoff into subterranean cooling reservoirs"
                    ],
                    "answer": "B",
                    "explanation": "Retrofitting sedum roofs and high-albedo permeable pavements dropped surface temps by 15°C."
                }
            ]
        })

        total_questions = sum(len(p["questions"]) for p in parts)

        return {
            "title": "IELTS Listening Section (Standard 4 Parts)",
            "allocated_time_seconds": 1800, # 30 mins
            "total_questions": total_questions,
            "parts": parts
        }

    def _build_reading_section(self, test_type: str = "academic", set_id: int = 1) -> Dict[str, Any]:
        """
        Academic: 3 complex academic passages with multi-type question sets.
        General Training: Section 1 everyday notices, Section 2 workplace policies, Section 3 long general text.
        """
        if set_id == 2:
            return build_reading_set_2(test_type)
        elif set_id == 3:
            return build_reading_set_3(test_type)
        return self._build_reading_set_1(test_type)

    def _build_reading_set_1(self, test_type: str = "academic") -> Dict[str, Any]:
        if test_type == "academic":
            passages = [
                {
                    "passage_number": 1,
                    "title": "Passage 1: The Architecture and Hydraulic Engineering of Roman Aqueducts",
                    "topic": "Classical Civil Engineering",
                    "word_count": 820,
                    "text": (
                        "The roman aqueducts stand among the most astonishing engineering triumphs of classical antiquity. "
                        "Spanning hundreds of kilometers across the expansive provinces of the Roman Empire, these gravity-driven conduit "
                        "channels conveyed millions of liters of fresh mountain spring water daily to densely populated municipal centers, "
                        "luxurious public baths, and industrial milling facilities. Contrary to popular misconception, only a minor fraction "
                        "of any given aqueduct network was supported by monumental stone arches; over eighty percent of the overall distance "
                        "coursed underground through subterranean terracotta conduits and masonry-lined tunnels.\n\n"
                        "This deliberate subterranean alignment provided several vital benefits: it insulated municipal drinking water from "
                        "environmental contamination, prevented excessive evaporation beneath the blistering Mediterranean sun, and shielded "
                        "vital infrastructure from deliberate enemy sabotage during wartime hostilities. Specialized Roman surveyors, designated "
                        "as libratores, deployed advanced optical leveling equipment including the chorobates—a twenty-foot wooden leveling bench "
                        "equipped with plumb lines and precise water channels—to calculate delicate gradient declines averaging merely one meter "
                        "per kilometer. Such minute inclines ensured an uninterrupted, laminar hydraulic flow rate that prevented both stagnant "
                        "water accumulation and abrasive erosion along the lime-mortared channel walls.\n\n"
                        "Where aqueducts crossed broad valleys too profound for elevated arcades, engineers constructed inverted siphons: "
                        "pressurized lead pipes that dipped down one hillside and ascended the opposing slope governed by hydrostatic equilibrium. "
                        "At the city boundary, the water discharged into the castellum divisorium, a distribution cistern equipped with bronze sluice "
                        "gates that allocated supply according to strict municipal hierarchy: first to public drinking fountains, second to "
                        "civic baths, and lastly to private villas paying a metered civic water tariff."
                    ),
                    "questions": [
                        {
                            "question_id": "R-P1-Q1",
                            "question_number": 1,
                            "question_type": "true_false_not_given",
                            "instruction": "Do the following statements agree with the information in the passage? Write TRUE, FALSE, or NOT GIVEN.",
                            "question": "Most Roman aqueduct mileage was suspended on monumental above-ground masonry arches.",
                            "options": ["TRUE", "FALSE", "NOT GIVEN"],
                            "answer": "FALSE",
                            "explanation": "Over eighty percent of the overall distance coursed underground through subterranean channels."
                        },
                        {
                            "question_id": "R-P1-Q2",
                            "question_number": 2,
                            "question_type": "multiple_choice",
                            "instruction": "Choose the correct letter, A, B, C, or D.",
                            "question": "Why did Roman surveyors design channels with such minimal gradient declines?",
                            "options": [
                                "A. To conserve expensive masonry building supplies",
                                "B. To maintain smooth flow while preventing hydraulic channel erosion",
                                "C. To allow construction workers to navigate tunnels easily",
                                "D. Because mountain springs were located at similar sea levels"
                            ],
                            "answer": "B",
                            "explanation": "A minute incline maintained an uninterrupted laminar flow without stagnant accumulation or abrasive erosion."
                        },
                        {
                            "question_id": "R-P1-Q3",
                            "question_number": 3,
                            "question_type": "sentence_completion",
                            "instruction": "Complete the sentence below. Choose ONE WORD ONLY from the passage.",
                            "question": "Surveyors calculated delicate slope angles using an optical leveling instrument known as the ________.",
                            "options": [],
                            "answer": "chorobates",
                            "explanation": "The text identifies the 'chorobates—a twenty-foot wooden leveling bench'."
                        },
                        {
                            "question_id": "R-P1-Q4",
                            "question_number": 4,
                            "question_type": "matching_headings",
                            "instruction": "Which priority received water first at the castellum divisorium?",
                            "options": [
                                "A. Private residential villas",
                                "B. Municipal civic baths",
                                "C. Public drinking fountains",
                                "D. Industrial olive oil mills"
                            ],
                            "answer": "C",
                            "explanation": "Strict municipal hierarchy allocated water first to public drinking fountains, second to baths, and last to private villas."
                        }
                    ]
                },
                {
                    "passage_number": 2,
                    "title": "Passage 2: Marine Bioluminescence: Biochemical Light in the Deep Ocean",
                    "topic": "Marine Biology & Enzymology",
                    "word_count": 890,
                    "text": (
                        "Bioluminescence—the enzymatic generation and emission of cold light by living organisms—is ubiquitous across the world's "
                        "oceans. In oceanic waters below depths of two hundred meters (the mesopelagic zone) and exceeding one thousand meters "
                        "(the bathypelagic aphotic zone), sunlight is extinguished completely. Under these perpetual midnight conditions, biological "
                        "luminescence serves as the dominant modality for communication, prey acquisition, and defense against apex predators.\n\n"
                        "At the molecular level, the reaction requires two key chemical components: a substrate pigment generically termed luciferin, "
                        "and a specialized catalytic enzyme called luciferase. When luciferase catalyzes the oxidation of luciferin in the presence of "
                        "dissolved molecular oxygen, luciferin transforms into electronically excited oxyluciferin. As oxyluciferin relaxes to its ground "
                        "energy state, it releases electromagnetic photons. Remarkably, nearly 98 percent of the chemical reaction energy is converted "
                        "directly into radiant light with virtually undetectable thermal byproduct, rendering it almost one hundred percent efficient.\n\n"
                        "Marine fauna employ this living light for sophisticated ecological strategies. Midwater cephalopods and teleost fishes utilize "
                        "counterillumination: rows of ventral light-emitting organs called photophores emit downward radiance that precisely matches the "
                        "color and intensity of ambient downwelling celestial light from the ocean surface. Consequently, bottom-dwelling predators "
                        "looking upward cannot discern the silhouette of the swimming animal. In contrast, deep-sea anglerfish sport an illuminated "
                        "dorsal appendage—the esca—which harbors symbiotic bioluminescent bacteria to entice inquisitive prey within striking distance."
                    ),
                    "questions": [
                        {
                            "question_id": "R-P2-Q5",
                            "question_number": 5,
                            "question_type": "multiple_choice",
                            "instruction": "Choose the correct letter, A, B, C, or D.",
                            "question": "What is chemically extraordinary about the enzymatic oxidation of luciferin?",
                            "options": [
                                "A. It requires zero presence of dissolved oxygen",
                                "B. Almost 98 percent of reaction energy is converted to light with near-zero heat loss",
                                "C. It can only occur under severe atmospheric pressure exceeding 500 bars",
                                "D. It produces toxic chemical residues that dissolve ocean plastics"
                            ],
                            "answer": "B",
                            "explanation": "The passage confirms that nearly 98 percent of the chemical reaction energy converts directly into radiant light with virtually undetectable thermal byproduct."
                        },
                        {
                            "question_id": "R-P2-Q6",
                            "question_number": 6,
                            "question_type": "true_false_not_given",
                            "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                            "question": "Counterillumination is used to attract potential mates in shallow coastal lagoons.",
                            "options": ["TRUE", "FALSE", "NOT GIVEN"],
                            "answer": "FALSE",
                            "explanation": "Counterillumination is used for camouflage by matching ambient surface light to eliminate ventral silhouettes from predators below."
                        },
                        {
                            "question_id": "R-P2-Q7",
                            "question_number": 7,
                            "question_type": "sentence_completion",
                            "instruction": "Complete the sentence with ONE WORD ONLY from the passage.",
                            "question": "The deep-sea anglerfish lures prey using an illuminated dorsal organ named the ________.",
                            "options": [],
                            "answer": "esca",
                            "explanation": "The text states: 'anglerfish sport an illuminated dorsal appendage—the esca'."
                        }
                    ]
                },
                {
                    "passage_number": 3,
                    "title": "Passage 3: Macroeconomic Shifts in Global Renewable Energy Grids",
                    "topic": "Energy Economics & Public Policy",
                    "word_count": 940,
                    "text": (
                        "The past two decades have witnessed an unprecedented structural metamorphosis in the global energy landscape. What began as "
                        "heavily subsidized municipal pilot installations of solar photovoltaic panels and onshore wind turbines has evolved into "
                        "an economically dominant sector outcompeting legacy fossil fuel infrastructure on a levelized cost of energy (LCOE) basis. "
                        "The primary catalyst underpinning this tectonic shift has been Wright's Law of technological learning: with every cumulative "
                        "doubling of global photovoltaic manufacturing capacity, production capital expenditure declined by approximately twenty-eight percent.\n\n"
                        "However, the exponential integration of variable renewable energy (VRE) has exposed fundamental weaknesses in legacy centralized "
                        "transmission grids. Traditional electrical distribution architectures were engineered around steady, dispatchable thermal baseload "
                        "generators such as coal-fired boilers and combined-cycle gas turbines. Unlike these mechanical turbines, solar and wind power "
                        "are inherently intermittent and asynchronous, lacking mechanical inertia to stabilize grid frequency during sudden system disturbances.\n\n"
                        "To circumvent this systemic vulnerability, transmission system operators are rapidly commissioning utility-scale lithium-iron-phosphate "
                        "(LFP) battery energy storage systems, coupled with grid-forming inverters capable of digitally simulating mechanical rotor inertia. "
                        "Furthermore, regional high-voltage direct current (HVDC) interconnectors now enable transcontinental power transmission across "
                        "climatic zones, transporting surplus offshore wind energy generated in the North Sea directly to industrial manufacturing basins "
                        "in southern and central Europe with sub-three percent line resistance losses."
                    ),
                    "questions": [
                        {
                            "question_id": "R-P3-Q8",
                            "question_number": 8,
                            "question_type": "multiple_choice",
                            "instruction": "Choose the correct letter, A, B, C, or D.",
                            "question": "According to the passage, what principle explains the steep cost reduction in solar panel manufacturing?",
                            "options": [
                                "A. The law of diminishing agricultural returns",
                                "B. Wright's Law of technological learning",
                                "C. Moore's Law of semiconductor density",
                                "D. Keynesian macroeconomic demand stimulation"
                            ],
                            "answer": "B",
                            "explanation": "The text explicitly names 'Wright's Law of technological learning: with every cumulative doubling of global photovoltaic manufacturing capacity, production capital expenditure declined'."
                        },
                        {
                            "question_id": "R-P3-Q9",
                            "question_number": 9,
                            "question_type": "true_false_not_given",
                            "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                            "question": "Wind and solar energy supply inherent mechanical inertia to stabilize transmission frequency.",
                            "options": ["TRUE", "FALSE", "NOT GIVEN"],
                            "answer": "FALSE",
                            "explanation": "The text states that solar and wind power 'are inherently intermittent and asynchronous, lacking mechanical inertia'."
                        },
                        {
                            "question_id": "R-P3-Q10",
                            "question_number": 10,
                            "question_type": "sentence_completion",
                            "instruction": "Complete the sentence with NO MORE THAN TWO WORDS.",
                            "question": "Power grid operators deploy grid-forming inverters to electronically replicate mechanical ________.",
                            "options": [],
                            "answer": "rotor inertia",
                            "explanation": "Grid-forming inverters are 'capable of digitally simulating mechanical rotor inertia' (rotor inertia / mechanical inertia)."
                        }
                    ]
                }
            ]
        else:
            # General Training Reading: Workplace policies, public services, everyday informative texts
            passages = [
                {
                    "passage_number": 1,
                    "title": "Section 1: Community Library Borrowing Regulations & Co-Working Spaces",
                    "topic": "Public Services & Civic Amenities",
                    "word_count": 650,
                    "text": (
                        "Welcome to the Central District Library. As a registered library cardholder, you have full access to our loan collection, "
                        "media suites, and private study pods. Please review the lending regulations below to ensure a smooth visit:\n\n"
                        "1. Borrowing Limits: Adult patrons may borrow up to 12 physical books for a period of 21 calendar days. Audiobooks and documentary "
                        "DVDs are limited to 4 items per card for a loan period of 7 days.\n"
                        "2. Renewals: Items may be renewed up to three consecutive times online via your member portal, provided no other patron has placed a "
                        "reservation hold on the item. Express 7-day reserve collections are non-renewable.\n"
                        "3. Quiet Co-Working Zones: Floors 3 and 4 are designated as Silent Research Pods. Mobile phone ringers must be muted at all times. "
                        "Headphones with acoustic leakage are strictly prohibited. Light refreshments (bottled water with caps, hot drinks in thermal travel mugs) "
                        "are permitted, but hot or fragrant meals must be consumed in the Ground Floor Cafe area.\n"
                        "4. Lost Item Fees: Patrons are responsible for returning materials in their original condition. Items overdue by more than 30 days "
                        "will be declared lost, and a standard replacement charge of £18.50 plus a £3.00 administrative fee will be assessed."
                    ),
                    "questions": [
                        {
                            "question_id": "R-GT1-Q1",
                            "question_number": 1,
                            "question_type": "form_completion",
                            "instruction": "Write ONE NUMBER ONLY.",
                            "question": "Maximum number of physical books an adult cardholder can borrow: ________",
                            "options": [],
                            "answer": "12",
                            "explanation": "Adult patrons may borrow up to 12 physical books."
                        },
                        {
                            "question_id": "R-GT1-Q2",
                            "question_number": 2,
                            "question_type": "true_false_not_given",
                            "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                            "question": "Express 7-day reserve collections can be renewed up to three times online.",
                            "options": ["TRUE", "FALSE", "NOT GIVEN"],
                            "answer": "FALSE",
                            "explanation": "Express 7-day reserve collections are strictly non-renewable."
                        },
                        {
                            "question_id": "R-GT1-Q3",
                            "question_number": 3,
                            "question_type": "multiple_choice",
                            "instruction": "Choose the correct letter, A, B, or C.",
                            "question": "Where are library patrons permitted to eat warm meals?",
                            "options": [
                                "A. Inside the Silent Research Pods on Floor 3",
                                "B. In the Ground Floor Cafe",
                                "C. Anywhere on the outdoor terrace only"
                            ],
                            "answer": "B",
                            "explanation": "Hot or fragrant meals must be consumed in the Ground Floor Cafe area."
                        }
                    ]
                },
                {
                    "passage_number": 2,
                    "title": "Section 2: Health, Safety & Ergonomic Standards for Remote Employees",
                    "topic": "Employment Regulations & Workplace Safety",
                    "word_count": 720,
                    "text": (
                        "Company Policy Document HS-402: Flexible and Telecommuting Workstations.\n\n"
                        "All full-time and contractual employees approved for hybrid telecommuting must maintain a verified home workstation conforming "
                        "to company health and occupational safety guidelines:\n\n"
                        "1. Display Screen Equipment (DSE): Computer displays must be positioned directly in front of the operator at approximately arm's length "
                        "(50 to 70 cm). The top bezel of the display monitor should align with eye level when seated upright. Anti-glare screen filters are "
                        "available upon request through IT procurement.\n"
                        "2. Seating and Posture: Work chairs must feature an adjustable lumbar backrest, swivel base with five casters, and pneumatic seat-height "
                        "adjustment ensuring that thighs are parallel to the floor with feet resting flat. Footrests will be subsidized by the corporate ergonomic fund.\n"
                        "3. Repetitive Strain Prevention: For every 50 minutes of continuous keyboard or mouse input, staff members are mandated to take a "
                        "minimum 5 to 10-minute micro-break. This interval should involve optical rest (focusing on an object at least 6 meters away) and shoulder "
                        "mobilization exercises.\n"
                        "4. Incident Reporting: Work-related muscular aches, repetitive strain tingling, or home tripping accidents must be formally submitted "
                        "to Human Resources within 48 hours utilizing Safety Incident Form 2A."
                    ),
                    "questions": [
                        {
                            "question_id": "R-GT2-Q4",
                            "question_number": 4,
                            "question_type": "sentence_completion",
                            "instruction": "Complete the sentence with NO MORE THAN TWO WORDS.",
                            "question": "The top edge of the monitor display must be adjusted to align with ________.",
                            "options": [],
                            "answer": "eye level",
                            "explanation": "The top bezel of the monitor should align with eye level when seated upright."
                        },
                        {
                            "question_id": "R-GT2-Q5",
                            "question_number": 5,
                            "question_type": "form_completion",
                            "instruction": "Write ONE NUMBER ONLY.",
                            "question": "Employees must submit incident reports within ________ hours of an injury.",
                            "options": [],
                            "answer": "48",
                            "explanation": "Incident reports must be submitted within 48 hours."
                        }
                    ]
                },
                {
                    "passage_number": 3,
                    "title": "Section 3: The Resurgence of Traditional Woodblock Printing Techniques",
                    "topic": "Cultural Heritage & Modern Artisans",
                    "word_count": 860,
                    "text": (
                        "In an era dominated by instantaneous digital press runs and automated offset lithography, a burgeoning renaissance in relief woodblock "
                        "printing is capturing the attention of independent publishers, fine art collectors, and typographers worldwide. Dating back to eighth-century "
                        "East Asian monastic scriptoria and fifteenth-century European broadsheet printers, woodblock printing involves carving a relief matrix onto the "
                        "long-grain face of seasoned fruitwoods, such as cherry, pear, or boxwood.\n\n"
                        "The artisan commences by transferring an inverted brush drawing onto the polished timber surface. Using precision V-gouges, chisels, and "
                        "razor-edged knives, the block cutter systematically excavates all non-image negative space, leaving the intended lines elevated in relief. "
                        "Water-based natural pigments or viscous linseed oil inks are meticulously spread across the raised lines using horsehair brushes (marubake). "
                        "A damp sheet of handmade mulberry bark paper is then aligned over the inked block, and pressure is applied manually by rubbing a circular bamboo "
                        "pad known as a baren.\n\n"
                        "Unlike industrial four-color process printing where ink sits flat on treated paper stock, manual woodblock printing forces pigment deep into the "
                        "interwoven fibers of damp rag paper, producing unmatched textural depth, subtle tonal gradations (bokashi), and distinct tactile embossing."
                    ),
                    "questions": [
                        {
                            "question_id": "R-GT3-Q6",
                            "question_number": 6,
                            "question_type": "multiple_choice",
                            "instruction": "Choose the correct letter, A, B, C, or D.",
                            "question": "What is the primary function of the bamboo pad called a baren?",
                            "options": [
                                "A. To carve fine incisions into seasoned pear timber",
                                "B. To apply circular manual pressure when transferring ink onto paper",
                                "C. To polish raw cherrywood blocks prior to carving",
                                "D. To dry damp mulberry paper following printing"
                            ],
                            "answer": "B",
                            "explanation": "Pressure is applied manually by rubbing a circular bamboo pad known as a baren."
                        },
                        {
                            "question_id": "R-GT3-Q7",
                            "question_number": 7,
                            "question_type": "true_false_not_given",
                            "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                            "question": "Industrial offset lithography achieves greater textural fiber depth than manual woodblock printing.",
                            "options": ["TRUE", "FALSE", "NOT GIVEN"],
                            "answer": "FALSE",
                            "explanation": "The text notes that unlike industrial flat printing, manual woodblock forces pigment into fibers producing unmatched textural depth."
                        }
                    ]
                }
            ]

        total_questions = sum(len(p["questions"]) for p in passages)

        return {
            "title": f"IELTS Reading Section ({test_type.replace('_', ' ').title()})",
            "allocated_time_seconds": 3600, # 60 mins continuous
            "total_questions": total_questions,
            "passages": passages
        }

    def _build_writing_section(self, test_type: str = "academic", set_id: int = 1) -> Dict[str, Any]:
        """
        Both Task 1 and Task 2 under a single 60-minute continuous timer.
        Academic Task 1: Data report / chart description (150 words).
        General Training Task 1: Formal / Semi-formal letter (150 words).
        Task 2: Discursive Essay for both (250 words).
        """
        if set_id == 2:
            return build_writing_set_2(test_type)
        elif set_id == 3:
            return build_writing_set_3(test_type)
        return self._build_writing_set_1(test_type)

    def _build_writing_set_1(self, test_type: str = "academic") -> Dict[str, Any]:
        if test_type == "academic":
            task_1 = {
                "task_number": 1,
                "title": "Writing Task 1 (Academic Data Report)",
                "min_words": 150,
                "recommended_minutes": 20,
                "prompt": (
                    "The line graph below shows renewable energy consumption as a percentage of total energy use in four countries "
                    "(Germany, Sweden, China, and the United States) between 2000 and 2020.\n\n"
                    "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
                ),
                "data_points": {
                    "Germany": {"2000": "6%", "2010": "12%", "2020": "21%"},
                    "Sweden": {"2000": "38%", "2010": "47%", "2020": "56%"},
                    "China": {"2000": "4%", "2010": "9%", "2020": "16%"},
                    "USA": {"2000": "5%", "2010": "8%", "2020": "12%"}
                },
                "guidance": "Write at least 150 words. Provide an overview, identify major upward trends, and report key numerical milestones."
            }
        else:
            task_1 = {
                "task_number": 1,
                "title": "Writing Task 1 (General Training Letter)",
                "min_words": 150,
                "recommended_minutes": 20,
                "prompt": (
                    "You recently booked a multi-day international business conference flight with an airline, but your flight was delayed "
                    "by ten hours without prior notification, causing you to miss key sessions.\n\n"
                    "Write a letter to the airline customer service manager. In your letter:\n"
                    "- Give details of your flight booking and schedule\n"
                    "- Explain the problems and inconvenience caused by the delay\n"
                    "- State what action or compensation you expect the airline to provide."
                ),
                "guidance": "Write at least 150 words. Use an appropriate formal tone and begin your letter with 'Dear Sir or Madam,'."
            }

        task_2 = {
            "task_number": 2,
            "title": "Writing Task 2 (Discursive Essay)",
            "min_words": 250,
            "recommended_minutes": 40,
            "prompt": (
                "Some people believe that artificial intelligence and automation will replace human teachers in schools and universities "
                "within the next few decades, while others maintain that human educators will always remain essential.\n\n"
                "Discuss both views and give your own opinion. Give reasons for your answer and include relevant examples from your knowledge or experience."
            ),
            "guidance": "Write at least 250 words. Organize your essay with a clear introduction, 2 balanced body paragraphs, and a conclusive stance."
        }

        return {
            "title": f"IELTS Writing Section ({test_type.replace('_', ' ').title()})",
            "allocated_time_seconds": 3600, # 60 mins continuous for both tasks
            "tasks": [task_1, task_2]
        }

    def _build_speaking_section(self, set_id: int = 1) -> Dict[str, Any]:
        """
        Authentic 3-Part Speaking Examiner Simulation:
        Part 1: 3-4 interview questions (introductory familiarity).
        Part 2: Cue card with bullet points, 60-second preparation countdown, 2-minute speech timer.
        Part 3: 4 two-way analytical questions extending Part 2 themes.
        """
        if set_id == 2:
            return build_speaking_set_2()
        elif set_id == 3:
            return build_speaking_set_3()
        return self._build_speaking_set_1()

    def _build_speaking_set_1(self) -> Dict[str, Any]:
        return {
            "title": "IELTS Speaking Examination (AI Voice Examiner)",
            "allocated_time_seconds": 840, # ~14 minutes
            "parts": [
                {
                    "part_number": 1,
                    "title": "Part 1: Introduction and Everyday Familiarity",
                    "instruction": "The examiner asks general questions about yourself, your home, work or studies, and familiar interests. Answer naturally in 2 to 4 sentences.",
                    "questions": [
                        {
                            "id": "SPK-P1-Q1",
                            "examiner_script": "Good morning. My name is Dr. Harrison and I will be your IELTS speaking examiner today. To start with, could you tell me where you live and what you enjoy most about your hometown?"
                        },
                        {
                            "id": "SPK-P1-Q2",
                            "examiner_script": "Do you often spend time outdoors in green parks or natural spaces during your free time?"
                        },
                        {
                            "id": "SPK-P1-Q3",
                            "examiner_script": "Has the way you communicate with friends and family changed noticeably over recent years?"
                        },
                        {
                            "id": "SPK-P1-Q4",
                            "examiner_script": "Do you prefer studying or working in a quiet space, or do you work better with background activity?"
                        }
                    ]
                },
                {
                    "part_number": 2,
                    "title": "Part 2: Individual Long Turn (Cue Card)",
                    "instruction": "You have 1 minute to plan your answer. You can make notes. Then you must speak continuously for 1 to 2 minutes on the topic.",
                    "prep_time_seconds": 60,
                    "speak_time_seconds": 120,
                    "cue_card": {
                        "topic": "Describe a technological innovation or digital tool that has significantly improved your daily productivity or study routine.",
                        "bullet_points": [
                            "What this tool or technology is",
                            "When you first began utilizing it",
                            "What specific tasks or activities you use it for",
                            "And explain why this tool has made such a substantial impact on your efficiency."
                        ]
                    },
                    "examiner_script": "Now, I am going to give you a topic and I would like you to speak on it for one to two minutes. Before you speak, you will have one minute to think about what you are going to say, and you can take notes if you wish. Here is your cue card."
                },
                {
                    "part_number": 3,
                    "title": "Part 3: Two-Way In-Depth Analytical Discussion",
                    "instruction": "The examiner will ask broader, abstract questions related to the topic of Part 2. Develop your answers with justifications, hypotheses, and examples.",
                    "questions": [
                        {
                            "id": "SPK-P3-Q1",
                            "examiner_script": "Do you believe that increasing reliance on digital productivity algorithms is reducing human capacity for deep critical thinking?"
                        },
                        {
                            "id": "SPK-P3-Q2",
                            "examiner_script": "How can educational institutions ensure that students from lower socioeconomic backgrounds have equal access to advanced digital tools?"
                        },
                        {
                            "id": "SPK-P3-Q3",
                            "examiner_script": "Some sociologists argue that workplace automation will eventually shorten the standard working week for all employees. What is your view on this?"
                        },
                        {
                            "id": "SPK-P3-Q4",
                            "examiner_script": "What ethical responsibilities should technology developers bear when software systems influence public decisions or hiring policies?"
                        }
                    ]
                }
            ]
        }
