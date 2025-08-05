// Icon utility for mapping icon IDs to SVG components
export const iconMap = {
   folder: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
      </svg>
   ),
   film: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
   ),
   tv: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v2h8v-2l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z" />
      </svg>
   ),
   gamepad: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M15.5 6.5C15.5 5.66 14.84 5 14 5S12.5 5.66 12.5 6.5 13.16 8 14 8s1.5-.66 1.5-1.5zM19.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM18 13.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM16.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM17 14.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
         <path d="M7.5 2C4.46 2 2 4.46 2 7.5v9C2 19.54 4.46 22 7.5 22h9c3.04 0 5.5-2.46 5.5-5.5v-9C22 4.46 19.54 2 16.5 2h-9z" />
      </svg>
   ),
   anime: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
         />
         <circle cx="9" cy="10" r="1.5" />
         <circle cx="15" cy="10" r="1.5" />
         <path
            d="M8 16s1.5 2 4 2 4-2 4-2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
         />
         <path
            d="M6 8s2-4 6-4 6 4 6 4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
         />
      </svg>
   ),
   music: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
   ),
   book: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </svg>
   ),
   star: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
   ),
   heart: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
   ),
   globe: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
         <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
      </svg>
   ),
};

// Function to get icon by ID, with fallback to folder icon
export const getIcon = (iconId) => {
   // If it's already an emoji (for backward compatibility)
   if (
      iconId &&
      iconId.length <= 4 &&
      /[\u{1F000}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{1F900}-\u{1F9FF}]/u.test(iconId)
   ) {
      return iconId;
   }

   // Return SVG icon or default folder icon
   return iconMap[iconId] || iconMap.folder;
};

// Function to check if an icon is SVG
export const isSVGIcon = (iconId) => {
   return Object.prototype.hasOwnProperty.call(iconMap, iconId);
};
