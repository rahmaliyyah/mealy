const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Types
export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strIngredient1: string;
  strIngredient2: string;
  strIngredient3: string;
  strIngredient4: string;
  strIngredient5: string;
  strIngredient6: string;
  strIngredient7: string;
  strIngredient8: string;
  strIngredient9: string;
  strIngredient10: string;
  strIngredient11: string;
  strIngredient12: string;
  strIngredient13: string;
  strIngredient14: string;
  strIngredient15: string;
  strIngredient16: string;
  strIngredient17: string;
  strIngredient18: string;
  strIngredient19: string;
  strIngredient20: string;
  strMeasure1: string;
  strMeasure2: string;
  strMeasure3: string;
  strMeasure4: string;
  strMeasure5: string;
  strMeasure6: string;
  strMeasure7: string;
  strMeasure8: string;
  strMeasure9: string;
  strMeasure10: string;
  strMeasure11: string;
  strMeasure12: string;
  strMeasure13: string;
  strMeasure14: string;
  strMeasure15: string;
  strMeasure16: string;
  strMeasure17: string;
  strMeasure18: string;
  strMeasure19: string;
  strMeasure20: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Area {
  strArea: string;
}

export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string;
  strType: string;
}

export interface MealPreview {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

// Helper untuk extract ingredients dari meal detail
export function getIngredients(meal: Meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }
  return ingredients;
}

// Search meal by name
export async function searchMealByName(name: string): Promise<Meal[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=${name}`);
  const data = await res.json();
  return data.meals || [];
}

// List meals by first letter
export async function getMealsByLetter(letter: string): Promise<Meal[]> {
  const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
  const data = await res.json();
  return data.meals || [];
}

// Lookup meal by ID
export async function getMealById(id: string): Promise<Meal | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}

// Random meal
export async function getRandomMeal(): Promise<Meal | null> {
  const res = await fetch(`${BASE_URL}/random.php`);
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}

// List all categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories || [];
}

// List all areas
export async function getAreas(): Promise<Area[]> {
  const res = await fetch(`${BASE_URL}/list.php?a=list`);
  const data = await res.json();
  return data.meals || [];
}

// List all ingredients
export async function getIngredientsList(): Promise<Ingredient[]> {
  const res = await fetch(`${BASE_URL}/list.php?i=list`);
  const data = await res.json();
  return data.meals || [];
}

// Filter by category
export async function getMealsByCategory(category: string): Promise<MealPreview[]> {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await res.json();
  return data.meals || [];
}

// Filter by area
export async function getMealsByArea(area: string): Promise<MealPreview[]> {
  const res = await fetch(`${BASE_URL}/filter.php?a=${area}`);
  const data = await res.json();
  return data.meals || [];
}

// Filter by ingredient
export async function getMealsByIngredient(ingredient: string): Promise<MealPreview[]> {
  const res = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
  const data = await res.json();
  return data.meals || [];
}

// Image helpers
export function getMealImageUrl(url: string, size: "small" | "medium" | "large") {
  return `${url}/${size}`;
}

export function getIngredientImageUrl(name: string, size?: "small" | "medium" | "large") {
  const base = `https://www.themealdb.com/images/ingredients/${name.replace(/ /g, "_")}`;
  return size ? `${base}-${size}.png` : `${base}.png`;
}