import { Case } from '../models/Case.js';
import { generateMysteryCase } from '../services/geminiService.js';
import { CreateCaseInputSchema, AccusationInputSchema } from '../schemas/caseValidation.js';
import { calculateScore, CLUE_BONUS_POINTS, HINT_PENALTY_POINTS } from '../utils/scoring.js';

/**
 * Helper to sanitize case payload during active investigation.
 * Strictly strips solution, conceals unrevealed hints and undiscovered clue descriptions.
 */
function sanitizeActiveCase(caseDoc) {
  const plain = caseDoc.toObject ? caseDoc.toObject() : { ...caseDoc };

  if (plain.status === 'investigating') {
    delete plain.solution;

    if (plain.clues) {
      plain.clues = plain.clues.map((clue) => ({
        id: clue.id,
        title: clue.title,
        category: clue.category,
        discovered: clue.discovered,
        discoveredAt: clue.discoveredAt,
        description: clue.discovered ? clue.description : undefined,
      }));
    }

    if (plain.hints) {
      plain.hints = plain.hints.map((hint) => ({
        id: hint.id,
        order: hint.order,
        revealed: hint.revealed,
        revealedAt: hint.revealedAt,
        text: hint.revealed ? hint.text : undefined,
      }));
    }
  }

  return plain;
}

// 1. POST /api/cases — Generate a mystery
export async function createCase(req, res) {
  try {
    const validatedInput = CreateCaseInputSchema.parse(req.body);
    const { premise, difficulty, theme } = validatedInput;

    const generatedData = await generateMysteryCase({ premise, difficulty, theme });

    const newCase = new Case({
      title: generatedData.title,
      premise: premise || '',
      theme,
      difficulty,
      story: generatedData.story,
      suspects: generatedData.suspects,
      clues: generatedData.clues.map((c) => ({
        ...c,
        discovered: false,
      })),
      hints: generatedData.hints.map((h, idx) => ({
        ...h,
        order: h.order || idx + 1,
        revealed: false,
      })),
      solution: generatedData.solution,
      status: 'investigating',
      score: {
        base: 0,
        cluesBonus: 0,
        hintsDeduction: 0,
        total: 0,
      },
    });

    await newCase.save();

    res.status(201).json({
      success: true,
      data: sanitizeActiveCase(newCase),
    });
  } catch (error) {
    console.error('[createCase Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate mystery case',
    });
  }
}

// 2. GET /api/cases/:id — Retrieve active mystery
export async function getCaseById(req, res) {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        error: 'Case not found',
      });
    }

    res.json({
      success: true,
      data: sanitizeActiveCase(caseDoc),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching case',
    });
  }
}

// 3. POST /api/cases/:id/clues/:clueId/discover — Discover a clue
export async function discoverClue(req, res) {
  try {
    const { id, clueId } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    if (caseDoc.status !== 'investigating') {
      return res.status(400).json({ success: false, error: 'Case is already closed' });
    }

    const clue = caseDoc.clues.find((c) => c.id === clueId);
    if (!clue) {
      return res.status(404).json({ success: false, error: 'Clue not found' });
    }

    if (!clue.discovered) {
      clue.discovered = true;
      clue.discoveredAt = new Date();

      const discoveredCount = caseDoc.clues.filter((c) => c.discovered).length;
      caseDoc.score.cluesBonus = discoveredCount * CLUE_BONUS_POINTS;
      caseDoc.score.total = Math.max(
        0,
        caseDoc.score.base + caseDoc.score.cluesBonus - caseDoc.score.hintsDeduction
      );

      await caseDoc.save();
    }

    res.json({
      success: true,
      clue: {
        id: clue.id,
        title: clue.title,
        category: clue.category,
        description: clue.description,
        discovered: true,
        discoveredAt: clue.discoveredAt,
      },
      score: caseDoc.score,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// 4. POST /api/cases/:id/hints — Request a hint
export async function requestHint(req, res) {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    if (caseDoc.status !== 'investigating') {
      return res.status(400).json({ success: false, error: 'Case is already closed' });
    }

    // Find first unrevealed hint in order
    const nextHint = caseDoc.hints
      .filter((h) => !h.revealed)
      .sort((a, b) => a.order - b.order)[0];

    if (!nextHint) {
      return res.status(400).json({
        success: false,
        error: 'All available hints have already been unlocked',
      });
    }

    nextHint.revealed = true;
    nextHint.revealedAt = new Date();

    const usedHintsCount = caseDoc.hints.filter((h) => h.revealed).length;
    caseDoc.score.hintsDeduction = usedHintsCount * HINT_PENALTY_POINTS;
    caseDoc.score.total = Math.max(
      0,
      caseDoc.score.base + caseDoc.score.cluesBonus - caseDoc.score.hintsDeduction
    );

    await caseDoc.save();

    res.json({
      success: true,
      hint: {
        id: nextHint.id,
        order: nextHint.order,
        text: nextHint.text,
        revealed: true,
        revealedAt: nextHint.revealedAt,
      },
      score: caseDoc.score,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// 5. POST /api/cases/:id/accuse — Submit accusation
export async function accuseSuspect(req, res) {
  try {
    const { id } = req.params;
    const validatedInput = AccusationInputSchema.parse(req.body);
    const { suspectId, reasoning } = validatedInput;

    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    if (caseDoc.status !== 'investigating') {
      return res.status(400).json({
        success: false,
        error: 'Accusation already submitted for this case.',
      });
    }

    const accusedSuspect = caseDoc.suspects.find(
      (s) => s.id === suspectId || s.name.toLowerCase() === suspectId.toLowerCase()
    );

    if (!accusedSuspect) {
      return res.status(400).json({
        success: false,
        error: 'Invalid suspect ID provided',
      });
    }

    // Evaluate guilt against solution
    const isCorrect =
      accusedSuspect.id === caseDoc.solution.culpritId ||
      accusedSuspect.name.trim().toLowerCase() === caseDoc.solution.culpritName.trim().toLowerCase();

    const discoveredCluesCount = caseDoc.clues.filter((c) => c.discovered).length;
    const usedHintsCount = caseDoc.hints.filter((h) => h.revealed).length;

    const finalScore = calculateScore({
      difficulty: caseDoc.difficulty,
      isCorrect,
      discoveredCluesCount,
      usedHintsCount,
    });

    caseDoc.status = isCorrect ? 'solved' : 'failed';
    caseDoc.accusation = {
      suspectId: accusedSuspect.id,
      suspectName: accusedSuspect.name,
      reasoning: reasoning || '',
      isCorrect,
      accusedAt: new Date(),
    };
    caseDoc.score = finalScore;

    await caseDoc.save();

    // Now securely unmask the solution in the response
    res.json({
      success: true,
      verdict: {
        isCorrect,
        status: caseDoc.status,
        accusedSuspect: accusedSuspect.name,
        actualCulprit: caseDoc.solution.culpritName,
        score: caseDoc.score,
        solution: caseDoc.solution,
      },
      data: caseDoc.toObject(),
    });
  } catch (error) {
    console.error('[accuseSuspect Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// 6. GET /api/cases/:id/result — Retrieve completed result
export async function getCaseResult(req, res) {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    if (caseDoc.status === 'investigating') {
      return res.status(403).json({
        success: false,
        error: 'Case is still active. Accuse a suspect to unseal the final verdict.',
      });
    }

    res.json({
      success: true,
      data: {
        id: caseDoc._id,
        title: caseDoc.title,
        difficulty: caseDoc.difficulty,
        status: caseDoc.status,
        accusation: caseDoc.accusation,
        score: caseDoc.score,
        solution: caseDoc.solution,
        story: caseDoc.story,
        suspects: caseDoc.suspects,
        clues: caseDoc.clues,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// 7. GET /api/cases — Retrieve list of recent cases
export async function listRecentCases(req, res) {
  try {
    const cases = await Case.find()
      .select('title difficulty status premise score createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: cases,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
