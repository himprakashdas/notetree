import React from 'react';
import { Toaster } from 'sonner';
import { useAppStore } from './store/useAppStore';
import { ProjectGallery } from './components/project/ProjectGallery';
import FlowCanvas from './components/canvas/FlowCanvas';

function App() {
  const { activeProject } = useAppStore();

  if (!activeProject) {
    return (
      <>
        <ProjectGallery />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="w-full h-full bg-background text-white">
      <FlowCanvas />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
