<template>
  <DefaultField
    :field="currentField"
    :errors="errors"
    :show-help-text="showHelpText"
    :full-width-content="currentField.fullWidth"
  >
    <template #field>
      <Table :can-delete="field.canDelete" :edit-mode="!field.readonly">
        <div class="o1-rounded-lg o1-overflow-hidden o1-bg-white dark:o1-bg-gray-900 key-value-items">
          <TableRow
            v-for="(row, index) in theData"
            :key="row.id"
            :ref="row.id"
            :can-delete="field.canDelete"
            :index="index"
            :read-only="field.readonly"
            :row.sync="row"
            @remove-row="removeRow"
          />
        </div>
      </Table>
      <div v-if="field.canDelete && !field.readonly" class="o1-relative o1-mr-11 o1-mt-3 o1-flex">
        <div v-for="n in numberOfColumns" :key="`column-delete-${n}`" class="o1-flex o1-flex-grow o1-justify-center">
          <Button
            :title="__('Delete')"
            icon="trash"
            state="danger"
            variant="link"
            size="small"
            tabindex="-1"
            type="button"
            @click="removeColumn(n)"
          />
        </div>
      </div>
      <div
        v-if="!field.readonly && field.canAdd"
        class="o1-mr-11 o1-mt-3 o1-flex o1-items-center o1-justify-center o1-gap-4"
      >
        <Button leading-icon="plus-circle" variant="link" type="button" @click="addRowAndSelect">
          {{ __('novaTableField.addRow') }}
        </Button>
        <Button
          v-if="numberOfColumns > 0"
          leading-icon="plus-circle"
          variant="link"
          type="button"
          tabindex="-1"
          @click="addColumnAndSelect"
        >
          {{ __('novaTableField.addColumn') }}
        </Button>
      </div>
      <div v-if="field.helpText" class="help-text o1-mt-2" v-html="field.helpText"></div>
    </template>
  </DefaultField>
</template>

<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova';
import { Button } from 'laravel-nova-ui';
import TableRow from './TableRow';
import autosize from 'autosize';
import Table from './Table';

function guid() {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

export default {
  mixins: [HandlesValidationErrors, FormField],

  components: { Button, Table, TableRow },

  data: () => ({ theData: [] }),

  mounted() {
    let valuesArray = Array.isArray(this.field.value) ? this.value : JSON.parse(this.field.value);
    if (!Array.isArray(valuesArray) || !valuesArray.length) valuesArray = [];

    if (this.field.defaultValues)
      this.field.defaultValues.forEach((item, index) => {
        if (!valuesArray[index]) valuesArray[index] = item;
      });
    else this.field.defaultValues = [];

    this.theData = _.map(valuesArray, cells => ({
      id: guid(),
      cells,
    }));

    if (this.theData.length === 0) {
      for (let i = 0; i < (this.defaultAttributes.minRows || 1); i++) {
        this.addRow();
      }
    }
  },

  methods: {
    /**
     * Provide a function that fills a passed FormData object with the
     * field's internal value attribute.
     */
    fill(formData) {
      formData.append(this.field.attribute, JSON.stringify(this.finalPayload));
    },

    /**
     * Add a row to the table.
     */
    addRow() {
      if (this.theData.length + 1 > this.defaultAttributes.maxRows)
        return this.$toasted.show(this.__('novaTableField.maxRowsError', { max: this.defaultAttributes.maxRows }), {
          type: 'error',
        });

      return _.tap(guid(), id => {
        this.theData = [...this.theData, { id, cells: Array(this.numberOfColumns).join('.').split('.') }];
        return id;
      });
    },

    /**
     * Add a column to the table.
     */
    addColumn() {
      if (this.numberOfColumns + 1 > this.defaultAttributes.maxColumns)
        return this.$toasted.show(
          this.__('novaTableField.maxColumnsError', { max: this.defaultAttributes.maxColumns }),
          {
            type: 'error',
          }
        );

      this.theData.forEach((_, index) => {
        this.theData[index].cells.push('');
      });
    },

    /**
     * Add a row to the table and select its first field.
     */
    addRowAndSelect() {
      return this.selectRow(this.addRow());
    },

    /**
     * Remove the row from the table.
     */
    removeRow(id) {
      if (this.theData.length - 1 < this.defaultAttributes.minRows)
        return this.$toasted.show(this.__('novaTableField.minRowsError', { min: this.defaultAttributes.minRows }), {
          type: 'error',
        });

      return _.tap(
        _.findIndex(this.theData, row => row.id === id),
        index => this.theData.splice(index, 1)
      );
    },

    /**
     * Remove the column from the table.
     */
    removeColumn(index) {
      if (this.numberOfColumns - 1 < this.defaultAttributes.minColumns)
        return this.$toasted.show(
          this.__('novaTableField.minColumnsError', { min: this.defaultAttributes.minColumns }),
          {
            type: 'error',
          }
        );

      return this.theData.map(row => {
        row.cells.splice(index - 1, 1);
        return row;
      });
    },

    /**
     * Remove all columns and rows from the table.
     */
    removeTable() {
      return (this.theData = []);
    },

    /**
     * Add a column to the row and select its last field.
     */
    addColumnAndSelect() {
      return this.selectColumn(this.addColumn());
    },

    /**
     * Select the first field in a row with the given ref ID.
     */
    selectRow(refId) {
      return this.$nextTick(() => {
        this.$refs[refId][0].$refs.columnFields[0].select();
      });
    },

    /**
     * Select the last cell in the first row.
     */
    selectColumn() {
      return this.$nextTick(() => {
        // prettier-ignore
        Object.values(this.$refs).map(ref => autosize(ref[0].$refs.columnFields))[0].slice(-1)[0].select();
      });
    },
  },

  computed: {
    /**
     * Return the final filtered json object
     */
    finalPayload() {
      return _(this.theData)
        .map(row => (row && row.cells && row.cells.length > 0 ? row.cells : undefined))
        .reject(row => row === undefined)
        .value();
    },

    defaultAttributes() {
      return {
        minRows: this.field.minRows || 1,
        maxRows: this.field.maxRows,
        minColumns: this.field.minColumns || 1,
        maxColumns: this.field.maxColumns,
      };
    },

    numberOfColumns() {
      return this.theData[0] ? this.theData[0].cells.length : this.defaultAttributes.minColumns;
    },
  },
};
</script>
