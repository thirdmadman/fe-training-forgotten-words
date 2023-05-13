import { createRoot } from 'react-dom/client';
import App from './app/App';

const container = document.querySelector('#root');
if (container === null) throw new Error('Root container missing in index.html');
const root = createRoot(container);
root.render(<App />);
