<template>
  <svg
    viewBox="0 0 250 250"
    xmlns="http://www.w3.org/2000/svg"
    class="pointer-events-none fixed top-0 left-0 min-h-svh min-w-svw opacity-20 mix-blend-color-dodge"
  >
    <filter id="noiseFilter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="2  "
        numOctaves="3"
        stitchTiles="stitch"
      />
    </filter>

    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
</template>
