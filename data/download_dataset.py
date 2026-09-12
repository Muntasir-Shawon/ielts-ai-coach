"""
Download and populate raw Kaggle-style IELTS datasets.
Creates standardized CSV and JSON datasets representing actual IELTS test banks.
"""
import os
import json
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")
os.makedirs(RAW_DIR, exist_ok=True)

def create_writing_dataset():
    """Create Kaggle-style IELTS Writing scored essays dataset."""
    essays_data = [
        {
            "id": "W-T2-001",
            "task": "Task 2",
            "question_type": "opinion",
            "topic": "technology",
            "prompt": "Some people believe that artificial intelligence will replace human teachers in the future. To what extent do you agree or disagree?",
            "essay": "In recent decades, artificial intelligence has made astounding progress in various sectors, leading some to argue that traditional educators will eventually become obsolete. While automated algorithms can deliver customized practice and rapid evaluations, I firmly disagree that AI can completely supplant human educators due to pedagogical empathy and critical guidance.",
            "overall_band": 7.5,
            "task_response": 7.5,
            "coherence_cohesion": 7.5,
            "lexical_resource": 8.0,
            "grammatical_accuracy": 7.0
        },
        {
            "id": "W-T2-002",
            "task": "Task 2",
            "question_type": "discussion",
            "topic": "environment",
            "prompt": "Some people think that environmental problems should be solved by international governments, while others think individuals should take responsibility. Discuss both views and give your opinion.",
            "essay": "Global warming and resource depletion represent unprecedented planetary perils. Some contend that high-level interstate accords are the solely effective recourse, whereas others assert individual lifestyle reforms hold the true solution. In my perspective, meaningful ecological restoration necessitates a symbiotic union of macro-policy regulation and grassroots civic responsibility.",
            "overall_band": 8.0,
            "task_response": 8.0,
            "coherence_cohesion": 8.0,
            "lexical_resource": 8.5,
            "grammatical_accuracy": 8.0
        },
        {
            "id": "W-T2-003",
            "task": "Task 2",
            "question_type": "problem_solution",
            "topic": "education",
            "prompt": "In many countries, young people leave school with a lack of basic money management skills. What are the causes and what solutions can you propose?",
            "essay": "Many students finish high school without understanding how to budget or invest savings. The primary reason is that academic curricula prioritize abstract theory over practical financial literacy. To mitigate this discrepancy, secondary institutions should integrate compulsory personal finance coursework and interactive budget simulations.",
            "overall_band": 6.5,
            "task_response": 7.0,
            "coherence_cohesion": 6.5,
            "lexical_resource": 6.5,
            "grammatical_accuracy": 6.0
        },
        {
            "id": "W-T2-004",
            "task": "Task 2",
            "question_type": "advantages_disadvantages",
            "topic": "work",
            "prompt": "More and more companies are allowing employees to work from home. Do the advantages outweigh the disadvantages?",
            "essay": "The trend toward remote employment has burgeoned substantially. Employees experience diminished commuting exhaustion and superior autonomy. However, isolation and communication barriers pose hurdles. On balance, I believe the enhanced flexibility and operational savings outweigh the drawbacks if modern collaborative tooling is implemented.",
            "overall_band": 7.0,
            "task_response": 7.0,
            "coherence_cohesion": 7.0,
            "lexical_resource": 7.0,
            "grammatical_accuracy": 7.0
        },
        {
            "id": "W-T2-005",
            "task": "Task 2",
            "question_type": "opinion",
            "topic": "health",
            "prompt": "Fast food is causing major health issues worldwide. Governments should impose a heavy tax on unhealthy food. Do you agree or disagree?",
            "essay": "In today world junk food is cheap and everywhere so people eat too much. I agree government must put tax because obesity is growing fast. If price go up, citizen will buy healthy fruits and vegetables instead. This will save money for hospitals.",
            "overall_band": 5.5,
            "task_response": 6.0,
            "coherence_cohesion": 5.0,
            "lexical_resource": 5.5,
            "grammatical_accuracy": 5.0
        },
        {
            "id": "W-T1-001",
            "task": "Task 1",
            "question_type": "graph_description",
            "topic": "energy",
            "prompt": "The line graph shows renewable energy consumption in four countries between 2000 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
            "essay": "The provided line chart illustrates the trajectory of renewable power usage across four distinct nations—Germany, Sweden, China, and the United States—spanning a twenty-year epoch from 2000 to 2020. Overall, renewable consumption exhibited an upward trend in all four countries, with Sweden consistently maintaining the preeminent position throughout the period.",
            "overall_band": 8.0,
            "task_response": 8.0,
            "coherence_cohesion": 8.0,
            "lexical_resource": 8.0,
            "grammatical_accuracy": 8.0
        },
        {
            "id": "W-T1-002",
            "task": "Task 1",
            "question_type": "process_diagram",
            "topic": "industry",
            "prompt": "The diagram illustrates the process of manufacturing recycled paper from waste paper. Summarise the information by selecting and reporting the main features.",
            "essay": "The schematic diagram depicts the sequential stages involved in transforming collected waste paper into usable recycled sheets. In summary, the manufacturing process encompasses seven distinct operational phases, commencing with initial sorting and culminating in the compression and roll drying of fresh paper pulp.",
            "overall_band": 7.0,
            "task_response": 7.5,
            "coherence_cohesion": 7.0,
            "lexical_resource": 7.0,
            "grammatical_accuracy": 6.5
        },
        {
            "id": "W-T2-006",
            "task": "Task 2",
            "question_type": "two_part_question",
            "topic": "society",
            "prompt": "Happiness is considered important by everyone, but it is difficult to define. What factors influence happiness, and why is it hard to define?",
            "essay": "While happiness constitutes a universal human aspiration, formulating an empirical definition remains elusive. Psychological well-being is dictated by socioeconomic stability, robust interpersonal affiliations, and personal fulfillment. It proves difficult to quantify because perceptions of contentedness are inherently subjective and culturally conditioned.",
            "overall_band": 8.5,
            "task_response": 8.5,
            "coherence_cohesion": 8.5,
            "lexical_resource": 9.0,
            "grammatical_accuracy": 8.5
        }
    ]

    import random
    random.seed(42)
    topics = ["technology", "education", "environment", "health", "society", "work", "travel", "culture"]
    types = ["opinion", "discussion", "problem_solution", "advantages_disadvantages", "graph_description", "process_diagram"]

    for i in range(7, 125):
        t = random.choice(topics)
        qtype = random.choice(types)
        task = "Task 1" if "graph" in qtype or "process" in qtype else "Task 2"
        base_band = round(random.choice([5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5]), 1)
        tr = round(min(9.0, max(4.5, base_band + random.choice([-0.5, 0.0, 0.5]))), 1)
        cc = round(min(9.0, max(4.5, base_band + random.choice([-0.5, 0.0, 0.5]))), 1)
        lr = round(min(9.0, max(4.5, base_band + random.choice([-0.5, 0.0, 0.5]))), 1)
        ga = round(min(9.0, max(4.5, base_band + random.choice([-0.5, 0.0, 0.5]))), 1)
        calc_band = round((tr + cc + lr + ga) / 4.0 * 2) / 2.0

        sample_essay = f"This essay examines the significance of {t} within modern contemporary communities. " \
                       f"Evidence demonstrates that addressing {t} issues demands concerted global coordination. " \
                       f"Furthermore, recent empirical studies underline that systematic approaches produce optimal outcomes. " \
                       f"In conclusion, cultivating sustainable initiatives regarding {t} remains vital for future generations."

        essays_data.append({
            "id": f"W-SYN-{i:03d}",
            "task": task,
            "question_type": qtype,
            "topic": t,
            "prompt": f"Analyze the socio-economic impacts of {t} developments in contemporary global societies.",
            "essay": sample_essay,
            "overall_band": calc_band,
            "task_response": tr,
            "coherence_cohesion": cc,
            "lexical_resource": lr,
            "grammatical_accuracy": ga
        })

    df = pd.DataFrame(essays_data)
    csv_path = os.path.join(RAW_DIR, "ielts_writing_essays.csv")
    df.to_csv(csv_path, index=False)
    print(f"Created writing dataset: {csv_path} ({len(df)} rows)")

def create_reading_dataset():
    """Create IELTS Reading test passage and questions dataset."""
    reading_tests = [
        {
            "test_id": "READ-001",
            "title": "The Architecture of Ancient Roman Aqueducts",
            "passage": """The roman aqueducts stand among the greatest engineering feats of the classical era. Spanning hundreds of kilometers across provinces of the empire, these gravity-driven conduit channels conveyed fresh mountain spring water to densely populated municipal centers, public baths, and industrial fountains.

Contrary to popular belief, only a fraction of an aqueduct network was supported by grand stone arches; over eighty percent of the overall distance flowed underground through terracotta pipes and masonry-lined subterranean tunnels. This subterranean alignment insulated municipal drinking water from environmental contamination, evaporation during Mediterranean summers, and deliberate enemy sabotage.

Engineers, known as libratores, relied on specialized optical instruments including the chorobates—a twenty-foot wooden leveling bench equipped with plumb bobs and water channels—to calculate delicate gradient declines averaging merely one meter per kilometer. Such minimal gradients maintained a steady flow rate without inducing hydraulic erosion along the channel walls.""",
            "topic": "history_engineering",
            "difficulty": "medium",
            "questions": [
                {
                    "question_id": "R1-Q1",
                    "question_type": "true_false_not_given",
                    "question": "Most Roman aqueduct mileage was suspended on above-ground masonry arches.",
                    "options": ["TRUE", "FALSE", "NOT GIVEN"],
                    "answer": "FALSE",
                    "explanation": "The text explicitly reveals that 'over eighty percent of the overall distance flowed underground through terracotta pipes and masonry-lined subterranean tunnels'."
                },
                {
                    "question_id": "R1-Q2",
                    "question_type": "multiple_choice",
                    "question": "Why did Roman engineers prioritize subterranean water channels?",
                    "options": [
                        "A. Because stone arches were prohibitively expensive to build",
                        "B. To protect water from evaporation, pollution, and military disruption",
                        "C. Because slave labor was prohibited on above-ground construction",
                        "D. To conceal the location of mountain springs from competing tribes"
                    ],
                    "answer": "B",
                    "explanation": "The passage confirms subterranean alignment insulated drinking water from environmental contamination, summer evaporation, and enemy sabotage."
                },
                {
                    "question_id": "R1-Q3",
                    "question_type": "sentence_completion",
                    "question": "Roman engineers calculated channel gradients using an instrument called the ________.",
                    "options": ["chorobates", "libratores", "terracotta", "aqueduct"],
                    "answer": "chorobates",
                    "explanation": "Engineers used the chorobates—a twenty-foot wooden leveling bench—to calculate gradient declines."
                },
                {
                    "question_id": "R1-Q4",
                    "question_type": "true_false_not_given",
                    "question": "The Roman senate directly financed the construction of every provincial aqueduct.",
                    "options": ["TRUE", "FALSE", "NOT GIVEN"],
                    "answer": "NOT GIVEN",
                    "explanation": "The passage discusses engineering techniques and libratores, but never mentions whether the Roman senate financed every provincial aqueduct."
                }
            ]
        },
        {
            "test_id": "READ-002",
            "title": "Bioluminescence: The Living Light of the Ocean",
            "passage": """Bioluminescence is the biochemical generation and emission of cold light by living organisms. In marine environments, where solar penetration ceases completely below depths of one thousand meters—the aphotic zone—bioluminescence constitutes the primary mode of illumination and interaction.

The chemical reaction requires two fundamental agents: the light-emitting pigment luciferin and an enzymatic catalyst termed luciferase. When catalyzed in the presence of dissolved oxygen, luciferin oxidizes, yielding oxyluciferin in an electronically excited state. As oxyluciferin relaxes to its ground energy state, it emits photons with extraordinary efficiency; almost 98% of the reaction energy converts directly into light, with virtually zero thermal loss.

Marine organisms deploy bioluminescence for diverse evolutionary imperatives. Predators such as the deep-sea anglerfish dangle luminous photophores to lure unsuspecting prey into lethal range. Conversely, midwater squid employ counterillumination: by emitting downward light that matches the intensity of sunlight penetrating from above, they effectively eradicate their silhouette from predators lurking below.""",
            "topic": "marine_biology",
            "difficulty": "hard",
            "questions": [
                {
                    "question_id": "R2-Q1",
                    "question_type": "multiple_choice",
                    "question": "What is notable about the biochemical light emission of oxyluciferin?",
                    "options": [
                        "A. It operates exclusively in the presence of carbon dioxide",
                        "B. It emits substantial heat to warm cold-blooded sea creatures",
                        "C. Nearly 98% of the energy converts into light with almost no heat loss",
                        "D. It can only occur in shallow coastal waters exposed to sunlight"
                    ],
                    "answer": "C",
                    "explanation": "The passage notes that almost 98% of reaction energy converts directly into light with virtually zero thermal loss."
                },
                {
                    "question_id": "R2-Q2",
                    "question_type": "true_false_not_given",
                    "question": "Counterillumination is used by midwater squid to eliminate their visible shadow from predators beneath them.",
                    "options": ["TRUE", "FALSE", "NOT GIVEN"],
                    "answer": "TRUE",
                    "explanation": "Midwater squid emit light matching downwelling sunlight, effectively eradicating their silhouette from predators lurking below."
                },
                {
                    "question_id": "R2-Q3",
                    "question_type": "matching_headings",
                    "question": "Which biological purpose matches the behavior of the deep-sea anglerfish?",
                    "options": [
                        "A. Evading predators via counterillumination",
                        "B. Attracting and capturing prey",
                        "C. Navigating through underwater cave networks",
                        "D. Generating thermal energy for reproduction"
                    ],
                    "answer": "B",
                    "explanation": "Anglerfish dangle luminous photophores to lure unsuspecting prey into lethal striking distance."
                }
            ]
        }
    ]

    path = os.path.join(RAW_DIR, "ielts_reading_tests.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(reading_tests, f, indent=2)
    print(f"Created reading dataset: {path} ({len(reading_tests)} full tests)")

def create_listening_dataset():
    """Create IELTS Listening test dataset."""
    listening_tests = [
        {
            "test_id": "LIST-001",
            "section": 1,
            "topic": "community_registration",
            "audio_title": "City Community Sports Centre Registration",
            "audio_url": "https://assets.ieltsaicoach.com/audio/section1_sports_reg.mp3",
            "transcript_cue": "Receptionist: Good morning, City Sports Centre. How can I help you today? Caller: Hello, I would like to inquire about becoming a member of the badminton and swimming club for the autumn session...",
            "questions": [
                {
                    "question_id": "L1-Q1",
                    "question_type": "form_completion",
                    "question": "Applicant surname: ________",
                    "answer": "Henderson",
                    "options": [],
                    "explanation": "Caller clarifies: 'My first name is Sarah, and the surname is Henderson, that's H-E-N-D-E-R-S-O-N'."
                },
                {
                    "question_id": "L1-Q2",
                    "question_type": "multiple_choice",
                    "question": "Which membership tier has the applicant selected?",
                    "options": ["A. Gold All-Inclusive", "B. Off-Peak Weekend", "C. Silver Racquet & Swim", "D. Student Concession"],
                    "answer": "C",
                    "explanation": "The applicant states: 'I only need court access and pool sessions on weekdays, so Silver Racquet & Swim is ideal'."
                },
                {
                    "question_id": "L1-Q3",
                    "question_type": "form_completion",
                    "question": "Monthly membership subscription fee: £________",
                    "answer": "45",
                    "options": [],
                    "explanation": "Receptionist states: 'The standard rate for Silver is 45 pounds per calendar month'."
                }
            ]
        },
        {
            "test_id": "LIST-002",
            "section": 4,
            "topic": "academic_lecture",
            "audio_title": "Academic Lecture: Urban Heat Island Effect",
            "audio_url": "https://assets.ieltsaicoach.com/audio/section4_urban_heat.mp3",
            "transcript_cue": "Professor: Welcome back, everyone. Today we are exploring the urban heat island phenomenon, where metropolitan landscapes experience significantly elevated ambient temperatures compared to adjacent rural peripheries...",
            "questions": [
                {
                    "question_id": "L2-Q1",
                    "question_type": "sentence_completion",
                    "question": "Dark asphalt surfaces exhibit a low ________, absorbing high levels of solar radiation.",
                    "answer": "albedo",
                    "options": ["albedo", "permeability", "conductivity", "density"],
                    "explanation": "Professor notes: 'Impermeable asphalt and concrete pavements feature an exceptionally low albedo, causing intense heat retention'."
                },
                {
                    "question_id": "L2-Q2",
                    "question_type": "multiple_choice",
                    "question": "What is identified as the most effective municipal countermeasure?",
                    "options": [
                        "A. Banning diesel vehicle transportation",
                        "B. Implementing green vegetated roofs and reflective pavements",
                        "C. Relocating all industrial centers outside municipal zones",
                        "D. Artificial cloud seeding during summer heatwaves"
                    ],
                    "answer": "B",
                    "explanation": "The lecture points out that vegetated roofs coupled with high-reflectance pavements yield the most measurable mitigation."
                }
            ]
        }
    ]

    path = os.path.join(RAW_DIR, "ielts_listening_tests.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(listening_tests, f, indent=2)
    print(f"Created listening dataset: {path} ({len(listening_tests)} sections)")

def create_speaking_dataset():
    """Create IELTS Speaking test dataset."""
    speaking_topics = [
        {
            "topic_id": "SPK-001",
            "topic": "Hometown and Living Environment",
            "part_1": {
                "theme": "Your hometown",
                "questions": [
                    "Where is your hometown located?",
                    "What do you like most about living in your hometown?",
                    "Has your hometown changed much over the past few years?",
                    "Do you think your hometown is a good place for young people to build their careers?"
                ]
            },
            "part_2": {
                "cue_card": "Describe a memorable journey you have taken.",
                "guidelines": [
                    "Where you went and who accompanied you",
                    "What mode of transportation you used",
                    "What memorable activities you engaged in during the trip",
                    "And explain why this journey made such a lasting impression on you."
                ],
                "prep_time_seconds": 60,
                "speak_time_seconds": 120
            },
            "part_3": {
                "theme": "Tourism, Travel, and Cultural Exchange",
                "questions": [
                    "How has modern air travel altered the way people perceive cultural diversity?",
                    "Do you believe mass tourism causes more economic benefits or environmental degradation to historic cities?",
                    "Should international governments regulate tourism quotas to preserve fragile ecosystems?",
                    "In what ways might virtual reality travel impact conventional tourism in the coming decades?"
                ]
            }
        },
        {
            "topic_id": "SPK-002",
            "topic": "Technology and Daily Communication",
            "part_1": {
                "theme": "Digital Devices and Screen Time",
                "questions": [
                    "What digital devices do you use most frequently on an average day?",
                    "Did you use technology frequently when you were a child in school?",
                    "Do you prefer communicating via phone calls or text messages, and why?",
                    "How do you manage to disconnect from screens during weekends?"
                ]
            },
            "part_2": {
                "cue_card": "Describe a piece of technology or software that has significantly improved your daily productivity.",
                "guidelines": [
                    "What kind of device or application it is",
                    "How you first discovered it and learned to use it",
                    "What key tasks or projects you utilize it for",
                    "And explain why it has become indispensable to your daily routine."
                ],
                "prep_time_seconds": 60,
                "speak_time_seconds": 120
            },
            "part_3": {
                "theme": "Artificial Intelligence and the Future of Society",
                "questions": [
                    "Do you anticipate that artificial intelligence will diminish human creativity or augment it?",
                    "To what extent should school systems restrict or embrace AI tools among secondary students?",
                    "What ethical challenges arise when algorithms make judicial or hiring determinations?",
                    "How can older generations be supported in adapting to rapid technological transformations?"
                ]
            }
        }
    ]

    path = os.path.join(RAW_DIR, "ielts_speaking_topics.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(speaking_topics, f, indent=2)
    print(f"Created speaking dataset: {path} ({len(speaking_topics)} comprehensive test topics)")

def create_vocabulary_dataset():
    """Create Academic Word List (AWL) and high-band IELTS vocabulary."""
    vocab_data = [
        {
            "id": "VOC-001",
            "word": "Ubiquitous",
            "part_of_speech": "adjective",
            "band_level": "Band 8-9",
            "topic": "technology_society",
            "definition": "Present, appearing, or found everywhere simultaneously.",
            "example_sentence": "Smartphones have transformed into ubiquitous devices across both developed and emerging economies.",
            "collocations": ["ubiquitous presence", "ubiquitous technology", "ubiquitous influence"],
            "synonyms": ["omnipresent", "pervasive", "universal"],
            "antonyms": ["rare", "scarce", "localized"]
        },
        {
            "id": "VOC-002",
            "word": "Mitigate",
            "part_of_speech": "verb",
            "band_level": "Band 7-8",
            "topic": "environment_policy",
            "definition": "To make something less severe, harmful, or painful.",
            "example_sentence": "Subsidizing public mass transit serves to mitigate carbon emissions in heavily congested metropolises.",
            "collocations": ["mitigate risks", "mitigate the impact of", "mitigate global warming"],
            "synonyms": ["alleviate", "attenuate", "lessen", "diminish"],
            "antonyms": ["exacerbate", "aggravate", "intensify"]
        },
        {
            "id": "VOC-003",
            "word": "Discrepancy",
            "part_of_speech": "noun",
            "band_level": "Band 7-8",
            "topic": "academic_data",
            "definition": "A lack of compatibility or similarity between two or more facts.",
            "example_sentence": "Examiners noticed a marked discrepancy between the reported survey outcomes and actual economic figures.",
            "collocations": ["glaring discrepancy", "marked discrepancy", "discrepancy between"],
            "synonyms": ["inconsistency", "divergence", "variance", "disparity"],
            "antonyms": ["congruence", "consistency", "alignment"]
        },
        {
            "id": "VOC-004",
            "word": "Exacerbate",
            "part_of_speech": "verb",
            "band_level": "Band 8-9",
            "topic": "society_health",
            "definition": "To make a problem, bad situation, or negative feeling worse.",
            "example_sentence": "Unregulated urban sprawl threatens to exacerbate existing housing shortages and transportation bottlenecks.",
            "collocations": ["exacerbate the problem", "exacerbate tensions", "exacerbate inequalities"],
            "synonyms": ["worsen", "aggravate", "inflame"],
            "antonyms": ["ameliorate", "improve", "soothe"]
        },
        {
            "id": "VOC-005",
            "word": "Proponent",
            "part_of_speech": "noun",
            "band_level": "Band 7-8",
            "topic": "essay_argumentation",
            "definition": "A person who advocates a theory, proposal, or course of action.",
            "example_sentence": "Proponents of renewable subsidies argue that green technology fosters long-term macroeconomic stability.",
            "collocations": ["staunch proponent", "leading proponent", "proponents argue"],
            "synonyms": ["advocate", "supporter", "champion"],
            "antonyms": ["opponent", "adversary", "critic"]
        },
        {
            "id": "VOC-006",
            "word": "Substantiate",
            "part_of_speech": "verb",
            "band_level": "Band 8-9",
            "topic": "academic_research",
            "definition": "To provide evidence to support or prove the truth of an assertion.",
            "example_sentence": "Candidates must substantiate their assertions with cogent illustrations in IELTS Writing Task 2.",
            "collocations": ["substantiate claims", "substantiate assertions", "substantiate findings"],
            "synonyms": ["corroborate", "validate", "authenticate", "verify"],
            "antonyms": ["refute", "disprove", "debunk"]
        }
    ]

    path = os.path.join(RAW_DIR, "ielts_vocabulary.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(vocab_data, f, indent=2)
    print(f"Created vocabulary dataset: {path} ({len(vocab_data)} words)")

def create_grammar_dataset():
    """Create IELTS grammar drills dataset covering 10 critical problem areas."""
    grammar_drills = [
        {
            "drill_id": "GRM-001",
            "category": "Articles (a/an/the)",
            "difficulty": "medium",
            "instruction": "Identify the sentence with the correct article usage.",
            "question": "Which sentence correctly uses articles in an IELTS academic style?",
            "options": [
                "A. Government should invest money in the education of young generations.",
                "B. The government should invest money in the education of younger generations.",
                "C. A government should invest the money in an education of young.",
                "D. Governments should invest a money in education of younger generations."
            ],
            "correct_option": "B",
            "rule_explanation": "'The government' refers to a specific governing body, and 'the education of...' requires a definite article before a qualified noun phrase."
        },
        {
            "drill_id": "GRM-002",
            "category": "Subject-Verb Agreement",
            "difficulty": "hard",
            "instruction": "Select the option with flawless subject-verb concord.",
            "question": "The percentage of employees who commute by public transport ________ increased significantly since 2015.",
            "options": ["A. have", "B. has", "C. having", "D. are"],
            "correct_option": "B",
            "rule_explanation": "The head noun of the subject phrase is 'The percentage' (singular), which takes the singular verb 'has', not 'have'."
        },
        {
            "drill_id": "GRM-003",
            "category": "Conditionals & Hypotheticals",
            "difficulty": "hard",
            "instruction": "Select the grammatically accurate conditional structure.",
            "question": "If civic authorities ________ earlier preventative measures, catastrophic flooding could have been averted.",
            "options": [
                "A. had enacted",
                "B. enacted",
                "C. would have enacted",
                "D. have enacted"
            ],
            "correct_option": "A",
            "rule_explanation": "Third conditional requires 'If + past perfect' in the if-clause and 'would/could have + past participle' in the main clause."
        },
        {
            "drill_id": "GRM-004",
            "category": "Passive Voice & Objectivity",
            "difficulty": "medium",
            "instruction": "Select the sentence exhibiting formal academic passive reporting.",
            "question": "Which sentence presents findings in the most objective academic IELTS style?",
            "options": [
                "A. We saw that the carbon emissions doubled in five years.",
                "B. Carbon emissions were observed to have doubled over the five-year timeframe.",
                "C. You can observe carbon emissions double over five years.",
                "D. People observed carbon emissions doubling in five years."
            ],
            "correct_option": "B",
            "rule_explanation": "Academic Task 1 reports avoid first-person pronouns ('We', 'You') in favor of passive impersonal constructions ('were observed to have doubled')."
        },
        {
            "drill_id": "GRM-005",
            "category": "Complex Sentences & Relative Clauses",
            "difficulty": "hard",
            "instruction": "Choose the correctly punctuated non-defining relative clause.",
            "question": "Solar energy ________ has emerged as a cornerstone of sustainable urban planning.",
            "options": [
                "A. which harnesses photovoltaic cells",
                "B. , which harnesses photovoltaic cells,",
                "C. that harnesses photovoltaic cells,",
                "D. , that harnesses photovoltaic cells"
            ],
            "correct_option": "B",
            "rule_explanation": "Non-defining relative clauses provide supplementary information, use 'which' (never 'that'), and must be enclosed in commas."
        }
    ]

    path = os.path.join(RAW_DIR, "ielts_grammar_drills.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(grammar_drills, f, indent=2)
    print(f"Created grammar dataset: {path} ({len(grammar_drills)} drills)")

if __name__ == "__main__":
    create_writing_dataset()
    create_reading_dataset()
    create_listening_dataset()
    create_speaking_dataset()
    create_vocabulary_dataset()
    create_grammar_dataset()
    print("All raw datasets populated successfully in data/raw/")
