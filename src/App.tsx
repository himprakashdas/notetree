import React from 'react';
import { useAppStore } from './store/useAppStore';
import { ProjectGallery } from './components/project/ProjectGallery';
import FlowCanvas from './components/canvas/FlowCanvas';

function App() {
  const { activeProject } = useAppStore();

  if (!activeProject) {
    return <ProjectGallery />;
  }

  return (
    <div className="w-screen h-screen bg-black text-white">
      <FlowCanvas />
    </div>
  );
}

export default App;
