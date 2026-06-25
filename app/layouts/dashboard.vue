<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-950">
    <TheHeader :user="{ name: 'Yuri Andrade', initials: 'YA' }" />
    <main class="py-2">
      <slot />
    </main>
  </div>
</template>
