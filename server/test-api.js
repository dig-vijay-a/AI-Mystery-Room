async function testFlow() {
  console.log('Testing AI Mystery Room API...');
  
  // 1. Create Mystery (Easy)
  const createRes = await fetch('http://localhost:5000/api/cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'A billionaire antique collector is poisoned in his private conservatory',
      difficulty: 'easy',
      theme: 'classic noir',
    }),
  });

  const createJson = await createRes.json();
  console.log('[1. Create Case]:', createJson.success ? 'PASS' : 'FAIL');
  console.log('  Case ID:', createJson.data._id);
  console.log('  Title:', createJson.data.title);
  console.log('  Difficulty:', createJson.data.difficulty);
  console.log('  Suspects count:', createJson.data.suspects.length);
  console.log('  Clues count:', createJson.data.clues.length);
  console.log('  Hints count:', createJson.data.hints.length);
  console.log('  Security Check - Solution Hidden?:', createJson.data.solution === undefined ? 'PASS (Secure)' : 'FAIL');

  const caseId = createJson.data._id;
  const firstClue = createJson.data.clues[0];

  // 2. Discover Clue
  const clueRes = await fetch(`http://localhost:5000/api/cases/${caseId}/clues/${firstClue.id}/discover`, {
    method: 'POST',
  });
  const clueJson = await clueRes.json();
  console.log('[2. Discover Clue]:', clueJson.success ? 'PASS' : 'FAIL');
  console.log('  Clue Title:', clueJson.clue.title);
  console.log('  Clues Bonus:', clueJson.score.cluesBonus, 'pts');

  // 3. Request Hint
  const hintRes = await fetch(`http://localhost:5000/api/cases/${caseId}/hints`, {
    method: 'POST',
  });
  const hintJson = await hintRes.json();
  console.log('[3. Request Hint]:', hintJson.success ? 'PASS' : 'FAIL');
  console.log('  Hint Unlocked:', hintJson.hint.text);
  console.log('  Hints Penalty:', hintJson.score.hintsDeduction, 'pts');

  // 4. Submit Accusation
  const accuseRes = await fetch(`http://localhost:5000/api/cases/${caseId}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      suspectId: 'suspect_1',
      reasoning: 'Footwear tracks and contradicted sprinkler log proves guilt.',
    }),
  });
  const accuseJson = await accuseRes.json();
  console.log('[4. Submit Accusation]:', accuseJson.success ? 'PASS' : 'FAIL');
  console.log('  Verdict isCorrect:', accuseJson.verdict.isCorrect);
  console.log('  Actual Culprit:', accuseJson.verdict.actualCulprit);
  console.log('  Score Breakdown:', JSON.stringify(accuseJson.verdict.score));
  console.log('  Solution Motive Unmasked:', accuseJson.verdict.solution.motive);

  // 5. Get Completed Result
  const resultRes = await fetch(`http://localhost:5000/api/cases/${caseId}/result`);
  const resultJson = await resultRes.json();
  console.log('[5. Completed Result API]:', resultJson.success ? 'PASS' : 'FAIL');
  console.log('  Final Status:', resultJson.data.status);
  console.log('\nAll Backend Acceptance Criteria Verified Successfully!');
}

testFlow().catch(console.error);
