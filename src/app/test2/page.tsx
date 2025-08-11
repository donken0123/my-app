'use client';
import Link from "next/link";
import { useState,useEffect, useRef } from "react";
import { useRouter } from "next/navigation";



// 動態導入 react-beautiful-dnd 以避免 SSR 問題


 type todolist={
  text: string; 
  completed: boolean;
  category: string;
  priority: string;
  dueDate: string | null;
  diffDays1: number;
 }
 type DueStatus = 'overdue' | 'due-today' | 'due-soon' | 'normal'|'no-due-date';
 const statusColors = {
  'overdue': '#dc3545',    // 紅色
  'due-today': '#fd7e14', // 橙色  
  'due-soon': '#ffc107',  // 黃色
  'normal': '#28a745',      // 綠色
  'no-due-date': '#6c757d' // 灰色
};
    


export default function Home(){
    const router=useRouter();
    
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [selectedTodo, setSelectedTodo]=useState<todolist | null>(null);
    //const [todos, setTodos]=useState<todolist[]>(localStorage?JSON.parse('todos'):[]);
    const newTodoText = new Date().toISOString().split('T')[0];
    const [newTodoDueDate, setNewTodoDueDate]=useState<string>('');
    const [editingDueDate, setEditingDueDate]=useState<string>('');
    const [research, setResearch]=useState<string>('');
    //const datepriority=['overdue','due-today','due-soon','normal','no-due-date'];
    const priorities=['高','中','低'];
    const categories=['工作','生活','學習','其他'];
    const priorityOrder=['高','中','低'];
    const [newTodoPriority, setNewTodoPriority]=useState<string>('低');
    const [editingPriority, setEditingPriority]=useState<string>('低');
    const [newTodoCategory, setNewTodoCategory]=useState<string>('工作');
    const [editingCategory, setEditingCategory]=useState<string>('工作');
    const [diffDays, setDiffDays]=useState<number>(0);
    const [todos, setTodos]=useState<todolist[]>([]);
    const [input, setinput]=useState<string>('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>('');
    const Requested=useRef<boolean>(false);
    
    const viewTodoDetail = (todoId:number) => {
      const todo = todos[todoId];
      const params = new URLSearchParams();
      params.set('category', todo.category);
      params.set('priority', todo.priority);
      params.set('text', todo.text);
      if (todo.dueDate) params.set('dueDate', todo.dueDate);
      params.set('diffDays', todo.diffDays1.toString());
      params.set('completed', todo.completed.toString());
      
      
      console.log("2");
      
      router.push(`/test2/${todoId}?${params.toString()}`);
  };

    const viewTodoDetail2=(todoId:number)=>{
      const todo=todos[todoId];
      setSelectedTodo(todo);
      setIsModalOpen(true);
    };
    
    // 通知權限請求 - 只在客戶端執行
    useEffect(() => {
        if(Requested.current) return;
        Requested.current=true;
        
        if ('Notification' in window) {
            Notification.requestPermission().then(permission=>{
                if(permission==='granted'){
                    new Notification('通知',{
                        body:'通知已開啟',
                    });
                    console.log('通知已開啟');
                }
            });
        }
        return () => {
          console.log('組件卸載');
      };
    }, []);

    useEffect(()=>{
      const loadTodos=()=>{
        const localstorage=localStorage.getItem('todos');
        if(localstorage){
          const parsedTodos=JSON.parse(localstorage);
          setTodos(parsedTodos);
          /* console.log(parsedTodos,'2');
          console.log("3"); */
        }
      }
      loadTodos();
    },[]);
    /*useEffect(()=>{
      todos.forEach(todo=>{
        if(todo.dueDate && todo.diffDays1<=0){
          new Notification('提醒',{
            body:`${todo.text} 已過期`,
          });
        }
      })

    },[todos]);*/
    // 這段代碼已經移動到上面的 mounted useEffect 中

    // 鍵盤事件處理 - 只在客戶端執行
    useEffect(() => {
        
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                addTodo();
            }
            if (e.key === 'Delete') {
                removeTodo(editingIndex || 0);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }); // 添加依賴
    // 新增：監聽 todos 變化並自動儲存
    /*useEffect(() => {
      console.log(todos);
      localStorage.setItem('todos', JSON.stringify(todos));
      console.log("1");
    }, [todos]);*/
    
    const addTodo=()=>{
        if(input.trim()=== '') return;
        const newTodo={
          text: input,
          completed: false,
          category: newTodoCategory,
          priority: newTodoPriority,
          dueDate: newTodoDueDate || null,
          diffDays1: diffDays
        };
        const updatedTodos=[...todos, newTodo];
        setTodos(updatedTodos); 
        
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
        
        console.log(updatedTodos,'1');
        setinput(''); 
        if(newTodo.dueDate && newTodo.diffDays1<=0){
          new Notification('提醒',{
            body:`${newTodo.text} 已過期`,
          });
        }
        
        
    };


    const removeTodo=(index: number)=>{
        const updatesetTodos=todos.filter((_, i) => i !== index);
        setTodos(updatesetTodos);
        
            localStorage.setItem('todos', JSON.stringify(updatesetTodos));
        
        console.log(updatesetTodos,'3');
         //localStorage.setItem('todos', JSON.stringify(todos.filter((_, i) => i !== index)));
    };

    const toggleTodo = (index: number) => {
        setTodos(todos.map((todo, i) =>
            i === index ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const startEdit = (index: number, text: string,category: string,priority: string,dueDate: string | null,diffDays1: number) => {
        setEditingIndex(index);
        setEditingText(text);
        setEditingCategory(category);
        setEditingPriority(priority);
        setEditingDueDate(dueDate || '');
        setDiffDays(diffDays1);
    };

    const saveEdit = (index: number) => {
        const updatesetTodo=todos.map((todo, i) =>
            i === index ? { ...todo,text: editingText, category: editingCategory, priority: editingPriority, dueDate: editingDueDate || null, diffDays1: diffDays } : todo
        );
        setTodos(updatesetTodo);
        
            localStorage.setItem('todos', JSON.stringify(updatesetTodo));
        
        console.log(updatesetTodo,'4');
        setEditingIndex(null);
        setEditingText('');
        
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditingText('');
    };

    const filteredTodos=todos.filter(todo=>{
      
      const searchText=research.toLowerCase();
      const todoText=todo.text.toLowerCase();
      const todoCategory=todo.category.toLowerCase();
      return todoText.includes(searchText) || todoCategory.includes(searchText);
    });

    const getDueStatus = (dueDate: string | null): DueStatus => {
      if (!dueDate) return 'no-due-date';
      
      const due = new Date(dueDate);
      const now = new Date();
      if (dueDate < newTodoText) return 'overdue';
      if (dueDate === newTodoText) return 'due-today';
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 3) return 'due-soon';
      return 'normal';
    };
    //max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg p-6
    //flex item-center gap-2
        //text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400
    // 防止 hydration 錯誤 - 在組件未掛載時顯示加載狀態
   

    return(
      <main className="flex flex-col items-center justify-center gap-2">

        <h1 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">Todolist</h1>
        {/* <Group>
        <Menu>
           <Menu.Target>
             <Button>更多選項</Button>
           </Menu.Target>
           <Menu.Dropdown>
             <Menu.Item>選項 1</Menu.Item>
           </Menu.Dropdown>
          </Menu>
        <Button variant="filled" color="red" size="md">填滿按鈕</Button>
        <Button loading>載入中</Button>
        <Button disabled>已停用</Button>
        <Button onClick={open}>打開模態視窗</Button>
          <Modal opened={opened} onClose={close} title="模態視窗" centered>
            <p>這是一個模態視窗</p>
            <p>點擊關閉按鈕或背景即可關閉</p>
            <Button onClick={close}>手動關閉</Button>
          </Modal>
        <Button onClick={modal2handle.open}>打開模態視窗2</Button>
          <Modal opened={opened2} onClose={modal2handle.close} title="模態視窗2" centered>
          <p>這是一個模態視窗2</p>
          <p>點擊關閉按鈕或背景即可關閉</p>
          <Button onClick={modal2handle.close}>手動關閉</Button>
          </Modal>
        </Group> */}
        <div>
          <button 
            onClick={() => {
              
                localStorage.removeItem('todos');
                setTodos([]);
                alert('資料已清除！');
              
            }}
            className={ 'bg-red-500 text-white rounded px-2 py-1 active:scale-95 hover:bg-red-700 transition duration-700'
              
            }
          >
            清除所有資料
          </button>
        </div>
        
        {/* 搜尋區域 */}
        <div className="w-full max-w-md mb-6">
          <div className="relative">
            <input
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
              type="text"
              placeholder="🔍 搜尋待辦事項或分類..."
              value={research}
              onChange={(e)=>setResearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {research && (
              <button
                onClick={() => setResearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 搜尋結果區域 */}
        {research && (
          <div className="w-full max-w-md mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="mr-2">📋</span>
                  搜尋結果
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {filteredTodos.length} 項
                  </span>
                </h3>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {filteredTodos.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 text-4xl mb-3">🔍</div>
                    <p className="text-gray-500 font-medium mb-1">找不到符合的項目</p>
                    <p className="text-gray-400 text-sm">試試其他關鍵字或檢查拼寫</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {filteredTodos.map((todo, index) => (
                      <li key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-gray-800 font-medium">{todo.text}</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                todo.priority === '高' ? 'bg-red-100 text-red-800' :
                                todo.priority === '中' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {todo.priority}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span className="flex items-center">
                                <span className="mr-1">🏷️</span>
                                {todo.category}
                              </span>
                              {todo.dueDate && (
                                <span className="flex items-center">
                                  <span className="mr-1">📅</span>
                                  {todo.dueDate}
                                </span>
                              )}
                              {todo.diffDays1 !== undefined && (
                                <span className={`flex items-center font-medium ${
                                  todo.diffDays1 < 0 ? 'text-red-600' :
                                  todo.diffDays1 <= 3 ? 'text-orange-600' :
                                  'text-green-600'
                                }`}>
                                  <span className="mr-1">⏰</span>
                                  {todo.diffDays1 < 0 ? `逾期 ${Math.abs(todo.diffDays1)} 天` :
                                   todo.diffDays1 === 0 ? '今天到期' :
                                   `還有 ${todo.diffDays1} 天`}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-3">
                            <div className={`w-3 h-3 rounded-full ${
                              todo.completed ? 'bg-green-400' : 'bg-gray-300'
                            }`} title={todo.completed ? '已完成' : '未完成'}></div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex text-center gap-2">
        <input
        className="border-2 border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 "
        type="text"
        placeholder="輸入待辦事項..."
        value={input}
        onChange={(e)=>setinput(e.target.value)}
        />
        
        <input
        type="date"
        value={newTodoDueDate}
        onChange={(e)=>{
          setNewTodoDueDate(e.target.value);
          if (e.target.value) {
            const diff = Math.ceil((new Date(e.target.value).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            setDiffDays(diff);
          } else {
            setDiffDays(0);
          }
        }}
        />
        
        
        <select className="border-2 border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" value={newTodoCategory} onChange={(e)=>setNewTodoCategory(e.target.value)}>
        {categories.map(category => (
    <option key={category} value={category}>{category}</option>
  ))}
        </select>
        <select value={newTodoPriority} onChange={(e)=>setNewTodoPriority(e.target.value)}>
          {priorities.map(priority=>(
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition" onClick={addTodo}>新增</button>
        </div>
        <ul className="flex flex-col items-center justify-center">
          {((todos.sort((a,b)=>priorityOrder.indexOf(a.priority)-priorityOrder.indexOf(b.priority)))).sort((a,b)=>a.diffDays1-b.diffDays1).map((todo, index) => (
          <li key={index} className={`${todo.completed ? 'line-through' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(index)}
              
            />
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <input
                  type="date"
                  value={editingDueDate || ''}
                  onChange={(e)=>{
                    setEditingDueDate(e.target.value);
                    
                    if (e.target.value) {
                      const diff = Math.ceil((new Date(e.target.value).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      setDiffDays(diff);
                    } else {
                      setDiffDays(0);
                    };}}
                 
                />
                <select value={editingCategory} onChange={(e)=>{setEditingCategory(e.target.value)}}>
                  {categories.map(category=>(
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select value={editingPriority} onChange={(e)=>{setEditingPriority(e.target.value)}}>
                  {priorities.map(priority=>(
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
                <button onClick={() =>saveEdit(index)}>儲存</button>
                <button onClick={cancelEdit}>取消</button>
              </>
            ) : (
              <>
              <div className="flex item-center gap-2">
                <span
                style={{
                  backgroundColor:
                    todo.priority === '高'
                      ? '#ffcccc'
                      : todo.priority === '中'
                      ? '#fff3cd'
                      : '#d4edda',
                  color:
                    todo.priority === '高'
                      ? '#b71c1c'
                      : todo.priority === '中'
                      ? '#856404'
                      : '#155724',
                  padding: '2px 8px',
                }}>
                  {todo.priority}
                </span>
                <span >
                {todo.text} 
                </span>
                
                
                {todo.category} {todo.dueDate} (剩餘 {todo.diffDays1} 天)
                <span
                style={{
                  backgroundColor: statusColors[getDueStatus(todo.dueDate)],
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginRight: '8px',
                  fontSize: '12px'
                }}>
                {getDueStatus(todo.dueDate)}
                </span>
                {' '}
                <button onClick={() => startEdit(index, todo.text, todo.category, todo.priority, todo.dueDate, todo.diffDays1)}>編輯</button>
                </div>  
              </>
            )}
            <div>
            <button  onClick={() => removeTodo(index)} style={{ color: 'red' }}>
              刪除
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition" onClick={() => viewTodoDetail(index)}>
              TodolistDetail
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition" onClick={() => viewTodoDetail2(index)}>
              TodolistDetail2
            </button>
            <Link href={{pathname:`/test2/${index}`,query:{category:todo.category,priority:todo.priority,text:todo.text,dueDate:todo.dueDate,diffDays:todo.diffDays1.toString(),completed:todo.completed.toString()}}}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition">TodolistDetail3</Link>
            </div>
            
          </li>
        ))}
        </ul>
        {isModalOpen && selectedTodo &&(
          <div className="fixed inset-0 bg-black  flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 ">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">待辦事項詳細資料</h2>
                <button onClick={()=>setIsModalOpen(false)} className={"text-gray-500 hover:text-gray-700"}>關閉</button>

                </div>
                <div className="space-y-4">
                 <div className="border-b pb-2">
                  <span className="font-semibold">待辦事項:</span>
                  <span>{selectedTodo.text}</span>
                 
                 </div>
                 <div className="border-b pb-2">
                  <span className="font-semibold">類別:</span>
                  <span>{selectedTodo.category}</span>
                 </div>
                 <div className="border-b pb-2">
                 <span className="font-semibold">優先順序:</span>
                 <span>{selectedTodo.priority}</span>
                 </div>
                 <div>
                 <span className="font-semibold">截止日期:</span>
                 <span>{selectedTodo.dueDate}</span>
                  
                 </div>
                </div>
            </div>
          </div>





        )}
    </main>
    );
}
//className='flex items-center justify-center w-16 h-8'