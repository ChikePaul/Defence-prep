import { StudentProfile } from "../types/siwes";

export const SAMPLE_PROFILES: { id: string; label: string; tag: string; profile: StudentProfile }[] = [
  {
    id: "civil-gkg-flourmills",
    label: "Civil Engineering & Infrastructure (GKG / Flour Mills)",
    tag: "Civil Engineering - 400L FUTO",
    profile: {
      studentName: "Chikezie Tochukwu Paul",
      matricNo: "20221317493",
      institution: "Federal University of Technology Owerri (FUTO)",
      faculty: "School of Engineering and Engineering Technology (SEET)",
      department: "Department of Civil Engineering",
      level: "400 Level (B. Tech)",
      companyName: "GKG Construction Limited / Flour Mills of Nigeria Plc",
      companyAddress: "Flour Mills, Wharf, Apapa Port Axis, Lagos State",
      unitAttached: "Structural Engineering Department & Site Store Administration",
      duration: "6 Months (April 16 to September 30, 2026)",
      industrySupervisor: "Engr. Stanley Onyeukwu (Site Supervisor & Safety Officer)",
      technologies: [
        "Theodolite & Leveling Staff",
        "Bar Bending Schedule (BBS in MS Excel)",
        "Bill of Quantities (BOQ)",
        "Concrete Mix Ratio (1:2:4)",
        "Poker Vibrator & Plate Compactor",
        "Pneumatic Rotary Hammer Drill",
        "Work at Height & General Work Permits",
        "Arc Welding & Steel Fabrication",
        "Scissor Lift (DFLIFT GTJZ12)",
        "Center Lathe (PROMASTER 24120)",
        "Laser Level & Spirit Level",
        "ANPR Cameras & Automated Arm Barriers"
      ],
      logbookSummary: `
WEEK 1-4 (APRIL): Site safety induction, General Work Permit and Work at Height permit regulations under Flour Mills of Nigeria safety code. Assigned to Storekeeper duties recording site tools, consumables (paint, brushes), and safety PPE. Assisted with theodolite spot heighting at the Jetty Building and West Mill to establish reduced levels and benchmarks.
WEEK 5-8 (MAY): Footing rehabilitation works inside the warehouse. Used pneumatic cordless rotary hammer drill and sledgehammers to break out defective, spalling, and honeycombed concrete down to sound aggregate. Cleaned corroded reinforcement bars, applied precast 25mm concrete spacer blocks, tied new Y12 steel with binding wire, and recasted column bases.
WEEK 9-12 (JUNE): Bar Bending Schedule (BBS) and Bill of Quantities (BOQ) preparation under Engr. Charles (WNM Ltd). Modeled cutting lengths, bend allowances, hook extensions, and shape IDs (001 to 007) in MS Excel for FRP connecting beams and Quay Wall beams. Calculated total steel tonnage for site iron benders (Mr. Mannaseh).
WEEK 13-16 (JULY): Rigid pavement construction for the Access Control Point truck lane. Checked formwork level using spirit level. Arranged Y12 main reinforcement mesh at 150mm centers and Y10 distribution bars at 200mm centers over compacted sub-base. Supervised concrete casting from ready-mix delivery trucks using a 1:2:4 mix ratio, poker vibrators to expel entrapped air, and power trowel (concrete helicopter) finishing.
WEEK 17-20 (AUGUST): Construction of automated Access Control Point infrastructure. Prepared foundation trenches for ANPR (Automatic Number Plate Recognition) camera posts, traffic lights, and retractable arm barriers. Fabricated and welded a 10-meter roller foldable gate in the site workshop using electric arc welding, angle grinder, and horizontal band saw. Applied zinc chromate primer and protective paint.
WEEK 21-24 (SEPTEMBER): CNG Plants project retaining wall and footing foundation setting out. Used theodolite, pegs, and line-plumb to mark wall alignments. Supervised excavation to 3m depth. Tied vertical Y20 earth-face tension bars and Y16 front-face distribution bars. Conducted pre-work safety PET talks with masons and laborers. Collated final technical report for submission to FUTO Civil Engineering Department.
      `.trim(),
      reportSummary: `
CHAPTER ONE: INTRODUCTION TO SIWES (STANDALONE CHAPTER)
1.1 Background: Established by the Industrial Training Fund (ITF) in 1973 under Decree No. 47 of 1971 to bridge theoretical classroom engineering with industrial field reality.
1.2 Bodies Involved: Federal Government, ITF, National Universities Commission (NUC), Tertiary Institutions (FUTO), and Host Employers.
1.3 Aims & Objectives: Exposing students to industrial machinery, work ethics, bridging knowledge gaps.
1.4 Relevance to Civil Engineering: Translating Structural Analysis, Concrete Technology, and Surveying into real construction site execution.

CHAPTER TWO: COMPANY PROFILE & ORGANOGRAM (GKG CONSTRUCTION LIMITED)
2.1 History: Founded in 2017 operating within the Flour Mills Apapa Wharf corridor.
2.3 Services: Civil infrastructure, road construction, rigid pavements, renovation, steel fabrication.
2.6 Organogram: Managing Director (Engr. Gopal Gopalanine) -> Chief Engineer (Engr. Joseph Omane) -> Project Manager (Engr. Jacob Hwere) & Admin Manager (Engr. Peace Oko) -> Site Manager (Engr. Peter Hensaul) -> Site Supervisor & HSE Officer (Engr. Stanley Onyeukwu) -> Sectional Supervisors -> Foremen & Craftsmen (Iron Bender: Mr. Mannaseh, Carpenter: Mr. Innocent, Masons: Alhaji Sule, Store: Alex Nkana).

CHAPTER THREE: TECHNICAL WORK CARRIED OUT (CORE HEART OF REPORT - 80%+ DEFENSE SOURCE)
3.1 Quantity Documentation: Bill of Quantities (BOQ) preparation from structural drawings.
3.2 Bar Bending Schedules (BBS): Cutting length formula, bend allowances, hook extensions, shape IDs (001-007), FRP connecting beams, and Quay Wall beams in Excel.
3.3 Surveying & Setting Out: Theodolite reduced levels, benchmarks, laser leveling (Fig 8), line and plumb (Fig 10), and foundation pegging.
3.4 Concrete Works & Structural Rehabilitation:
    - Warehouse footing rehabilitation (Figs 11-14): Breaking out spalling concrete with rotary hammer, cleaning steel, 25mm spacer cover, recasting.
    - Rigid pavement construction (Figs 15-19): Sub-grade compaction, Y12@150mm & Y10@200mm steel mat, 1:2:4 concrete mix ratio, ready-mix truck, poker vibrator, power trowel.
3.5 Maintenance & Protective Works: Painting warehouse bollards (yellow/black oil paint) and external walls (Figs 24, 25).
3.6 Safety & HSE Protocols: Work at Height Permit, General Work Permit (Fig 26), Toolbox PET talks (Fig 28), PPE compliance.
3.7 Workshop Steel Fabrication: Measuring, cutting with angle grinder, electric arc welding of 10m roller foldable gate.
3.8 Dedicated Projects: Warehouse Maintenance, Access Control Point (ANPR cameras & arm barriers), Jetty Building Rehabilitation (Y20 berthing tension bars), CNG Plants Retaining Wall (Y20 earth face, Y16 front face).
3.9 Heavy Machinery & Equipment: Center lathe (PROMASTER 24120), horizontal band saw, pillar drill, scissor lift (DFLIFT GTJZ12), telescopic boom lift, Zoomlion forklift, Bobcat skid-steer loader.

CHAPTER FOUR: SPECIALIZED EQUIPMENT & EXPERIENCE GAINED
- Operating principles of concrete vibrators, rotary hammer drills, and survey leveling staff.
- Core skills: Surveying & setting out, Excel BBS calculation, concrete quality assurance, steel fabrication, and workplace safety administration.

CHAPTER FIVE: PROBLEMS ENCOUNTERED, CONCLUSION & RECOMMENDATIONS
- Challenges: Language barriers with site masons (not understanding English/Pidgin), occupational exposure to cement dust and welding fumes, heavy rain disruptions, and inadequate measuring instruments.
- Recommendations to Host Firm: Provide dust respirators and formal safety training.
- Recommendations to Institution (FUTO): Organize pre-attachment orientation on reading working construction drawings.
- Recommendations to ITF: Increase student monthly allowance and ensure prompt coordinator inspection visits.
      `.trim(),
    },
  },
  {
    id: "cs-fintech",
    label: "Software Eng & Cloud (PayDirect FinTech)",
    tag: "Computer Science - 400L UNILAG",
    profile: {
      studentName: "Elvis Okafor",
      matricNo: "190408044",
      institution: "University of Lagos (UNILAG)",
      faculty: "Faculty of Science",
      department: "Department of Computer Sciences",
      level: "400 Level (Penultimate Year)",
      companyName: "PayDirect Africa Technologies Ltd",
      companyAddress: "Plot 12, Adeola Odeku Street, Victoria Island, Lagos State",
      unitAttached: "Backend Engineering & Core Infrastructure Unit",
      duration: "6 Months (24 Weeks)",
      industrySupervisor: "Engr. Tunde Adeleke (Principal Systems Architect)",
      technologies: [
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "Redis Cache",
        "Docker",
        "RabbitMQ",
        "REST APIs",
        "Git/GitHub",
        "Linux CLI",
        "Postman"
      ],
      logbookSummary: `
WEEK 1-4: Company orientation, IT security protocol compliance, development environment workstation setup (Ubuntu 22.04 LTS, Docker Engine, PostgreSQL 15, VS Code). Studied company coding guidelines and Git branching workflows (GitFlow).
WEEK 5-8: Assigned to Payment Gateway Reconciliation team. Identified issues with duplicated webhook callbacks. Implemented idempotent request handling using Redis key-value storage with TTL expiry. Wrote automated unit tests in Jest.
WEEK 9-12: Database query optimization. Analyzed slow SQL queries in the merchant settlement ledger. Designed composite B-Tree indexes on settlement_date and merchant_id, reducing table scan latency from 1.4s to 85ms on a 2.3-million row database.
WEEK 13-16: Microservices containerization. Authored multi-stage Dockerfiles for the notification dispatch service. Configured Docker Compose environments for local staging and isolated test runs.
WEEK 17-20: Integrated RabbitMQ asynchronous message queues for transactional SMS and email alert broadcasting to prevent blocking client checkout requests.
WEEK 21-24: System monitoring and bug resolution. Monitored server CPU and memory usage using Grafana and Prometheus. Assisted in debugging memory leaks in Node.js event listeners. Final report collation and presentation to Head of Engineering.
      `.trim(),
      reportSummary: `
CHAPTER 1: INTRODUCTION TO SIWES (STANDALONE)
- Background of SIWES in Nigeria (ITF Decree 47 of 1971).
- Statutory tripartite roles of ITF, NUC, and participating tech employers.

CHAPTER 2: COMPANY PROFILE & ORGANOGRAM
- PayDirect Africa Technologies Ltd: CBN-licensed payment gateway.
- Organogram: Board -> CEO -> CTO -> Engineering Manager -> Architects -> Software Engineers -> Interns.

CHAPTER 3: TECHNICAL ACTIVITIES EXECUTED (CORE HEART OF REPORT)
3.1 Merchant settlement transaction architecture.
3.2 Idempotency keys implementation with Redis atomic locks to prevent double-charging.
3.3 Relational database normalization (3NF) & composite B-Tree indexing.
3.4 Asynchronous webhook dispatch queues with RabbitMQ.
3.5 Docker containerization with multi-stage builds.

CHAPTER 4: SPECIALIZED TOOLS & SKILLS
- Advanced debugging of Node.js event-loop blockages and memory leaks.
- API testing with Postman collections and automated Jest suites.

CHAPTER 5: CHALLENGES & RECOMMENDATIONS
- Challenges: Uncaught asynchronous Promise rejections; corporate VPN latency.
- Recommendations to ITF: Fund developer certification subsidies for top SIWES interns.
      `.trim(),
    },
  },
  {
    id: "ce-telecom",
    label: "Network Infrastructure & NOC (BroadBand ISP)",
    tag: "Computer Engineering - 400L ABU",
    profile: {
      studentName: "Aisha Mohammed",
      matricNo: "U18/ENG/COE/1042",
      institution: "Ahmadu Bello University (ABU), Zaria",
      faculty: "Faculty of Engineering",
      department: "Department of Computer Engineering",
      level: "400 Level",
      companyName: "BroadBand Wireless & Fiber ISP Ltd",
      companyAddress: "Plot 842, Central Business District, Abuja, FCT",
      unitAttached: "Core Network Operations Centre (NOC) & IP Routing",
      duration: "6 Months (24 Weeks)",
      industrySupervisor: "Engr. Kabir Sanusi (NOC Lead & Senior Network Engineer)",
      technologies: [
        "Cisco Catalyst 2960/3850",
        "Cisco 2911 ISR",
        "OSPF Protocol",
        "VLANs & 802.1Q",
        "Wireshark",
        "Fiber Optic Fusion Splicer",
        "OTDR",
        "Subnetting (VLSM)",
        "MikroTik RouterOS",
        "PuTTY / SSH"
      ],
      logbookSummary: `
WEEK 1-4: Introduction to enterprise telecommunications architecture. Learned Ethernet cable termination (T-568A and T-568B pinouts), rack cable management, patch panel punchdown using Krone tool, and switch port labeling.
WEEK 5-8: Basic Cisco IOS configuration via console cable and PuTTY. Configured management IP addresses, banners, SSH v2, and privilege EXEC passwords on access layer switches.
WEEK 9-12: Virtual Local Area Network (VLAN) design and implementation. Configured IEEE 802.1Q trunking and Inter-VLAN routing (Router-on-a-stick) to segment corporate voice and data traffic.
WEEK 13-16: Dynamic Routing protocols. Configured Single-Area Open Shortest Path First (OSPF v2) across core routers. Calculated wildcard masks, verified neighbor adjacencies, and analyzed routing table convergence.
WEEK 17-20: Fiber Optics field work. Conducted single-mode optical fiber core splicing using Fujikura Arc Fusion Splicer. Measured optical power loss using Optical Time Domain Reflectometer (OTDR) and light source meter.
WEEK 21-24: NOC live incident management. Captured and analyzed packet drops using Wireshark. Resolved DHCP starvation and ARP poisoning alerts using Port Security and DHCP Snooping.
      `.trim(),
      reportSummary: `
CHAPTER 1: INTRODUCTION TO SIWES
- History of ITF and statutory SIWES mandate for telecommunication engineering.

CHAPTER 2: COMPANY OVERVIEW & HIERARCHY
- NCC-licensed Tier-2 ISP infrastructure and Core NOC organogram.

CHAPTER 3: TECHNICAL ACTIVITIES & IMPLEMENTATIONS (CORE HEART)
- VLSM mathematical subnetting (/24 to /29).
- Single-Area OSPF metric calculation and LSA exchange.
- Fiber optical attenuation reduction (<0.02dB per splice).

CHAPTER 4: NETWORK HARDWARE & SKILLS
- Cisco Catalyst switches, OTDR trace interpretation, Wireshark TCP stream analysis.

CHAPTER 5: BOTTLENECKS & RECOMMENDATIONS
- Challenges: Accidental fiber cuts during road construction; SLA penalties.
- Recommendations to ITF & NCC: Sponsor CCNA / MikroTik exam vouchers.
      `.trim(),
    },
  },
  {
    id: "eee-automation",
    label: "Industrial Automation & Power (Refinery)",
    tag: "Electrical/Electronic Eng - 400L FUTA",
    profile: {
      studentName: "Emmanuel Adeleke",
      matricNo: "EEE/18/3920",
      institution: "Federal University of Technology, Akure (FUTA)",
      faculty: "School of Engineering & Engineering Technology",
      department: "Department of Electrical and Electronics Engineering",
      level: "400 Level",
      companyName: "West African Manufacturing & Sugar Refinery Plc",
      companyAddress: "Industrial Estate, Ikeja / Apapa Port Corridor, Lagos",
      unitAttached: "Instrumentation, Control & Electrical Maintenance Dept",
      duration: "6 Months (24 Weeks)",
      industrySupervisor: "Engr. Michael Ibe (Senior Instrumentation Engineer)",
      technologies: [
        "Siemens S7-1200 PLC",
        "TIA Portal V16",
        "Ladder Logic (LAD)",
        "SCADA (WinCC)",
        "Variable Frequency Drives (VFD)",
        "3-Phase Induction Motors",
        "Megger Insulation Tester",
        "4-20mA Transmitters",
        "Lockout-Tagout (LOTO)"
      ],
      logbookSummary: `
WEEK 1-4: Plant safety induction, strictly adhering to Lockout/Tagout (LOTO) protocols, PPE requirements (steel-toe boots, flame-retardant coveralls, safety goggles). Studied plant Single Line Diagrams (SLD) and electrical sub-stations.
WEEK 5-8: Motor control circuit wiring. Wired and tested Direct-On-Line (DOL) and Star-Delta (Wye-Delta) starter panels with thermal overload relays and contactors for 15kW 3-phase induction motors.
WEEK 9-12: Troubleshooting sensory instrumentation. Calibrated 4-20mA pressure and temperature transmitters. Diagnosed open-circuit and zero-offset drift errors in RTD PT100 sensors.
WEEK 13-16: Siemens PLC programming. Used Siemens TIA Portal V16 to write Ladder Logic routines for automated bottle conveyor filling and sorting lines, incorporating timer (TON/TOF) and counter (CTU) blocks.
WEEK 17-20: Variable Frequency Drive (VFD) installation. Configured Danfoss VLT AutomationDrive parameters (ramp-up time, maximum frequency, digital input speed presets) for sugar centrifugal pumps.
WEEK 21-24: Preventive maintenance. Measured motor winding insulation resistance using 1000V Megger tester. Cleaned motor terminal boxes, replaced worn carbon brushes, and compiled weekly maintenance logs.
      `.trim(),
      reportSummary: `
CHAPTER 1: INTRODUCTION TO SIWES IN ENGINEERING
- 1973 ITF establishment and relevance to heavy electrical machinery operations.

CHAPTER 2: INDUSTRIAL REFINERY ENVIRONMENT
- Single Line Diagrams (SLD) and Plant Maintenance Organogram.

CHAPTER 3: TECHNICAL PROCESSES & INSTRUMENTATION (CORE HEART)
- DOL and Star-Delta starter power and control wiring schematics.
- Ladder Logic PLC programming for sequential automated filling.
- Analog signal conditioning (4-20mA loop to 0-27648 words in Siemens S7-1200 CPU).
- VFD parameter tuning via PWM (Pulse Width Modulation).

CHAPTER 4: SAFETY EQUIPMENT & TOOLS
- Lockout/Tagout (LOTO) padlocks, 1000V Megger insulation tester, multimeter probes.

CHAPTER 5: CHALLENGES & RECOMMENDATIONS
- Challenges: Industrial motor single-phasing; electrical noise on sensor cables.
- Recommendations to University: Upgrade laboratory benches with industrial PLCs.
      `.trim(),
    },
  },
];
