import React, {useEffect, useState} from 'react'
import {ArrowRight, BookOpen, ChevronLeft, Clock3} from 'lucide-react'
import {api} from './api'

const when = value => new Date(value).toLocaleString('vi-VN')

export function History({go, user, needAuth}) {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { needAuth(() => {}); return }
    setLoading(true)
    api('/attempts/').then(setAttempts).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [user])

  return <main className="workspace"><div className="container">
    <div className="workspace-title"><div><span className="eyebrow">QUÁ TRÌNH LUYỆN TẬP</span><h1>Lịch sử làm bài</h1><p>Các lượt làm bài đã lưu trên tài khoản của bạn.</p></div></div>
    {loading ? <div className="panel empty slim">Đang tải lịch sử...</div> : error ? <div className="panel empty slim">{error}</div> : !attempts.length ?
      <div className="panel empty"><span className="empty-icon"><BookOpen/></span><h3>Chưa có lượt làm bài</h3><p>Hãy đăng nhập và hoàn thành một bài thi để kết quả xuất hiện tại đây.</p><button className="primary" onClick={() => go('/')}>Khám phá đề thi <ArrowRight size={17}/></button></div> :
      <div className="panel"><div className="panel-head"><h2>Những lần đã làm</h2><span>{attempts.length} lượt gần nhất</span></div>
        <div className="exam-list">{attempts.map(item => <button className="exam-row history-row" key={item.id} onClick={() => go(`/history/${item.id}`)}>
          <span className="row-icon"><BookOpen/></span><span className="row-info"><strong>{item.exam_title}</strong>{item.exam_description && <p className="history-description">{item.exam_description}</p>}<span>{item.exam_category || 'Bài thi'} · {when(item.submitted_at)}{item.total != null ? ` · ${item.correct_count}/${item.total} câu đúng` : ''}</span></span>
          <b className="history-score">{item.score}/{item.max_score} điểm</b><ArrowRight size={18}/>
        </button>)}</div>
      </div>}
  </div></main>
}

export function HistoryDetail({id, go, user, needAuth}) {
  const [attempt, setAttempt] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!user) { needAuth(() => {}); return }
    setAttempt(null)
    setError('')
    api(`/attempts/${id}/`).then(setAttempt).catch(e => setError(e.message))
  }, [id, user])

  if (error) return <main className="workspace"><div className="container narrow"><button className="back" onClick={() => go('/history')}><ChevronLeft size={18}/> Lịch sử làm bài</button><div className="panel empty slim">{error}</div></div></main>
  if (!attempt) return <main className="workspace"><div className="container empty">Đang tải kết quả...</div></main>
  return <main className="workspace"><div className="container narrow">
    <button className="back" onClick={() => go('/history')}><ChevronLeft size={18}/> Lịch sử làm bài</button>
    <div className="panel result-hero"><span className="eyebrow">KẾT QUẢ ĐÃ LƯU</span><h1>{attempt.exam_title}</h1>{attempt.exam_description && <p className="history-detail-description">{attempt.exam_description}</p>}<p className="history-date"><Clock3 size={15}/> {when(attempt.submitted_at)}</p>
      <div className="score-number">{attempt.score}<span>/{attempt.max_score} điểm</span></div>
      {attempt.total != null && <p>Trả lời đúng {attempt.correct_count}/{attempt.total} câu hỏi</p>}
    </div>
    {attempt.has_snapshot ? <><h2 className="review-heading">Xem lại đáp án</h2>{attempt.questions.map((question, index) => <ReviewQuestion key={index} question={question} index={index}/>)}</> :
      <div className="panel history-note">Lượt làm này được lưu trước khi có tính năng xem lại câu hỏi. Điểm số và thời gian nộp vẫn được giữ nguyên.</div>}
  </div></main>
}

function ReviewQuestion({question, index}) {
  const chosen = new Set((question.selected_choice_ids || []).map(String))
  const correct = new Set((question.correct_choice_ids || []).map(String))
  const letters = ids => question.choices.map((choice, i) => ids.has(String(choice.id)) ? String.fromCharCode(65 + i) : null).filter(Boolean).join(', ') || 'Chưa chọn'
  return <div className="panel review-card"><span className={'review-status ' + (question.is_correct ? 'correct' : 'wrong')}>Câu {index + 1} · {question.is_correct ? 'Đúng' : 'Chưa đúng'}</span>
    <h3>{question.prompt}</h3>{question.passage && <p className="passage">{question.passage}</p>}
    {question.image_url && <img className="question-image" src={question.image_url} alt="Hình minh họa câu hỏi"/>}
    {question.audio_url && <audio controls src={question.audio_url}/>}
    <p className="answer-summary"><strong>Bạn đã chọn:</strong> {letters(chosen)} <span>·</span> <strong>Đáp án đúng:</strong> {letters(correct)}</p>
    {question.choices.map((choice, i) => <div className={'review-choice ' + (correct.has(String(choice.id)) ? 'right' : chosen.has(String(choice.id)) ? 'selected' : '')} key={choice.id}>
      <span>{String.fromCharCode(65 + i)}. {choice.text}</span><span className="review-tags">{chosen.has(String(choice.id)) && <b className="picked">Bạn chọn</b>}{correct.has(String(choice.id)) && <b className="correct-tag">Đáp án đúng</b>}</span>
    </div>)}
    {question.explanation && <p className="explanation"><strong>Giải thích:</strong> {question.explanation}</p>}
  </div>
}
