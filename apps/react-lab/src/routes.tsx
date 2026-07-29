import { Navigate, Route, Routes } from 'react-router-dom';
import { experimentRoutes } from './lab/experiment.routes';
import LabHome from './lab/LabHome';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LabHome />} />
      {experimentRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
