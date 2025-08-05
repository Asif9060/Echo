import CategoryPage from "../components/CategoryPage";

const SeriesPage = () => {
   return (
      <CategoryPage
         title="TV Series"
         description="Binge-worthy shows, limited series, and episodic content that will keep you entertained for hours. From gripping thrillers to comedy gems."
         icon="📺"
         gradient="from-blue-500 to-purple-600"
         placeholderCount={15}
      />
   );
};

export default SeriesPage;
