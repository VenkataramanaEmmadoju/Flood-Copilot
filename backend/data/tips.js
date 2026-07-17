"use strict";

const tips = [
  {
    id: "t001",
    category: "evacuation",
    priority: "critical",
    titleEn: "Move to Higher Ground Immediately",
    titleTe: "వెంటనే ఎత్తైన ప్రదేశానికి వెళ్ళండి",
    bodyEn:
      "Do not wait for official orders. If water is rising around your home, move to the nearest high ground or shelter immediately.",
    bodyTe:
      "అధికారిక ఆదేశాల కోసం వేచి ఉండకండి. మీ ఇంటి చుట్టూ నీరు పెరుగుతుంటే, వెంటనే సమీప ఎత్తైన ప్రదేశం లేదా శరణాలయానికి వెళ్ళండి.",
    icon: "alert-triangle",
  },
  {
    id: "t002",
    category: "safety",
    priority: "high",
    titleEn: "Do Not Walk Through Moving Water",
    titleTe: "ప్రవహించే నీటిలో నడవకండి",
    bodyEn:
      "Six inches of moving water can knock you down. If you must walk through water, use a stick to check depth ahead of you.",
    bodyTe:
      "ఆరు అంగుళాల ప్రవహించే నీరు మిమ్మల్ని పడగొట్టగలదు. మీరు నీటిలో నడవాల్సి వస్తే, ముందు లోతు తనిఖీ చేయడానికి కర్రను వాడండి.",
    icon: "waves",
  },
  {
    id: "t003",
    category: "electrical",
    priority: "high",
    titleEn: "Turn Off Electricity at the Main Switch",
    titleTe: "మెయిన్ స్విచ్ వద్ద విద్యుత్ ఆపివేయండి",
    bodyEn:
      "Before leaving or if water enters, switch off electricity at the main breaker. Never touch electrical equipment in flooded areas.",
    bodyTe:
      "వెళ్ళే ముందు లేదా నీరు వస్తే, మెయిన్ బ్రేకర్ వద్ద విద్యుత్ ఆపివేయండి. వరద ప్రాంతాలలో విద్యుత్ పరికరాలు ముట్టుకోకండి.",
    icon: "zap-off",
  },
  {
    id: "t004",
    category: "health",
    priority: "high",
    titleEn: "Drink Only Safe Water",
    titleTe: "సురక్షితమైన నీటిని మాత్రమే తాగండి",
    bodyEn:
      "Floodwater is contaminated. Drink only bottled water, boiled water, or water from trusted relief camps. Avoid well water after floods.",
    bodyTe:
      "వరద నీరు కలుషితమైనది. బాటిల్ నీరు, మరిగించిన నీరు లేదా విశ్వసనీయ శరణాలయాల నీటిని మాత్రమే తాగండి. వరదల తర్వాత బావి నీటిని నివారించండి.",
    icon: "droplets",
  },
  {
    id: "t005",
    category: "communication",
    priority: "medium",
    titleEn: "Save Battery — Use SMS Over Calls",
    titleTe: "బ్యాటరీ ఆదా చేయండి — కాల్‌లకు బదులుగా SMS వాడండి",
    bodyEn:
      "Text messages use less power and reach through congested networks. Keep calls short and essential only.",
    bodyTe:
      "SMS తక్కువ శక్తిని వినియోగిస్తుంది మరియు రద్దీ నెట్‌వర్క్‌ల ద్వారా చేరుతుంది. కాల్‌లు తక్కువగా మరియు అత్యవసరంగా మాత్రమే చేయండి.",
    icon: "message-square",
  },
  {
    id: "t006",
    category: "food",
    priority: "medium",
    titleEn: "Avoid Flood-Contaminated Food",
    titleTe: "వరద కలుషిత ఆహారాన్ని నివారించండి",
    bodyEn:
      "Discard any food that has come in contact with floodwater, including canned goods with damaged seals. Eat only food from official relief camps.",
    bodyTe:
      "వరద నీటితో సంబంధంలో వచ్చిన ఏ ఆహారాన్నైనా పాటించకండి. అధికారిక శరణాలయాల నుండి మాత్రమే ఆహారం తినండి.",
    icon: "utensils",
  },
  {
    id: "t007",
    category: "children",
    priority: "high",
    titleEn: "Keep Children Away from Floodwater",
    titleTe: "పిల్లలను వరద నీటికి దూరంగా ఉంచండి",
    bodyEn:
      "Children are especially vulnerable to waterborne diseases and drowning. Supervise them at all times near flood areas.",
    bodyTe:
      "పిల్లలు నీటిద్వారా వ్యాపించే వ్యాధులు మరియు మునకకు ప్రత్యేకంగా హాని కలిగించే వారు. వరద ప్రాంతాల సమీపంలో వారిని ఎల్లప్పుడూ పర్యవేక్షించండి.",
    icon: "shield",
  },
  {
    id: "t008",
    category: "animals",
    priority: "medium",
    titleEn: "Watch for Snakes and Insects",
    titleTe: "పాములు మరియు కీటకాలకు జాగ్రత్తగా ఉండండి",
    bodyEn:
      "Floods displace snakes and insects. Wear rubber boots and long clothing when moving through affected areas. Seek immediate medical help for bites.",
    bodyTe:
      "వరదలు పాములు మరియు కీటకాలను స్థానభ్రంశం చేస్తాయి. ప్రభావిత ప్రాంతాల గుండా వెళ్ళేటప్పుడు రబ్బరు బూట్లు మరియు పొడవైన దుస్తులు ధరించండి.",
    icon: "bug",
  },
];

module.exports = tips;
