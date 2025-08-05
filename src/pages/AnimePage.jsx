import CategoryPage from "../components/CategoryPage";

const AnimePage = () => {
   return (
      <CategoryPage
         title="Anime"
         description="Japanese animation and manga adaptations featuring stunning visuals, compelling storylines, and unforgettable characters across all genres."
         icon="🗾"
         gradient="from-green-500 to-teal-600"
         placeholderCount={16}
      />
   );
};

export default AnimePage;
