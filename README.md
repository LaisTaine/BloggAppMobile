# Tech Challenge - Fase 4: BlogApp Mobile

Este é o projeto de front-end mobile para o Tech Challenge da Pós-Graduação em Full Stack Development.

## 🚀 Objetivo

O objetivo é construir uma interface gráfica mobile em React Native para a API do Blog Education, permitindo que professores e alunos interajam com a plataforma.

## 🛠️ Arquitetura e Tecnologias

* **React Native (com Expo)**
* **TypeScript**
* **React Navigation:** Para o gerenciamento de rotas e navegação.
* **Redux Toolkit:** Para gerenciamento de estado global (autenticação).
* **AsyncStorage:** Para persistir o token de autenticação.
* **Axios:** Para realizar as chamadas à API REST.
* **@expo/vector-icons:** Para a iconografia.

## ⚙️ Setup Inicial (Como Rodar)

1.  Clone este repositório.
2.  Instale as dependências: `npm install`
3.  Inicie o servidor de desenvolvimento: `npx expo start`
4.  Escaneie o QR Code com o app Expo Go no seu celular.

## 📖 Guia de Uso

1.  **Login:** O app inicia na tela de Login.
2.  **Autorização:**
    * **Professores:** Podem ver todos os botões (Criar, Editar, Excluir, Gerenciar).
         ***Login:*** 
         ***Senha:***
        
    * **Alunos:** Apenas visualizam os posts.
3.  **CRUDs:** O app implementa o CRUD completo para Posts, Professores e Estudantes.