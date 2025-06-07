$(document).ready(async () => {
  const shimmerWrapper = $(".shimmer-wrapper");
  const realContent = $(".real-content");
  const sliderTrack = $(".slider-track");

  shimmerWrapper.show();
  realContent.hide();

  try {
    const response = await fetch(
      "./novel/kokoro/popular?provider=anilist&page=1&perPage=5"
    );
    const result = await response.json();

    if (!result.success || !result.data || result.data.length === 0) {
      console.error("No popular novels found.");
      return;
    }

    const novels = result.data;

    // Inject slides
    novels.forEach(novel => {
      const slide = $(`
        <div class="slide">
          <div class="slider-banner">
            <img class="slider-banner-image" src="${
              novel.externalInfo.bannerImage || novel.cover
            }" alt="Banner" />
          </div>
          <div class="slider-wrapper-content">
            <h1 class="slider-title" style="color: ${
              novel.externalInfo.images.color
            };">${novel.title || "Untitled"}</h1>
            <p class="slider-synopsis">${
              novel.externalInfo?.synopsis || "No synopsis available."
            }</p>
            <div class="slider-wrapper-buttons">
              <button type="button" data-id="${novel.id}">READ MORE</button>
            </div>
          </div>
        </div>
      `);
      sliderTrack.append(slide);
    });

    // Show real content and hide shimmer
    shimmerWrapper.hide();
    realContent.fadeIn();

    // Slider logic
    let currentIndex = 0;

    const updateSlider = () => {
      sliderTrack.css("transform", `translateX(-${currentIndex * 100}%)`);
    };

    $("#prev-slide").click(() => {
      currentIndex = (currentIndex - 1 + novels.length) % novels.length;
      updateSlider();
    });

    $("#next-slide").click(() => {
      currentIndex = (currentIndex + 1) % novels.length;
      updateSlider();
    });

    // Auto-rotate every 5 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % novels.length;
      updateSlider();
    }, 5000);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
});
