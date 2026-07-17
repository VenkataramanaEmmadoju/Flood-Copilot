"use strict";

const alerts = [
  {
    id: "AL-2026-0714-01",
    title: "Godavari river crosses second warning level near Bhadrachalam",
    district: "Bhadradri Kothagudem",
    mandal: "Bhadrachalam",
    severity: "critical",
    source: "Central Water Commission (CWC)",
    sourceType: "CWC",
    publishedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    aiSummary:
      "Godavari at Bhadrachalam is at 51.2 ft, above the second warning mark (50 ft). Upstream inflows from Sabari and Pranahita continue to rise. Low-lying colonies in Bhadrachalam, Burgampadu, and Aswapuram face inundation within 6–10 hours.",
    instructions: [
      "Move immediately to designated relief camps or higher ground.",
      "Do not attempt to cross submerged roads or bridges.",
      "Keep phones charged and stay tuned to 1077 district helpline.",
      "Livestock owners should shift cattle to raised shelters.",
    ],
    details:
      "As per CWC bulletin, discharge at Perur upstream station reached 12.4 lakh cusecs. Godavari is expected to cross the third warning mark (53 ft) by evening if inflows sustain. NDRF teams have been deployed at Bhadrachalam, Dummugudem, and Cherla. All schools within 5 km of the river will remain closed.",
    river: "Godavari",
  },
  {
    id: "AL-2026-0714-02",
    title: "Very heavy rainfall warning for northern Telangana districts",
    district: "Adilabad",
    mandal: "Adilabad Urban",
    severity: "high",
    source: "India Meteorological Department (IMD) Hyderabad",
    sourceType: "IMD",
    publishedAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    aiSummary:
      "Adilabad, Kumurambheem Asifabad, Mancherial, and Nirmal likely to receive 115–204 mm rainfall in the next 24 hours. Localised flash floods and waterlogging expected in low-lying areas.",
    instructions: [
      "Avoid non-essential travel during nights and early morning.",
      "Farmers should not enter fields near streams and check dams.",
      "Fishermen along Kaddam and Sathnala reservoirs must stay off water.",
    ],
    details:
      "Nowcast indicates active monsoon trough with moisture feed from Bay of Bengal. Red colour warning is in effect till 08:30 IST tomorrow. Wind gusts of 40–50 kmph expected with intense spells of rain.",
    river: "Penganga",
  },
  {
    id: "AL-2026-0714-03",
    title: "Musi reservoir gates opened — downstream advisory",
    district: "Nalgonda",
    mandal: "Chityal",
    severity: "high",
    source: "Telangana State Disaster Management Authority (TSDMA)",
    sourceType: "TSDMA",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    aiSummary:
      "Six gates of Musi project lifted to 8 ft, releasing 42,000 cusecs. Villages along Musi in Chityal, Ramannapet, and Choutuppal mandals will see rising water in 4–6 hours.",
    instructions: [
      "Villagers within 500 m of Musi bank must evacuate to relief camps.",
      "Fisherfolk should not venture near the river until further notice.",
      "Panchayat secretaries to sound sirens every 30 minutes.",
    ],
    details:
      "Inflow to Musi has crossed 55,000 cusecs due to heavy rains in the catchment. Discharge will be regulated based on downstream conditions. Control room contact: 08682-232345.",
    river: "Musi",
  },
  {
    id: "AL-2026-0714-04",
    title: "Localised urban flooding warning for Hyderabad",
    district: "Hyderabad",
    mandal: "Hyderabad Central",
    severity: "moderate",
    source: "GHMC Enforcement Vigilance and Disaster Management (EVDM)",
    sourceType: "District",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    aiSummary:
      "Heavy showers expected in LB Nagar, Malakpet, Kukatpally, and Serilingampally zones. Waterlogging likely at 14 known hotspots.",
    instructions: [
      "Avoid Nagole–Uppal stretch and Balanagar underpass during peak rain.",
      "Two-wheeler riders should not enter waterlogged stretches.",
      "Report open manholes via GHMC 040-21111111.",
    ],
    details:
      "EVDM teams have been positioned at 62 hotspots with dewatering pumps. Metro Rail services remain normal. Citizens can track live updates on the GHMC Hyderabad app.",
  },
  {
    id: "AL-2026-0714-05",
    title: "Krishna river inflows rising at Srisailam",
    district: "Nagarkurnool",
    mandal: "Kollapur",
    severity: "moderate",
    source: "CWC Krishna Basin",
    sourceType: "CWC",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    aiSummary:
      "Srisailam reservoir inflows at 2.1 lakh cusecs. Water level at 878 ft against FRL 885 ft. No immediate downstream threat, but riverside villages should stay alert.",
    instructions: [
      "Boating and river crossings suspended in Kollapur and Amrabad.",
      "Tourists advised to avoid ghat road viewpoints.",
    ],
    details:
      "Upstream discharges from Almatti and Narayanpur are being monitored. Next bulletin at 08:00 IST.",
    river: "Krishna",
  },
  {
    id: "AL-2026-0714-06",
    title: "Flash flood advisory for Warangal rural streams",
    district: "Warangal",
    mandal: "Geesukonda",
    severity: "advisory",
    source: "IMD Nowcast",
    sourceType: "IMD",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    aiSummary:
      "Isolated thunderstorms with 50–70 mm rainfall likely in Geesukonda, Sangem, and Nekkonda mandals over next 3 hours. Small streams and vaagus may swell briefly.",
    instructions: [
      "Do not cross flowing streams on foot or by two-wheeler.",
      "Move parked vehicles away from stream beds and low bridges.",
    ],
    details:
      "Advisory issued based on Doppler radar returns from Shamshabad. Situation will be reassessed by 22:00 IST.",
  },
  {
    id: "AL-2026-0714-07",
    title: "NDRF pre-positioning in Mulugu and Bhupalpally",
    district: "Mulugu",
    mandal: "Eturnagaram",
    severity: "advisory",
    source: "NDRF 10th Battalion, Vijayawada",
    sourceType: "NDRF",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    aiSummary:
      "Two NDRF teams with inflatable boats and rescue gear stationed at Eturnagaram and Venkatapur as a precaution against Godavari tributary surges.",
    instructions: [
      "Village volunteers to coordinate with NDRF liaison officer.",
      "Keep list of vulnerable persons (elderly, PwD, pregnant women) ready.",
    ],
    details:
      "Teams equipped with satellite phones and medical kits. District Collector's office will coordinate any deployment requests.",
  },
];

module.exports = alerts;
