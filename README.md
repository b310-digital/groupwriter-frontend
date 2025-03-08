# GroupWriter: Frontend

GroupWriter's frontend is a React application served via Nginx. It synchronizes data with a Hocuspocus-based Node.js backend using the Yjs framework for real-time collaboration.

## Demo
![Plugin as used in groupwriter](/documentation/groupwriter.gif)


## Setup

### Development

Clone the backend first in the parental folder: `git clone git@github.com:b310-digital/groupwriter-backend.git`.

```
docker compose build
docker compose up -d
docker compose exec editor npm run dev # server starts on 5173 by default
docker compose exec backend npm run start:dev # start the backend
```
Requests are proxied to the backend with the `/backend` path in dev, see `vite.config.ts`.

Browse to `http://localhost:5173`

#### Tests
Unit tests: `npm run test`,
e2e Playwright tests: `npx playwright test`

### Production
Currently, the app is expected to run as a subdomain `write` and the backend under the subdomain `write-backend`. A complete docker compose example for production can be seen in the [production documentation](/documentation/production.md).

### Options
Attention: Options need to be passed during build time.

- `VITE_HOCUSPOCUS_SUBDOMAIN`: Name of the subdomain where the backend resides and where requests are routed to. Default: `write-backend`
- `VITE_HOCUSPOCUS_SERVER_URL`: Backend Server URL, in case the subdomain is not used. If set, overwrites the subdomain connection option. Undefined by default.
- `VITE_LEGAL_URL`: URL to legal statement. Undefined by default.
- `VITE_PRIVACY_STATEMENT_URL`: URL to privacy statement. Undefined by default.

## Design Decisions

### [TipTap](https://tiptap.dev) / [ProseMirror](https://prosemirror.net)
The editor is based on TipTap which is itself based on the popular ProseMirror Editor. The editor is extended with a couple of plugins.

### [hocuspocus](https://tiptap.dev/docs/hocuspocus/introduction) / [yjs](https://yjs.dev)
The sync the data, yjs and a compatible server is being used.

### Comments & Suggestions

Comments are added as marks, meaning they are inlined in nodes. A comment id is generated and saved along with the color of the comment (which is identical to the user's color) in the attributes of the mark (span element). The raw data of comments, meaning text and other meta data, are saved in a different yjs map but inside the same document to ensure both data structures are synced together. If a comment is deleted, first the marking inside the editor is deleted and then the comment itself in the yjs map is deleted.

Its gets more interesting for redo/undo operations: When undoing, the marking disappears but the user might redo this operation. Therefore, the comment is NOT deleted from the yjs map. This means eventually storing unused / deleted comments but ensures successful redoing and undoing operations. 

## Testimonials / Sponsors

<img src="https://www.nibis.de/img/nlq-medienbildung.png" align="left" style="margin-right:20px">
<img src="https://kits.blog/wp-content/uploads/2021/03/kits_logo.svg" width=100px align="left" style="margin-right:20px">

kits is a project platform hosted by a public institution for quality
development in schools (Lower Saxony, Germany) and focusses on digital tools
and media in language teaching. GroupWriter can
be found on https://kits.blog/tools and can be used by schools for free.

Logos and text provided with courtesy of kits.

## Acknowledgements
- Background image by [Jessica Lewis](https://www.pexels.com/de-de/foto/gelbe-orange-rosa-und-blaue-malstifte-auf-weissem-notizbuch-998591/)
- Main icons: [Hero Icons](https://github.com/tailwindlabs/heroicons)
- Additional icons: [Tabler Icons](https://github.com/tabler/tabler-icons)
