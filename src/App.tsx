import React from 'react';
import { useAppStore } from './store/useAppStore';
import { ProjectGallery } from './components/project/ProjectGallery';

function App() {
  const { activeProject, setActiveProject } = useAppStore();

  if (!activeProject) {
    return <ProjectGallery />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Canvas View will go here in next plan */}
      <div className="p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">NoteTree: {activeProject.name}</h1>
          <button 
            onClick={() => setActiveProject(null)}
            className="text-sm text-gray-400 hover:text-white underline"
          >
            Back to Gallery
          </button>
        </header>
        
        <div className="border-2 border-dashed border-gray-800 rounded-2xl h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-xl mb-4">Infinite Canvas Loading...</p>
            <p className="text-gray-600 italic">(Implemented in Phase 1-02)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
