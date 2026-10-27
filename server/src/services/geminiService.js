import { GoogleGenAI } from '@google/genai';
import { MysteryGenerationSchema } from '../schemas/caseValidation.js';
import { DIFFICULTY_CONFIG } from '../utils/scoring.js';

/**
 * Procedural fallback mystery generator when Gemini API is unconfigured or rate-limited.
 * Generates rich, logically sound cases according to difficulty specs.
 */
function generateProceduralMystery({ premise, difficulty, theme }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const safePremise = premise && premise.trim().length > 3
    ? premise.trim()
    : 'A priceless sapphire necklace vanishes from a locked penthouse safe during a storm';

  const settingPool = {
    easy: {
      setting: 'The Rosewood Conservatory at midnight',
      victim: 'Lord Reginald Sterling, a reclusive botanist',
      crimeScene: 'Private Glasshouse, Table 4, beside the rare Moonflower orchid',
      timeOfDeath: '11:15 PM, during the power surge',
      narrative: `During an exclusive midnight viewing of the glowing Moonflower orchid, Lord Reginald Sterling was found unconscious in his chair with symptoms of neurotoxin exposure. The glasshouse doors were locked from the inside, and only three guests held keycards. Clues scatter the damp stone floor, pointing to a dispute over his grandfather's botanical estate.`,
    },
    medium: {
      setting: 'The Neon Aegis Cybernetics Tower, 44th Floor Laboratory',
      victim: 'Dr. Evelyn Vance, Chief Bio-Neural Architect',
      crimeScene: 'Sub-Zero Server Vault, Terminal Alpha',
      timeOfDeath: '02:30 AM, precisely when the biometric grid rebooted',
      narrative: `At 02:45 AM, an automated security protocol detected an environmental breach in the cryogenic neural lab. Security found Dr. Evelyn Vance slumped over Terminal Alpha with her master encryption key missing and a lethal dose of pressurized aerosol anesthetic in the vent. The surveillance was wiped for 15 minutes, leaving only physical and electronic breadcrumbs across the research wing.`,
    },
    hard: {
      setting: 'The SS Valkyrie Arctic Expedition Vessel, 200 miles off Svalbard',
      victim: 'Commander Nikolai Petrov, Geothermal Survey Director',
      crimeScene: 'The Chart Room & Seismic Sonar Bay',
      timeOfDeath: 'Between 03:00 AM and 03:45 AM during the blizzard',
      narrative: `Stranded in the polar pack ice with communications severed by an antenna fracture, Commander Nikolai Petrov was found fatally bludgeoned with a brass sextant in the sealed Chart Room. The vessel's seismic core sample data—worth billions on the open commodities market—had been copied to an external rugged drive. Five senior crew members were on duty, each with conflicting accounts, secret grudges, and intricate timetables.`,
    },
  };

  const selectedSetting = settingPool[difficulty] || settingPool.medium;

  // Suspects per difficulty
  const suspectPools = {
    easy: [
      {
        id: 'suspect_1',
        name: 'Clara Oswald',
        role: 'Assistant Horticulturist',
        bio: 'Worked under Lord Sterling for five years. Rumored to have been denied co-authorship on his revolutionary paper.',
        alibi: 'Claims she was calibrating the humidity sprinkler valves in Greenhouse C from 11:00 PM to 11:30 PM.',
        motive: 'Furious about stolen intellectual property and facing financial ruin.',
      },
      {
        id: 'suspect_2',
        name: 'Julian Sterling',
        role: 'Estranged Nephew & Gambler',
        bio: 'Deep in debt to downtown bookmakers, Julian arrived uninvited demanding an advance on his inheritance.',
        alibi: 'States he was drinking scotch in the library and smoking on the west balcony.',
        motive: 'Desperately needed funds before sunrise to satisfy violent creditors.',
      },
      {
        id: 'suspect_3',
        name: 'Beatrice Langford',
        role: 'Estate Attorney',
        bio: 'Drafted Lord Sterling’s new will earlier that morning which removed several former beneficiaries.',
        alibi: 'Claims she was asleep in the guest annex after retiring at 10:30 PM.',
        motive: 'Allegations of embezzling trust funds were about to be revealed in the audit.',
      },
    ],
    medium: [
      {
        id: 'suspect_1',
        name: 'Jaxson Reed',
        role: 'Senior Hardware Engineer',
        bio: 'Designs the neural interfaces. Passed over twice for promotion in favor of outside consultants.',
        alibi: 'Logs show his access badge entered the 40th-floor cafeteria at 02:15 AM and left at 02:40 AM.',
        motive: 'Wanted to sell the prototype neural schematics to rival firm Omnicorp.',
      },
      {
        id: 'suspect_2',
        name: 'Dr. Mira Chen',
        role: 'Research Ethics Officer',
        bio: 'Threatened to whistleblow on unauthorized human neural trials scheduled for next week.',
        alibi: 'Claims she was reviewing ethics manifests in her office on Floor 42 with door locked.',
        motive: 'Discovered Dr. Vance had forged her signature on federal compliance affidavits.',
      },
      {
        id: 'suspect_3',
        name: 'Soren Frost',
        role: 'Corporate Security Lead',
        bio: 'Former intelligence operative who controls the internal biometric protocols and server key switches.',
        alibi: 'Claims he was conducting a physical perimeter patrol on Floor 1 after the alarm tripped.',
        motive: 'Was being audited by Vance for suspicious dark-web traffic through internal relays.',
      },
      {
        id: 'suspect_4',
        name: 'Valeria Ramos',
        role: 'Venture Capital Liaison',
        bio: 'Represents the syndicate funding the project. Facing a deadline to deliver functioning prototypes.',
        alibi: 'Stated she was on an overseas teleconference in the boardroom from 02:00 AM to 03:00 AM.',
        motive: 'Needed to secure the code before Vance could freeze the repo over moral objections.',
      },
    ],
    hard: [
      {
        id: 'suspect_1',
        name: 'Dr. Henrik Lind',
        role: 'Chief Geophysicist',
        bio: 'Believed the survey findings belonged to open scientific consensus rather than commercial sale.',
        alibi: 'Was monitoring seismic readouts in Lab B; witnessed by sensor telemetry until 03:15 AM.',
        motive: 'Fiercely opposed Petrov’s secret auction of exclusive Arctic drilling coordinates.',
      },
      {
        id: 'suspect_2',
        name: 'Elena Rostova',
        role: 'First Mate & Navigator',
        bio: 'Second-in-command with a dishonorable discharge from naval service on record.',
        alibi: 'Claims she was on the Bridge checking satellite radar sweeps throughout the watch.',
        motive: 'Petrov intended to submit a disciplinary report that would terminate her mariner license.',
      },
      {
        id: 'suspect_3',
        name: 'Klaus Fischer',
        role: 'Chief Marine Engineer',
        bio: 'Maintains engine turbines and ventilation. Deep knowledge of access tunnels and sub-decks.',
        alibi: 'Claims he was repairing an auxiliary generator in the Lower Engine room between 02:45 and 03:40 AM.',
        motive: 'Bribed by foreign resource consortium to retrieve the encrypted acoustic survey drive.',
      },
      {
        id: 'suspect_4',
        name: 'Dr. Sarah Connor',
        role: 'Expedition Medical Officer',
        bio: 'Responsible for crew wellness and prescription lockers. Highly perceptive and observant.',
        alibi: 'Claims she was in the Sickbay inventorying emergency supplies following the storm damage.',
        motive: 'Petrov had confiscated her personal research logs containing evidence of crew radiation poisoning.',
      },
      {
        id: 'suspect_5',
        name: 'Tariq Al-Mansoor',
        role: 'Communications & Sonar Specialist',
        bio: 'Operates the satellite links. The sole crew member with cryptographic keys to external relays.',
        alibi: 'Stated he was attempting to repair the damaged external microwave dish on the Upper Deck.',
        motive: 'Was promised a 20% commission on the data drive sale by an anonymous offshore broker.',
      },
    ],
  };

  // Clues per difficulty
  const cluePools = {
    easy: [
      {
        id: 'clue_1',
        title: 'Glasshouse Humidity Logbook',
        category: 'documentary',
        description: 'The automated sprinkler valves in Greenhouse C show no recorded adjustments between 11:00 PM and 11:30 PM, contradicting Clara’s claim of emergency calibration.',
      },
      {
        id: 'clue_2',
        title: 'Amber Glass Dropper Bottle',
        category: 'forensic',
        description: 'Found under the potting bench. Trace analysis reveals concentrated extract of Aconitum napellus (Monkshood), identical to the toxin found in the victim’s tea.',
      },
      {
        id: 'clue_3',
        title: 'Torn Botanical Garden Pass',
        category: 'physical',
        description: 'A badge lanyard found caught on the greenhouse exit latch, stained with traces of rare Moonflower pollen.',
      },
      {
        id: 'clue_4',
        title: 'Unsigned Will Draft',
        category: 'documentary',
        description: 'Beatrice Langford’s briefcase contains an unexecuted codicil bequeathing the entire botanical estate to the National Flora Trust, disinheriting both Clara and Julian.',
      },
      {
        id: 'clue_5',
        title: 'Muddy Footprint Near West Door',
        category: 'physical',
        description: 'A size 6 botanical work boot print in soil matching the potting shed compound. Clara wears size 6 work boots; Julian wears size 10 formal brogues.',
      },
    ],
    medium: [
      {
        id: 'clue_1',
        title: 'Ventilation Damper Override Log',
        category: 'forensic',
        description: 'Sub-Zero Server Vault damper 4B was manually overridden at 02:22 AM using Master Security credential #099—issued exclusively to Soren Frost.',
      },
      {
        id: 'clue_2',
        title: 'Thermal Imaging Snapshot',
        category: 'forensic',
        description: 'Camera 14 captures a silhouette exiting the server vault at 02:28 AM wearing a kevlar security tactical jacket with reflective shoulder piping.',
      },
      {
        id: 'clue_3',
        title: 'Encrypted USB Dump File',
        category: 'documentary',
        description: 'Found on an internal shared workstation. Contains Dr. Vance’s audit report highlighting missing surveillance drives and unauthorized external IP pings from security desk 1.',
      },
      {
        id: 'clue_4',
        title: 'Discarded Aerosol Cannister',
        category: 'physical',
        description: 'An empty pressurized cylinder of medical-grade Sevoflurane discovered in the 43rd-floor security locker garbage disposal.',
      },
      {
        id: 'clue_5',
        title: 'Boardroom Video Conference Log',
        category: 'testimony',
        description: 'Confirms Valeria Ramos was on active camera in the boardroom continuously from 02:00 AM to 03:00 AM, with 3 overseas directors testifying to her presence.',
      },
      {
        id: 'clue_6',
        title: 'Cafeteria Turnstile Timestamp',
        category: 'documentary',
        description: 'Jaxson Reed’s badge scan at 02:15 AM matches CCTV footage showing him eating a sandwich until 02:42 AM in full view of two janitors.',
      },
      {
        id: 'clue_7',
        title: 'Scratch on Soren Frost’s Wrist',
        category: 'physical',
        description: 'A fresh defensive scratch on Soren Frost’s right forearm consistent with the sharp corner of Dr. Vance’s heavy silver ring.',
      },
    ],
    hard: [
      {
        id: 'clue_1',
        title: 'Chart Room Biometric Lock Audit',
        category: 'forensic',
        description: 'The magnetic deadbolt was disengaged at 03:12 AM using the emergency bypass tool kept in the Chief Marine Engineer’s locked toolbox.',
      },
      {
        id: 'clue_2',
        title: 'Sextant Forensic Residue',
        category: 'physical',
        description: 'The murder weapon—a heavy brass naval sextant—bears trace lubricant identifiable as LubriPlate 130-A, used only on the lower turbine reduction gears.',
      },
      {
        id: 'clue_3',
        title: 'Snow-Stained Thermal Coveralls',
        category: 'physical',
        description: 'Coveralls marked "K. Fischer" found in dryer #2 with faint traces of Commander Petrov’s blood type (O-negative) along the right cuff hem.',
      },
      {
        id: 'clue_4',
        title: 'Auxiliary Generator Diagnostic Log',
        category: 'documentary',
        description: 'Reveals the generator experienced no electrical faults or manual restarts during the entire night, disproving Klaus Fischer’s maintenance alibi.',
      },
      {
        id: 'clue_5',
        title: 'Bridge Logbook Radar Verification',
        category: 'testimony',
        description: 'Radar system logs corroborate Elena Rostova was continuously logging vessel ice drift coordinates every five minutes between 02:30 AM and 04:00 AM.',
      },
      {
        id: 'clue_6',
        title: 'Encrypted Satellite Uplink Cache',
        category: 'documentary',
        description: 'Tariq Al-Mansoor’s communications terminal reveals incoming bids, but the transmission was blocked at 02:50 AM due to damaged microwave cables, leaving him on the upper mast.',
      },
      {
        id: 'clue_7',
        title: 'Seismic Acoustic Data Drive Enclosure',
        category: 'physical',
        description: 'A waterproof Pelican case stashed inside the bilge compartment beneath engine sub-station 3, containing the commander’s copied hard drive.',
      },
      {
        id: 'clue_8',
        title: 'Sickbay Pharmaceutical Roster',
        category: 'documentary',
        description: 'Dr. Connor’s controlled narcotics and surgical instruments are completely accounted for with zero missing items or sedative usage.',
      },
      {
        id: 'clue_9',
        title: 'Seismic Sonar Sensor Interruption',
        category: 'forensic',
        description: 'Seismic Lab telemetry proves Dr. Henrik Lind was actively recalibrating geophone receivers with verifiable keystroke stamps until 03:35 AM.',
      },
    ],
  };

  // Hints per difficulty
  const hintPools = {
    easy: [
      {
        id: 'hint_1',
        order: 1,
        text: 'Cross-reference the automated greenhouse environmental logs with the alibi claiming sprinkler calibration.',
      },
      {
        id: 'hint_2',
        order: 2,
        text: 'Pay close attention to the footwear size discovered in the damp soil versus the shoe sizes of the male and female suspects.',
      },
    ],
    medium: [
      {
        id: 'hint_1',
        order: 1,
        text: 'Look for who had exclusive administrative credentials to override the vault ventilation dampers.',
      },
      {
        id: 'hint_2',
        order: 2,
        text: 'Review the alibis of Jaxson and Valeria carefully—both have external corroboration through witnesses and video feeds.',
      },
      {
        id: 'hint_3',
        order: 3,
        text: 'Inspect physical injuries on the suspects to see which one matches the victim’s defensive jewelry marks.',
      },
    ],
    hard: [
      {
        id: 'hint_1',
        order: 1,
        text: 'Check the auxiliary generator status logs against the suspect who claimed to spend an hour repairing it.',
      },
      {
        id: 'hint_2',
        order: 2,
        text: 'The lubricant residue found on the murder weapon exists exclusively in one specific area of the vessel.',
      },
      {
        id: 'hint_3',
        order: 3,
        text: 'Look at the blood transfer on clothing found in the vessel’s laundry facility to confirm physical contact with the victim.',
      },
    ],
  };

  // Solution per difficulty
  const solutionPools = {
    easy: {
      culpritId: 'suspect_1',
      culpritName: 'Clara Oswald',
      motive: 'Lord Sterling intended to patent the synthesized neurotoxin without crediting her five years of research, while disinheriting all associates in his revised will.',
      fatalFlaw: 'The automated greenhouse log proved she never calibrated the sprinklers, and her unique size 6 work boot print left indelible tracks right beside the victim’s table.',
      explanation: 'Clara Oswald steeped the monkshood extract into Lord Sterling’s evening herbal infusion. When the power dipped, she entered the glasshouse wearing her boots, staged the scene, and attempted to hide the dropper bottle under the potting bench.',
    },
    medium: {
      culpritId: 'suspect_3',
      culpritName: 'Soren Frost',
      motive: 'Dr. Vance discovered Soren was running an illicit data-extraction service selling proprietary neural patterns on darknet forums, and scheduled a meeting to report him to federal authorities.',
      fatalFlaw: 'His master security credential was used to open the gas damper, and the fresh defensive scratch on his wrist matched Dr. Vance’s ring.',
      explanation: 'Soren Frost utilized his administrative access to disable the 44th-floor cameras and pump Sevoflurane through the server vault vents. When Dr. Vance collapsed, he entered to steal her master token, during which she struck his wrist with her ring.',
    },
    hard: {
      culpritId: 'suspect_3',
      culpritName: 'Klaus Fischer',
      motive: 'Klaus was promised millions by an overseas cartel to secure the pristine seismic survey drive before the vessel reached port.',
      fatalFlaw: 'He claimed he was repairing the auxiliary generator, yet ship diagnostics proved the unit ran untouched; the murder weapon was coated in his exclusive gear lubricant, and the bloodied coveralls bore his name.',
      explanation: 'Klaus used the emergency bypass tool from his engineering kit to enter the locked Chart Room. When Commander Petrov resisted the theft of the seismic drive, Klaus struck him with the heavy brass sextant. He stashed the drive in the engine bilge and attempted to wash his bloodied coveralls.',
    },
  };

  return {
    title: `The Mystery of ${safePremise.slice(0, 40).replace(/[^a-zA-Z0-9 ]/g, '') || 'The Hidden Truth'}`,
    story: {
      ...selectedSetting,
      narrative: `${safePremise}. ${selectedSetting.narrative}`,
    },
    suspects: suspectPools[difficulty] || suspectPools.medium,
    clues: cluePools[difficulty] || cluePools.medium,
    hints: hintPools[difficulty] || hintPools.medium,
    solution: solutionPools[difficulty] || solutionPools.medium,
  };
}

/**
 * Generates an AI-powered murder mystery using Gemini, with seamless procedural fallback.
 */
export async function generateMysteryCase({ premise, difficulty = 'medium', theme = 'classic noir' }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    console.log('[GeminiService] GEMINI_API_KEY not configured. Using high-fidelity procedural case engine.');
    const proceduralCase = generateProceduralMystery({ premise, difficulty, theme });
    return MysteryGenerationSchema.parse(proceduralCase);
  }

  const prompt = `
You are the master narrative architect and puzzle designer for an acclaimed mystery detective game.
Generate a gripping, logically airtight murder mystery case based on the following specifications:

- Premise: "${premise || 'A high-profile murder inside an exclusive locked venue'}"
- Difficulty: ${difficulty.toUpperCase()}
- Theme: ${theme}
- Target Suspects Count: ${config.suspectsCount}
- Target Clues Count: ${config.cluesCount}
- Target Hints Count: ${config.hintsCount}

AIRTIGHT LOGIC RULES:
1. Exactly ONE suspect is the true culprit.
2. The culprit MUST have a clear motive, opportunity, and a fatal flaw in their alibi or behavior that can be proven strictly through the clues.
3. Every innocent suspect must have an alibi, verifiable timeline, or physical impossibility that exonerates them upon careful analysis.
4. Clues must include a mixture of forensic (autopsy/chemical/digital), documentary (logs/wills/messages), physical (objects/residue/footprints), and testimony.
5. Provide ${config.hintsCount} progressive hints that nudge the detective without immediately spoiling the killer's name.
6. The solution must identify the culprit by id and name, explain the motive, detail the fatal flaw, and give a comprehensive explanation of how the crime was executed.

Return ONLY a valid JSON object matching this exact structure:
{
  "title": "Case Title",
  "story": {
    "setting": "Detailed location and atmosphere",
    "victim": "Name and brief background of victim",
    "crimeScene": "Specific room or focal area of the crime",
    "timeOfDeath": "Estimated time of incident",
    "narrative": "Immersive narrative paragraph introducing the mystery"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Full Name",
      "role": "Occupation or relation",
      "bio": "Backstory and personality",
      "alibi": "Stated alibi",
      "motive": "Potential motive"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Clue Title",
      "category": "forensic", // one of: forensic, testimony, documentary, physical
      "description": "Clear forensic finding or contradiction revealed upon inspection"
    }
  ],
  "hints": [
    {
      "id": "hint_1",
      "order": 1,
      "text": "Guidance hint text"
    }
  ],
  "solution": {
    "culpritId": "suspect_X",
    "culpritName": "Full Name",
    "motive": "True underlying motive",
    "fatalFlaw": "The exact contradiction or physical impossibility that breaks their alibi",
    "explanation": "Complete breakdown of the murder and evidence"
  }
}
Do not include any markdown backticks or commentary outside the JSON object.
`;

  try {
    console.log(`[GeminiService] Calling Gemini API for difficulty=${difficulty}...`);
    const ai = new GoogleGenAI({ apiKey });

    // Try primary recommended models
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let rawText = '';
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        rawText = response.text || '';
        if (rawText) break;
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiService] Model ${model} failed: ${err.message}. Trying next fallback model...`);
      }
    }

    if (!rawText) {
      throw lastError || new Error('No content returned from Gemini models');
    }

    // Strip markdown formatting if any was returned
    const cleanedText = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsedJson = JSON.parse(cleanedText);
    const validatedData = MysteryGenerationSchema.parse(parsedJson);
    console.log(`[GeminiService] Successfully generated and validated Gemini case: "${validatedData.title}"`);
    return validatedData;
  } catch (error) {
    console.error(`[GeminiService] Gemini generation error (${error.message}). Falling back to procedural engine.`);
    const proceduralCase = generateProceduralMystery({ premise, difficulty, theme });
    return MysteryGenerationSchema.parse(proceduralCase);
  }
}
