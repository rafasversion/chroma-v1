# Chroma

Chroma é uma plataforma de gerenciamento e compartilhamento de mídia visual projetada para organização pessoal através de pastas, interações sociais e notificações em tempo real.

## Tecnologias Principais

- **Frontend:** React.js, TypeScript, CSS Modules.
- **Backend:** WordPress REST API (PHP).
- **Management Tools:** Git.

## Arquitetura de Dados

O sistema integra a flexibilidade do WordPress com uma estrutura personalizada de banco de dados para suportar funcionalidades avançadas de redes sociais.

### Entidades e Relacionamentos

- **Usuários:** Sincronizados com o sistema de autenticação do WordPress, incluindo suporte a metadados para fotos de perfil e integração com Google Login.
- **Postagens (Fotos/Vídeos):** Gerenciadas como Custom Post Types, contendo metadados para cores dominantes e estatísticas de acesso.
- **Pastas (Álbuns):** Sistema de organização onde cada pasta é um post do tipo `pasta`, relacionando-se com múltiplas mídias.
- **Comentários e Respostas:** Estrutura hierárquica que permite respostas aninhadas (threaded comments) e curtidas individuais em cada comentário.
- **Notificações:** Sistema persistente para alertas de novos likes, comentários e interações em pastas.

## Funcionalidades Implementadas

- **Organização Baseada em Pastas:** Criação e gestão de coleções com controle de privacidade.
- **Feed Dinâmico:** Visualização em Masonry Grid para carregamento otimizado de imagens e vídeos.
- **Interação Social:** Sistema de curtidas e comentários em múltiplos níveis com suporte a notificações.
- **Segurança:** Autenticação via JWT (JSON Web Token) integrada às rotas REST do WordPress.
- **Processamento de Mídia:** Extração de cor dominante para interface adaptativa e suporte a vídeos (MP4, WebM).

## Configuração do Ambiente

### Pré-requisitos

- Ambiente PHP/WordPress (Local ou Remoto)

### Instalação

1. Clone o repositório:

   ```bash
   git clone [https://github.com/rafasversion/chroma-v1.git](https://github.com/rafasversion/chroma-v1.git)
   ```

2. Instale as dependências do projeto:

   ```bash
   npm install
   ```

3. Configure o endpoint da API no arquivo `.env`:

   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=chroma
   ```

4. Rode o projeto:
   ```bash
   npm run dev
   ```

## License

Este projeto é destinado a fins de desenvolvimento e portfólio pessoal. Todos os direitos reservados.
