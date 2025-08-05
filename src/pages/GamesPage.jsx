import CategoryPage from "../components/CategoryPage";

const GamesPage = () => {
   return (
      <CategoryPage
         title="Games"
         description="Gaming content, reviews, walkthroughs, and everything related to the world of video games. From indie titles to AAA blockbusters."
         icon="🎮"
         gradient="from-orange-500 to-red-600"
         placeholderCount={20}
      />
   );
};

export default GamesPage;
