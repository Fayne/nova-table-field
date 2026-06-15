<template>
  <div
    class="o1-relative o1-rounded-lg o1-border o1-border-gray-200 dark:o1-border-gray-700 o1-bg-white dark:o1-bg-gray-900"
    :class="{ 'o1-mr-11': editMode && canDelete }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    canDelete: {
      type: Boolean,
      default: true,
    },
    editMode: {
      type: Boolean,
      default: true,
    },
    defaultValues: {
      type: Object,
      default: () => [],
    },
  },
};
</script>
