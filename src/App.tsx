import React from 'react';
import { Toaster } from 'sonner';
import { useAppStore } from './store/useAppStore';
import { ProjectGallery } from './components/project/ProjectGallery';
import FlowCanvas from './components/canvas/FlowCanvas';

import { Sidebar } from './components/layout/Sidebar';

function App() {
  const { activeProject } = useAppStore();

  return (
    <div className="flex w-full h-screen bg-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        {!activeProject ? (
          <ProjectGallery />
        ) : (
          <div className="w-full h-full bg-background text-white">
            <FlowCanvas />
          </div>
        )}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
