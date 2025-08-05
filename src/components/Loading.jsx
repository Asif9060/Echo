const Loading = ({ message = "Loading amazing content..." }) => {
   return (
      <div className="flex flex-col items-center justify-center py-20">
         <div className="relative">
            {/* Animated spinner */}
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

            {/* Pulsing dots */}
            <div className="flex justify-center mt-8 space-x-2">
               <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
               <div
                  className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}></div>
               <div
                  className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}></div>
            </div>
         </div>

         <p className="text-gray-400 mt-6 text-lg animate-pulse">{message}</p>
      </div>
   );
};

export default Loading;
