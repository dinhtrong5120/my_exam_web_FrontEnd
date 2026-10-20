import React, {useEffect} from 'react'

export const examCategoryKey = category => `category:${String(category || '').trim().toLowerCase()}`

export default function ExamCategoryTabs({exams, value, onChange}) {
  const groups = new Map()
  for (const exam of exams) {
    const label = String(exam.category || '').trim()
    if (!label) continue
    const key = examCategoryKey(label)
    if (groups.has(key)) groups.get(key).count += 1
    else groups.set(key, {key, label, count: 1})
  }
  const categories = [...groups.values()].sort((a, b) => {
    if (a.key === examCategoryKey('TOEIC')) return -1
    if (b.key === examCategoryKey('TOEIC')) return 1
    return a.label.localeCompare(b.label, 'vi')
  })
  useEffect(() => {
    if (value !== 'all' && !groups.has(value)) onChange('all')
  }, [exams, value])
  return <div className="exam-category-tabs" role="group" aria-label="Lọc bài thi theo danh mục">
    {[{key: 'all', label: 'Tất cả', count: exams.length}, ...categories].map(group =>
      <button key={group.key} type="button" aria-pressed={value === group.key}
        className={value === group.key ? 'active' : ''} onClick={() => onChange(group.key)}>
        {group.label}<span>{group.count}</span>
      </button>)}
  </div>
}
