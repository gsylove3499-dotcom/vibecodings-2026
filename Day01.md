# 바이브코딩 1일차

## VibeCoding with Codex/Cursor/Claude Code/Gemini

### AI에게 제대로 코딩을 시키자!

#### 1.핵심 개념

코딩을 직접 작성하지말 것. AI와 협업해서 새로운 프로그램을 만들자!

##### 기본 개발방식

요구사항분석 > 설계(DB/UI 포함) > 구현/디버깅 > 테스트 > 배포 > 유지보수

##### 바이브코딩 방식

요구사항정의(PRD)/사람 > 코드생성/AI > 디버깅.테스트/AI > 검증 및 수정/사람 > 배포/사람

##### 핵심 포인트

- AI - 주니어 개발자? 시니어 개발자!
- 사람 - PM + 리뷰어

#### Tip
문맥의 토큰을 어떻게 부분리하는지 확인 사이트
- https://platform.openai.com/tokenizer

#### 2. 바이브코딩 개발 환경

여러방식 존재. 본인에게 맞는 방식을 찾으세요

##### <CLI 방식>

콘솔(터미널, 파워쉘, bash)에서 바이브코딩

- node.js 패키지 모듈 명령어(npm)로 설치

###### (ChatGPT - OpenAI Codex CLI)

```powershell 실행 후
#설치
> npm install -g @openai/codex
```

```powershell 실행 후
#실행
> codex
```

- 로그인 진행
- 웹 브라우저 SSO로 접속
- 폴더 신뢰 여부 확인 뒤
- 개발화면
- 기본 명령어 중 /로 명령 수행
- 폴더 생성 명령 확인

###### (Gemini GLI)

```powershell
#설치
> npm install -g @google/gemini-cli
```

```powershell
#실행
> gemini
```

###### (ClaudeCode CLI)

```powershell
# 설치
> npm install -g @anthropic-ai/claude-code
```

```powershell
# 실행
> claude
```

##### <웹브라우저 LLM 사용 방식>

Chat GPT, 클로드, 제미나이 사이트 접속 바이브코딩

##### <IDE 툴 확장툴 사용 방식>

VS Code의 확장 설치 바이트코딩

###### Codex

- 확장 > Codex 검색 > OpenAI 버전 Codex 설치

- 로그인

###### Gemini Code Assist

- 2026년 6월 18일 부터 VS Code 확장 사용불가. (Enterprise는 지원)
- Antigravity 사용 권장

- ~~확장 > Gemini 검색 > Google 버전 Gemini Code Assist 설치~~

- ~~설치 후 채팅 탭에서 Gemini 나옴~~

###### Claude Code

- 확장 > Claude 검색 > Anthropic 버전 설치

- 설치 후 채팅 탭에서 Cluade 나옴

#### 3. 바이크코딩 시작

##### 프롬프트 가이드

- LLM에 질의를 던지는 컨텍스트(문맥)
- 간결한 프롬프트로 처리할 것
    - '주의를 살펴서 조심스럽게', '자세히'... 이런 단어를 사용하지 말 것
    - '수정해줘', '분석해줘', '최적화해줘' 등 명령어 형태로 문장을 완료할 것

##### 프롬프트 종류

- 제로샷 프롬프트
    - 아무 예제없이 AI와 대화로 코딩을 시작하는 방식

- 원샷 프롬프트
    - 예제 하나 정보 제공한 뒤 비슷한 작업을 수행하도록 요청하는 방식

- 퓨샷 프롬프트
    - 2~5개 예제를 제공한 뒤 작업을 수행하도록 요청하는 방식


##### ChatGPT, Gemini 웹 브라우저 바이브코딩

- 프롬프트는 명령이 아닌 설계도, 지시를 잘못하면 결과도 이상하게 나옴

```bash
#나쁜 예시
> 로그인을 만들어줘
> 뭔가 멋진 로그인을 만들어줘(?)

#좋은 예시
> 로그인 기능을 만들어줘. Python으로
```

- 좀 더 개선된 방식으로 프롬프트를 작성 필요

```bash
#개선 1차 - 원샷 프롬프트
> 
너는 백엔드 개발자야.

사용자 로그인 기능을 만들어줘. Python FastApi 사용해줘.
```

```bash
#개선 2차 - 퓨샷 프롬프트
>
너는 백엔드 개발자야.

사용자 로그인 API를 만들어줘.
- Python FastAPI 사용
- JWT 인증, OAuth2
- 예외처리 포함
```


###### 웹 브라우저 사용 바이브코딩 단점

- 나온 결과를 직접 구성. 폴더나 파일 등 개발자가 수동으로 처리
- 디버깅이 개발툴과 웹 브라우저 LLM 사이에 전환하면서 처리
- CLI나 IDE 툴 확장으로 좀 더 편하게 바이브코딩하자

##### Codex, API 사용 바이브코딩

- VS Code 등의 IDE 툴 사용
- AI가 직접 폴더나 파일을 제어할 수 있음
- 디버깅도 실시간으로 가능. 배포도 AI가 해줄 수 있음

###### 에이전틱 코딩 - TODO 리스트

- HTML, Javascript, CSS를 사용한 간단한 TODO 리스트 프로그램
- 프롬프트 영역에 작성 시 Shift+Enter로 여러줄 작성

```markdown
HTML, CSS, Javascript를 사용해서 간단한 TODO 리스트를 만들어줘.

기능은 다음과 같아
- 할 일 추가
- 할 일 완료 체크
- 할 일 삭제
- 새로고침 전까지 브라우저에서 동작할 것
- 초보자가 이해하기 쉽게 작성
- 하나의 HTML 파일에 CSS, Javascript 모두 추가할 것
```

- 완성된 결과 확인
    - 1차 결과.png

- 웹서버로 동작하는게 아님

```markdown
현재 사용중인 VS Code Insider에 Live Server 확장을 설치해줘
```

- 서버 실행명령

```markdown
좋아. Live Server로 조금전에 작성한 todo.html을 실행해줘.
```

- 서버 실행 명령이 실패할 수도 있음

###### TODO List 개선

- Python 웹서비스 연계

- Python 가상환경 설치 및 실행

```powershell
#Python 가상환경 설치
> python -m venv venv
#가상환경 활성화
> .\venv\Scripts\Activate.ps1
(venv) > 
```

```markdown
너는 백앤드 개발자야.

Python FastAPI로 간단한 TODO API를 만들어줘.

요구사항
- 할 일 목록 조회
- 할 일 추가
- 할 일 완료 상태 변경
- 할 일 삭제
- 데이터는 매모리 리스트에 저장(DB사용 아님)
- 초보자도 이해하기 쉽게 작성
- 실행 방법도 같이 설명
```

### FastAPI TODO API 예제

아래 예제는 메모리 리스트에 할 일을 저장하는 가장 단순한 FastAPI 서버입니다.
서버를 다시 시작하면 데이터는 초기화됩니다.

#### 파일 구조

```text
Day01/
  main.py
  requirements.txt
```

#### `main.py`

```python
from itertools import count
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


app = FastAPI(title="Simple TODO API", version="1.0.0")


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)


class TodoUpdate(BaseModel):
    completed: bool


class Todo(BaseModel):
    id: int
    title: str
    completed: bool


todos: List[Todo] = []
next_id = count(1)


@app.get("/")
def root():
    return {"message": "Simple TODO API is running"}


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
            updated_todo = todo.model_copy(update={"completed": payload.completed})
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
```

#### `requirements.txt`

```txt
fastapi
uvicorn[standard]
```

#### API 설명

- `GET /todos`: 할 일 목록 조회
- `POST /todos`: 할 일 추가
- `PATCH /todos/{todo_id}`: 완료 상태 변경
- `DELETE /todos/{todo_id}`: 할 일 삭제

#### 실행 방법

1. 가상환경 활성화

```powershell
.\venv\Scripts\Activate.ps1
```

2. 필요한 패키지 설치

```powershell
pip install -r Day01\requirements.txt
```

3. 서버 실행

```powershell
uvicorn Day01.main:app --reload
```

4. 브라우저에서 확인

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

#### 테스트 예시

```powershell
# 할 일 추가
curl -X POST "http://127.0.0.1:8000/todos" -H "Content-Type: application/json" -d "{\"title\":\"공부하기\"}"

# 목록 조회
curl "http://127.0.0.1:8000/todos"

# 완료 상태 변경
curl -X PATCH "http://127.0.0.1:8000/todos/1" -H "Content-Type: application/json" -d "{\"completed\":true}"

# 삭제
curl -X DELETE "http://127.0.0.1:8000/todos/1"
```

###### 추가 실행

```markdown
간단한 HTML 프론트엔드를 붙여서 브라우저에서 CRUD 되게 만들기
```

###### 다음 진행할 것

- 실제 DB와 연동해서 데이터를 DB에 저장하는 기능 구현

#### 5. PRD.md

- Product Requirments Document의 약자. 제품 요구사항 정의서
- AI에게 던질 설계도
- 마크다운으로 작성. 필요한 경우는 UI 이미지도 포함

##### 퍼즐게임 PRD 예시

- PRD.md로 저장

```markdown
## 프로젝트: 간단한 퍼즐 게임

### 목표:
- 브라우저에서 실행되는 퍼즐 게임

### 기능:
- 퍼즐 보드 표시
- 클릭 이벤트 처리
- 클리어 조건 판단

### 기술:
- HTML, CSS, JavaScript
- 하나의 index.html 파일

### 대상:
- 코딩 초보자
```

```markdown
Day01\puzzle_game 아래에 PRD.md 파일 참조해서 만들어줘. UI는 ui.png 파일을 확인해서 만들면 돼.
```

##### 실행 결과 화면


##### 분석

- AI가 생성한 코드를 분석
- 소스코드 > context menu > 'Add to Codex Thread' 선택

- 바뀐 소스를 되돌리기 Ctrl + Z

- 오류(예외) 발생하는 코드 영역을 선택하고 Codex Thread 등 전달 뒤 분석 요청

##### 리팩토링

- 원본 소스를 분석해서 좀 더 나은 로직으로 변경하는 것

```markdown
현재 index.html을 더 깔끔하게 리팩토링 해줘.

조건 : 
- 기능은 그대로 유지
- 함수 최대한 분리
- 변수명은 SnakeCasing으로 
- 초보자로 이해 가능하게
- Js 스크립트에 주석 최대한 작성
- 변경 이유 설명 
```

- 원본파일. 탐색기 > context menu > '비교를 위해서 선택'
- 변경된 파일. 탐색기 > context menu > '선택한 항목과 비교'

##### 예외처리

- 실행 중 발생하는 오류
- 예외 발생하는 구문 Codex Thread로 전송 후 프롬프트 작성. 실행

```js
    function hide_card(card_element) {
      // 맞지 않는 카드 두 장을 다시 뒤집는 역할입니다.
      // 재시작 직후에는 카드 요소가 없을 수 있으므로 먼저 확인합니다.
      if (!card_element || !card_element.classList) { //예외발생 처리 결과
        return;
      }

      card_element.classList.remove("flipped");
    }
```

##### 구조 변경

- 예시

```markdown
현재 과일 emoji가 8개야. 갯수를 2배로 늘려서 랜덤하게 과일 이미지가 변경되게 정리해줘.
```

- 실행 시 마다 과일변경

##### 코드 설명 요청

- 예시

```markdown
index.html에 자바스크립트 코드를 초보자에게 설명하듯이 블록 단위로 설명해줘.

- 외부라이브러리 확인
- 엔트리포인트 확인
- 실행 흐름
```

#### index.html 자바스크립트 블록 설명

퍼즐 게임의 자바스크립트는 [Day01/puzzle_game/index.html](C:\vibecodings\Day01\puzzle_game\index.html) 안에 들어 있습니다.
이 코드는 외부 라이브러리를 쓰지 않고, `script` 태그 안에서 직접 실행되는 방식입니다.

##### 1. 외부 라이브러리 확인

- 사용한 외부 라이브러리는 없습니다.
- `import` 구문도 없고, CDN 주소도 없습니다.
- 순수한 HTML, CSS, JavaScript만으로 만든 파일입니다.
- 그래서 브라우저만 있으면 바로 실행할 수 있습니다.

##### 2. 엔트리포인트 확인

- 자바스크립트의 시작점은 [index.html의 `<script>` 블록](C:\vibecodings\Day01\puzzle_game\index.html#L269)입니다.
- 페이지가 열리면 맨 아래에서 `reset_game()`이 먼저 호출됩니다.
- 즉, 프로그램 시작 흐름은 `페이지 열림 -> 보드 준비 -> 프리뷰 시작 -> 실제 게임 시작` 순서입니다.

##### 3. 실행 흐름

1. `reset_game()`
   - 게임 상태를 초기화합니다.
   - 타이머를 정리하고, 시도 횟수와 매칭 개수를 0으로 돌립니다.
   - 랜덤 과일 8개를 뽑습니다.
   - 카드 보드를 다시 만듭니다.
   - 마지막에 `start_preview_sequence()`를 호출해서 시작 애니메이션을 실행합니다.

2. `start_preview_sequence()`
   - 카드 1번부터 16번까지 순서대로 잠깐씩 보여줍니다.
   - 이때 보드는 잠시 클릭하지 못하게 막습니다.
   - 약 1초 뒤 프리뷰가 끝나면 카드들을 다시 숨기고, 실제 게임을 시작할 수 있게 바꿉니다.

3. `handle_card_click()`
   - 사용자가 카드를 클릭하면 실행됩니다.
   - 게임이 아직 시작되지 않았거나, 이미 맞춘 카드면 무시합니다.
   - 첫 번째 카드면 저장만 하고 끝냅니다.
   - 두 번째 카드면 `handle_second_selection()`으로 넘어갑니다.

4. `handle_second_selection()`
   - 두 번째 카드 선택을 기록합니다.
   - 시도 횟수를 1 올립니다.
   - 두 카드가 같은지 `compare_cards()`로 확인합니다.
   - 같으면 `handle_matched_pair()`, 다르면 `handle_mismatched_pair()`로 이동합니다.

5. `handle_matched_pair()`
   - 같은 그림이면 카드 2장을 `matched` 상태로 바꿉니다.
   - 둘 다 더 이상 클릭할 수 없게 막습니다.
   - 모든 쌍을 다 맞췄으면 클리어 메시지를 보여줍니다.

6. `handle_mismatched_pair()`
   - 다른 그림이면 잠시 보여준 뒤 다시 뒤집습니다.
   - `setTimeout()`을 써서 700ms 뒤에 카드가 다시 숨겨집니다.
   - 이때 재시작 예외를 막기 위해 `hide_card()` 안에서 null 검사를 합니다.

##### 4. 블록별 역할 한눈에 보기

- `shuffle_array()`: 배열을 무작위로 섞음
- `pick_random_fruits()`: 이번 판에 쓸 과일 8개를 뽑음
- `create_card_emoji_list()`: 과일 8개를 2장씩 복제함
- `render_board()`: 16장의 카드를 화면에 그림
- `handle_card_click()`: 카드 클릭 전체 처리
- `handle_matched_pair()`: 같은 카드 처리
- `handle_mismatched_pair()`: 다른 카드 처리
- `reset_game()`: 게임 다시 시작 및 초기화

##### 5. 초보자용 핵심 포인트

- 상태 변수는 `first_card`, `second_card`, `attempt_count`처럼 “게임의 기억” 역할을 합니다.
- 함수는 가능한 한 한 가지 일만 하도록 나뉘어 있습니다.
- 이벤트는 버튼 클릭과 카드 클릭 두 곳에서 시작됩니다.
- 게임의 시작점은 `reset_game()`이고, 사용자의 행동은 `handle_card_click()`로 들어옵니다.
- 프리뷰와 실제 게임이 섞이지 않도록 타이머를 따로 관리합니다.
