let mix = require('laravel-mix');

require('./nova.mix');

mix
  .disableNotifications()
  .setPublicPath('dist')
  .js('resources/js/field.js', 'js')
  .vue({ version: 3 })
  .nova('outl1ne/nova-table-field');
