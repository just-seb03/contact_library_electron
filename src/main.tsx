import { createRoot } from 'react-dom/client';
import Framework7 from 'framework7/lite-bundle';
import Framework7React from 'framework7-react';

Framework7.use(Framework7React);

import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
