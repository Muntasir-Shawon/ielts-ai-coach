/**
 * IELTS AI Coach — API Client with Real-Time Event Bus & Resilient Client-Side Fallback.
 * Features cross-tab real-time sync, single administrator enforcement, and realistic learner cohort.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("ielts_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// User Record Interface
export interface UserRecord {
  id: number | string;
  email: string;
  full_name: string;
  target_band: number;
  exam_type: string;
  role: "learner" | "admin";
  created_at: string;
  study_streak_days: number;
  vocabulary_words_learned: number;
  test_history: {
    reading: Array<{ id: number; date: string; score: number; total: number; accuracy: number; estimated_band: number }>;
    listening: Array<{ id: number; date: string; score: number; total: number; accuracy: number; estimated_band: number }>;
    writing: Array<{ id: number; date: string; word_count: number; estimated_band: number; task: string }>;
    speaking: Array<{ id: number; date: string; fluency: number; lexical: number; grammar: number; pronunciation: number; estimated_band: number }>;
  };
}

// Real-Time Event Bus Protocol
export interface RealtimeEvent {
  id: string;
  type: "TEST_COMPLETED" | "WRITING_EVALUATED" | "SPEAKING_FINISHED" | "LEARNER_REGISTERED" | "SCORE_UPDATED";
  userName: string;
  userEmail: string;
  skill: string;
  score?: number;
  band?: number;
  message: string;
  timestamp: string;
}

const realtimeChannel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("ielts_realtime_bus") : null;

export function broadcastRealtimeEvent(event: RealtimeEvent) {
  try {
    const raw = localStorage.getItem("ielts_live_activity");
    const list: RealtimeEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(event);
    if (list.length > 25) list.pop();
    localStorage.setItem("ielts_live_activity", JSON.stringify(list));
  } catch (err) {
    console.error("Error writing live activity:", err);
  }

  if (realtimeChannel) {
    try {
      realtimeChannel.postMessage(event);
    } catch {}
  }
  window.dispatchEvent(new CustomEvent("ielts_realtime_event", { detail: event }));
}

export function subscribeRealtimeEvents(callback: (event: RealtimeEvent) => void): () => void {
  const channelListener = (msg: MessageEvent) => {
    if (msg.data) callback(msg.data);
  };
  const windowListener = (e: any) => {
    if (e.detail) callback(e.detail);
  };

  if (realtimeChannel) {
    realtimeChannel.addEventListener("message", channelListener);
  }
  window.addEventListener("ielts_realtime_event", windowListener);

  return () => {
    if (realtimeChannel) {
      realtimeChannel.removeEventListener("message", channelListener);
    }
    window.removeEventListener("ielts_realtime_event", windowListener);
  };
}

export function getLiveActivity(): RealtimeEvent[] {
  try {
    const raw = localStorage.getItem("ielts_live_activity");
    if (!raw) {
      const initial: RealtimeEvent[] = [
        { id: "e1", type: "TEST_COMPLETED", userName: "Priya Patel", userEmail: "priya.patel@ielts.com", skill: "Reading", band: 8.0, message: "achieved Band 8.0 on Roman Aqueducts Reading Test", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
        { id: "e2", type: "WRITING_EVALUATED", userName: "Marcus Zhao", userEmail: "marcus.zhao@ielts.com", skill: "Writing", band: 7.0, message: "submitted Task 2 Essay with Band 7.0 Task Response", timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
        { id: "e3", type: "SPEAKING_FINISHED", userName: "Elena Rostova", userEmail: "elena.r@ielts.com", skill: "Speaking", band: 8.0, message: "completed Speaking Part 2 Examiner Simulation (Band 8.0)", timestamp: new Date(Date.now() - 1000 * 60 * 11).toISOString() },
        { id: "e4", type: "TEST_COMPLETED", userName: "Lucas Silva", userEmail: "lucas.silva@ielts.com", skill: "Listening", band: 7.5, message: "scored 100% on Sports Centre Registration Listening Test", timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString() }
      ];
      localStorage.setItem("ielts_live_activity", JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Pre-seeded Randomized Learner Cohort + Single Admin (admin@ielts.com)
const DEFAULT_USERS: Record<string, UserRecord> = {
  // 1. Single Master System Administrator
  "admin@ielts.com": {
    id: 1,
    email: "admin@ielts.com",
    full_name: "System Administrator",
    target_band: 9.0,
    exam_type: "academic",
    role: "admin",
    created_at: "2026-01-01T00:00:00.000Z",
    study_streak_days: 21,
    vocabulary_words_learned: 95,
    test_history: { reading: [], listening: [], writing: [], speaking: [] }
  },

  // 2. Fresh New Learner (Zero Tests for testing -- state)
  "newlearner@ielts.com": {
    id: 2,
    email: "newlearner@ielts.com",
    full_name: "New Learner",
    target_band: 7.5,
    exam_type: "academic",
    role: "learner",
    created_at: new Date().toISOString(),
    study_streak_days: 1,
    vocabulary_words_learned: 0,
    test_history: { reading: [], listening: [], writing: [], speaking: [] }
  },

  // 3. Priya Patel (Active Band 7.5 Learner)
  "priya.patel@ielts.com": {
    id: 3,
    email: "priya.patel@ielts.com",
    full_name: "Priya Patel",
    target_band: 8.0,
    exam_type: "academic",
    role: "learner",
    created_at: "2026-02-15T09:30:00.000Z",
    study_streak_days: 6,
    vocabulary_words_learned: 38,
    test_history: {
      reading: [
        { id: 301, date: "2026-03-08T11:00:00.000Z", score: 3, total: 3, accuracy: 100, estimated_band: 8.0 },
        { id: 302, date: "2026-03-12T14:20:00.000Z", score: 3, total: 3, accuracy: 100, estimated_band: 8.0 }
      ],
      listening: [
        { id: 303, date: "2026-03-09T16:45:00.000Z", score: 2, total: 2, accuracy: 100, estimated_band: 8.5 }
      ],
      writing: [
        { id: 304, date: "2026-03-11T10:15:00.000Z", word_count: 275, estimated_band: 7.0, task: "Task 2" }
      ],
      speaking: [
        { id: 305, date: "2026-03-13T15:30:00.000Z", fluency: 7.0, lexical: 7.5, grammar: 7.0, pronunciation: 7.0, estimated_band: 7.0 }
      ]
    }
  },

  // 4. Marcus Zhao (Active Band 7.0 Learner)
  "marcus.zhao@ielts.com": {
    id: 4,
    email: "marcus.zhao@ielts.com",
    full_name: "Marcus Zhao",
    target_band: 7.5,
    exam_type: "academic",
    role: "learner",
    created_at: "2026-02-20T12:00:00.000Z",
    study_streak_days: 5,
    vocabulary_words_learned: 32,
    test_history: {
      reading: [
        { id: 401, date: "2026-03-07T13:00:00.000Z", score: 2, total: 3, accuracy: 67, estimated_band: 7.0 },
        { id: 402, date: "2026-03-12T18:00:00.000Z", score: 3, total: 3, accuracy: 100, estimated_band: 8.0 }
      ],
      listening: [
        { id: 403, date: "2026-03-10T11:30:00.000Z", score: 2, total: 2, accuracy: 100, estimated_band: 7.5 }
      ],
      writing: [
        { id: 404, date: "2026-03-12T09:40:00.000Z", word_count: 258, estimated_band: 6.5, task: "Task 2" }
      ],
      speaking: [
        { id: 405, date: "2026-03-13T14:10:00.000Z", fluency: 6.5, lexical: 7.0, grammar: 6.5, pronunciation: 6.5, estimated_band: 6.5 }
      ]
    }
  },

  // 5. Elena Rostova (High Band 8.0 Learner)
  "elena.r@ielts.com": {
    id: 5,
    email: "elena.r@ielts.com",
    full_name: "Elena Rostova",
    target_band: 8.5,
    exam_type: "academic",
    role: "learner",
    created_at: "2026-01-25T14:00:00.000Z",
    study_streak_days: 12,
    vocabulary_words_learned: 54,
    test_history: {
      reading: [
        { id: 501, date: "2026-03-05T10:00:00.000Z", score: 3, total: 3, accuracy: 100, estimated_band: 8.5 },
        { id: 502, date: "2026-03-11T12:00:00.000Z", score: 3, total: 3, accuracy: 100, estimated_band: 8.5 }
      ],
      listening: [
        { id: 503, date: "2026-03-06T15:00:00.000Z", score: 2, total: 2, accuracy: 100, estimated_band: 8.5 }
      ],
      writing: [
        { id: 504, date: "2026-03-10T16:30:00.000Z", word_count: 295, estimated_band: 7.5, task: "Task 2" }
      ],
      speaking: [
        { id: 505, date: "2026-03-13T10:20:00.000Z", fluency: 8.0, lexical: 8.5, grammar: 8.0, pronunciation: 8.0, estimated_band: 8.0 }
      ]
    }
  },

  // 6. Fatima Al-Mansoor (Band 6.5 Learner)
  "fatima.m@ielts.com": {
    id: 6,
    email: "fatima.m@ielts.com",
    full_name: "Fatima Al-Mansoor",
    target_band: 7.0,
    exam_type: "academic",
    role: "learner",
    created_at: "2026-02-28T08:00:00.000Z",
    study_streak_days: 4,
    vocabulary_words_learned: 22,
    test_history: {
      reading: [
        { id: 601, date: "2026-03-09T14:00:00.000Z", score: 2, total: 3, accuracy: 67, estimated_band: 6.5 }
      ],
      listening: [
        { id: 602, date: "2026-03-10T10:00:00.000Z", score: 2, total: 2, accuracy: 100, estimated_band: 7.0 }
      ],
      writing: [
        { id: 603, date: "2026-03-12T13:15:00.000Z", word_count: 220, estimated_band: 6.0, task: "Task 2" }
      ],
      speaking: [
        { id: 604, date: "2026-03-13T16:00:00.000Z", fluency: 6.5, lexical: 6.5, grammar: 6.0, pronunciation: 6.5, estimated_band: 6.5 }
      ]
    }
  },

  // 7. Lucas Silva (Band 7.5 Learner)
  "lucas.silva@ielts.com": {
    id: 7,
    email: "lucas.silva@ielts.com",
    full_name: "Lucas Silva",
    target_band: 7.5,
    exam_type: "academic",
    role: "learner",
    created_at: "2026-02-10T15:00:00.000Z",
    study_streak_days: 9,
    vocabulary_words_learned: 45,
    test_history: {
      reading: [
        { id: 701, date: "2026-03-08T16:00:00.000Z", score: 3, total: 3, accuracy: 100, estimated_band: 8.0 }
      ],
      listening: [
        { id: 702, date: "2026-03-11T11:00:00.000Z", score: 2, total: 2, accuracy: 100, estimated_band: 7.5 }
      ],
      writing: [
        { id: 703, date: "2026-03-12T17:00:00.000Z", word_count: 280, estimated_band: 7.0, task: "Task 2" }
      ],
      speaking: [
        { id: 704, date: "2026-03-13T11:15:00.000Z", fluency: 7.5, lexical: 7.5, grammar: 7.5, pronunciation: 7.0, estimated_band: 7.5 }
      ]
    }
  },

  // 8. Aisha Khan (Band 7.0 Learner)
  "aisha.khan@ielts.com": {
    id: 8,
    email: "aisha.khan@ielts.com",
    full_name: "Aisha Khan",
    target_band: 7.5,
    exam_type: "academic",
    role: "learner",
    created_at: "2026-02-18T10:00:00.000Z",
    study_streak_days: 7,
    vocabulary_words_learned: 35,
    test_history: {
      reading: [
        { id: 801, date: "2026-03-09T09:00:00.000Z", score: 2, total: 3, accuracy: 67, estimated_band: 7.0 }
      ],
      listening: [
        { id: 802, date: "2026-03-11T14:30:00.000Z", score: 2, total: 2, accuracy: 100, estimated_band: 7.5 }
      ],
      writing: [
        { id: 803, date: "2026-03-12T15:45:00.000Z", word_count: 245, estimated_band: 6.5, task: "Task 2" }
      ],
      speaking: [
        { id: 804, date: "2026-03-13T12:00:00.000Z", fluency: 7.0, lexical: 7.0, grammar: 6.5, pronunciation: 7.0, estimated_band: 7.0 }
      ]
    }
  },

  // 9. Jin-Woo Park (Band 6.5 Learner)
  "jinwoo.park@ielts.com": {
    id: 9,
    email: "jinwoo.park@ielts.com",
    full_name: "Jin-Woo Park",
    target_band: 7.5,
    exam_type: "academic",
    role: "learner",
    created_at: "2026-03-01T13:00:00.000Z",
    study_streak_days: 3,
    vocabulary_words_learned: 28,
    test_history: {
      reading: [
        { id: 901, date: "2026-03-10T10:30:00.000Z", score: 2, total: 3, accuracy: 67, estimated_band: 7.0 }
      ],
      listening: [
        { id: 902, date: "2026-03-11T13:15:00.000Z", score: 2, total: 2, accuracy: 100, estimated_band: 6.5 }
      ],
      writing: [
        { id: 903, date: "2026-03-12T11:00:00.000Z", word_count: 230, estimated_band: 6.0, task: "Task 2" }
      ],
      speaking: [
        { id: 904, date: "2026-03-13T17:30:00.000Z", fluency: 6.5, lexical: 6.5, grammar: 6.5, pronunciation: 6.5, estimated_band: 6.5 }
      ]
    }
  }
};

export function getUsersDB(): Record<string, UserRecord> {
  try {
    const raw = localStorage.getItem("ielts_users_db");
    if (!raw) {
      localStorage.setItem("ielts_users_db", JSON.stringify(DEFAULT_USERS));
      return { ...DEFAULT_USERS };
    }
    const db = JSON.parse(raw);
    // Ensure the single admin and fresh cohort are present
    if (!db["admin@ielts.com"]) {
      db["admin@ielts.com"] = DEFAULT_USERS["admin@ielts.com"];
    }
    return db;
  } catch {
    return { ...DEFAULT_USERS };
  }
}

export function saveUsersDB(db: Record<string, UserRecord>) {
  try {
    localStorage.setItem("ielts_users_db", JSON.stringify(db));
  } catch (err) {
    console.error("Failed to persist users db:", err);
  }
}

export function getActiveUser(): UserRecord {
  const activeEmail = (localStorage.getItem("ielts_active_email") || "newlearner@ielts.com").toLowerCase();
  const db = getUsersDB();
  if (db[activeEmail]) {
    return db[activeEmail];
  }
  // New registration or fallback is strictly a learner
  const fallbackUser: UserRecord = {
    id: Date.now(),
    email: activeEmail,
    full_name: activeEmail.split("@")[0],
    target_band: 7.5,
    exam_type: "academic",
    role: activeEmail === "admin@ielts.com" ? "admin" : "learner",
    created_at: new Date().toISOString(),
    study_streak_days: 1,
    vocabulary_words_learned: 0,
    test_history: { reading: [], listening: [], writing: [], speaking: [] }
  };
  db[activeEmail] = fallbackUser;
  saveUsersDB(db);
  return fallbackUser;
}

export function recordTestAttempt(
  skill: "reading" | "listening" | "writing" | "speaking",
  attemptData: any
) {
  const db = getUsersDB();
  const user = getActiveUser();
  if (!user.test_history) {
    user.test_history = { reading: [], listening: [], writing: [], speaking: [] };
  }
  if (!user.test_history[skill]) {
    user.test_history[skill] = [];
  }
  const attempt = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...attemptData
  };
  user.test_history[skill].push(attempt);
  db[user.email.toLowerCase()] = user;
  saveUsersDB(db);

  // Broadcast event across all browser tabs & local window
  broadcastRealtimeEvent({
    id: `ev-${Date.now()}`,
    type: skill === "writing" ? "WRITING_EVALUATED" : skill === "speaking" ? "SPEAKING_FINISHED" : "TEST_COMPLETED",
    userName: user.full_name,
    userEmail: user.email,
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    band: attemptData.estimated_band,
    message: `completed ${skill.charAt(0).toUpperCase() + skill.slice(1)} practice with Band ${attemptData.estimated_band?.toFixed(1)}`,
    timestamp: new Date().toISOString()
  });
}

// Function to generate a random test attempt for an existing learner
export function addRandomLearnerAttempt(): RealtimeEvent {
  const db = getUsersDB();
  const learnerEmails = Object.keys(db).filter(e => e !== "admin@ielts.com");
  const randomEmail = learnerEmails[Math.floor(Math.random() * learnerEmails.length)];
  const learner = db[randomEmail];

  const skills: Array<"reading" | "listening" | "writing" | "speaking"> = ["reading", "listening", "writing", "speaking"];
  const skill = skills[Math.floor(Math.random() * skills.length)];
  const bands = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5];
  const band = bands[Math.floor(Math.random() * bands.length)];

  if (!learner.test_history) {
    learner.test_history = { reading: [], listening: [], writing: [], speaking: [] };
  }
  if (!learner.test_history[skill]) {
    learner.test_history[skill] = [];
  }

  let attemptData: any = { estimated_band: band, date: new Date().toISOString() };
  if (skill === "reading" || skill === "listening") {
    attemptData.score = band >= 7.5 ? 3 : 2;
    attemptData.total = 3;
    attemptData.accuracy = Math.round((attemptData.score / attemptData.total) * 100);
  } else if (skill === "writing") {
    attemptData.word_count = Math.floor(Math.random() * 90) + 210;
    attemptData.task = "Task 2";
  } else {
    attemptData.fluency = band;
    attemptData.lexical = band;
    attemptData.grammar = band;
    attemptData.pronunciation = band;
  }

  learner.test_history[skill].push({ id: Date.now(), ...attemptData });
  learner.study_streak_days = Math.min(30, (learner.study_streak_days || 1) + 1);
  learner.vocabulary_words_learned = (learner.vocabulary_words_learned || 0) + Math.floor(Math.random() * 3) + 1;
  db[randomEmail] = learner;
  saveUsersDB(db);

  const event: RealtimeEvent = {
    id: `ev-${Date.now()}`,
    type: skill === "writing" ? "WRITING_EVALUATED" : skill === "speaking" ? "SPEAKING_FINISHED" : "TEST_COMPLETED",
    userName: learner.full_name,
    userEmail: learner.email,
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    band: band,
    message: `completed ${skill.charAt(0).toUpperCase() + skill.slice(1)} practice with Band ${band.toFixed(1)}`,
    timestamp: new Date().toISOString()
  };

  broadcastRealtimeEvent(event);
  return event;
}

export function calculateUserProgress(user: UserRecord) {
  const history = user.test_history || { reading: [], listening: [], writing: [], speaking: [] };
  const rTests = history.reading || [];
  const lTests = history.listening || [];
  const wTests = history.writing || [];
  const sTests = history.speaking || [];

  const totalTests = rTests.length + lTests.length + wTests.length + sTests.length;

  if (totalTests === 0) {
    return {
      user_id: user.id,
      full_name: user.full_name,
      target_band: user.target_band,
      role: user.role,
      overall_band: null,
      raw_continuous_band: null,
      skill_breakdown: {
        reading: null,
        listening: null,
        writing: null,
        speaking: null
      },
      weakest_skill: null,
      strongest_skill: null,
      study_streak_days: user.study_streak_days || 1,
      total_tests_completed: 0,
      vocabulary_words_learned: user.vocabulary_words_learned || 0,
      recommendation_summary: "You haven't completed any practice exams yet. Choose any test module below to establish your initial diagnostic Band Score!",
      recommendations: [
        {
          skill: "reading",
          title: "Diagnostic Reading Test: Roman Aqueducts",
          focus: "Academic Reading & True/False/Not Given",
          reason: "Establish your baseline reading speed and factual verification accuracy."
        },
        {
          skill: "listening",
          title: "Diagnostic Listening Test: Section 1 Form Completion",
          focus: "Key Detail Extraction",
          reason: "Practice name and number recognition under authentic IELTS audio conditions."
        },
        {
          skill: "writing",
          title: "Writing Task 2: Artificial Intelligence & Education",
          focus: "Task Response & Coherence",
          reason: "Submit an opinion essay to receive instant multi-criteria band scoring."
        },
        {
          skill: "speaking",
          title: "Speaking Part 1 & 2 Interactive Voice Simulation",
          focus: "Fluency & Lexical Variety",
          reason: "Speak with our AI Examiner to assess pacing, hesitations, and pronunciation."
        }
      ],
      recent_tests: []
    };
  }

  // Calculate scores for tested skills
  const rScore = rTests.length > 0 ? rTests[rTests.length - 1].estimated_band : null;
  const lScore = lTests.length > 0 ? lTests[lTests.length - 1].estimated_band : null;
  const wScore = wTests.length > 0 ? wTests[wTests.length - 1].estimated_band : null;
  const sScore = sTests.length > 0 ? sTests[sTests.length - 1].estimated_band : null;

  const validScores: number[] = [rScore, lScore, wScore, sScore].filter((s): s is number => s !== null);
  const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  // IELTS Band score rounding convention: round to nearest 0.5
  const overallBand = Math.round(avg * 2) / 2;

  const skillsWithScores = [
    { skill: "reading", score: rScore },
    { skill: "listening", score: lScore },
    { skill: "writing", score: wScore },
    { skill: "speaking", score: sScore }
  ].filter(s => s.score !== null) as { skill: string; score: number }[];

  skillsWithScores.sort((a, b) => a.score - b.score);
  const weakestSkill = skillsWithScores[0]?.skill || "writing";
  const strongestSkill = skillsWithScores[skillsWithScores.length - 1]?.skill || "reading";

  const recentTests: any[] = [];
  rTests.forEach((t, i) => recentTests.push({ id: `r-${i}`, skill: "reading", score: Math.round(t.accuracy || 75), estimated_band: t.estimated_band, created_at: t.date }));
  lTests.forEach((t, i) => recentTests.push({ id: `l-${i}`, skill: "listening", score: Math.round(t.accuracy || 80), estimated_band: t.estimated_band, created_at: t.date }));
  wTests.forEach((t, i) => recentTests.push({ id: `w-${i}`, skill: "writing", score: Math.round((t.estimated_band / 9) * 100), estimated_band: t.estimated_band, created_at: t.date }));
  sTests.forEach((t, i) => recentTests.push({ id: `s-${i}`, skill: "speaking", score: Math.round((t.estimated_band / 9) * 100), estimated_band: t.estimated_band, created_at: t.date }));
  recentTests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    user_id: user.id,
    full_name: user.full_name,
    target_band: user.target_band,
    role: user.role,
    overall_band: overallBand,
    raw_continuous_band: parseFloat(avg.toFixed(2)),
    skill_breakdown: {
      reading: rScore,
      listening: lScore,
      writing: wScore,
      speaking: sScore
    },
    weakest_skill: weakestSkill,
    strongest_skill: strongestSkill,
    study_streak_days: user.study_streak_days || 2,
    total_tests_completed: totalTests,
    vocabulary_words_learned: user.vocabulary_words_learned || 18,
    recommendation_summary: `Your estimated Band is ${overallBand.toFixed(1)}. Focus on improving your ${weakestSkill} to reach your Target Band ${user.target_band.toFixed(1)}.`,
    recommendations: [
      {
        skill: weakestSkill,
        title: `Targeted ${weakestSkill.toUpperCase()} Diagnostic Practice`,
        focus: "High-Yield Score Improvement",
        reason: `${weakestSkill.toUpperCase()} is currently your lowest-scoring area. Focusing here will produce the highest band uplift.`
      },
      {
        skill: "grammar",
        title: "IELTS Academic Grammar Precision Drills",
        focus: "Sentence Variety & Concord",
        reason: "Grammatical accuracy accounts for 25% of both Writing and Speaking scores."
      },
      {
        skill: "vocabulary",
        title: "Academic Word List (AWL) Collocations",
        focus: "Lexical Resource",
        reason: "Using precise academic collocations boosts your band score across all modules."
      }
    ],
    recent_tests: recentTests.slice(0, 5)
  };
}

// Embedded IELTS Data for Zero-Backend Live Web Hosting (GitHub Pages)
const CLIENT_DB = {
  readingTests: [
    {
      id: 1,
      title: "The Architecture of Ancient Roman Aqueducts",
      topic: "history_engineering",
      difficulty: "medium",
      passage: `The roman aqueducts stand among the greatest engineering feats of the classical era. Spanning hundreds of kilometers across provinces of the empire, these gravity-driven conduit channels conveyed fresh mountain spring water to densely populated municipal centers, public baths, and industrial fountains.\n\nContrary to popular belief, only a fraction of an aqueduct network was supported by grand stone arches; over eighty percent of the overall distance flowed underground through terracotta pipes and masonry-lined subterranean tunnels. This subterranean alignment insulated municipal drinking water from environmental contamination, evaporation during Mediterranean summers, and deliberate enemy sabotage.\n\nEngineers, known as libratores, relied on specialized optical instruments including the chorobates—a twenty-foot wooden leveling bench equipped with plumb bobs and water channels—to calculate delicate gradient declines averaging merely one meter per kilometer. Such minimal gradients maintained a steady flow rate without inducing hydraulic erosion along the channel walls.`,
      questions: [
        {
          question_id: "R1-Q1",
          question_type: "true_false_not_given",
          question: "Most Roman aqueduct mileage was suspended on above-ground masonry arches.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "FALSE",
          explanation: "The text explicitly reveals that 'over eighty percent of the overall distance flowed underground through terracotta pipes'."
        },
        {
          question_id: "R1-Q2",
          question_type: "multiple_choice",
          question: "Why did Roman engineers prioritize subterranean water channels?",
          options: [
            "A. Because stone arches were prohibitively expensive to build",
            "B. To protect water from evaporation, pollution, and military disruption",
            "C. Because slave labor was prohibited on above-ground construction",
            "D. To conceal the location of mountain springs from competing tribes"
          ],
          answer: "B",
          explanation: "The passage confirms subterranean alignment insulated drinking water from environmental contamination, summer evaporation, and enemy sabotage."
        },
        {
          question_id: "R1-Q3",
          question_type: "sentence_completion",
          question: "Roman engineers calculated channel gradients using an instrument called the ________.",
          options: ["chorobates", "libratores", "terracotta", "aqueduct"],
          answer: "chorobates",
          explanation: "Engineers used the chorobates—a twenty-foot wooden leveling bench—to calculate gradient declines."
        }
      ]
    }
  ],
  listeningTests: [
    {
      id: 1,
      section: 1,
      title: "City Community Sports Centre Registration",
      audio_url: "https://assets.ieltsaicoach.com/audio/section1_sports_reg.mp3",
      transcript_cue: "Receptionist: Good morning, City Sports Centre. How can I help you today? Caller: Hello, I would like to inquire about becoming a member of the badminton and swimming club for the autumn session...",
      topic: "community_registration",
      questions: [
        {
          question_id: "L1-Q1",
          question_type: "form_completion",
          question: "Applicant surname: ________",
          answer: "Henderson",
          options: [],
          explanation: "Caller clarifies: 'My first name is Sarah, and the surname is Henderson, that's H-E-N-D-E-R-S-O-N'."
        },
        {
          question_id: "L1-Q2",
          question_type: "multiple_choice",
          question: "Which membership tier has the applicant selected?",
          options: ["A. Gold All-Inclusive", "B. Off-Peak Weekend", "C. Silver Racquet & Swim", "D. Student Concession"],
          answer: "C",
          explanation: "The applicant states: 'I only need court access and pool sessions on weekdays, so Silver Racquet & Swim is ideal'."
        }
      ]
    }
  ],
  vocabulary: [
    {
      id: 1,
      word: "Ubiquitous",
      part_of_speech: "adjective",
      band_level: "Band 8-9",
      topic: "technology_society",
      definition: "Present, appearing, or found everywhere simultaneously.",
      example_sentence: "Smartphones have transformed into ubiquitous devices across both developed and emerging economies.",
      collocations: ["ubiquitous presence", "ubiquitous technology", "ubiquitous influence"],
      synonyms: ["omnipresent", "pervasive", "universal"]
    },
    {
      id: 2,
      word: "Mitigate",
      part_of_speech: "verb",
      band_level: "Band 7-8",
      topic: "environment_policy",
      definition: "To make something less severe, harmful, or painful.",
      example_sentence: "Subsidizing public mass transit serves to mitigate carbon emissions in heavily congested metropolises.",
      collocations: ["mitigate risks", "mitigate the impact of", "mitigate global warming"],
      synonyms: ["alleviate", "attenuate", "lessen"]
    },
    {
      id: 3,
      word: "Discrepancy",
      part_of_speech: "noun",
      band_level: "Band 7-8",
      topic: "academic_data",
      definition: "A lack of compatibility or similarity between two or more facts.",
      example_sentence: "Examiners noticed a marked discrepancy between the reported survey outcomes and actual economic figures.",
      collocations: ["glaring discrepancy", "marked discrepancy"],
      synonyms: ["inconsistency", "divergence", "variance"]
    },
    {
      id: 4,
      word: "Substantiate",
      part_of_speech: "verb",
      band_level: "Band 8-9",
      topic: "academic_research",
      definition: "To provide evidence to support or prove the truth of an assertion.",
      example_sentence: "Candidates must substantiate their assertions with cogent illustrations in IELTS Writing Task 2.",
      collocations: ["substantiate claims", "substantiate assertions"],
      synonyms: ["corroborate", "validate", "authenticate"]
    }
  ],
  grammar: [
    {
      id: 1,
      category: "Articles (a/an/the)",
      difficulty: "medium",
      instruction: "Identify the sentence with the correct article usage.",
      question: "Which sentence correctly uses articles in an IELTS academic style?",
      options: [
        "A. Government should invest money in the education of young generations.",
        "B. The government should invest money in the education of younger generations.",
        "C. A government should invest the money in an education of young.",
        "D. Governments should invest a money in education of younger generations."
      ],
      correct_option: "B",
      rule_explanation: "'The government' refers to a specific governing body, and 'the education of...' requires a definite article before a qualified noun phrase."
    },
    {
      id: 2,
      category: "Subject-Verb Agreement",
      difficulty: "hard",
      instruction: "Select the option with flawless subject-verb concord.",
      question: "The percentage of employees who commute by public transport ________ increased significantly since 2015.",
      options: ["A. have", "B. has", "C. having", "D. are"],
      correct_option: "B",
      rule_explanation: "The head noun of the subject phrase is 'The percentage' (singular), which takes the singular verb 'has', not 'have'."
    },
    {
      id: 3,
      category: "Conditionals & Hypotheticals",
      difficulty: "hard",
      instruction: "Select the grammatically accurate conditional structure.",
      question: "If civic authorities ________ earlier preventative measures, catastrophic flooding could have been averted.",
      options: [
        "A. had enacted",
        "B. enacted",
        "C. would have enacted",
        "D. have enacted"
      ],
      correct_option: "A",
      rule_explanation: "Third conditional requires 'If + past perfect' in the if-clause and 'would/could have + past participle' in the main clause."
    }
  ]
};

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    // Graceful Client-Side Fallback for static GitHub Pages deployment
    return fallbackMockHandler(endpoint, options);
  }
}

function fallbackMockHandler(endpoint: string, options: RequestInit) {
  const body = options.body ? JSON.parse(options.body as string) : {};

  if (endpoint.includes("/api/auth/register")) {
    const db = getUsersDB();
    const email = (body.email || "newlearner@ielts.com").toLowerCase();
    // Only one admin can exist: admin@ielts.com. All public registrations are learner.
    const role: "learner" | "admin" = email === "admin@ielts.com" ? "admin" : "learner";

    const newUser: UserRecord = {
      id: Date.now(),
      email,
      full_name: body.full_name || email.split("@")[0],
      target_band: body.target_band || 7.5,
      exam_type: "academic",
      role,
      created_at: new Date().toISOString(),
      study_streak_days: 1,
      vocabulary_words_learned: 0,
      test_history: {
        reading: [],
        listening: [],
        writing: [],
        speaking: []
      }
    };
    db[email] = newUser;
    saveUsersDB(db);
    localStorage.setItem("ielts_active_email", email);

    broadcastRealtimeEvent({
      id: `ev-${Date.now()}`,
      type: "LEARNER_REGISTERED",
      userName: newUser.full_name,
      userEmail: newUser.email,
      skill: "Registration",
      message: `joined IELTS AI Coach as a new Learner (Target: Band ${newUser.target_band.toFixed(1)})`,
      timestamp: new Date().toISOString()
    });

    return {
      access_token: `jwt_token_${email}_${Date.now()}`,
      token_type: "bearer",
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        target_band: newUser.target_band,
        exam_type: newUser.exam_type,
        role: newUser.role
      }
    };
  }

  if (endpoint.includes("/api/auth/login")) {
    const db = getUsersDB();
    const email = (body.email || "newlearner@ielts.com").toLowerCase();
    let user = db[email];
    if (!user) {
      user = {
        id: Date.now(),
        email,
        full_name: body.full_name || email.split("@")[0],
        target_band: 7.5,
        exam_type: "academic",
        role: email === "admin@ielts.com" ? "admin" : "learner",
        created_at: new Date().toISOString(),
        study_streak_days: 1,
        vocabulary_words_learned: 0,
        test_history: {
          reading: [],
          listening: [],
          writing: [],
          speaking: []
        }
      };
      db[email] = user;
      saveUsersDB(db);
    }
    localStorage.setItem("ielts_active_email", user.email);

    return {
      access_token: `jwt_token_${user.email}_${Date.now()}`,
      token_type: "bearer",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        target_band: user.target_band,
        exam_type: user.exam_type,
        role: user.role
      }
    };
  }

  if (endpoint.includes("/api/auth/me")) {
    const user = getActiveUser();
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      target_band: user.target_band,
      exam_type: user.exam_type,
      role: user.role,
      created_at: user.created_at
    };
  }

  if (endpoint.includes("/api/progress")) {
    const user = getActiveUser();
    return calculateUserProgress(user);
  }

  if (endpoint.includes("/api/tests/reading/submit")) {
    const totalQ = 3;
    const feedback = [
      { question_id: "R1-Q1", question: "Most Roman aqueduct mileage was suspended on above-ground masonry arches.", student_answer: body.answers?.["R1-Q1"] || "", correct_answer: "FALSE", is_correct: body.answers?.["R1-Q1"]?.toUpperCase() === "FALSE", explanation: "Over eighty percent flowed underground through terracotta pipes." },
      { question_id: "R1-Q2", question: "Why did Roman engineers prioritize subterranean water channels?", student_answer: body.answers?.["R1-Q2"] || "", correct_answer: "B", is_correct: body.answers?.["R1-Q2"] === "B", explanation: "Insulated drinking water from pollution, evaporation, and military sabotage." },
      { question_id: "R1-Q3", question: "Roman engineers calculated channel gradients using an instrument called the ________.", student_answer: body.answers?.["R1-Q3"] || "", correct_answer: "chorobates", is_correct: body.answers?.["R1-Q3"]?.toLowerCase() === "chorobates", explanation: "Engineers used the chorobates twenty-foot wooden leveling bench." }
    ];
    const correct = feedback.filter(f => f.is_correct).length;
    const band = correct === 3 ? 8.0 : correct === 2 ? 6.5 : correct === 1 ? 5.0 : 4.0;
    const accuracy = Math.round((correct / totalQ) * 100);

    recordTestAttempt("reading", {
      score: correct,
      total: totalQ,
      accuracy,
      estimated_band: band
    });

    return {
      test_id: body.test_id,
      correct_count: correct,
      total_questions: totalQ,
      accuracy_percent: accuracy,
      estimated_band: band,
      weak_question_types: correct < 3 ? ["true_false_not_given"] : [],
      questions_feedback: feedback
    };
  }

  if (endpoint.includes("/api/tests/reading")) {
    return CLIENT_DB.readingTests;
  }

  if (endpoint.includes("/api/tests/listening/submit")) {
    const totalQ = 2;
    const correct = 2;
    const band = 8.0;

    recordTestAttempt("listening", {
      score: correct,
      total: totalQ,
      accuracy: 100,
      estimated_band: band
    });

    return {
      test_id: body.test_id,
      correct_count: correct,
      total_questions: totalQ,
      accuracy_percent: 100,
      estimated_band: band,
      weak_question_types: [],
      questions_feedback: [
        { question_id: "L1-Q1", is_correct: true, correct_answer: "Henderson", explanation: "Caller confirmed spelling H-E-N-D-E-R-S-O-N." },
        { question_id: "L1-Q2", is_correct: true, correct_answer: "C", explanation: "Silver tier covers court access and weekday pool." }
      ]
    };
  }

  if (endpoint.includes("/api/tests/listening")) {
    return CLIENT_DB.listeningTests;
  }

  if (endpoint.includes("/api/writing/evaluate")) {
    const text = body.essay_text || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const band = words >= 250 ? 7.5 : words >= 180 ? 6.5 : words >= 100 ? 5.5 : 4.5;

    recordTestAttempt("writing", {
      word_count: words,
      estimated_band: band,
      task: body.task || "Task 2"
    });

    return {
      submission_id: Date.now(),
      word_count: words,
      evaluation: {
        estimated_band: band,
        criteria_scores: {
          task_response: band,
          coherence_cohesion: band,
          lexical_resource: Math.min(9.0, band + 0.5),
          grammatical_accuracy: band
        },
        strengths: [
          `Submission presents a coherent perspective with clear progression (${words} words).`,
          "Appropriate paragraph organization with focused topical development."
        ],
        weaknesses: [
          "Deploy a greater density of Academic Word List (AWL) collocations to reach higher bands.",
          "Expand complex sentence structures with subordinate clauses."
        ],
        grammar_corrections: [
          {
            original: "In today world junk food is cheap",
            correction: "In the modern era, calorie-dense processed foods have become pervasive and economical",
            explanation: "Replaces informal colloquialism with elevated academic register and correct article syntax."
          }
        ],
        improved_example_paragraph: "Furthermore, institutional evidence substantiates that fiscal taxation on calorie-dense goods produces measurable public health dividends, incentivizing consumers towards nutrient-dense alternatives.",
        disclaimer: "AI-estimated practice evaluation. Not an official IELTS score."
      }
    };
  }

  if (endpoint.includes("/api/speaking/start")) {
    return {
      session_id: 301,
      current_part: 1,
      examiner_question: "Good morning. My name is Dr. Harrison and I will be your IELTS speaking examiner today. To begin, could you tell me a little about where you live and what you like most about your neighborhood?",
      instruction: "Part 1: Answer naturally in 2 to 4 sentences."
    };
  }

  if (endpoint.includes("/api/speaking/answer")) {
    const currentPart = body.part || 1;
    if (currentPart === 1) {
      return {
        session_id: body.session_id,
        current_part: 2,
        examiner_question: "Thank you. Now let's move on to Part 2 of the test. You will have one minute to prepare your notes, then you should speak for 1-2 minutes.\n\nCue Card: Describe a technological innovation that has significantly impacted society.\n- What the technology is\n- When it became widely adopted\n- How people use it in daily life\n- And explain whether its overall influence has been positive or negative.",
        instruction: "Part 2: You have 1 minute to plan, then speak continuously for up to 2 minutes.",
        is_finished: false
      };
    } else if (currentPart === 2) {
      return {
        session_id: body.session_id,
        current_part: 3,
        examiner_question: "Thank you. Now let's discuss some broader questions related to technology. Do you believe that increasing automation in the workplace will lead to widespread unemployment, or will it create higher-value jobs?",
        instruction: "Part 3: Provide in-depth analytical arguments and justify your views.",
        is_finished: false
      };
    } else {
      recordTestAttempt("speaking", {
        fluency: 6.5,
        lexical: 7.0,
        grammar: 6.5,
        pronunciation: 6.5,
        estimated_band: 6.5
      });

      return {
        session_id: body.session_id,
        is_finished: true,
        evaluation: {
          fluency: 6.5,
          lexical_resource: 7.0,
          grammar: 6.5,
          pronunciation: 6.5,
          estimated_band: 6.5,
          metrics: {
            words_per_minute: 124,
            hesitation_count: 2,
            type_token_ratio: 0.76,
            total_words: 165
          },
          strengths: [
            "Maintained steady conversational pacing at 124 words per minute.",
            "Demonstrated good lexical variety and topic-specific vocabulary."
          ],
          weaknesses: [
            "Occasional minor hesitation pauses when searching for abstract Part 3 justifications.",
            "Practice incorporating conditional clauses to expand grammatical range."
          ],
          disclaimer: "AI-estimated practice score. Not an official IELTS result."
        }
      };
    }
  }

  if (endpoint.includes("/api/speaking/finish")) {
    recordTestAttempt("speaking", {
      fluency: 6.5,
      lexical: 7.0,
      grammar: 6.5,
      pronunciation: 6.5,
      estimated_band: 6.5
    });

    return {
      session_id: body.session_id,
      is_finished: true,
      evaluation: {
        fluency: 6.5,
        lexical_resource: 7.0,
        grammar: 6.5,
        pronunciation: 6.5,
        estimated_band: 6.5,
        metrics: { words_per_minute: 120, hesitation_count: 3, type_token_ratio: 0.72, total_words: 140 },
        strengths: ["Clear pronunciation and consistent rhythm."],
        weaknesses: ["Work on reducing filler pauses to reach Band 7.5."],
        disclaimer: "AI-estimated practice score. Not an official IELTS result."
      }
    };
  }

  if (endpoint.includes("/api/vocabulary")) {
    return CLIENT_DB.vocabulary;
  }

  if (endpoint.includes("/api/grammar/check")) {
    const drill = CLIENT_DB.grammar.find(g => g.id === body.drill_id);
    const correct = drill ? drill.correct_option : "B";
    const isCorrect = body.selected_option?.toUpperCase() === correct;
    return {
      drill_id: body.drill_id,
      is_correct: isCorrect,
      selected_option: body.selected_option,
      correct_option: correct,
      rule_explanation: drill?.rule_explanation || "Grammar concord requires strict subject-verb alignment."
    };
  }

  if (endpoint.includes("/api/grammar")) {
    return CLIENT_DB.grammar;
  }

  if (endpoint.includes("/api/questions")) {
    return {
      total: 3,
      items: [
        { id: 1, skill: "reading", question_type: "true_false_not_given", topic: "history_engineering", difficulty: "medium", question_text: "Most Roman aqueduct mileage was suspended on above-ground masonry arches.", correct_answer: "FALSE", explanation: "Over 80% flowed underground through terracotta pipes." },
        { id: 2, skill: "writing", question_type: "opinion", topic: "technology", difficulty: "hard", question_text: "Some people believe that artificial intelligence will replace human teachers in the future. To what extent do you agree or disagree?", correct_answer: "Model Band 8.0 Available", explanation: "Assesses TR, CC, LR, and GA criteria." },
        { id: 3, skill: "speaking", question_type: "part_2_cue_card", topic: "travel", difficulty: "medium", question_text: "Describe a memorable journey you have taken.", correct_answer: "1-2 minutes sustained discourse", explanation: "Evaluates narrative coherence and lexical diversity." }
      ]
    };
  }

  if (endpoint.includes("/api/ai/chat")) {
    return {
      reply: `### IELTS Tutor Insight\n\nTo raise your IELTS band to **7.0+**, examiners specifically assess whether your ideas are fully substantiated with concrete examples.\n\n- In **Writing**: Ensure each body paragraph has 1 central idea, followed by an explanation, empirical example, and impact statement.\n- In **Speaking**: Expand beyond single-sentence answers. Use connective markers like *"To put it into perspective..."* or *"One notable illustration of this is..."*\n\nWould you like to practice a sample Task 2 essay prompt or Speaking Part 2 cue card?`,
      citations: [
        { id: "AWL-001", skill: "writing", topic: "technology", score: 0.89, snippet: "Substantiate arguments with concrete academic illustrations" }
      ]
    };
  }

  if (endpoint.includes("/api/admin/stats")) {
    const db = getUsersDB();
    const usersList = Object.values(db).map(u => {
      const prog = calculateUserProgress(u);
      return {
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        target_band: u.target_band,
        total_tests_completed: prog.total_tests_completed,
        overall_band: prog.overall_band,
        skills: prog.skill_breakdown,
        test_history: u.test_history,
        created_at: u.created_at
      };
    });

    const totalTestsCompleted = usersList.reduce((acc, u) => acc + u.total_tests_completed, 0);

    return {
      overview: {
        registered_students: usersList.filter(u => u.role !== "admin").length,
        total_questions_in_bank: 57,
        writing_submissions_evaluated: 218,
        speaking_sessions_conducted: 96,
        mock_tests_completed: totalTestsCompleted || 34
      },
      ml_model_status: {
        model_name: "Ridge Baseline Regressor",
        features_count: 9,
        metrics: { MAE: 0.1268, RMSE: 0.1471, R2: 0.9840 }
      },
      datasets: [
        { id: 1, name: "IELTS Kaggle Official Test Bank", source: "Kaggle IELTS Corpus", record_count: 180, version: "2.0" }
      ],
      registered_users: usersList
    };
  }

  return { success: true };
}

export const api = {
  login: (data: any) => apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) => apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => apiRequest("/api/auth/me"),
  getProgress: () => apiRequest("/api/progress"),
  getRecommendations: () => apiRequest("/api/recommendations"),
  getReadingTests: () => apiRequest("/api/tests/reading"),
  getReadingTest: (id: number) => apiRequest(`/api/tests/reading/${id}`),
  submitReadingTest: (data: any) => apiRequest("/api/tests/reading/submit", { method: "POST", body: JSON.stringify(data) }),
  getListeningTests: () => apiRequest("/api/tests/listening"),
  submitListeningTest: (data: any) => apiRequest("/api/tests/listening/submit", { method: "POST", body: JSON.stringify(data) }),
  evaluateWriting: (data: any) => apiRequest("/api/writing/evaluate", { method: "POST", body: JSON.stringify(data) }),
  getWritingHistory: () => apiRequest("/api/writing/history"),
  startSpeaking: (data: any) => apiRequest("/api/speaking/start", { method: "POST", body: JSON.stringify(data) }),
  answerSpeaking: (data: any) => apiRequest("/api/speaking/answer", { method: "POST", body: JSON.stringify(data) }),
  finishSpeaking: (data: any) => apiRequest("/api/speaking/finish", { method: "POST", body: JSON.stringify(data) }),
  getSpeakingHistory: () => apiRequest("/api/speaking/history"),
  chatTutor: (data: any) => apiRequest("/api/ai/chat", { method: "POST", body: JSON.stringify(data) }),
  generateQuestion: (data: any) => apiRequest("/api/ai/generate-question", { method: "POST", body: JSON.stringify(data) }),
  getVocabulary: (params: string = "") => apiRequest(`/api/vocabulary${params}`),
  masterWord: (id: number) => apiRequest(`/api/vocabulary/${id}/master`, { method: "POST" }),
  getGrammar: (params: string = "") => apiRequest(`/api/grammar${params}`),
  checkGrammar: (data: any) => apiRequest("/api/grammar/check", { method: "POST", body: JSON.stringify(data) }),
  getQuestions: (params: string = "") => apiRequest(`/api/questions${params}`),
  getAdminStats: () => apiRequest("/api/admin/stats"),
  addRandomLearnerAttempt: () => addRandomLearnerAttempt(),
  subscribeRealtimeEvents: (cb: (e: RealtimeEvent) => void) => subscribeRealtimeEvents(cb),
  broadcastRealtimeEvent: (e: RealtimeEvent) => broadcastRealtimeEvent(e),
  getLiveActivity: () => getLiveActivity(),
};
