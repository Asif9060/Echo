import React from "react";

class ErrorBoundary extends React.Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
   }

   static getDerivedStateFromError(error) {
      return { hasError: true, error };
   }

   componentDidCatch(error, errorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
   }

   render() {
      if (this.state.hasError) {
         return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
               <div className="text-center">
                  <h1 className="text-4xl font-bold text-red-500 mb-4">
                     Something went wrong
                  </h1>
                  <p className="text-gray-400 mb-6">
                     We're sorry, but something unexpected happened.
                  </p>
                  <button
                     onClick={() => window.location.reload()}
                     className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                     Reload Page
                  </button>
                  {import.meta.env.DEV && (
                     <pre className="mt-4 text-left text-red-400 text-sm bg-slate-800 p-4 rounded overflow-auto">
                        {this.state.error?.toString()}
                     </pre>
                  )}
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
