let mix = require('laravel-mix');

mix.extend('nova', new require('laravel-nova-devtool'));

mix
  .disableNotifications()
  .setPublicPath('dist')
  .js('resources/js/field.js', 'js')
  .vue({ version: 3 })
  .nova('outl1ne/nova-table-field');
