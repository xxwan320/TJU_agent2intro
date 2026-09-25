/** Hide retrieval process labels without deleting honest factual uncertainty. */
export function presentationText(text:string):string{
  return text.split('\n').filter(line=>!/^\s*(?:#{1,6}\s*|[-*]\s*)?(?:\*\*)?(?:资料查询\s*[:：]|(?:已取得依据|未取得依据|本次查询范围内未取得依据|核查通过|资料已核验|资料待核验)(?:[：:。；\s*]|$))/.test(line)).join('\n');
}
