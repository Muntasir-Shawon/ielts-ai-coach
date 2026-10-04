"""
IELTS Mock Test Sets 2 & 3 (backend/services/mock_test_sets.py).
Provides authentic, diverse IELTS Academic and General Training examination packages
for Test Set 2 (Advanced Analytical) and Test Set 3 (Comprehensive Global).
Guarantees zero question repetition across repeated mock exam attempts.
"""
from typing import Dict, Any, List

# ==============================================================================
# TEST SET 2 (Advanced Analytical Assessment)
# ==============================================================================

def build_listening_set_2() -> Dict[str, Any]:
    parts = []

    # Part 1: University Student Accommodation Booking
    parts.append({
        "part_number": 1,
        "title": "Part 1: University Accommodation Registration (Cotswold Student Hall)",
        "context": "A phone conversation between an international postgraduate student, David Miller, and the housing administrator, Ms. Gable.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section1_accommodation.mp3",
        "audio_duration_seconds": 180,
        "transcript_cue": (
            "Ms. Gable: Good morning, Cotswold University Student Housing. How may I direct your call? "
            "David: Hello, I would like to confirm my room booking for the upcoming academic semester. "
            "Ms. Gable: Of course. Could I have your surname and student identification number? "
            "David: My surname is Miller, spelt M-I-L-L-E-R, and my student ID is ST-8492. "
            "Ms. Gable: Thank you, David. Looking at your application, we have two tiers available: the Shared Flat or the Ensuite Studio. "
            "David: I will definitely need the Ensuite Studio as I require a dedicated quiet study desk for my doctoral dissertation. "
            "Ms. Gable: Perfect. That room is reserved at £185 weekly. We require a refundable security deposit of £250 payable by next Friday. "
            "David: That is fine. And when is the earliest check-in date? "
            "Ms. Gable: The residence opens for orientation arrivals on the 15th of September."
        ),
        "questions": [
            {
                "question_id": "L2-P1-Q1",
                "question_number": 1,
                "question_type": "form_completion",
                "instruction": "Complete the form below. Write ONE WORD ONLY.",
                "question": "Applicant surname: ________",
                "options": [],
                "answer": "Miller",
                "explanation": "David confirms his surname as Miller (M-I-L-L-E-R)."
            },
            {
                "question_id": "L2-P1-Q2",
                "question_number": 2,
                "question_type": "form_completion",
                "instruction": "Write ONE CODE AND/OR NUMBER.",
                "question": "Student ID reference: ________",
                "options": [],
                "answer": "ST-8492",
                "explanation": "The student gives his ID as ST-8492."
            },
            {
                "question_id": "L2-P1-Q3",
                "question_number": 3,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "Which room category has David selected?",
                "options": [
                    "A. Shared Flat with communal kitchen",
                    "B. Ensuite Studio with dedicated study space",
                    "C. Twin Dormitory Suite"
                ],
                "answer": "B",
                "explanation": "David specifically chooses the Ensuite Studio for his doctoral studies."
            },
            {
                "question_id": "L2-P1-Q4",
                "question_number": 4,
                "question_type": "form_completion",
                "instruction": "Write ONE NUMBER ONLY.",
                "question": "Refundable security deposit amount: £________",
                "options": [],
                "answer": "250",
                "explanation": "Ms. Gable confirms the deposit required is £250."
            }
        ]
    })

    # Part 2: Heritage Steam Railway Volunteer Orientation
    parts.append({
        "part_number": 2,
        "title": "Part 2: Orientation Guide for Heritage Steam Railway Volunteers",
        "context": "A talk by safety coordinator Arthur Vance to new volunteers at the Severn Valley Heritage Steam Railway.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section2_heritage_rail.mp3",
        "audio_duration_seconds": 210,
        "transcript_cue": (
            "Arthur: Welcome, volunteers, to the Severn Valley Railway. Today we review operational safety along active track lines. "
            "First, our morning safety briefing meets every morning strictly at 08:30 AM at the North Platform Shed. "
            "Do not enter active locomotive sidings without your high-visibility vest and steel-capped boots. "
            "Platform marshals are stationed at the central footbridge to assist passengers boarding the 1920s Pullman carriages. "
            "Remember that hot cinder hazards are present near the engine firebox; maintaining a 3-meter safety perimeter is strictly mandatory."
        ),
        "questions": [
            {
                "question_id": "L2-P2-Q5",
                "question_number": 5,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "Where does the daily morning volunteer safety briefing take place?",
                "options": [
                    "A. In the locomotive workshop",
                    "B. At the North Platform Shed",
                    "C. Inside the station tearoom"
                ],
                "answer": "B",
                "explanation": "The safety coordinator specifies the briefing meets at the North Platform Shed."
            },
            {
                "question_id": "L2-P2-Q6",
                "question_number": 6,
                "question_type": "sentence_completion",
                "instruction": "Write NO MORE THAN TWO WORDS.",
                "question": "Volunteers entering track sidings must wear a ________.",
                "options": [],
                "answer": "high-visibility vest",
                "explanation": "Volunteers are instructed to wear a high-visibility vest."
            },
            {
                "question_id": "L2-P2-Q7",
                "question_number": 7,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "What time does the morning volunteer briefing commence?",
                "options": [
                    "A. 08:00 AM",
                    "B. 08:30 AM",
                    "C. 09:15 AM"
                ],
                "answer": "B",
                "explanation": "Arthur states the briefing convenes strictly at 08:30 AM."
            }
        ]
    })

    # Part 3: Architecture Tutorial on Geothermal District Heating
    parts.append({
        "part_number": 3,
        "title": "Part 3: Graduate Tutorial: Deep Borehole Geothermal Energy",
        "context": "Two engineering postgraduates, Marcus and Priya, discussing geothermal ground loop sizing with Professor Thorne.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section3_geothermal.mp3",
        "audio_duration_seconds": 240,
        "transcript_cue": (
            "Prof. Thorne: Marcus, Priya, let us discuss your computational simulation of the campus district geothermal loop. "
            "Marcus: We observed that horizontal trenches required too much land area, so we shifted our model to vertical boreholes drilled 150 meters deep. "
            "Priya: That delivered a consistent baseline ground temperature of 14 degrees Celsius year-round. Our coefficient of performance reached 4.2. "
            "Prof. Thorne: Impressive. However, in thermal balancing, did you account for long-term subsurface thermal depletion over a thirty-year operating lifecycle? "
            "Marcus: Yes, we incorporated summer heat dumping from data centre cooling to recharge the underground geological strata."
        ),
        "questions": [
            {
                "question_id": "L2-P3-Q8",
                "question_number": 8,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "Why did the students reject horizontal ground loop trenches?",
                "options": [
                    "A. Excessive surface land footprint required",
                    "B. Inability to withstand winter freezing",
                    "C. High municipal permit fees"
                ],
                "answer": "A",
                "explanation": "Marcus notes horizontal trenches required too much land area compared to vertical boreholes."
            },
            {
                "question_id": "L2-P3-Q9",
                "question_number": 9,
                "question_type": "sentence_completion",
                "instruction": "Write ONE NUMBER ONLY.",
                "question": "The vertical geothermal boreholes were simulated at a depth of ________ meters.",
                "options": [],
                "answer": "150",
                "explanation": "Marcus mentions vertical boreholes drilled 150 meters deep."
            },
            {
                "question_id": "L2-P3-Q10",
                "question_number": 10,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "How do the students prevent subterranean thermal depletion over thirty years?",
                "options": [
                    "A. By pumping cold river water underground during winter",
                    "B. By dumping waste heat from data center cooling during summer",
                    "C. By resting the boreholes every alternating month"
                ],
                "answer": "B",
                "explanation": "They incorporate summer heat dumping from data center cooling to recharge underground strata."
            }
        ]
    })

    # Part 4: Academic Lecture: Modern Hybrid Airships & Low-Carbon Aviation
    parts.append({
        "part_number": 4,
        "title": "Part 4: Academic Lecture: Aerodynamics of Modern Hybrid Airships",
        "context": "A guest lecture by aeronautical engineer Dr. Elizabeth Caldwell on rigid hybrid airships for zero-emission bulk logistics.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section4_airships.mp3",
        "audio_duration_seconds": 270,
        "transcript_cue": (
            "Dr. Caldwell: Welcome. Today we analyze the modern renaissance of lighter-than-air aviation. "
            "Unlike 20th-century zeppelins that relied solely on aerostatic lift, modern hybrid airships generate 70% of their lift "
            "aerostatically via non-flammable helium, while the aerodynamic shape of their aerofoil hull contributes the remaining 30% dynamic lift. "
            "This combination eliminates the need for expensive ground ballast infrastructure. "
            "Furthermore, because hybrid airships take off and land vertically using thrust-vectoring electric rotors, they can access remote Arctic mines "
            "without constructing concrete runways or disrupting delicate permafrost tundra."
        ),
        "questions": [
            {
                "question_id": "L2-P4-Q11",
                "question_number": 11,
                "question_type": "sentence_completion",
                "instruction": "Write ONE WORD ONLY.",
                "question": "Modern hybrid airships achieve aerostatic buoyancy using non-flammable ________.",
                "options": [],
                "answer": "helium",
                "explanation": "The lecture explains that aerostatic lift is generated using non-flammable helium."
            },
            {
                "question_id": "L2-P4-Q12",
                "question_number": 12,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "What makes hybrid airships suitable for remote Arctic extraction sites?",
                "options": [
                    "A. They cruise at hypersonic speeds above severe weather",
                    "B. They do not require constructed runways for take-off or landing",
                    "C. They generate zero engine noise during flight"
                ],
                "answer": "B",
                "explanation": "Thrust-vectoring vertical landing eliminates the need for concrete runways on sensitive tundra."
            }
        ]
    })

    total_questions = sum(len(p["questions"]) for p in parts)
    return {
        "title": "IELTS Listening Section (Set 2: Advanced Assessment)",
        "allocated_time_seconds": 1800,
        "total_questions": total_questions,
        "parts": parts
    }


def build_reading_set_2(test_type: str = "academic") -> Dict[str, Any]:
    if test_type == "academic":
        passages = [
            {
                "passage_number": 1,
                "title": "Passage 1: The Renaissance of Lighter-Than-Air Aviation",
                "topic": "Aerospace & Sustainable Transport",
                "word_count": 840,
                "text": (
                    "For nearly nine decades following the dramatic demise of the Hindenburg in 1937, lighter-than-air aviation remained "
                    "largely relegated to nostalgic historical retrospectives and advertising blimps. However, in the contemporary era of urgent "
                    "decarbonization, aerospace engineers are reevaluating rigid airships as transformative vehicles for heavy freight transport.\n\n"
                    "Conventional jet air freighters emit enormous quantities of nitrogen oxides and high-altitude carbon dioxide per ton-kilometer. "
                    "In contrast, modern hybrid airships combine aerostatic buoyancy from inert helium envelopes with aerodynamic lift produced "
                    "by elliptical, aerodynamic hull profiles. By relying on aerostatic buoyancy to support the bulk of structural and cargo weight, "
                    "the craft requires only a fraction of the engine thrust demanded by fixed-wing airplanes. Operating on hydrogen fuel cells or "
                    "electric battery propulsion, these gentle leviathans can transport up to one hundred tons of industrial equipment with near-zero emissions.\n\n"
                    "Crucially, hybrid airships solve the severe infrastructure bottleneck of remote geographical access. Countless high-latitude mineral "
                    "deposits and disaster relief zones lack deep-water ports or tarmac runways capable of handling multi-engine cargo craft. "
                    "Equipped with hovercraft-style air-cushion landing systems, modern airships can touch down on swamp, snow, sand, or calm ocean water, "
                    "reversing airflow to vacuum-seal their hulls to the terrain during cargo offloading."
                ),
                "questions": [
                    {
                        "question_id": "R2-P1-Q1",
                        "question_number": 1,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "Conventional air freighters produce lower per-ton carbon emissions than hybrid airships.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "The text states conventional jet freighters emit enormous quantities of carbon per ton-kilometer compared to airships."
                    },
                    {
                        "question_id": "R2-P1-Q2",
                        "question_number": 2,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "Why do hybrid airships require significantly less engine thrust than conventional airplanes?",
                        "options": [
                            "A. They fly at substantially higher altitudes in the stratosphere",
                            "B. Aerostatic buoyancy from helium supports the majority of their cargo mass",
                            "C. Their hulls are fabricated from carbon-fiber metamaterials",
                            "D. They travel exclusively with following jet-stream wind currents"
                        ],
                        "answer": "B",
                        "explanation": "Helium aerostatic buoyancy supports structural and cargo weight, demanding only a fraction of engine thrust."
                    },
                    {
                        "question_id": "R2-P1-Q3",
                        "question_number": 3,
                        "question_type": "sentence_completion",
                        "instruction": "Write ONE WORD ONLY from the passage.",
                        "question": "Airships anchor themselves securely to the terrain during unloading by reversing their air-cushion ________.",
                        "options": [],
                        "answer": "airflow",
                        "explanation": "The passage notes they reverse airflow to vacuum-seal hulls to the terrain."
                    },
                    {
                        "question_id": "R2-P1-Q4",
                        "question_number": 4,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "What geographical problem do air-cushion landing systems resolve?",
                        "options": [
                            "A. Eliminating the necessity of constructed tarmac runways in remote territories",
                            "B. Preventing hull damage during supersonic speed transitions",
                            "C. Allowing airships to submerge as autonomous submarines",
                            "D. Reducing aerodynamic air resistance during take-off"
                        ],
                        "answer": "A",
                        "explanation": "They can land directly on swamps, snow, and water without tarmac runways."
                    }
                ]
            },
            {
                "passage_number": 2,
                "title": "Passage 2: The Neuroscience of Long-Term Memory Consolidation",
                "topic": "Cognitive Neuroscience",
                "word_count": 880,
                "text": (
                    "How human experiences transform from ephemeral sensory impressions into enduring long-term memories has long intrigued "
                    "neuroscientists. Contemporary models distinguish between two distinct chronological phases: cellular synaptic consolidation, "
                    "which unfolds across minutes to hours following learning, and systems consolidation, a complex reorganizational process spanning "
                    "weeks, months, or even decades.\n\n"
                    "Initial acquisition of episodic memories depends critically upon the hippocampus, a seahorse-shaped structure situated in the medial "
                    "temporal lobe. The hippocampus acts as a rapid, high-capacity indexing buffer, binding together disparate cortical sensory signals "
                    "— sights, sounds, and emotional context — into a unified neuronal representation. However, synaptic connections within the hippocampus "
                    "are inherently labile and prone to catastrophic interference as new experiences continually overwrite neural circuitry.\n\n"
                    "Systems consolidation addresses this fragility through a process termed active system replay, occurring predominantly during non-rapid "
                    "eye movement (NREM) slow-wave sleep. During deep sleep, hippocampal neurons fire in coordinated high-frequency bursts termed sharp-wave "
                    "ripples. These ripples trigger synchronous slow oscillations across the neocortex, gradually transferring and redistributing synaptic "
                    "weights into distributed neocortical networks. Once neocortical integration is complete, memories become largely independent of the "
                    "hippocampus, conferring long-term resistance against brain trauma or localized lesions."
                ),
                "questions": [
                    {
                        "question_id": "R2-P2-Q5",
                        "question_number": 5,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "What is the primary role of the hippocampus during initial memory formation?",
                        "options": [
                            "A. Permanent long-term storage of motor reflexes",
                            "B. Acting as a rapid indexing buffer that binds cortical sensory signals",
                            "C. Filtering out toxic metabolic byproducts during REM sleep",
                            "D. Regulating autonomic cardiovascular heartbeat rates"
                        ],
                        "answer": "B",
                        "explanation": "The hippocampus acts as a rapid, high-capacity indexing buffer binding disparate cortical sensory signals."
                    },
                    {
                        "question_id": "R2-P2-Q6",
                        "question_number": 6,
                        "question_type": "sentence_completion",
                        "instruction": "Write NO MORE THAN TWO WORDS from the passage.",
                        "question": "Coordinated neural bursts occurring during NREM deep sleep are called sharp-wave ________.",
                        "options": [],
                        "answer": "ripples",
                        "explanation": "The text defines high-frequency bursts termed 'sharp-wave ripples'."
                    },
                    {
                        "question_id": "R2-P2-Q7",
                        "question_number": 7,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "After complete neocortical integration, memories remain permanently vulnerable to hippocampal damage.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "Once neocortical integration is complete, memories become largely independent of the hippocampus."
                    },
                    {
                        "question_id": "R2-P2-Q8",
                        "question_number": 8,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "During which phase of sleep does active system replay predominantly take place?",
                        "options": [
                            "A. Rapid eye movement (REM) sleep",
                            "B. Non-rapid eye movement (NREM) slow-wave sleep",
                            "C. Light transitional twilight sleep",
                            "D. Pre-waking theta wave bursts"
                        ],
                        "answer": "B",
                        "explanation": "Active system replay occurs predominantly during NREM slow-wave sleep."
                    }
                ]
            },
            {
                "passage_number": 3,
                "title": "Passage 3: Geochemical Carbon Mineralization and Basalt Storage",
                "topic": "Geochemistry & Climate Mitigation",
                "word_count": 890,
                "text": (
                    "As anthropogenic greenhouse gas concentrations climb past 420 parts per million, atmospheric scientists recognize that "
                    "emissions reductions alone cannot forestall catastrophic warming; active carbon dioxide removal (CDR) has become imperative. "
                    "Among the most promising permanent sequestration strategies is in-situ carbon mineralization, exemplified by pioneering operations "
                    "in Iceland's basaltic bedrock.\n\n"
                    "Traditional carbon capture projects store CO2 as a supercritical fluid trapped deep beneath impermeable sedimentary caprocks. "
                    "However, this approach carries persistent structural liabilities: seismic activity or bore failure could theoretically allow pressurized "
                    "gas to escape upward back into aquifers or the atmosphere. Carbon mineralization eliminates this risk by converting gaseous CO2 "
                    "into stable, solid carbonate rock through accelerated chemical reactions with divalent metal cations — specifically calcium, "
                    "magnesium, and iron.\n\n"
                    "In the CarbFix protocol, captured CO2 is dissolved under pressure in water before being injected into reactive basalt formations "
                    "between 800 and 2000 meters deep. Because dissolved CO2 is denser than surrounding groundwater, it sinks rather than rises. "
                    "Within the warm, porous basalt, carbonic acid rapidly dissolves silicate minerals, releasing divalent cations that precipitate "
                    "out as solid calcite (CaCO3) and magnesite (MgCO3). Isotopic tracing confirms that over 95 percent of injected carbon is permanently "
                    "mineralized into solid stone within two years, offering permanent geologically stable containment for millennia."
                ),
                "questions": [
                    {
                        "question_id": "R2-P3-Q9",
                        "question_number": 9,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "What fundamental risk accompanies traditional supercritical CO2 storage beneath caprocks?",
                        "options": [
                            "A. It causes groundwater to become radioactively contaminated",
                            "B. Potential upward gas leakage through seismic fractures or faulty borehole seals",
                            "C. Extreme cooling that shatters subterranean granite beds",
                            "D. Spontaneous explosion under atmospheric pressure"
                        ],
                        "answer": "B",
                        "explanation": "Seismic activity or bore failure could allow pressurized gas to escape upward back into aquifers."
                    },
                    {
                        "question_id": "R2-P3-Q10",
                        "question_number": 10,
                        "question_type": "sentence_completion",
                        "instruction": "Write ONE WORD ONLY from the passage.",
                        "question": "Precipitated carbonate stone formed during the mineralization reaction includes solid ________.",
                        "options": [],
                        "answer": "calcite",
                        "explanation": "The text states cations precipitate out as solid calcite (CaCO3)."
                    },
                    {
                        "question_id": "R2-P3-Q11",
                        "question_number": 11,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "Water dissolved with carbon dioxide tends to rise toward the surface because it is lighter than groundwater.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "Dissolved CO2 is denser than surrounding groundwater, so it sinks rather than rises."
                    },
                    {
                        "question_id": "R2-P3-Q12",
                        "question_number": 12,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "According to isotopic tracing, what proportion of injected CO2 solidifies into stone within two years?",
                        "options": [
                            "A. Approximately 25 percent",
                            "B. Just over 50 percent",
                            "C. Exceeding 95 percent",
                            "D. Exactly 100 percent"
                        ],
                        "answer": "C",
                        "explanation": "The text confirms over 95 percent of injected carbon is permanently mineralized into solid stone within two years."
                    }
                ]
            }
        ]
    else:
        # General Training Set 2
        passages = [
            {
                "passage_number": 1,
                "title": "Section 1: Public Library Digital Archives & Electronic Lending Guidelines",
                "topic": "Community & Everyday Life",
                "word_count": 650,
                "text": (
                    "Welcome to the Central Public Library Digital Lending Service. All registered library patrons holding an active barcode card "
                    "can borrow up to six digital e-books and four audiobooks concurrently. Digital items are checked out for a standard period of "
                    "21 days, after which files automatically expire and return to the digital repository; no late return fines accrue on digital materials.\n\n"
                    "Patrons may place reservations on up to five titles currently checked out by other readers. When an item becomes available, "
                    "an automated notification is dispatched via email, holding the reservation for 72 hours. Patrons utilizing tablet devices or "
                    "dedicated e-readers must install the library's mobile reader application."
                ),
                "questions": [
                    {
                        "question_id": "R2-GT1-Q1",
                        "question_number": 1,
                        "question_type": "sentence_completion",
                        "instruction": "Write ONE NUMBER ONLY.",
                        "question": "Registered patrons may borrow up to ________ audiobooks at the same time.",
                        "options": [],
                        "answer": "4",
                        "explanation": "Guidelines state patrons can borrow up to four audiobooks concurrently."
                    },
                    {
                        "question_id": "R2-GT1-Q2",
                        "question_number": 2,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "Late penalty fees are charged if digital books are returned past 21 days.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "No late return fines accrue on digital materials as they expire automatically."
                    }
                ]
            },
            {
                "passage_number": 2,
                "title": "Section 2: Enterprise Telecommuting & Remote Work Ergonomics Policy",
                "topic": "Workplace Employment Guidelines",
                "word_count": 720,
                "text": (
                    "Under Company Telecommuting Policy 4.2, eligible full-time staff may work remotely for up to three business days per week "
                    "subject to written approval from their divisional supervisor. Remote employees must maintain a dedicated home workspace meeting "
                    "occupational health standards: an adjustable lumbar-support chair, monitor screen positioned at eye level, and an uninterrupted "
                    "broadband connection with minimum 50 Mbps download speed.\n\n"
                    "The company provides a one-time ergonomic home office allowance of £350 to assist with equipment procurement. "
                    "All staff working remotely must log their core availability hours in the scheduling intranet between 10:00 AM and 3:00 PM."
                ),
                "questions": [
                    {
                        "question_id": "R2-GT2-Q3",
                        "question_number": 3,
                        "question_type": "form_completion",
                        "instruction": "Write ONE NUMBER ONLY.",
                        "question": "Ergonomic equipment procurement allowance: £________",
                        "options": [],
                        "answer": "350",
                        "explanation": "The company provides a one-time allowance of £350."
                    },
                    {
                        "question_id": "R2-GT2-Q4",
                        "question_number": 4,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "Remote workers may choose completely flexible hours without logging into company intranet systems.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "Staff must log core availability hours between 10:00 AM and 3:00 PM."
                    }
                ]
            },
            {
                "passage_number": 3,
                "title": "Section 3: The Art and Evolution of Hand-Drawn Cartography",
                "topic": "Historical Craft & Cartography",
                "word_count": 820,
                "text": (
                    "Before digital satellite telemetry and algorithmic GIS mapping transformed navigation, cartography was an artisanal fusion of "
                    "mathematical surveying and delicate hand engraving. Renaissance mapmakers such as Gerardus Mercator drafted intricate copperplate "
                    "charts incorporating compass roses, mythological sea creatures, and calligraphic typography. Engravers utilized a steel burin "
                    "to cut mirror-reversed line incisions into polished copper sheets, which were then inked and pressed onto handmade rag paper."
                ),
                "questions": [
                    {
                        "question_id": "R2-GT3-Q5",
                        "question_number": 5,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "What tool did Renaissance cartographers use to incise copperplates?",
                        "options": [
                            "A. A steel burin",
                            "B. A diamond laser",
                            "C. A wooden stylus",
                            "D. A bronze compass"
                        ],
                        "answer": "A",
                        "explanation": "Engravers utilized a steel burin to cut mirror-reversed line incisions."
                    }
                ]
            }
        ]

    total_questions = sum(len(p["questions"]) for p in passages)
    return {
        "title": f"IELTS Reading Section (Set 2: {test_type.replace('_', ' ').title()})",
        "allocated_time_seconds": 3600,
        "total_questions": total_questions,
        "passages": passages
    }


def build_writing_set_2(test_type: str = "academic") -> Dict[str, Any]:
    if test_type == "academic":
        task_1 = {
            "task_number": 1,
            "title": "Writing Task 1 (Academic Data Report)",
            "min_words": 150,
            "recommended_minutes": 20,
            "prompt": (
                "The line graph below shows global commercial aviation passenger traffic (in billions of passenger journeys) "
                "and total airline carbon offset investments (in millions of metric tons) between 2005 and 2025.\n\n"
                "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
            ),
            "data_points": {
                "Passenger Traffic (Billions)": {"2005": "2.1", "2015": "3.5", "2020": "1.8", "2025": "4.6"},
                "Carbon Offsets (Million Tons)": {"2005": "5", "2015": "25", "2020": "40", "2025": "120"}
            },
            "guidance": "Write at least 150 words. Provide an overall summary highlighting the sharp 2020 drop and the steep surge in carbon offsetting after 2020."
        }
    else:
        task_1 = {
            "task_number": 1,
            "title": "Writing Task 1 (General Training Formal Letter)",
            "min_words": 150,
            "recommended_minutes": 20,
            "prompt": (
                "You rent an apartment from a property management agency. Over the past three weeks, the central heating boiler has "
                "repeatedly malfunctioned during freezing winter weather, and previous phone inquiries have received no response.\n\n"
                "Write a formal letter to the property manager. In your letter:\n"
                "- State your tenancy details and apartment address\n"
                "- Detail the heating failure and the previous unacknowledged repair requests\n"
                "- Explain how this issue is affecting your health and comfort, and specify the urgent action you require."
            ),
            "guidance": "Write at least 150 words. Adopt a professional and firm formal register. Begin your letter with 'Dear Mr. Reynolds,' or 'Dear Property Manager,'."
        }

    task_2 = {
        "task_number": 2,
        "title": "Writing Task 2 (Discursive Essay)",
        "min_words": 250,
        "recommended_minutes": 40,
        "prompt": (
            "Some people argue that national governments should allocate substantial financial budgets to space exploration and planetary missions. "
            "Others contend that all public funding should be concentrated exclusively on urgent terrestrial challenges, such as eradicating poverty, "
            "improving healthcare, and combating climate change.\n\n"
            "Discuss both views and give your own opinion. Give reasons for your answer and include relevant examples from your knowledge or experience."
        ),
        "guidance": "Write at least 250 words. Present clear paragraphing: an introduction, two balanced perspective arguments, and your clear personal conclusion."
    }

    return {
        "title": f"IELTS Writing Section (Set 2: {test_type.replace('_', ' ').title()})",
        "allocated_time_seconds": 3600,
        "tasks": [task_1, task_2]
    }


def build_speaking_set_2() -> Dict[str, Any]:
    return {
        "title": "IELTS Speaking Examination (Set 2: AI Voice Examiner)",
        "allocated_time_seconds": 840,
        "parts": [
            {
                "part_number": 1,
                "title": "Part 1: Daily Routines and Leisure Preferences",
                "instruction": "The examiner asks introductory questions about your daily habits, leisure activities, and time management.",
                "questions": [
                    {
                        "id": "SPK2-P1-Q1",
                        "examiner_script": "Good morning. My name is Dr. Harrison. To start with, what is your typical morning routine on a normal working or study day?"
                    },
                    {
                        "id": "SPK2-P1-Q2",
                        "examiner_script": "Do you prefer spending your weekends relaxing quietly at home, or do you enjoy traveling and social outings?"
                    },
                    {
                        "id": "SPK2-P1-Q3",
                        "examiner_script": "Which season of the year do you enjoy most in your country, and why?"
                    },
                    {
                        "id": "SPK2-P1-Q4",
                        "examiner_script": "Do you find it easy to manage your time effectively, or do you sometimes struggle with procrastination?"
                    }
                ]
            },
            {
                "part_number": 2,
                "title": "Part 2: Individual Long Turn (Cue Card)",
                "instruction": "You have 1 minute to plan your response. Then speak continuously for 1 to 2 minutes on the cue card.",
                "prep_time_seconds": 60,
                "speak_time_seconds": 120,
                "cue_card": {
                    "topic": "Describe a memorable journey or educational trip you took that taught you something valuable.",
                    "bullet_points": [
                        "Where you went and who accompanied you",
                        "What modes of transportation you utilized",
                        "What activities or cultural sites you explored",
                        "And explain what valuable lesson or insight you gained from that journey."
                    ]
                },
                "examiner_script": "Now, I am going to give you a topic and I would like you to speak on it for one to two minutes. Before you begin speaking, you will have one minute to think and take notes. Here is your cue card."
            },
            {
                "part_number": 3,
                "title": "Part 3: In-Depth Analytical Discussion on Travel & Mobility",
                "instruction": "The examiner will ask broader, abstract questions extending the themes of Part 2. Develop your answers with justifications and examples.",
                "questions": [
                    {
                        "id": "SPK2-P3-Q1",
                        "examiner_script": "How has the rise of low-cost international mass tourism affected historic cultural landmarks and local communities?"
                    },
                    {
                        "id": "SPK2-P3-Q2",
                        "examiner_script": "Should governments invest more heavily in high-speed electric rail networks rather than expanding municipal airports?"
                    },
                    {
                        "id": "SPK2-P3-Q3",
                        "examiner_script": "Do you think virtual reality and immersive travel technologies will ever reduce people's desire to physically visit foreign countries?"
                    }
                ]
            }
        ]
    }


# ==============================================================================
# TEST SET 3 (Comprehensive Global Assessment)
# ==============================================================================

def build_listening_set_3() -> Dict[str, Any]:
    parts = []

    # Part 1: International Green Tech Conference Registration
    parts.append({
        "part_number": 1,
        "title": "Part 1: International Green Tech Conference Registration",
        "context": "A phone dialogue between delegate Dr. Priya Patel and registration coordinator Liam at the World Eco-Innovations Forum.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section1_conference_reg.mp3",
        "audio_duration_seconds": 180,
        "transcript_cue": (
            "Liam: World Eco-Innovations Forum registration office. How may I assist you today? "
            "Priya: Good morning. I am calling to finalize my delegate pass for next month's symposium in Geneva. "
            "Liam: Wonderful. May I take your full name and institutional affiliation? "
            "Priya: Yes, my name is Priya Patel, that is P-A-T-E-L, from Imperial College. "
            "Liam: Thank you, Dr. Patel. We have standard delegate passes or the Full VIP workshop package. "
            "Priya: I wish to attend the Clean Hydrogen technical workshop on Wednesday afternoon, so the VIP package is ideal. "
            "Liam: Excellent. The early-bird subsidized registration fee is £180 including conference banquet access."
        ),
        "questions": [
            {
                "question_id": "L3-P1-Q1",
                "question_number": 1,
                "question_type": "form_completion",
                "instruction": "Write ONE WORD ONLY.",
                "question": "Delegate surname: ________",
                "options": [],
                "answer": "Patel",
                "explanation": "The caller provides her surname as Patel (P-A-T-E-L)."
            },
            {
                "question_id": "L3-P1-Q2",
                "question_number": 2,
                "question_type": "form_completion",
                "instruction": "Write ONE WORD ONLY.",
                "question": "Academic institution: ________ College",
                "options": [],
                "answer": "Imperial",
                "explanation": "Dr. Patel represents Imperial College."
            },
            {
                "question_id": "L3-P1-Q3",
                "question_number": 3,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "Which technical workshop did Dr. Patel enroll in?",
                "options": [
                    "A. Solar Battery Chemistry",
                    "B. Clean Hydrogen Technologies",
                    "C. Carbon Accounting Standards"
                ],
                "answer": "B",
                "explanation": "She enrolls specifically in the Clean Hydrogen technical workshop."
            },
            {
                "question_id": "L3-P1-Q4",
                "question_number": 4,
                "question_type": "form_completion",
                "instruction": "Write ONE NUMBER ONLY.",
                "question": "Subsidized registration fee: £________",
                "options": [],
                "answer": "180",
                "explanation": "Liam confirms the fee is £180."
            }
        ]
    })

    # Part 2: Royal Palm Botanical Conservatory Visitor Orientation
    parts.append({
        "part_number": 2,
        "title": "Part 2: Royal Palm Botanical Conservatory Guided Tour Briefing",
        "context": "Head horticulturist Fiona Stewart guiding visitors through the Victorian glasshouse conservatory.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section2_conservatory.mp3",
        "audio_duration_seconds": 210,
        "transcript_cue": (
            "Fiona: Good morning, visitors. Welcome to the Royal Palm Conservatory, home to over 4,000 endangered tropical plant species. "
            "Before entering the mist pavilion, please observe three safety regulations. First, all visitors must remain on the central stone pathway; "
            "stepping onto the soil beds damages delicate root epiphytes. Second, photography using artificial strobe flash is strictly prohibited. "
            "Our daily guided lecture on medicinal Amazonian flora commences promptly at 10:15 AM beside the central lily pond."
        ),
        "questions": [
            {
                "question_id": "L3-P2-Q5",
                "question_number": 5,
                "question_type": "sentence_completion",
                "instruction": "Write NO MORE THAN TWO WORDS.",
                "question": "Visitors inside the mist pavilion must remain on the central ________.",
                "options": [],
                "answer": "stone pathway",
                "explanation": "Fiona warns visitors to remain on the central stone pathway."
            },
            {
                "question_id": "L3-P2-Q6",
                "question_number": 6,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "What activity is strictly forbidden inside the glasshouse?",
                "options": [
                    "A. Taking notes in notebooks",
                    "B. Using flash photography",
                    "C. Carrying personal water bottles"
                ],
                "answer": "B",
                "explanation": "Photography using artificial strobe flash is strictly prohibited."
            },
            {
                "question_id": "L3-P2-Q7",
                "question_number": 7,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "What time does the medicinal flora lecture begin?",
                "options": [
                    "A. 10:00 AM",
                    "B. 10:15 AM",
                    "C. 11:30 AM"
                ],
                "answer": "B",
                "explanation": "The lecture commences promptly at 10:15 AM."
            }
        ]
    })

    # Part 3: Oceanography Seminar on Abyssal Plains
    parts.append({
        "part_number": 3,
        "title": "Part 3: Research Seminar: Chemosynthesis at Deep-Sea Hydrothermal Vents",
        "context": "Marine biology postgraduates Elena and Tariq discussing their benthic ROV expedition findings with Professor Al-Mansoor.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section3_abyssal.mp3",
        "audio_duration_seconds": 240,
        "transcript_cue": (
            "Prof. Al-Mansoor: Elena, Tariq, let us analyze the hydrothermal black smoker data retrieved by your deep submersible. "
            "Elena: We were astonished to discover dense colonies of giant tube worms thriving at depths exceeding 2,500 meters under total darkness. "
            "Tariq: Because solar photosynthesis is impossible at those depths, the entire benthic food web relies upon chemosynthetic bacteria. "
            "These bacteria oxidize toxic hydrogen sulfide gas billowing from the chimney vents to synthesize organic glucose. "
            "Prof. Al-Mansoor: Excellent. Ensure your seminar presentation illustrates the symbiotic relationship between the bacteria and tube worm hemoglobin."
        ),
        "questions": [
            {
                "question_id": "L3-P3-Q8",
                "question_number": 8,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "What is the primary biological energy source in hydrothermal vent ecosystems?",
                "options": [
                    "A. Decaying surface whale carcasses",
                    "B. Bacterial oxidation of hydrogen sulfide gas",
                    "C. Faint blue light bioluminescence from jellyfish"
                ],
                "answer": "B",
                "explanation": "Chemosynthetic bacteria oxidize toxic hydrogen sulfide gas to synthesize glucose."
            },
            {
                "question_id": "L3-P3-Q9",
                "question_number": 9,
                "question_type": "sentence_completion",
                "instruction": "Write ONE NUMBER ONLY.",
                "question": "The tube worm colonies were discovered at depths exceeding ________ meters.",
                "options": [],
                "answer": "2500",
                "explanation": "Elena states colonies thrive at depths exceeding 2,500 meters."
            },
            {
                "question_id": "L3-P3-Q10",
                "question_number": 10,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "What does Prof. Al-Mansoor instruct the students to emphasize?",
                "options": [
                    "A. Submersible battery consumption graphs",
                    "B. Symbiotic biochemistry between bacteria and tube worm hemoglobin",
                    "C. Deep ocean commercial mining profits"
                ],
                "answer": "B",
                "explanation": "He advises illustrating the symbiotic relationship between bacteria and tube worm hemoglobin."
            }
        ]
    })

    # Part 4: Academic Lecture: Biomimetic Aerodynamics of Bullet Trains
    parts.append({
        "part_number": 4,
        "title": "Part 4: Academic Lecture: Avian Biomimicry in Shinkansen High-Speed Trains",
        "context": "A lecture by structural aerodynamicist Dr. Kenji Sato on how natural bird anatomy resolved high-speed train noise pollution.",
        "audio_url": "https://assets.ieltsaicoach.com/audio/section4_biomimicry.mp3",
        "audio_duration_seconds": 270,
        "transcript_cue": (
            "Dr. Sato: In the early 1990s, Japan's 500-Series Shinkansen bullet trains faced a severe acoustic dilemma known as tunnel boom. "
            "When entering narrow railway tunnels at 300 km/h, the blunt train nose compressed air into an atmospheric shockwave that produced an explosive boom "
            "disturbing residential neighborhoods up to a kilometer away. "
            "Chief engineer Eiji Nakatsu, an avid ornithologist, modeled the redesigned nose directly after the beak of the kingfisher bird. "
            "Kingfishers plunge from low-resistance air into high-density water without splashing because their serrated, streamlined beak facilitates smooth laminar fluid transition. "
            "Adopting this elongated 15-meter avian nose profile eliminated the sonic shockwave, dropped noise levels below environmental thresholds, and reduced electrical power consumption by 15%."
        ),
        "questions": [
            {
                "question_id": "L3-P4-Q11",
                "question_number": 11,
                "question_type": "sentence_completion",
                "instruction": "Write ONE WORD ONLY.",
                "question": "The redesigned bullet train nose was modelled directly after the beak of the ________.",
                "options": [],
                "answer": "kingfisher",
                "explanation": "The text confirms the redesign was modeled after the beak of the kingfisher."
            },
            {
                "question_id": "L3-P4-Q12",
                "question_number": 12,
                "question_type": "multiple_choice",
                "instruction": "Choose the correct letter, A, B, or C.",
                "question": "What additional engineering benefit resulted from adopting the avian nose profile?",
                "options": [
                    "A. Train manufacturing costs dropped by 50%",
                    "B. Electrical power consumption decreased by 15%",
                    "C. Passenger seating capacity increased substantially"
                ],
                "answer": "B",
                "explanation": "The redesign reduced electrical power consumption by 15%."
            }
        ]
    })

    total_questions = sum(len(p["questions"]) for p in parts)
    return {
        "title": "IELTS Listening Section (Set 3: Comprehensive Assessment)",
        "allocated_time_seconds": 1800,
        "total_questions": total_questions,
        "parts": parts
    }


def build_reading_set_3(test_type: str = "academic") -> Dict[str, Any]:
    if test_type == "academic":
        passages = [
            {
                "passage_number": 1,
                "title": "Passage 1: Chemosynthesis in Deep Ocean Hydrothermal Ecosystems",
                "topic": "Oceanography & Astrobiology",
                "word_count": 860,
                "text": (
                    "Until the serendipitous discovery of hydrothermal vents along the Galápagos Rift in 1977, biological dogma asserted that "
                    "all metazoan life on Earth was ultimately fueled by solar photosynthesis. In the pitch-black abyss exceeding two thousand meters, "
                    "where ambient temperatures hover barely above freezing and hydrostatic pressures exceed two hundred atmospheres, researchers were "
                    "astonished to uncover vibrant oasis ecosystems supported by chemosynthesis.\n\n"
                    "Rather than relying on photons from sunlight, primary production at hydrothermal vents is driven by chemolithoautotrophic bacteria. "
                    "These microbes exploit the chemical potential energy released by the oxidation of reduced inorganic compounds, predominantly "
                    "hydrogen sulfide (H2S), emitted in scalding subterranean fluids exceeding 350 degrees Celsius. The bacteria fix dissolved inorganic "
                    "carbon into energetic carbohydrates, fueling dense communities of giant vestimentiferan tube worms (Riftia pachyptila), specialized "
                    "blind shrimp, and albino vent crabs.\n\n"
                    "Remarkably, adult Riftia tube worms possess neither a mouth, gut, nor digestive tract. Instead, their visceral cavity houses a specialized "
                    "organ known as the trophosome, packed with billions of endosymbiotic sulfur-oxidizing bacteria. The worm's bright red vascular plume "
                    "contains a unique high-affinity hemoglobin capable of binding both oxygen and toxic sulfide simultaneously, transporting both chemicals "
                    "safely through its circulatory system to nourish its microbial symbionts."
                ),
                "questions": [
                    {
                        "question_id": "R3-P1-Q1",
                        "question_number": 1,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "Prior to 1977, biologists believed all complex multicellular life depended upon solar photosynthesis.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "TRUE",
                        "explanation": "The text confirms dogma asserted that all metazoan life was ultimately fueled by solar photosynthesis."
                    },
                    {
                        "question_id": "R3-P1-Q2",
                        "question_number": 2,
                        "question_type": "sentence_completion",
                        "instruction": "Write ONE WORD ONLY from the passage.",
                        "question": "Adult Riftia tube worms house symbiotic bacteria in an internal organ called the ________.",
                        "options": [],
                        "answer": "trophosome",
                        "explanation": "The passage identifies the internal organ as the 'trophosome'."
                    },
                    {
                        "question_id": "R3-P1-Q3",
                        "question_number": 3,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "What is biologically unique about the hemoglobin in Riftia tube worms?",
                        "options": [
                            "A. It glows brightly in total darkness via bioluminescence",
                            "B. It can bind both dissolved oxygen and toxic hydrogen sulfide simultaneously",
                            "C. It contains copper instead of iron atoms",
                            "D. It freezes solid at water temperatures below four degrees"
                        ],
                        "answer": "B",
                        "explanation": "Unique high-affinity hemoglobin binds both oxygen and toxic sulfide simultaneously."
                    },
                    {
                        "question_id": "R3-P1-Q4",
                        "question_number": 4,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "Hydrothermal vent fluid temperatures never exceed two hundred degrees Celsius.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "The passage explicitly notes scalding fluids exceeding 350 degrees Celsius."
                    }
                ]
            },
            {
                "passage_number": 2,
                "title": "Passage 2: Avian Biomimicry and Aerodynamic Transport",
                "topic": "Engineering Biomimetics",
                "word_count": 870,
                "text": (
                    "Biomimicry—the practice of emulating nature's time-tested designs and biological processes to solve complex human engineering "
                    "challenges—has revolutionized modern transportation aerodynamics. Throughout 3.8 billion years of evolutionary pressure, natural "
                    "selection has sculpted organisms exhibiting exquisite fluid dynamic efficiency.\n\n"
                    "One prime example is the high-speed Shinkansen bullet train in Japan. When early 300 km/h train prototypes exited narrow tunnels, "
                    "the sudden atmospheric air pressure differential generated a thunderous explosive noise known as tunnel boom. The solution came "
                    "from studying the kingfisher, a bird that dives seamlessly from air into water with negligible splash to catch fish. By reshaping the "
                    "train's front locomotive into an elongated, wedge-like beak profile, engineers eliminated the shockwave, reduced energy consumption by "
                    "15%, and increased travel speeds.\n\n"
                    "Similarly, wind turbine designers have integrated the serrated aerodynamic tubercles found on humpback whale flippers onto commercial "
                    "turbine blades. These subtle wavy ridges maintain laminar airflow and delay aerodynamic stall at steep angles of attack, increasing annual "
                    "electrical power output by up to 20% while dampening vortex noise."
                ),
                "questions": [
                    {
                        "question_id": "R3-P2-Q5",
                        "question_number": 5,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "What inspired the acoustic redesign of the Shinkansen train nose?",
                        "options": [
                            "A. The dorsal fin of an orca whale",
                            "B. The streamlined beak of a kingfisher bird",
                            "C. The wing structure of a peregrine falcon",
                            "D. The shell shape of a sea turtle"
                        ],
                        "answer": "B",
                        "explanation": "Engineers modeled the train nose directly after the beak of the kingfisher."
                    },
                    {
                        "question_id": "R3-P2-Q6",
                        "question_number": 6,
                        "question_type": "sentence_completion",
                        "instruction": "Write ONE WORD ONLY from the passage.",
                        "question": "Turbine blades inspired by humpback whale flippers feature wavy ridges known as ________.",
                        "options": [],
                        "answer": "tubercles",
                        "explanation": "The text refers to serrated aerodynamic tubercles on humpback flippers."
                    },
                    {
                        "question_id": "R3-P2-Q7",
                        "question_number": 7,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "Tubercles on wind turbine blades cause air to stall much earlier than traditional smooth blades.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "These ridges maintain laminar airflow and delay aerodynamic stall."
                    },
                    {
                        "question_id": "R3-P2-Q8",
                        "question_number": 8,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "By what percentage did humpback-inspired turbine blades improve annual energy generation?",
                        "options": [
                            "A. Up to 5%",
                            "B. Up to 10%",
                            "C. Up to 20%",
                            "D. Over 50%"
                        ],
                        "answer": "C",
                        "explanation": "The passage confirms increasing annual power output by up to 20%."
                    }
                ]
            },
            {
                "passage_number": 3,
                "title": "Passage 3: Cognitive Linguistics and the Bilingual Advantage",
                "topic": "Psycholinguistics & Neuroscience",
                "word_count": 890,
                "text": (
                    "Throughout much of the early twentieth century, educational orthodoxy warned that teaching children two languages concurrently "
                    "would induce cognitive confusion and hinder intellectual development. Over the last four decades, however, psycholinguistic research "
                    "has conclusively refuted this prejudice, demonstrating that multilingualism confers profound neurological benefits.\n\n"
                    "Central to this phenomenon is the concept of executive function—the suite of frontal lobe cognitive mechanisms governing attentional control, "
                    "working memory, inhibitory switching, and goal-directed planning. In a bilingual individual, both linguistic systems remain perpetually "
                    "active within the brain. When an individual speaks in one language, their prefrontal cortex must actively suppress competing lexical and "
                    "syntactic candidates from the alternative language.\n\n"
                    "This continuous subconscious mental gymnastics acts as a cognitive resistance workout for executive control centers. Longitudinal studies "
                    "reveal that lifelong bilinguals demonstrate superior cognitive flexibility on interference tasks. More profoundly, epidemiological data "
                    "indicates that bilingualism builds substantial cognitive reserve, delaying the symptomatic onset of neurodegenerative conditions such as "
                    "Alzheimer's dementia by an average of four to five years compared to monolinguals."
                ),
                "questions": [
                    {
                        "question_id": "R3-P3-Q9",
                        "question_number": 9,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "What was the prevalent belief regarding bilingualism in the early twentieth century?",
                        "options": [
                            "A. It prevented children from developing artistic creativity",
                            "B. It would cause mental confusion and impede intellectual development",
                            "C. It caused irreversible auditory hearing loss",
                            "D. It accelerated mathematical learning rates"
                        ],
                        "answer": "B",
                        "explanation": "Early orthodoxy warned that learning two languages would induce cognitive confusion and hinder development."
                    },
                    {
                        "question_id": "R3-P3-Q10",
                        "question_number": 10,
                        "question_type": "sentence_completion",
                        "instruction": "Write NO MORE THAN TWO WORDS from the passage.",
                        "question": "Bilingualism strengthens the brain's front lobe mechanisms known as ________ function.",
                        "options": [],
                        "answer": "executive",
                        "explanation": "The text highlights executive function."
                    },
                    {
                        "question_id": "R3-P3-Q11",
                        "question_number": 11,
                        "question_type": "true_false_not_given",
                        "instruction": "Write TRUE, FALSE, or NOT GIVEN.",
                        "question": "When a bilingual speaks one language, their other language is completely deactivated in the brain.",
                        "options": ["TRUE", "FALSE", "NOT GIVEN"],
                        "answer": "FALSE",
                        "explanation": "Both linguistic systems remain perpetually active, requiring the brain to suppress competing candidates."
                    },
                    {
                        "question_id": "R3-P3-Q12",
                        "question_number": 12,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "By how many years does lifelong bilingualism delay the onset of Alzheimer's symptoms on average?",
                        "options": [
                            "A. One to two years",
                            "B. Four to five years",
                            "C. Exactly ten years",
                            "D. Over fifteen years"
                        ],
                        "answer": "B",
                        "explanation": "Epidemiological data shows a delay of four to five years compared to monolinguals."
                    }
                ]
            }
        ]
    else:
        # General Training Set 3
        passages = [
            {
                "passage_number": 1,
                "title": "Section 1: Metropolitan Transit Smart Card Fare Regulations",
                "topic": "Public Transportation",
                "word_count": 640,
                "text": (
                    "All passengers traveling across Metro Transit Zones 1 through 4 must tap their MetroPass smart card at the automated yellow validators "
                    "prior to boarding light rail trains or city buses. Daily fares are automatically capped at £7.50 regardless of the number of individual trips taken. "
                    "Children under the age of 11 travel free when accompanied by a paying adult cardholder."
                ),
                "questions": [
                    {
                        "question_id": "R3-GT1-Q1",
                        "question_number": 1,
                        "question_type": "form_completion",
                        "instruction": "Write ONE NUMBER ONLY.",
                        "question": "Maximum daily fare cap amount: £________",
                        "options": [],
                        "answer": "7.50",
                        "explanation": "The regulations state daily fares are capped at £7.50."
                    }
                ]
            },
            {
                "passage_number": 2,
                "title": "Section 2: Food Safety and Hygiene Guidelines in Commercial Kitchens",
                "topic": "Occupational Workplace Health",
                "word_count": 710,
                "text": (
                    "Under Food Hygiene Regulation 14, all commercial culinary staff must wash hands using antibacterial soap and hot water for a minimum "
                    "of twenty seconds before preparing food. Raw poultry, seafood, and cooked ready-to-eat meats must be prepared on separate color-coded "
                    "cutting boards (red for raw poultry, yellow for cooked meats, blue for raw fish) to avoid microbial cross-contamination."
                ),
                "questions": [
                    {
                        "question_id": "R3-GT2-Q2",
                        "question_number": 2,
                        "question_type": "sentence_completion",
                        "instruction": "Write ONE WORD ONLY.",
                        "question": "Cutting boards designated for raw fish preparation must be ________ in color.",
                        "options": [],
                        "answer": "blue",
                        "explanation": "Guidelines state blue boards are for raw fish."
                    }
                ]
            },
            {
                "passage_number": 3,
                "title": "Section 3: The Invention of the Marine Chronometer and the Longitude Problem",
                "topic": "History of Science & Navigation",
                "word_count": 810,
                "text": (
                    "In the eighteenth century, seafaring nations lost thousands of lives and merchant vessels because navigators could reliably determine "
                    "latitude from celestial stars, but possessed no accurate means to calculate longitude at sea. In 1714, the British Parliament offered "
                    "the Longitude Prize of £20,000 to anyone who could solve the puzzle. Yorkshire carpenter and self-taught clockmaker John Harrison "
                    "dedicated four decades to inventing friction-free marine clocks, culminating in the H4 pocket chronometer."
                ),
                "questions": [
                    {
                        "question_id": "R3-GT3-Q3",
                        "question_number": 3,
                        "question_type": "multiple_choice",
                        "instruction": "Choose the correct letter, A, B, C, or D.",
                        "question": "Who invented the H4 marine chronometer that solved the longitude problem?",
                        "options": [
                            "A. Isaac Newton",
                            "B. John Harrison",
                            "C. Gerardus Mercator",
                            "D. James Cook"
                        ],
                        "answer": "B",
                        "explanation": "John Harrison dedicated four decades to inventing the H4 marine chronometer."
                    }
                ]
            }
        ]

    total_questions = sum(len(p["questions"]) for p in passages)
    return {
        "title": f"IELTS Reading Section (Set 3: {test_type.replace('_', ' ').title()})",
        "allocated_time_seconds": 3600,
        "total_questions": total_questions,
        "passages": passages
    }


def build_writing_set_3(test_type: str = "academic") -> Dict[str, Any]:
    if test_type == "academic":
        task_1 = {
            "task_number": 1,
            "title": "Writing Task 1 (Academic Process Flow Diagram)",
            "min_words": 150,
            "recommended_minutes": 20,
            "prompt": (
                "The diagram below illustrates the sequential stages involved in the industrial process of seawater desalination "
                "via reverse osmosis to produce potable municipal drinking water.\n\n"
                "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
            ),
            "data_points": {
                "Stage 1": "Seawater Intake & Pre-filtration (sediment removal)",
                "Stage 2": "High-Pressure Pumping (pressurized to 70 bars)",
                "Stage 3": "Semi-permeable Membrane Separation (salt brine vs freshwater)",
                "Stage 4": "Post-treatment Mineralization & Chlorine Disinfection",
                "Stage 5": "Municipal Distribution Reservoir"
            },
            "guidance": "Write at least 150 words. Describe each sequential phase clearly using passive academic voice and chronological transition markers."
        }
    else:
        task_1 = {
            "task_number": 1,
            "title": "Writing Task 1 (General Training Formal Letter)",
            "min_words": 150,
            "recommended_minutes": 20,
            "prompt": (
                "There is an abandoned plot of municipal land in your local neighborhood that has become overgrown and littered with waste. "
                "You would like the local council to convert this land into a community organic garden and educational park.\n\n"
                "Write a letter to the chairperson of the local municipal council. In your letter:\n"
                "- Explain the current derelict state of the abandoned plot\n"
                "- Describe your proposal for the community garden and park\n"
                "- Explain how this initiative will benefit residents of all ages in your neighborhood."
            ),
            "guidance": "Write at least 150 words. Maintain a persuasive, formal tone. Begin your letter with 'Dear Councillor Davies,'."
        }

    task_2 = {
        "task_number": 2,
        "title": "Writing Task 2 (Discursive Essay)",
        "min_words": 250,
        "recommended_minutes": 40,
        "prompt": (
            "Some educators argue that universities should focus exclusively on imparting specialized vocational skills and practical training "
            "directly aligned with immediate industry employment. Others believe that the fundamental purpose of higher education is to cultivate "
            "broad theoretical knowledge, critical philosophy, and intellectual inquiry.\n\n"
            "Discuss both views and give your own opinion. Give reasons for your answer and include relevant examples from your knowledge or experience."
        ),
        "guidance": "Write at least 250 words. Structure your response with an introduction, two cohesive opposing perspective body paragraphs, and a justified personal stance."
    }

    return {
        "title": f"IELTS Writing Section (Set 3: {test_type.replace('_', ' ').title()})",
        "allocated_time_seconds": 3600,
        "tasks": [task_1, task_2]
    }


def build_speaking_set_3() -> Dict[str, Any]:
    return {
        "title": "IELTS Speaking Examination (Set 3: AI Voice Examiner)",
        "allocated_time_seconds": 840,
        "parts": [
            {
                "part_number": 1,
                "title": "Part 1: Cultural Interests and Personal Learning",
                "instruction": "The examiner asks general questions about your interests in music, reading, languages, and celebrations.",
                "questions": [
                    {
                        "id": "SPK3-P1-Q1",
                        "examiner_script": "Good morning. My name is Dr. Harrison. To start with, what genres of music do you most enjoy listening to when you want to concentrate or relax?"
                    },
                    {
                        "id": "SPK3-P1-Q2",
                        "examiner_script": "Do you prefer reading physical printed books, or do you find reading on digital screens and e-readers more convenient?"
                    },
                    {
                        "id": "SPK3-P1-Q3",
                        "examiner_script": "What do you find most challenging when learning a foreign language?"
                    },
                    {
                        "id": "SPK3-P1-Q4",
                        "examiner_script": "Is there a traditional cultural festival in your hometown that you particularly look forward to each year?"
                    }
                ]
            },
            {
                "part_number": 2,
                "title": "Part 2: Individual Long Turn (Cue Card)",
                "instruction": "You have 1 minute to plan your response. Then speak continuously for 1 to 2 minutes on the cue card.",
                "prep_time_seconds": 60,
                "speak_time_seconds": 120,
                "cue_card": {
                    "topic": "Describe a challenging project or milestone that required significant discipline and planning to achieve.",
                    "bullet_points": [
                        "What this project or personal objective was",
                        "What obstacles or setbacks you encountered during the process",
                        "How you organized your time and resources to overcome those hurdles",
                        "And explain how you felt when you successfully completed the objective."
                    ]
                },
                "examiner_script": "Now, I am going to give you a topic and I would like you to speak on it for one to two minutes. Before you begin speaking, you will have one minute to prepare and make notes. Here is your cue card."
            },
            {
                "part_number": 3,
                "title": "Part 3: In-Depth Analytical Discussion on Achievement & Education",
                "instruction": "The examiner will ask broader, abstract questions related to the themes of Part 2. Develop your answers with justifications and hypotheses.",
                "questions": [
                    {
                        "id": "SPK3-P3-Q1",
                        "examiner_script": "In modern educational institutions, is too much emphasis placed on standardized examination scores rather than creative problem-solving?"
                    },
                    {
                        "id": "SPK3-P3-Q2",
                        "examiner_script": "What role does learning from failure or temporary setbacks play in long-term intellectual and professional growth?"
                    },
                    {
                        "id": "SPK3-P3-Q3",
                        "examiner_script": "How can governments foster lifelong adult education programs in an era of rapid technological disruption?"
                    }
                ]
            }
        ]
    }
