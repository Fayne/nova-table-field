<template>
  <div class="o1-flex o1-items-center key-value-item">
    <div class="o1-flex o1-flex-grow o1-border-b o1-border-gray-200 dark:o1-border-gray-700 key-value-fields">
      <div
        :key="`column-${index}`"
        @click="handleColumnFieldFocus(index)"
        class="o1-flex-grow"
        :class="{ 'o1-border-l o1-border-gray-200 dark:o1-border-gray-700': index > 0 }"
        v-for="(cell, index) in row.cells"
      >
        <textarea
          :class="cellClasses"
          :disabled="!isEditable"
          rows="1"
          :dusk="`table-value-${index}`"
          :key="cell.id"
          @focus="handleColumnFieldFocus(index)"
          class="o1-font-mono o1-text-sm o1-block o1-w-full o1-resize-none o1-px-3 o1-py-3 o1-text-gray-600 dark:o1-text-gray-400 focus:o1-outline-none focus:o1-ring-2 focus:o1-ring-inset focus:o1-ring-primary-500"
          ref="columnFields"
          style="background-clip: border-box; min-height: 32px"
          v-model="row.cells[index]"
        />
      </div>
    </div>

    <div
      class="o1-flex o1-items-center o1-justify-center o1-h-11 o1-w-11 o1-absolute o1-right-[-50px]"
      v-if="isEditable && canDelete"
    >
      <Button
        @click="$emit('remove-row', row.id)"
        :dusk="`remove-table-row-${index}`"
        :title="__('Delete')"
        icon="trash"
        state="danger"
        variant="link"
        size="small"
        tabindex="-1"
        type="button"
      />
    </div>
  </div>
</template>

<script>
import autosize from 'autosize';
import { Button } from 'laravel-nova-ui';

export default {
  components: { Button },

  props: {
    index: Number,
    row: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    autosize(this.$refs.columnFields);
  },

  methods: {
    handleColumnFieldFocus(index) {
      this.$refs.columnFields[index].select();
    },
  },

  computed: {
    isEditable() {
      return !this.readOnly && !this.disabled;
    },

    /**
     * Background classes for a cell, mirroring Nova's .form-input colors
     * (white / gray-900) with a muted variant when the field is read-only.
     */
    cellClasses() {
      return this.isEditable
        ? 'o1-bg-white dark:o1-bg-gray-900 hover:o1-bg-gray-50 dark:hover:o1-bg-gray-800 focus:o1-bg-white dark:focus:o1-bg-gray-900'
        : 'o1-bg-gray-50 dark:o1-bg-gray-800';
    },
  },
};
</script>
