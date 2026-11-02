import { renderToString } from 'react-dom/server';
import App from './App';
export { getSeo, serializeJsonLd } from './seo';
export function render() { return renderToString(<App />); }
