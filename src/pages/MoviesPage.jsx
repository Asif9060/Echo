import CategoryPage from "../components/CategoryPage";

const MoviesPage = () => {
   return (
      <CategoryPage
         title="Movies"
         description="Discover blockbuster hits, indie gems, and cinematic masterpieces from around the world. From action-packed adventures to heartwarming dramas."
         icon="🎬"
         gradient="from-red-500 to-pink-600"
         placeholderCount={18}
      />
   );
};

export default MoviesPage;
