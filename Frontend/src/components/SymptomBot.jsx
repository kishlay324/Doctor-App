import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// Health tips database for common issues (fallback when AI is not available)
const healthTipsDatabase = {
  // General Health
  fever: {
    mild: [
      "🌡️ Rest well and stay hydrated - drink plenty of water, herbal tea, or clear broths",
      "💊 Take paracetamol/acetaminophen as directed for fever reduction",
      "🧊 Apply a cool, damp cloth to your forehead",
      "👕 Wear light, breathable clothing",
      "⚠️ Seek medical help if fever exceeds 103°F (39.4°C) or lasts more than 3 days"
    ],
    moderate: [
      "Take fever-reducing medication as directed",
      "Monitor temperature every 4-6 hours",
      "Stay in bed and rest completely",
      "If fever persists beyond 48 hours, consult a doctor"
    ]
  },
  cold: {
    mild: [
      "🍵 Drink warm fluids like honey-lemon water, ginger tea, or chicken soup",
      "😴 Get plenty of rest - aim for 8-10 hours of sleep",
      "💨 Use a humidifier to ease congestion",
      "🧂 Gargle with warm salt water for sore throat",
      "🍯 Take honey (1 tbsp) to soothe cough - not for children under 1 year"
    ]
  },
  cough: {
    mild: [
      "🍯 Honey and warm water can soothe your throat",
      "💧 Stay well hydrated to thin mucus",
      "🌬️ Use steam inhalation - breathe over hot water with a towel over head",
      "🛏️ Elevate your head while sleeping",
      "🚫 Avoid irritants like smoke and strong perfumes"
    ]
  },
  'sore throat': {
    mild: [
      "🧂 Gargle with warm salt water (1/2 tsp salt in 8 oz water) every few hours",
      "🍵 Drink warm tea with honey and lemon",
      "🍬 Suck on throat lozenges or ice chips",
      "💧 Stay hydrated with warm fluids",
      "🌡️ Use a humidifier to add moisture to the air"
    ]
  },
  fatigue: {
    mild: [
      "😴 Ensure 7-9 hours of quality sleep each night",
      "💧 Drink at least 8 glasses of water daily",
      "🥗 Eat balanced meals with iron-rich foods (spinach, beans, red meat)",
      "🚶 Light exercise like walking can boost energy",
      "☕ Limit caffeine intake, especially after 2 PM"
    ]
  },
  'body ache': {
    mild: [
      "🛁 Take a warm bath with Epsom salt",
      "💆 Gentle stretching or yoga can help",
      "🔥 Apply a heating pad to sore areas",
      "💊 Over-the-counter pain relievers like ibuprofen can help",
      "😴 Rest and avoid strenuous activities"
    ]
  },

  // Stomach Issues
  acidity: {
    mild: [
      "🥛 Drink cold milk or buttermilk for quick relief",
      "🍌 Eat bananas - they're natural antacids",
      "🚫 Avoid spicy, oily, and citrus foods",
      "🚶 Don't lie down immediately after eating - wait 2-3 hours",
      "💧 Drink plenty of water throughout the day"
    ]
  },
  'stomach pain': {
    mild: [
      "🍵 Drink ginger or peppermint tea",
      "🌡️ Apply a warm compress to your abdomen",
      "🚫 Avoid heavy, greasy foods",
      "🚶 Light walking can help with digestion",
      "⚠️ If pain is severe or persistent, see a doctor immediately"
    ]
  },
  constipation: {
    mild: [
      "💧 Drink 8-10 glasses of water daily",
      "🥬 Eat fiber-rich foods - fruits, vegetables, whole grains",
      "🚶 Regular physical activity helps bowel movements",
      "🍇 Prunes or prune juice are natural laxatives",
      "⏰ Try to maintain regular meal times"
    ]
  },
  bloating: {
    mild: [
      "🍵 Drink peppermint or ginger tea",
      "🚶 Take a short walk after meals",
      "🚫 Avoid carbonated drinks and chewing gum",
      "🍽️ Eat slowly and chew food thoroughly",
      "🧘 Try gentle yoga poses like child's pose"
    ]
  },
  nausea: {
    mild: [
      "🍵 Sip ginger tea or chew on ginger candy",
      "🍋 Smell or suck on fresh lemon",
      "🧊 Suck on ice chips if you can't keep fluids down",
      "🌬️ Get fresh air - sit near an open window",
      "🍞 Eat bland foods like crackers or toast"
    ]
  },

  // Skin Issues
  acne: {
    mild: [
      "🧼 Wash face twice daily with a gentle cleanser",
      "🚫 Don't touch or pick at pimples",
      "💧 Stay hydrated and eat less oily food",
      "🛏️ Change pillowcases frequently",
      "☀️ Use non-comedogenic sunscreen"
    ]
  },
  'skin rash': {
    mild: [
      "🧊 Apply a cold compress to reduce itching",
      "🧴 Use calamine lotion or hydrocortisone cream",
      "👕 Wear loose, cotton clothing",
      "🚿 Take lukewarm (not hot) showers",
      "⚠️ See a doctor if rash spreads or is accompanied by fever"
    ]
  },
  itching: {
    mild: [
      "🧊 Apply cold compress to itchy areas",
      "🧴 Use moisturizing lotion (fragrance-free)",
      "🛁 Add colloidal oatmeal to bath water",
      "🚫 Avoid scratching - trim nails short",
      "👕 Wear soft, breathable fabrics"
    ]
  },

  // Head & Nerves
  headache: {
    mild: [
      "💧 Drink water - dehydration often causes headaches",
      "😴 Rest in a dark, quiet room",
      "🧊 Apply cold or warm compress to forehead/neck",
      "💆 Gently massage temples and neck",
      "☕ If caffeine-related, a small amount of coffee may help"
    ]
  },
  migraine: {
    mild: [
      "🌑 Rest in a dark, quiet room",
      "🧊 Apply ice pack to forehead or back of neck",
      "☕ Small amount of caffeine may help some people",
      "💆 Try pressure point massage (between thumb and index finger)",
      "⚠️ If migraines are frequent, definitely see a neurologist"
    ]
  },
  dizziness: {
    mild: [
      "🪑 Sit or lie down immediately when feeling dizzy",
      "💧 Drink water - dehydration can cause dizziness",
      "🍬 If blood sugar might be low, eat something sweet",
      "🐢 Move slowly when changing positions",
      "⚠️ Persistent dizziness needs medical evaluation"
    ]
  },

  // General advice
  'general checkup': {
    mild: [
      "✅ Maintain a balanced diet with fruits and vegetables",
      "🚶 Exercise for at least 30 minutes daily",
      "😴 Get 7-9 hours of quality sleep",
      "💧 Drink 8 glasses of water daily",
      "🧘 Practice stress management techniques"
    ]
  }
};

// Quick Doctor Finder - Symptom to Speciality with descriptions
const quickDoctorFinder = {
  'General physician': {
    icon: '🩺',
    description: 'For fever, cold, cough, body pain, fatigue, diabetes, BP',
    symptoms: ['Fever or chills', 'Cold & cough', 'Body aches', 'Fatigue', 'General weakness', 'Routine checkup', 'Diabetes management', 'Blood pressure issues'],
    whenToVisit: 'For general health issues, preventive care, and initial consultation for any health concern.'
  },
  'Dermatologist': {
    icon: '🧴',
    description: 'For skin, hair, and nail problems',
    symptoms: ['Acne or pimples', 'Skin rash', 'Hair loss', 'Itching', 'Eczema', 'Skin infections', 'Dandruff', 'Nail problems'],
    whenToVisit: 'For any skin conditions, allergies, cosmetic concerns, hair fall, or nail issues.'
  },
  'Gynecologist': {
    icon: '👩‍⚕️',
    description: 'For women\'s health and pregnancy care',
    symptoms: ['Pregnancy care', 'Menstrual problems', 'PCOD/PCOS', 'Irregular periods', 'Fertility issues', 'Menopause symptoms', 'Breast concerns', 'Vaginal infections'],
    whenToVisit: 'For all women\'s reproductive health issues, pregnancy care, and hormonal problems.'
  },
  'Pediatricians': {
    icon: '👶',
    description: 'For children\'s health (0-18 years)',
    symptoms: ['Child fever', 'Vaccination', 'Growth concerns', 'Child nutrition', 'Developmental issues', 'Childhood infections', 'Allergies in kids', 'Behavioral concerns'],
    whenToVisit: 'For all health concerns related to infants, children, and adolescents.'
  },
  'Neurologist': {
    icon: '🧠',
    description: 'For brain, spine, and nerve problems',
    symptoms: ['Severe headaches', 'Migraines', 'Dizziness', 'Seizures', 'Numbness/tingling', 'Memory problems', 'Sleep disorders', 'Stroke symptoms'],
    whenToVisit: 'For persistent headaches, migraines, vertigo, nerve pain, or any neurological symptoms.'
  },
  'Gastroenterologist': {
    icon: '🫃',
    description: 'For digestive system problems',
    symptoms: ['Stomach pain', 'Acidity/heartburn', 'Constipation', 'Diarrhea', 'Bloating', 'Liver problems', 'Nausea/vomiting', 'Digestive issues'],
    whenToVisit: 'For digestive problems, liver issues, stomach pain, or any GI tract concerns.'
  }
};

// Symptom to Speciality Mapping
const symptomSpecialityMap = {
  // General Physician
  fever: 'General physician',
  cold: 'General physician',
  cough: 'General physician',
  fatigue: 'General physician',
  'body ache': 'General physician',
  weakness: 'General physician',
  flu: 'General physician',
  'sore throat': 'General physician',
  'general checkup': 'General physician',
  'blood pressure': 'General physician',
  diabetes: 'General physician',

  // Dermatologist
  'skin rash': 'Dermatologist',
  acne: 'Dermatologist',
  'skin allergy': 'Dermatologist',
  eczema: 'Dermatologist',
  'hair loss': 'Dermatologist',
  'skin infection': 'Dermatologist',
  psoriasis: 'Dermatologist',
  'dry skin': 'Dermatologist',
  itching: 'Dermatologist',
  pimples: 'Dermatologist',

  // Gynecologist
  'pregnancy care': 'Gynecologist',
  'menstrual problems': 'Gynecologist',
  'irregular periods': 'Gynecologist',
  pcod: 'Gynecologist',
  pcos: 'Gynecologist',
  'breast pain': 'Gynecologist',
  'vaginal infection': 'Gynecologist',
  menopause: 'Gynecologist',
  infertility: 'Gynecologist',
  'prenatal care': 'Gynecologist',

  // Pediatricians
  'child fever': 'Pediatricians',
  'baby health': 'Pediatricians',
  vaccination: 'Pediatricians',
  'child nutrition': 'Pediatricians',
  'growth issues': 'Pediatricians',
  'child cold': 'Pediatricians',
  'infant care': 'Pediatricians',
  'child development': 'Pediatricians',

  // Neurologist
  headache: 'Neurologist',
  migraine: 'Neurologist',
  dizziness: 'Neurologist',
  seizures: 'Neurologist',
  numbness: 'Neurologist',
  'memory loss': 'Neurologist',
  'nerve pain': 'Neurologist',
  stroke: 'Neurologist',
  tremors: 'Neurologist',
  paralysis: 'Neurologist',

  // Gastroenterologist
  'stomach pain': 'Gastroenterologist',
  acidity: 'Gastroenterologist',
  constipation: 'Gastroenterologist',
  diarrhea: 'Gastroenterologist',
  bloating: 'Gastroenterologist',
  'liver problems': 'Gastroenterologist',
  'digestive issues': 'Gastroenterologist',
  nausea: 'Gastroenterologist',
  vomiting: 'Gastroenterologist',
  'food poisoning': 'Gastroenterologist',
};

// Conditions that require immediate doctor consultation
const seriousConditions = [
  'seizures', 'stroke', 'paralysis', 'numbness', 'chest pain', 
  'difficulty breathing', 'severe bleeding', 'pregnancy care',
  'infertility', 'liver problems', 'food poisoning', 'diarrhea',
  'vomiting', 'high fever', 'vaccination', 'skin infection'
];

// Gemini AI Integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const getAIResponse = async (prompt, symptoms, severity, userAge) => {
  if (!GEMINI_API_KEY) {
    return null;
  }

  try {
    const systemPrompt = `You are a helpful and caring health assistant for DocSpot, a doctor appointment booking platform. 
    
Your role is to:
1. Provide helpful, accurate health advice for common ailments
2. Suggest home remedies and self-care tips when appropriate
3. Be empathetic and reassuring
4. ALWAYS recommend seeing a doctor for serious symptoms
5. Never diagnose - only provide general wellness advice
6. Keep responses concise (2-4 bullet points max)
7. Use emojis to make responses friendly

Patient Info:
- Age Group: ${userAge}
- Symptoms: ${symptoms.join(', ')}
- Severity: ${severity}

User Query: ${prompt}

Important: If symptoms are severe or concerning, always recommend consulting a doctor. Include a brief disclaimer that this is not medical advice.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH"
            }
          ]
        }),
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    return null;
  } catch (error) {
    console.error('AI API Error:', error);
    return null;
  }
};

const SymptomBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [userResponses, setUserResponses] = useState({});
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedSpeciality, setRecommendedSpeciality] = useState(null);
  const [chatMode, setChatMode] = useState('guided'); // 'guided', 'free', or 'quick_find'
  const [showDoctorOption, setShowDoctorOption] = useState(false);
  const [aiEnabled] = useState(!!GEMINI_API_KEY);
  
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startChat();
    }
  }, [isOpen]);

  const startChat = () => {
    addBotMessage(
      "👋 Hello! I'm DocSpot's AI Health Assistant. I can help you with health advice or find the right doctor for you.",
      { type: 'info' }
    );
    
    setTimeout(() => {
      addBotMessage(
        "How can I help you today?",
        { 
          type: 'mode_selection',
          id: 'mode_selection'
        }
      );
      setCurrentStep('mode_selection');
    }, 800);
  };

  const addBotMessage = (text, step = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text,
          step,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text,
        timestamp: new Date(),
      },
    ]);
  };

  // Get local health tips
  const getLocalHealthTips = (symptoms, severity) => {
    let tips = [];
    const severityLevel = severity === 'severe' ? 'moderate' : severity || 'mild';
    
    symptoms.forEach(symptom => {
      const symptomTips = healthTipsDatabase[symptom];
      if (symptomTips) {
        const levelTips = symptomTips[severityLevel] || symptomTips['mild'] || [];
        tips = [...tips, ...levelTips];
      }
    });
    
    tips = [...new Set(tips)].slice(0, 5);
    
    if (tips.length === 0) {
      tips = [
        "💧 Stay hydrated - drink plenty of water",
        "😴 Get adequate rest",
        "🥗 Eat a balanced diet",
        "🧘 Practice relaxation techniques",
        "📞 Consult a doctor if symptoms persist"
      ];
    }
    
    return tips;
  };

  // Check if condition is serious
  const isConditionSerious = (symptoms, severity, duration) => {
    if (symptoms.some(s => seriousConditions.includes(s))) return true;
    if (severity === 'severe') return true;
    if ((duration === 'chronic' || duration === 'week_plus') && severity === 'moderate') return true;
    return false;
  };

  // Handle mode selection
  const handleModeSelect = (mode) => {
    if (mode === 'chat') {
      addUserMessage('💬 Chat about my symptoms');
      setChatMode('guided');
      setTimeout(() => {
        addBotMessage(
          "Let me help you understand your symptoms better. First, who needs help?",
          {
            type: 'age_selection',
            id: 'age'
          }
        );
        setCurrentStep('age');
      }, 600);
    } else if (mode === 'find_doctor') {
      addUserMessage('👨‍⚕️ Find a doctor directly');
      setChatMode('quick_find');
      setTimeout(() => {
        addBotMessage(
          "🔍 Let me help you find the right specialist!\n\nWhat's your main health concern?",
          {
            type: 'quick_speciality_select',
            id: 'quick_select'
          }
        );
        setCurrentStep('quick_select');
      }, 600);
    } else if (mode === 'health_tips') {
      addUserMessage('📋 Get health tips');
      setChatMode('free');
      setTimeout(() => {
        addBotMessage(
          "💡 Here are some general health tips:\n\n" +
          "• 💧 Drink 8 glasses of water daily\n" +
          "• 🥗 Eat a balanced diet with fruits & vegetables\n" +
          "• 😴 Get 7-9 hours of sleep\n" +
          "• 🚶 Exercise for 30 minutes daily\n" +
          "• 🧘 Practice stress management\n\n" +
          "Feel free to ask me anything about your health!",
          { type: 'ai_chat' }
        );
        setCurrentStep('free_chat');
      }, 600);
    }
  };

  // Handle quick speciality selection
  const handleQuickSpecialitySelect = (speciality) => {
    const specInfo = quickDoctorFinder[speciality];
    addUserMessage(`${specInfo.icon} ${speciality}`);
    setRecommendedSpeciality(speciality);

    const availableDoctors = doctors.filter(
      (doc) => doc.speciality === speciality && doc.available !== false
    );

    setTimeout(() => {
      addBotMessage(
        `✅ **You should consult a ${speciality}**\n\n` +
        `${specInfo.icon} ${specInfo.whenToVisit}\n\n` +
        `**Common issues they treat:**\n${specInfo.symptoms.slice(0, 4).map(s => `• ${s}`).join('\n')}`,
        { type: 'info' }
      );

      setTimeout(() => {
        if (availableDoctors.length > 0) {
          addBotMessage(
            `🩺 Great news! We have **${availableDoctors.length} ${speciality}${availableDoctors.length > 1 ? 's' : ''}** available for you:`,
            {
              type: 'doctor_list',
              speciality,
              doctors: availableDoctors.slice(0, 3),
            }
          );
        } else {
          addBotMessage(
            `😔 Sorry, no ${speciality}s are currently available. Please check back later or try another speciality.`,
            {
              type: 'no_doctors',
              speciality,
            }
          );
        }
        setCurrentStep('doctor_shown');
      }, 1000);
    }, 600);
  };

  // Handle symptom-based quick find
  const handleSymptomQuickFind = (symptomCategory) => {
    let speciality = 'General physician';
    
    switch(symptomCategory) {
      case 'fever_cold':
        speciality = 'General physician';
        break;
      case 'skin_hair':
        speciality = 'Dermatologist';
        break;
      case 'womens_health':
        speciality = 'Gynecologist';
        break;
      case 'child_health':
        speciality = 'Pediatricians';
        break;
      case 'head_nerves':
        speciality = 'Neurologist';
        break;
      case 'stomach_digestion':
        speciality = 'Gastroenterologist';
        break;
      default:
        speciality = 'General physician';
    }

    handleQuickSpecialitySelect(speciality);
  };

  const handleOptionSelect = async (option, stepId) => {
    addUserMessage(option.label);
    setUserResponses((prev) => ({ ...prev, [stepId]: option.value }));

    // Handle symptom category selection
    if (stepId === 'symptom_category') {
      if (option.value === 'free_chat') {
        setChatMode('free');
        setTimeout(() => {
          addBotMessage(
            "I'm here to help! Describe your health concern and I'll provide advice:",
            { type: 'ai_chat' }
          );
          setCurrentStep('free_chat');
        }, 600);
        return;
      }

      let nextStepId;
      switch (option.value) {
        case 'general':
          nextStepId = 'specific_symptoms_general';
          break;
        case 'neuro':
          nextStepId = 'specific_symptoms_neuro';
          break;
        case 'gastro':
          nextStepId = 'specific_symptoms_gastro';
          break;
        case 'skin':
          nextStepId = 'specific_symptoms_skin';
          break;
        case 'gynec':
          nextStepId = 'specific_symptoms_gynec';
          break;
        default:
          nextStepId = 'duration';
      }
      
      setTimeout(() => {
        const symptomOptions = getSymptomOptionsForCategory(nextStepId);
        addBotMessage(
          "Please select your symptoms:",
          {
            type: 'multi_choice',
            id: nextStepId,
            options: symptomOptions
          }
        );
        setCurrentStep(nextStepId);
      }, 600);
      return;
    }

    // Handle age selection for children
    if (stepId === 'age' && option.value === 'child') {
      setSelectedSymptoms(['child fever']);
    }

    // Move to next step based on current step
    if (stepId === 'age') {
      setTimeout(() => {
        addBotMessage(
          "What area is your concern related to?",
          {
            type: 'symptom_category',
            id: 'symptom_category'
          }
        );
        setCurrentStep('symptom_category');
      }, 600);
    } else if (stepId === 'duration') {
      setTimeout(() => {
        addBotMessage(
          "How would you rate the severity?",
          {
            type: 'severity_select',
            id: 'severity'
          }
        );
        setCurrentStep('severity');
      }, 600);
    } else if (stepId === 'severity') {
      generateAIAnalysis();
    }
  };

  const getSymptomOptionsForCategory = (categoryId) => {
    const optionsMap = {
      'specific_symptoms_general': [
        { label: '🌡️ Fever', value: 'fever' },
        { label: '🤧 Cold & Cough', value: 'cold' },
        { label: '😫 Body Ache', value: 'body ache' },
        { label: '😴 Fatigue/Weakness', value: 'fatigue' },
        { label: '🤕 Sore Throat', value: 'sore throat' },
      ],
      'specific_symptoms_neuro': [
        { label: '🤯 Headache', value: 'headache' },
        { label: '💫 Dizziness', value: 'dizziness' },
        { label: '😵 Migraine', value: 'migraine' },
        { label: '😶 Numbness', value: 'numbness' },
        { label: '🧠 Memory Issues', value: 'memory loss' },
      ],
      'specific_symptoms_gastro': [
        { label: '🤢 Stomach Pain', value: 'stomach pain' },
        { label: '🔥 Acidity', value: 'acidity' },
        { label: '😣 Constipation', value: 'constipation' },
        { label: '🤮 Nausea/Vomiting', value: 'nausea' },
        { label: '💨 Bloating', value: 'bloating' },
      ],
      'specific_symptoms_skin': [
        { label: '😤 Acne/Pimples', value: 'acne' },
        { label: '🔴 Skin Rash', value: 'skin rash' },
        { label: '😖 Itching', value: 'itching' },
        { label: '💇 Hair Loss', value: 'hair loss' },
        { label: '🩹 Skin Infection', value: 'skin infection' },
      ],
      'specific_symptoms_gynec': [
        { label: '🤰 Pregnancy Care', value: 'pregnancy care' },
        { label: '📅 Menstrual Issues', value: 'menstrual problems' },
        { label: '💊 PCOD/PCOS', value: 'pcod' },
        { label: '🩺 General Checkup', value: 'prenatal care' },
      ],
    };
    return optionsMap[categoryId] || [];
  };

  const handleMultiSelect = (option) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(option.value)) {
        return prev.filter((s) => s !== option.value);
      }
      return [...prev, option.value];
    });
  };

  const handleMultiSelectSubmit = () => {
    if (selectedSymptoms.length === 0) return;
    
    const labels = selectedSymptoms.join(', ');
    addUserMessage(labels);
    setUserResponses((prev) => ({ ...prev, symptoms: selectedSymptoms }));

    setTimeout(() => {
      addBotMessage(
        "How long have you been experiencing this?",
        {
          type: 'duration_select',
          id: 'duration'
        }
      );
      setCurrentStep('duration');
    }, 600);
  };

  // Free chat AI response
  const handleFreeChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQuery = inputText;
    addUserMessage(userQuery);
    setInputText('');
    setIsTyping(true);

    // Parse symptoms from user query
    const text = userQuery.toLowerCase();
    let matchedSymptoms = [];
    
    Object.keys(symptomSpecialityMap).forEach((symptom) => {
      if (text.includes(symptom) || symptom.split(' ').some((word) => word.length > 3 && text.includes(word))) {
        matchedSymptoms.push(symptom);
      }
    });

    // Determine speciality for doctor suggestion
    let suggestedSpeciality = 'General physician';
    if (matchedSymptoms.length > 0) {
      const specialityCounts = {};
      matchedSymptoms.forEach((symptom) => {
        const spec = symptomSpecialityMap[symptom];
        if (spec) {
          specialityCounts[spec] = (specialityCounts[spec] || 0) + 1;
        }
      });
      
      let maxCount = 0;
      Object.entries(specialityCounts).forEach(([spec, count]) => {
        if (count > maxCount) {
          maxCount = count;
          suggestedSpeciality = spec;
        }
      });
    }
    
    setSelectedSymptoms(matchedSymptoms);
    setRecommendedSpeciality(suggestedSpeciality);

    // Get available doctors for the speciality
    const availableDoctors = doctors.filter(
      (doc) => doc.speciality === suggestedSpeciality && doc.available !== false
    );
    const specInfo = quickDoctorFinder[suggestedSpeciality];

    // Try AI response first
    if (aiEnabled) {
      const aiResponse = await getAIResponse(
        userQuery, 
        matchedSymptoms.length > 0 ? matchedSymptoms : ['general health'],
        userResponses.severity || 'mild',
        userResponses.age || 'adult'
      );

      if (aiResponse) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: 'bot',
              text: aiResponse,
              step: { type: 'info' },
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
          
          // Show recommended doctor after AI response
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: 'bot',
                text: `${specInfo?.icon || '🩺'} **Recommended: Consult a ${suggestedSpeciality}**\n\n${specInfo?.whenToVisit || 'For proper diagnosis and treatment.'}`,
                step: {
                  type: 'doctor_list',
                  speciality: suggestedSpeciality,
                  doctors: availableDoctors.slice(0, 3),
                },
                timestamp: new Date(),
              },
            ]);
          }, 800);
        }, 500);
        return;
      }
    }

    // Fallback to keyword-based response with doctors
    if (matchedSymptoms.length > 0) {
      const tips = getLocalHealthTips(matchedSymptoms, 'mild');
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: `Based on what you described, here are some helpful tips:\n\n${tips.map(t => `• ${t}`).join('\n')}`,
            step: { type: 'info' },
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        
        // Show recommended doctor with available doctors
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: 'bot',
              text: `${specInfo?.icon || '🩺'} **Recommended: Consult a ${suggestedSpeciality}**\n\n${specInfo?.whenToVisit || 'For proper diagnosis and treatment.'}`,
              step: {
                type: 'doctor_list',
                speciality: suggestedSpeciality,
                doctors: availableDoctors.slice(0, 3),
              },
              timestamp: new Date(),
            },
          ]);
        }, 800);
      }, 500);
    } else {
      // No specific symptoms matched - recommend General Physician
      const generalDoctors = doctors.filter(
        (doc) => doc.speciality === 'General physician' && doc.available !== false
      );
      const generalInfo = quickDoctorFinder['General physician'];
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: "I understand you have a health concern. Here's my advice:\n\n• 💧 Stay hydrated and rest well\n• 📝 Keep track of your symptoms\n• 🏥 For any health concern, a General Physician is a good starting point",
            step: { type: 'info' },
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        
        // Show General Physician recommendation
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: 'bot',
              text: `${generalInfo?.icon || '🩺'} **Recommended: Consult a General Physician**\n\n${generalInfo?.whenToVisit || 'For general health issues and initial consultation.'}`,
              step: {
                type: 'doctor_list',
                speciality: 'General physician',
                doctors: generalDoctors.slice(0, 3),
              },
              timestamp: new Date(),
            },
          ]);
        }, 800);
      }, 500);
    }
  };

  const generateAIAnalysis = async () => {
    const severity = userResponses.severity;
    const duration = userResponses.duration;
    const isSerious = isConditionSerious(selectedSymptoms, severity, duration);

    // Determine speciality
    let speciality = 'General physician';
    
    if (userResponses.age === 'child') {
      speciality = 'Pediatricians';
    } else {
      const specialityCounts = {};
      selectedSymptoms.forEach((symptom) => {
        const spec = symptomSpecialityMap[symptom];
        if (spec) {
          specialityCounts[spec] = (specialityCounts[spec] || 0) + 1;
        }
      });

      let maxCount = 0;
      Object.entries(specialityCounts).forEach(([spec, count]) => {
        if (count > maxCount) {
          maxCount = count;
          speciality = spec;
        }
      });
    }

    setRecommendedSpeciality(speciality);
    const specInfo = quickDoctorFinder[speciality];

    // For severe/serious conditions, recommend doctor immediately
    if (isSerious) {
      const availableDoctors = doctors.filter(
        (doc) => doc.speciality === speciality && doc.available !== false
      );

      setTimeout(() => {
        addBotMessage(
          `⚠️ Based on your symptoms (${severity} severity), I strongly recommend consulting a **${speciality}** soon.\n\n` +
          `${specInfo?.icon || '🩺'} ${specInfo?.whenToVisit || ''}\n\n` +
          `While waiting for your appointment:\n` +
          `• Rest and stay hydrated\n` +
          `• Monitor your symptoms\n` +
          `• Seek emergency care if symptoms worsen`,
          { type: 'info' }
        );

        setTimeout(() => {
          if (availableDoctors.length > 0) {
            addBotMessage(
              `🩺 We have **${availableDoctors.length} ${speciality}${availableDoctors.length > 1 ? 's' : ''}** available:`,
              {
                type: 'doctor_list',
                speciality,
                doctors: availableDoctors.slice(0, 3),
              }
            );
          }
          setCurrentStep('doctor_shown');
        }, 1000);
      }, 800);
      return;
    }

    // For mild conditions, provide advice first
    setIsTyping(true);

    let aiAdvice = null;
    if (aiEnabled) {
      aiAdvice = await getAIResponse(
        `I have ${selectedSymptoms.join(', ')} symptoms that are ${severity} in severity and started ${duration}. What home remedies or self-care can help?`,
        selectedSymptoms,
        severity,
        userResponses.age
      );
    }

    const localTips = getLocalHealthTips(selectedSymptoms, severity);
    const advice = aiAdvice || localTips.map(t => `• ${t}`).join('\n');

    const availableDoctors = doctors.filter(
      (doc) => doc.speciality === speciality && doc.available !== false
    );

    setTimeout(() => {
      addBotMessage(
        `✨ **Health Advice for Your Symptoms**\n\n${advice}\n\n` +
        `---\n` +
        `💡 These tips should help with mild symptoms. Monitor your condition over the next 24-48 hours.`,
        { type: 'info' }
      );
      
      setTimeout(() => {
        addBotMessage(
          `If symptoms persist or worsen, you should consult a **${speciality}**.\n\n` +
          `${specInfo?.icon || '🩺'} ${specInfo?.whenToVisit || ''}`,
          {
            type: 'doctor_list',
            speciality,
            doctors: availableDoctors.slice(0, 3),
          }
        );
        setCurrentStep('advice_given');
      }, 1500);
    }, 800);
  };

  const handleBookDoctor = (docId) => {
    setIsOpen(false);
    navigate(`/appointment/${docId}`);
  };

  const handleViewAllDoctors = (spec = null) => {
    setIsOpen(false);
    navigate(`/doctors/${spec || recommendedSpeciality}`);
  };

  const handleFindDoctor = () => {
    if (recommendedSpeciality) {
      handleViewAllDoctors(recommendedSpeciality);
    } else {
      setIsOpen(false);
      navigate('/doctors');
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep('greeting');
    setUserResponses({});
    setSelectedSymptoms([]);
    setRecommendedSpeciality(null);
    setChatMode('guided');
    setShowDoctorOption(false);
    setTimeout(() => startChat(), 100);
  };

  const renderOptions = (step) => {
    if (!step) return null;

    // Mode selection buttons
    if (step.type === 'mode_selection') {
      return (
        <div className="flex flex-col gap-2 mt-3 animate-fadeIn">
          <button
            onClick={() => handleModeSelect('chat')}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 
                       hover:from-blue-100 hover:to-indigo-100 
                       text-gray-700 rounded-xl text-sm font-medium text-left
                       border border-blue-200 hover:border-blue-300
                       transition-all duration-200 hover:shadow-md flex items-center gap-3"
          >
            <span className="text-xl">💬</span>
            <div>
              <div className="font-semibold">Chat about my symptoms</div>
              <div className="text-xs text-gray-500">Get advice & doctor recommendations</div>
            </div>
          </button>
          <button
            onClick={() => handleModeSelect('find_doctor')}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 
                       hover:from-green-100 hover:to-emerald-100 
                       text-gray-700 rounded-xl text-sm font-medium text-left
                       border border-green-200 hover:border-green-300
                       transition-all duration-200 hover:shadow-md flex items-center gap-3"
          >
            <span className="text-xl">👨‍⚕️</span>
            <div>
              <div className="font-semibold">Find a doctor directly</div>
              <div className="text-xs text-gray-500">Quick specialist recommendation</div>
            </div>
          </button>
          <button
            onClick={() => handleModeSelect('health_tips')}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 
                       hover:from-purple-100 hover:to-pink-100 
                       text-gray-700 rounded-xl text-sm font-medium text-left
                       border border-purple-200 hover:border-purple-300
                       transition-all duration-200 hover:shadow-md flex items-center gap-3"
          >
            <span className="text-xl">📋</span>
            <div>
              <div className="font-semibold">Get health tips</div>
              <div className="text-xs text-gray-500">General wellness advice</div>
            </div>
          </button>
        </div>
      );
    }

    // Quick speciality selection
    if (step.type === 'quick_speciality_select') {
      return (
        <div className="mt-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(quickDoctorFinder).map(([speciality, info]) => (
              <button
                key={speciality}
                onClick={() => handleQuickSpecialitySelect(speciality)}
                className="px-3 py-3 bg-white rounded-xl text-left
                           border border-gray-200 hover:border-blue-300
                           transition-all duration-200 hover:shadow-md
                           transform hover:scale-[1.02]"
              >
                <div className="text-2xl mb-1">{info.icon}</div>
                <div className="text-xs font-semibold text-gray-800 leading-tight">{speciality}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-tight line-clamp-2">{info.description}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            💡 Select the area that matches your concern
          </p>
        </div>
      );
    }

    // Age selection
    if (step.type === 'age_selection') {
      const ageOptions = [
        { label: '👶 Child (0-12 years)', value: 'child' },
        { label: '🧑 Adult (13-59 years)', value: 'adult' },
        { label: '👴 Senior (60+ years)', value: 'senior' },
      ];
      return (
        <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
          {ageOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option, step.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                         hover:from-blue-100 hover:to-indigo-100 
                         text-gray-700 rounded-full text-sm font-medium
                         border border-blue-200 hover:border-blue-300
                         transition-all duration-200 hover:shadow-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }

    // Symptom category selection
    if (step.type === 'symptom_category') {
      const categoryOptions = [
        { label: '🤒 General Health', value: 'general' },
        { label: '🧠 Head & Nerves', value: 'neuro' },
        { label: '🫃 Stomach', value: 'gastro' },
        { label: '🩹 Skin & Hair', value: 'skin' },
        { label: '👩‍⚕️ Women\'s Health', value: 'gynec' },
        { label: '💬 Free Chat', value: 'free_chat' },
      ];
      return (
        <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
          {categoryOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option, step.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                         hover:from-blue-100 hover:to-indigo-100 
                         text-gray-700 rounded-full text-sm font-medium
                         border border-blue-200 hover:border-blue-300
                         transition-all duration-200 hover:shadow-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }

    // Multi-choice symptoms
    if (step.type === 'multi_choice') {
      const options = step.options || getSymptomOptionsForCategory(step.id);
      return (
        <div className="mt-3 animate-fadeIn">
          <div className="flex flex-wrap gap-2">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleMultiSelect(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium
                           border transition-all duration-200
                           ${selectedSymptoms.includes(option.value)
                             ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                             : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                           }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedSymptoms.length > 0 && (
            <button
              onClick={handleMultiSelectSubmit}
              className="mt-3 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 
                         text-white rounded-full text-sm font-semibold
                         hover:from-blue-600 hover:to-indigo-600
                         transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Continue →
            </button>
          )}
        </div>
      );
    }

    // Duration selection
    if (step.type === 'duration_select') {
      const durationOptions = [
        { label: '📅 Just started (1-2 days)', value: 'recent' },
        { label: '📆 Few days (3-7 days)', value: 'few_days' },
        { label: '🗓️ More than a week', value: 'week_plus' },
        { label: '📌 Chronic/Recurring', value: 'chronic' },
      ];
      return (
        <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
          {durationOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option, step.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                         hover:from-blue-100 hover:to-indigo-100 
                         text-gray-700 rounded-full text-sm font-medium
                         border border-blue-200 hover:border-blue-300
                         transition-all duration-200 hover:shadow-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }

    // Severity selection
    if (step.type === 'severity_select') {
      const severityOptions = [
        { label: '😊 Mild - Manageable', value: 'mild' },
        { label: '😐 Moderate - Uncomfortable', value: 'moderate' },
        { label: '😰 Severe - Need help soon', value: 'severe' },
      ];
      return (
        <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
          {severityOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option, step.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                         hover:from-blue-100 hover:to-indigo-100 
                         text-gray-700 rounded-full text-sm font-medium
                         border border-blue-200 hover:border-blue-300
                         transition-all duration-200 hover:shadow-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }

    // Doctor list
    if (step.type === 'doctor_list') {
      return (
        <div className="mt-4 space-y-3 animate-fadeIn">
          {step.doctors && step.doctors.length > 0 && (
            <>
              {step.doctors.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl 
                             border border-gray-200 hover:border-blue-300 
                             hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleBookDoctor(doc._id)}
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.experience} exp • ${doc.fees}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-500 text-white text-xs 
                                     rounded-full font-medium hover:bg-blue-600
                                     transition-colors whitespace-nowrap">
                    Book Now
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleViewAllDoctors(step.speciality)}
                className="w-full py-2 text-blue-600 text-sm font-medium 
                           hover:text-blue-700 transition-colors"
              >
                View All {step.speciality}s →
              </button>
            </>
          )}
          <button
            onClick={resetChat}
            className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 
                       transition-colors flex items-center justify-center gap-2"
          >
            🔄 Start New Consultation
          </button>
        </div>
      );
    }

    // No doctors available
    if (step.type === 'no_doctors') {
      return (
        <div className="mt-4 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleViewAllDoctors('')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-full 
                       text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Browse All Doctors
          </button>
          <button
            onClick={resetChat}
            className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 
                       transition-colors"
          >
            🔄 Start Over
          </button>
        </div>
      );
    }

    // AI chat options
    if (step.type === 'ai_chat') {
      return (
        <div className="mt-3 animate-fadeIn">
          {showDoctorOption && (
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={handleFindDoctor}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500
                           text-white rounded-full text-sm font-medium
                           hover:from-green-600 hover:to-emerald-600
                           transition-all shadow-md"
              >
                👨‍⚕️ Find a Doctor
              </button>
              <button
                onClick={resetChat}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm
                           hover:bg-gray-200 transition-colors"
              >
                🔄 Start Over
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full 
                    bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600
                    text-white shadow-2xl z-50 
                    flex items-center justify-center
                    transition-all duration-300 hover:scale-110
                    ${isOpen ? 'rotate-0' : 'animate-bounce-gentle'}
                    hover:shadow-blue-500/50`}
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
        }}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {aiEnabled && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-48px)] 
                     bg-white rounded-2xl shadow-2xl z-50 
                     flex flex-col overflow-hidden animate-slideUp
                     border border-gray-200"
          style={{
            height: '600px',
            maxHeight: 'calc(100vh - 140px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 
                          text-white px-5 py-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm 
                            flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg flex items-center gap-2">
                Health Assistant
                {aiEnabled && (
                  <span className="text-xs bg-green-400/30 px-2 py-0.5 rounded-full">
                    ✨ AI
                  </span>
                )}
              </h3>
              <p className="text-blue-100 text-xs">
                {isTyping ? '● Typing...' : '● Online - Ready to help'}
              </p>
            </div>
            <button
              onClick={resetChat}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Restart Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 
                              ${msg.type === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 shadow-md border border-gray-100 rounded-bl-md'
                              }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                  {msg.type === 'bot' && msg.step && idx === messages.length - 1 && (
                    renderOptions(msg.step)
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-gray-100">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                          style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                          style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                          style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Input - Show for free chat */}
          {(currentStep === 'free_chat' || chatMode === 'free') && (
            <form 
              onSubmit={handleFreeChatSubmit} 
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything about health..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full 
                             focus:outline-none focus:border-blue-500 focus:ring-2 
                             focus:ring-blue-500/20 text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 
                             text-white rounded-full font-medium
                             hover:from-blue-600 hover:to-indigo-600
                             transition-all shadow-md hover:shadow-lg
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              {aiEnabled 
                ? '🤖 AI-powered • Not a substitute for medical advice'
                : '💡 General guidance • Always consult a doctor'
              }
            </p>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default SymptomBot;
