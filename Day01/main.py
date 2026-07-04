from itertools import count
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field


app = FastAPI(title="Simple TODO API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Task title")


class TodoUpdate(BaseModel):
    completed: bool = Field(..., description="Completion status")


class Todo(BaseModel):
    id: int
    title: str
    completed: bool


todos: List[Todo] = []
next_id = count(1)
todo_page_path = Path(__file__).with_name("todo.html")


@app.get("/")
def root():
    return HTMLResponse(todo_page_path.read_text(encoding="utf-8"))


@app.get("/todos", response_model=list[Todo])
def get_todos():
    return todos


@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(payload: TodoCreate):
    todo = Todo(id=next(next_id), title=payload.title.strip(), completed=False)
    todos.append(todo)
    return todo


@app.patch("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, payload: TodoUpdate):
    for index, todo in enumerate(todos):
        if todo.id == todo_id:
            updated_todo = Todo(
                id=todo.id,
                title=todo.title,
                completed=payload.completed,
            )
            todos[index] = updated_todo
            return updated_todo

    raise HTTPException(status_code=404, detail="Todo not found")


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    for index, todo in enumerate(todos):
        if todo.id == todo_id:
            todos.pop(index)
            return None

    raise HTTPException(status_code=404, detail="Todo not found")
