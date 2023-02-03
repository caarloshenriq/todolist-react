import { useState, useEffect } from 'react'
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs'
import './App.css'

const url = 'http://localhost:5000/todos'

function App() {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todo, setTodo] = useState([])
  const [loading, setloading] = useState(false)

  // load todos on page load

  useEffect(() => {

    const loadData = async() => {

      setloading(true)

      const res = await fetch(url).then((res) => res.json()).then((data) =>data).catch((err) => console.log(err))

      setloading(false)

      setTodo(res)

      
    }
    loadData()
    
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done:false,
    }
    // enviando conteudo para a api
    await fetch(url, {
      method:'POST',
      body: JSON.stringify(todo),
      headers: {
        "Content-type":'application/json'
      }
    })

    setTodo((prevState) => [...prevState, todo])

    setTitle('')
    setTime('')
  }
  

  // deletando conteudo da api
  const handleDelete = async (id) => {

    await fetch(url + id, {
      method:'DELETE'
    })

    setTodo((prevState) => prevState.filter((todo) => todo.id !== id))
  }

// marcando como feito

  const handleEdit = async (todo) => {

    todo.done = !todo.done

    const data = await fetch(url + "/" + todo.id, {
      method: 'PUT',
      body:JSON.stringify(todo),
      headers: {
        "Content-type":'application/json',
      }
    })

    setTodo((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))

  }

  if(loading){
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React TODO</h1>
      </div>
      <div className="form-todo">
        <h2>Insira a sua proxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor='title'>O que você vai fazer?</label> 
              <input type="text" name="title" placeholder='Digite sua tarefa...' onChange={(e) => setTitle(e.target.value)} value={title || ''} required/>
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração</label>
              <input type="number" name="time" placeholder='Tempo estimado (em horas)' onChange={(e) => setTime(e.target.value)} value={time || ''} required/>
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de Tarefas</h2>
        {todo.length === 0 && <p>Não há tarefas</p>}
        {todo.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
            <p>Duração: {todo.time}h</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App