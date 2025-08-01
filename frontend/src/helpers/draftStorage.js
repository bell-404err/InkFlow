export function getDrafts() {
    return JSON.parse(localStorage.getItem('drafts') || '[]');
}

export function saveDraft(draft) {
    const drafts = getDrafts();
    const idx = drafts.findIndex(d => d.id === draft.id);
    if (idx >= 0) drafts[idx] = draft;
    else drafts.push(draft);
    localStorage.setItem('drafts', JSON.stringify(drafts));
}

export function deleteDraft(id) {
    const drafts = getDrafts().filter(d => d.id !== id);
    localStorage.setItem('drafts', JSON.stringify(drafts));
}

export function getDraftById(id) {
    return getDrafts().find(d => d.id === id);
}
