<script lang="ts" setup>
  import { ref } from "vue";
  import TutorialTurns from "~/components/tutorial/turns.vue";
  import TutorialMultiplier1 from "~/components/tutorial/multiplier-1.vue";
  import TutorialMultiplier2 from "~/components/tutorial/multiplier-2.vue";
  import TutorialRemove from "~/components/tutorial/remove.vue";
  import TutorialSummary from "~/components/tutorial/summary.vue";
  import { twMerge } from "tailwind-merge";

  const sliderRef = ref<HTMLElement>();
  const currentSlide = ref(0);

  const slides = [
    TutorialTurns,
    TutorialMultiplier1,
    TutorialMultiplier2,
    TutorialRemove,
    TutorialSummary,
  ];

  const totalSlides = slides.length;

  const goToSlide = (index: number) => {
    if (!sliderRef.value) return;
    const slideElements = sliderRef.value.children;
    if (index >= 0 && index < slideElements.length) {
      slideElements[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
      currentSlide.value = index;
    }
  };

  const next = () => {
    goToSlide(Math.min(currentSlide.value + 1, totalSlides - 1));
  };

  const previous = () => {
    if (currentSlide.value === 0) {
      navigateTo("/");
      return;
    }

    goToSlide(Math.max(currentSlide.value - 1, 0));
  };

  const slide =
    "flex w-[100vw] snap-center snap-always items-center justify-center grow-0 shrink-0 px-8";
</script>

<template>
  <div
    class="relative flex w-[100vw] flex-col overflow-hidden text-center text-xl"
  >
    <div
      ref="sliderRef"
      class="mb-4 flex flex-1 snap-x snap-mandatory snap-center gap-6 overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="(slideComponent, index) in slides"
        :key="index"
        :class="slide"
      >
        <component :is="slideComponent" />
      </div>
    </div>

    <div class="flex items-center justify-center gap-4">
      <button
        type="button"
        class="flex cursor-pointer items-center rounded-full bg-gray-900 p-2"
        @click="previous"
      >
        <Icon name="ep:arrow-left-bold" size="20px" />
      </button>

      <UiButton v-if="currentSlide !== totalSlides - 1" @click="next"
        >Next
      </UiButton>
    </div>
  </div>
</template>
