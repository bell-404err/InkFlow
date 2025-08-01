// src/helpers/draftStorage.js
export function getDrafts() {
    try { return JSON.parse(localStorage.getItem('drafts')) || []; }
    catch { return []; }
}
export function saveDraft(draft) {
    let drafts = getDrafts();
    if (!draft.id) draft.id = Date.now().toString() + Math.random().toString(36).slice(2, 8);
    drafts = drafts.filter(d => d.id !== draft.id);
    drafts.push(draft);
    localStorage.setItem('drafts', JSON.stringify(drafts));
}
export function removeDraft(id) {
    const drafts = getDrafts().filter(d => d.id !== id);
    localStorage.setItem('drafts', JSON.stringify(drafts));
}
export function getDraftById(id) {
    return getDrafts().find(d => d.id === id);
}
