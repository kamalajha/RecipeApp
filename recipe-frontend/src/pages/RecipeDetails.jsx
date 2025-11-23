import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ApiContext } from '../context/ApiContext';

function RecipeDetails() {
  const { id } = useParams();
  const { fetchedRecipes, isLoading } = useContext(ApiContext);

  const requiredRecipe = fetchedRecipes.filter(
    (recipe) => recipe.idMeal === id
  );

  if (!requiredRecipe.length) {
    return <p>No Detail Available</p>;
  }

  const recipe = requiredRecipe[0];

  const ingredients = [];
  for (let key in recipe) {
    if (key.includes("strIngredient") && recipe[key] !== "") {
      ingredients.push(recipe[key]);
    }
  }

  // ⭐ Universal YouTube ID extractor
  function getYouTubeId(url) {
    const regExp =
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  const videoId = getYouTubeId(recipe.strYoutube);

  return (
    <div className="recipe-detail">
      <h1>{recipe.strMeal}</h1>

      <div className="recipeinstructions">
        <h3>Instructions</h3>
        <p>{recipe.strInstructions}</p>
      </div>

      <div className="ingredients">
        <h3>Ingredients</h3>
        <ul>
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="youtube-video">
        <h3>Watch on YouTube</h3>

        {videoId ? (
          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allowFullScreen
          ></iframe>
        ) : (
          <p style={{ color: "red" }}>Invalid YouTube link</p>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;