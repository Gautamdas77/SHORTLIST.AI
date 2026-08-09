const form = document.querySelector('#screen-form');
const input = document.querySelector('#resume-files');
const dropzone = document.querySelector('#dropzone');
const fileList = document.querySelector('#file-list');
const description = document.querySelector('#job-description');
const count = document.querySelector('#char-count');
const button = document.querySelector('#analyze-button');
const results = document.querySelector('#results');
const resultsList = document.querySelector('#results-list');
const error = document.querySelector('#error-message');

const renderFiles = () => {
  const files = [...input.files];
  fileList.innerHTML = files.length ? files.map(file => `<div class="file-item"><span>${file.name}</span><span>${(file.size / 1024).toFixed(0)} KB</span></div>`).join('') : '<span class="empty-files">No resumes loaded yet</span>';
};

description.addEventListener('input', () => { count.textContent = `${description.value.length.toLocaleString()} characters`; });
input.addEventListener('change', renderFiles);
['dragenter', 'dragover'].forEach(event => dropzone.addEventListener(event, e => { e.preventDefault(); dropzone.classList.add('dragging'); }));
['dragleave', 'drop'].forEach(event => dropzone.addEventListener(event, e => { e.preventDefault(); dropzone.classList.remove('dragging'); }));
dropzone.addEventListener('drop', e => { input.files = e.dataTransfer.files; renderFiles(); });

const detailText = details => {
  if (typeof details === 'string') return details;
  const verdict = details.verdict || details.final_verdict || details.summary || '';
  const matching = details.matching_skills || details.matched_skills;
  const missing = details.missing_important_skills || details.missing_skills;
  return [
    verdict && `<span class="reason-line"><b>Verdict:</b> ${verdict}</span>`,
    matching && `<span class="reason-line"><b>Strong points:</b> ${Array.isArray(matching) ? matching.join(', ') : matching}</span>`,
    missing && `<span class="reason-line"><b>Gaps:</b> ${Array.isArray(missing) ? missing.join(', ') : missing}</span>`,
  ].filter(Boolean).join('<br>');
};

form.addEventListener('submit', async event => {
  event.preventDefault();
  error.classList.add('hidden');
  results.classList.add('hidden');
  button.disabled = true;
  button.querySelector('span').textContent = 'Reading the stack...';
  const payload = new FormData(form);
  try {
    const response = await fetch('/api/analyze', { method: 'POST', body: payload });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Analysis failed');
    document.querySelector('#result-count').textContent = `${data.candidates.length} candidates ranked`;
    resultsList.innerHTML = data.candidates.map((candidate, index) => `<article class="candidate" style="animation-delay:${index * 80}ms"><div class="rank">0${index + 1}</div><div><h3>${candidate.name}</h3><div class="candidate-meta">${candidate.file_name}${candidate.experience ? ` · ${candidate.experience} yrs experience` : ''}</div><div class="chips">${(candidate.skills || []).slice(0, 5).map(skill => `<span class="chip">${skill}</span>`).join('')}</div></div><div class="score"><strong>${candidate.score}%</strong><small>role match</small></div><div class="reason"><b>Why this ranking:</b> ${detailText(candidate.details) || 'The model found a meaningful match across the supplied role and resume data.'}</div></article>`).join('');
    results.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    error.textContent = err.message;
    error.classList.remove('hidden');
  } finally {
    button.disabled = false;
    button.querySelector('span').textContent = 'Rank candidates';
  }
});
