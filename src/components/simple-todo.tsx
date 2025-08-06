"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus } from "lucide-react"
import { useState } from "react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function Component() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        },
      ])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">待辦事項清單</h1>

      {/* 新增待辦事項 */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="新增待辦事項..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo()
            }
          }}
          className="flex-1"
        />
        <Button onClick={addTodo} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* 統計資訊 */}
      {totalCount > 0 && (
        <div className="text-sm text-gray-600 mb-4 text-center">
          已完成 {completedCount} / {totalCount} 項任務
        </div>
      )}

      {/* 待辦事項列表 */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">還沒有待辦事項，新增一個吧！</div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                todo.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300 hover:border-gray-400"
              }`}
            >
              <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 cursor-pointer ${todo.completed ? "text-gray-500 line-through" : "text-gray-800"}`}
              >
                {todo.text}
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* 清除已完成項目 */}
      {completedCount > 0 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTodos(todos.filter((todo) => !todo.completed))}
            className="text-gray-600 hover:text-gray-800"
          >
            清除已完成項目 ({completedCount})
          </Button>
        </div>
      )}
    </div>
  )
}
