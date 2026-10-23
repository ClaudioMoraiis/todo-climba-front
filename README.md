# Climba To-do — Frontend

Aplicação web de lista de tarefas (teste técnico Climba).

**App:** https://climba.claudiomoraisdev.com.br  
**API:** https://api-climba.claudiomoraisdev.com.br

## Stack

- React + Vite + TypeScript
- CSS próprio (sem lib de UI)

## Funcionalidades

- Adicionar, listar, editar, excluir e pesquisar tarefas
- Campos: título, descrição, data prevista, status
- Validação de título obrigatório e data (válida e não anterior a hoje)

## Como rodar

```bash
npm install
npm run dev
```

App em `http://localhost:5173`

Configure a API no `.env` (veja `.env.example`):

```env
VITE_API_URL=https://api-climba.claudiomoraisdev.com.br
```

Para API local sem tunnel: `VITE_API_URL=http://localhost:3001`

## Backend

Repositório: [todo-climba](https://github.com/ClaudioMoraiis/todo-climba)

## Organização e ferramentas

- Front consome a API via `fetch` (`src/api`)
- Estado e efeitos no hook `useTasks`
- Ferramentas: VS Code/Cursor, Vite, navegador
- IA (Cursor) usada no layout, componentes e integração com a API
