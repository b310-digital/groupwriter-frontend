import React from 'react';
import { useParams } from 'react-router';
import DocumentPage from './pages/DocumentPage';

function App() {
  const params = useParams();

  return <>{params.id && <DocumentPage documentId={params.id} />}</>;
}

export default App;
