const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const BASE_DATA = path.join(__dirname, "../../novels-data.json");

async function scrapeLatestUpdate() {
  try {
    const data = await fs.readFile(BASE_DATA, "utf-8");
    const novels = JSON.parse(data);
    return novels;
  } catch (error) {
    console.error("Failed to read local JSON:", error.message);
    return [];
  }
}

async function fetchMangaFromJikan(malId) {
  try {
    const response = await axios.get(`https://api.jikan.moe/v4/manga/${malId}`);
    const data = response.data?.data;

    if (!data) return null;

    return {
      images: {
        extraLarge: data.images.webp.large_image_url || "",
        large: data.images.webp.image_url || "",
        medium: data.images.jpg.image_url || "",
        color: null
      },
      titles: {
        romaji: data.title || "",
        english: data.title_english || "",
        native: data.title_japanese || "",
        userPreferred: data.title || ""
      },
      type: data.type || "MANGA",
      bannerImage: data.bannerImage || "",
      status: data.status || "",
      score: data.score || 0,
      popularity: data.popularity || 0,
      synopsis: data.synopsis || "",
      genres: (data.genres || []).map(g => g.name),
      authors: (data.authors || []).map(a => a.name)
    };
  } catch (error) {
    console.warn(`Jikan API fetch failed for malId ${malId}:`, error.message);
    return null;
  }
}

// Fetch from AniList GraphQL API
async function fetchMangaFromAnilist(anilistId) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA, format: NOVEL) {
        title {
          romaji
          english
          native
          userPreferred
        }
        type
        status
        description
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        genres
        averageScore
        popularity
        staff {
          nodes {
            name {
              full
            }
          }
        }
      }
    }
  `;

  const variables = { id: parseInt(anilistId) };

  try {
    const response = await axios.post("https://graphql.anilist.co", {
      query,
      variables
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const data = response.data?.data?.Media;

    if (!data) return null;

    return {
      images: {
        extraLarge: data.coverImage.extraLarge || "",
        large: data.coverImage.large || "",
        medium: data.coverImage.medium || "",
        color: data.coverImage.color || null
      },
      titles: data.title || {},
      type: data.type || "MANGA",
      bannerImage: data.bannerImage || "",
      status: data.status || "",
      score: data.averageScore || 0,
      popularity: data.popularity || 0,
      synopsis: data.description || "",
      genres: data.genres || [],
      authors: (data.staff?.nodes || []).map(s => s.name.full)
    };
  } catch (error) {
    console.warn(`AniList API fetch failed for anilistId ${anilistId}:`, error.message);
    return null;
  }
}

module.exports = {
  scrapeLatestUpdate,
  fetchMangaFromJikan,
  fetchMangaFromAnilist
};
