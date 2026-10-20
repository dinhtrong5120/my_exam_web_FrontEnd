import React, {useEffect, useId, useState} from 'react'
import {api} from './api'

const builtInCategories = ['TOEIC', 'IELTS', 'Tiếng Anh']

export default function CategoryInput({value, onChange}) {
  const listId = useId()
  const [categories, setCategories] = useState(builtInCategories)

  useEffect(() => {
    let mounted = true
    api('/exams/?mine=1').then(exams => {
      if (!mounted) return
      const names = [...builtInCategories, ...exams.map(exam => exam.category)]
      setCategories(names.filter((name, index) => name &&
        names.findIndex(other => other?.toLowerCase() === name.toLowerCase()) === index))
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  return <>
    <input list={listId} value={value || ''} onChange={event => onChange(event.target.value)}
      maxLength={60} placeholder="Chọn hoặc nhập danh mục mới" autoComplete="off" required />
    <datalist id={listId}>{categories.map(name => <option value={name} key={name}/>)}</datalist>
    <small className="category-hint">Chọn gợi ý hoặc gõ tên danh mục mới.</small>
  </>
}
