import { Route, Routes } from 'react-router-dom';
import LabShell from './lab/LabShell';
import AppRoutes from './routes';

export default function App() { return <Routes><Route element={<LabShell />}><Route path="*" element={<AppRoutes />} /></Route></Routes>; }
