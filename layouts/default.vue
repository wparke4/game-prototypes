<template>
  <div
    class="relative flex flex-col items-center justify-start min-h-screen-fixed w-full"
  >
    <!--<Header />-->
    <ClientOnly>
      <slot />
    </ClientOnly>
  </div>
</template>
